#!/usr/bin/env python
# coding: utf-8


import sys
import os
import itertools
import argparse

from logging import getLogger, StreamHandler, DEBUG

try:
  import json
except ImportError:
  import simplejson as json


logger = None


def deepupdate(original, update):
  """
  Recursively update a dict.
  Subdict's won't be overwritten but also updated.
  """
  for key, value in original.iteritems(): 
    if key not in update:
      update[key] = value
    elif isinstance(value, dict):
      deepupdate(value, update[key]) 
  return update


def getarg():
  parser = argparse.ArgumentParser(add_help=False)

  parser.add_argument("files", nargs="+", help="json files")
  parser.add_argument("-o", "--output", type=str, default=None, help="output path")
  parser.add_argument("--help", action="help")

  args = parser.parse_args()
  return args


def main():
  args = getarg()
  root = {}

  for filepath in args.files:
    try:
      with open(filepath) as f:
        update = json.load(f)
        root = deepupdate(root, update)
    except IOError:
      pass

  data = json.dumps(root)
  if args.output:
    with open(args.output, "w+") as f:
      f.write(data)
  else:
    sys.stdout.write(data)


logger = getLogger(__name__)
handler = StreamHandler()
handler.setLevel(DEBUG)
logger.setLevel(DEBUG)
logger.addHandler(handler)


if __name__ == "__main__":
  main()


