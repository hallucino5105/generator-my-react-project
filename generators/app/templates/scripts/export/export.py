#!/usr/bin/env python
# coding: utf-8

from __future__ import (
  print_function, unicode_literals, absolute_import, generators, division)

from logging import (
  StreamHandler, getLogger,  Formatter, DEBUG)

import sys
import os
import argparse
import tarfile
import tempfile
import shutil
import glob
import json

from distutils.dir_util import copy_tree


logger = None

script_dir = os.path.dirname(os.path.realpath(sys.argv[0]))
root_dir = os.path.realpath("%s/../.." % script_dir)

prod_dir = "%s/prod" % root_dir
npm_package_file = "%s/package.json" % root_dir


def export(output_name):
  if not os.path.isdir(prod_dir):
    sys.exit(-1)

  tempdir = tempfile.mkdtemp()

  copy_tree(prod_dir, tempdir)

  with tarfile.open("%s/%s" % (root_dir, output_name), "w:gz") as archive:
    for fpath in glob.glob("%s/*" % tempdir):
      archive.add(fpath, arcname=os.path.basename(fpath))

  shutil.rmtree(tempdir)


def getarg():
  def getDefaultFilename():
    default_filename = "prod.tar.gz"

    try:
      with open(npm_package_file, "r") as f:
        conf = json.load(f)
        if conf and "name" in conf and "version" in conf:
          name = conf["name"]
          version = conf["version"]
          default_filename = "%s_%s_prod.tar.gz" % (name.lower(), version)
    except Exception as e:
      logger.exception(e)

    return default_filename

  parser = argparse.ArgumentParser(add_help=False)
  parser.add_argument("-f", "--filename", type=str, default=getDefaultFilename(), help="Output filename")
  parser.add_argument("--help", action="help")

  return parser.parse_args()


logger = getLogger(sys.argv[0] + __name__)
handler = StreamHandler()
handler.setFormatter(Formatter("[%(asctime)s](%(levelname)s) %(message)s"))
logger.setLevel(DEBUG)
logger.addHandler(handler)

def main():
  args = getarg()
  export(args.filename)


if __name__ == "__main__":
  main()


