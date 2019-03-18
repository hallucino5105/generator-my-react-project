#!/usr/bin/env python
# coding: utf-8

import sys
import os
import subprocess
import fcntl
import re
import argparse
import git

from version import getVersion


script_dir  = os.path.dirname(os.path.realpath(sys.argv[0]))
root_dir = os.path.realpath("%s/../.." % script_dir)

target_path = "%s/package.json" % root_dir


def updateVersion(version):
  with open(target_path, 'r+') as f:
    try:
      fcntl.flock(f, fcntl.LOCK_EX)
      lines = f.readlines()

      for i in xrange(len(lines)):
        lines[i] = re.sub(r"(.*\"version\": \")[0-9\.\-]*(\".*)", "\g<1>%s\g<2>" % version, lines[i])

        f.truncate(0)
        f.seek(os.SEEK_SET)
        f.writelines(lines)
        f.flush()

    except IOError:
      sys.exit(-2)


def commitAndTagging(version):
  repo = git.Repo(search_parent_directories=True)

  deleted_files = [ item.a_path for item in repo.index.diff(None) if item.deleted_file ]
  if len(deleted_files) > 0:
    repo.index.remove(deleted_files)

    changed_and_untracked_files \
      = repo.untracked_files + [ item.a_path for item in repo.index.diff(None) if not item.deleted_file ]
    if len(changed_and_untracked_files) > 0:
      repo.index.add(changed_and_untracked_files)

    repo.index.commit("")

    for tag in repo.tags:
      if tag.name == version:
        sys.stderr.write("Tag already exists: %s\n" % version)
        sys.exit(-3)

    git.TagReference.create(repo, version)


def getarg():
  parser = argparse.ArgumentParser(add_help=False)

  parser.add_argument("-g", "--git", action="store_true", help="Allow git operation (commit and tagging)")
  parser.add_argument("--help", action="help")

  args = parser.parse_args()
  return args


def main():
  args = getarg()

  version = getVersion()
  if not version:
    sys.exit(-1)

  updateVersion(version)
  if args.git:
    commitAndTagging(version)


if __name__ == "__main__":
    main()

