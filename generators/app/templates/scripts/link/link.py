#!/usr/bin/env python
# coding: utf-8

import os
import sys


script_dir  = os.path.dirname(os.path.realpath(sys.argv[0]))
root_dir = os.path.realpath("%s/../.." % script_dir)


for root, dirs, files in os.walk(script_dir):
  for fname in files:
    fpath = "%s/%s" % (root, fname)
    _, ext = os.path.splitext(fname)

    if (ext == ".sh" or ext == ".py") \
        and fname != "link.py" \
        and os.access(fpath, os.X_OK):
      os.system("%s %s" % (fpath, root_dir))

