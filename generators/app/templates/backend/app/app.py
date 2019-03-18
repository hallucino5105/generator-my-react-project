#!/usr/bin/env python
# coding: utf-8

import sys
import os
import json

from logging import getLogger, StreamHandler, Formatter, DEBUG
from flask import Flask, render_template, request, make_response
from flask_cors import CORS, cross_origin

from utils import CustomFlask, connectdb, response_json, load_config


logger = None
conf = load_config("./config.json")

application = CustomFlask(__name__, static_folder="./static", template_folder="./template")
CORS(application)


@application.before_request
def before_request():
  pass


@application.after_request
def after_request(response):
  return response


@application.route("/favicon.ico")
def favicon():
  return application.send_static_file("./image/favicon.ico")


@application.route("/api")
def index():
  return "Hello, world."


@application.route("/api/test", methods=["GET", "POST"])
@response_json()
@connectdb()
def test(con, cur):
  """
    return { "con": con.__repr__(), "cur": cur.__repr__() }
  """

  return {}


logger = getLogger(sys.argv[0] + __name__)
handler = StreamHandler()
handler.setLevel(DEBUG)
handler.setFormatter(Formatter("[%(asctime)s](%(levelname)s) %(message)s"))
logger.setLevel(DEBUG)
logger.addHandler(handler)


if __name__ == "__main__":
  if not conf:
    logger.error("config not found")
    sys.exit(-1)

  application.run(
    host=conf["serve"]["app"]["host"],
    port=conf["serve"]["app"]["port"],
    debug=True)

