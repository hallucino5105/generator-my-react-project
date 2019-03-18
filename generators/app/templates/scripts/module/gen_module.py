#!/usr/bin/env python
# coding: utf-8

from __future__ import print_function

import sys
import os
import re


root_dir  = "%s/../../src/js" % os.path.abspath(os.path.dirname(__file__))
base_path = "%s/@template" % root_dir

template_path = {
  "action"        : "%s/action.jsx" % base_path,
  "action_labels" : "%s/action_labels.jsx" % base_path,
  "container"     : "%s/container.jsx" % base_path,
  "model"         : "%s/model.jsx" % base_path,
  "reducer"       : "%s/reducer.jsx" % base_path,
}


def out(text):
  sys.stdout.write(text)
  sys.stdout.flush()


def cap(text, sep="_"):
  return "".join([ s.capitalize() for s in text.split("_") ])


def camelToSnake(text):
  return re.sub("_(.)", lambda x:x.group(1).upper(), text)


def snakeToCamel(text):
  return re.sub("([A-Z])", lambda x:"_" + x.group(1).lower(), text)


def findModuleName(vars, template_string):
  template_item_label = template_string.split("_")[1]
  if vars[template_item_label]:
    return vars[template_item_label]

  raise RuntimeError("template string illegal format. \"%s\"" % template_string)


def replaceTemplateStr(buf, template_string, replace_string):
  return buf.replace(makeTemplateStr(template_string), replace_string)


def makeTemplateStr(template_string):
  return "{{%s}}" % template_string


def getTemplateItemLabel(template_string):
  return template_string.split("_")[1]


def makeFile(vars, item_label):
  print("generate template from %s" % item_label)

  with open(template_path[item_label]) as f:
    template_buf = f.read()

    tmpl_target_all = list(set(re.findall(r"{{(.+?)}}", template_buf)))
    #print(tmpl_target_all)

    for tmpl in tmpl_target_all:
      tmpl_label = getTemplateItemLabel(tmpl)
      #print("1.", tmpl)
      #print("2.", tmpl_label)

      if not vars[tmpl_label]:
        continue

      if "template" not in vars[tmpl_label]:
        continue

      template = vars[tmpl_label]["template"]
      #print("3.", template)

      for t in template:
        #print("4.", t["label"])

        if tmpl == t["label"]:
          out("template: \"%s\", to \"%s\"\n" % (t["label"], t["value"]))
          template_buf = replaceTemplateStr(template_buf, t["label"], t["value"])

  #print(template_buf)
  #print(vars[item_label])

  with open(vars[item_label]["module_path"], "wt") as f:
    f.write(template_buf)


def makeDir(vars, item_label):
  try:
    os.makedirs(vars[item_label]["module_dir"])
  except OSError:
    pass


def generateItem(vars, item_label):
  if not vars[item_label]:
    return

  makeDir(vars, item_label)
  makeFile(vars, item_label)


def createVar(vars, item_label, module_root_dir, postfix=None, default_ignore=False):
  default_name = "{module}".format(**vars)

  if not default_ignore:
    default_value_star1 = "*"
    default_value_star2 = ""
  else:
    default_value_star1 = ""
    default_value_star2 = "*"

  out("{0:<20} [\"{1}\"{2} / Ignore{3}]: ".format(
    "%s name?" % item_label.replace("_", " ").capitalize(),
    default_name,
    default_value_star1,
    default_value_star2,
  ))

  vars[item_label] = {
    "module_name": "",
    "module_filename": "",
  }

  vars[item_label]["module_name"] = raw_input()
  if not vars[item_label]["module_name"]:
    if not default_ignore:
      vars[item_label]["module_name"] = default_name
    else:
      vars[item_label] = None
  else:
    if vars[item_label]["module_name"].lower() == "ignore" \
        or vars[item_label]["module_name"].lower() == "i":
      vars[item_label] = None

  if vars[item_label]:
    if postfix:
      vars[item_label]["module_filename"] = "%s_%s" % (vars[item_label]["module_name"], postfix)
    else:
      vars[item_label]["module_filename"] = "%s" % vars[item_label]["module_name"]

      vars[item_label]["module_dir"] = "{root_dir}/{module_root_dir}/{module_name}".format(
        root_dir=root_dir,
        module_root_dir=module_root_dir,
        **vars[item_label])

      vars[item_label]["module_path"] = "%s/%s.jsx" % (
        vars[item_label]["module_dir"],
        vars[item_label]["module_filename"])

      vars[item_label]["template"] = [{
        "label": "template_%s" % item_label,
        "value": vars[item_label]["module_name"],
      }, {
        "label": "template_%s_cap" % item_label,
        "value": cap(vars[item_label]["module_name"]),
      }, {
        "label": "template_%s_upper" % item_label,
        "value": vars[item_label]["module_name"].upper(),
      }, {
        "label": "template_%s_camel" % item_label,
        "value": camelToSnake(vars[item_label]["module_name"]),
      }]

  #print(vars[item_label])


def genModule():
  vars = {}

  out("{0:<20} [required]: ".format("Module name?"))
  vars["module"] = raw_input()
  if not vars["module"]:
    raise RuntimeError("Blank not allowed")

  createVar(vars, "action", module_root_dir="actions")
  createVar(vars, "action_labels", module_root_dir="actions", postfix="labels")
  createVar(vars, "container", module_root_dir="containers")
  createVar(vars, "model", module_root_dir="models")
  createVar(vars, "reducer", module_root_dir="reducers")

  generateItem(vars, "action")
  generateItem(vars, "action_labels")
  generateItem(vars, "container")
  generateItem(vars, "model")
  generateItem(vars, "reducer")

  #print(vars)


def main():
  genModule()


if __name__ == "__main__":
  main()


