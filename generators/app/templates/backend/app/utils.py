#!/usr/bin/env python
# coding: utf-8

import decimal
import functools
import json

from flask import Flask, make_response


class CustomFlask(Flask):
  jinja_options = Flask.jinja_options.copy()
  jinja_options.update(dict(
    block_start_string="[%",
    block_end_string="%]",
    variable_start_string="[[",
    variable_end_string="]]",
    comment_start_string="[#",
    comment_end_string="#]",
  ))


class MyJsonEncoder(json.JSONEncoder):
  def default(self, obj):
    if hasattr(obj, 'isoformat'):
      return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
      return float(obj)
    elif isinstance(obj, ModelState):
      return None
    else:
      return json.JSONEncoder.default(self, obj)


def connectdb(conf=None, dictionary=True):
  def _connectdb(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
      if conf and conf["dbc"]:
        import mysql.connector
        con = mysql.connector.connect(**conf["dbc"])
        cur = con.cursor(dictionary=dictionary)
      else:
        con = None
        cur = None

      _args = (con, cur) + args
      ret = func(*_args, **kwargs)

      if cur: cur.close()
      if con: con.close()

      return ret

    return wrapper
  return _connectdb


def response_json(enableCallbackLabel=False, callbackLabel="callback"):
  def _response_json(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
      data = func(*args, **kwargs)

      if enableCallbackLabel:
        ret = r"%s(%s)" % (callbackLabel, json.dumps(data, cls=MyJsonEncoder))
      else:
        ret = r"%s" % json.dumps(data, cls=MyJsonEncoder)

        response = make_response(ret)
        response.headers["Content-Type"] = "application/json"

        return response

    return wrapper
  return _response_json


def load_config(confpath):
  with open(confpath) as f:
    return json.load(f)
  return None

