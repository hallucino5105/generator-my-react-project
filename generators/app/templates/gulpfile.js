"use strict";

var gulp = require("gulp");
var electron = require("electron-connect").server.create();


gulp.task("serve", function() {
  electron.start();
  gulp.watch(["dist/electron.build.js"], electron.restart);
  gulp.watch(["dist/react.build.js", "dist/*.html", "dist/*.css"], electron.reload);
});

