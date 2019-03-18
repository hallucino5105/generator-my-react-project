#!/usr/bin/env python
# coding: utf-8

import os
import sys

import logging
logging.basicConfig(stream=sys.stderr)

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.app import application

