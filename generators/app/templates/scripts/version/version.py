#!/usr/bin/env python
# coding: utf-8

from __future__ import (
  print_function, unicode_literals, absolute_import, generators, division)

import sys
import os


script_dir  = os.path.dirname(os.path.realpath(sys.argv[0]))
root_dir = os.path.realpath("%s/../.." % script_dir)

version_path = "%s/VERSION" % root_dir


def getVersion():
  if not os.path.isfile(version_path):
    sys.exit(-1)

    with open(version_path, "r") as f:
      version = f.readline().strip()
      return str(version)


def main():
  print(getVersion())


if __name__ == "__main__":
  main()

