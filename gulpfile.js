/*
  Copyright 2014 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
'use strict';

var browserify = require('browserify');
var eslint = require('gulp-eslint');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var connect = require('gulp-connect');
var source = require('vinyl-source-stream');
var temp = require('temp').track();
var mocha = require('gulp-mocha');

var buildSources = ['lib/**/*.js'];
var lintSources = buildSources.concat(['gulpfile.js', 'recipes/**/*.js']);

gulp.task('test:manual', function() {
  return connect.server({
    port: 8888
  });
});

gulp.task('test:automated', ['test:manual'], function() {
  // This task requires you to have chrome driver in your path
  // You can do this with:
  // npm install -g chromedriver
  return gulp.src('test/tests/automated-suite.js', {read: false})
    .pipe(mocha({
      timeout: 10000
    }))
    .once('error', () => {
      connect.serverClose();
    })
    .once('end', () => {
      connect.serverClose();
    });
});

gulp.task('build', function() {
  var bundler = browserify({
    entries: ['./lib/sw-toolbox.js'],
    standalone: 'toolbox',
    debug: true
  });

  bundler.plugin('browserify-header');
  bundler.plugin('minifyify', {
    map: 'sw-toolbox.map.json',
    output: 'sw-toolbox.map.json'
  });

  return bundler
    .bundle()
    .pipe(source('sw-toolbox.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('lint', function() {
  return gulp.src(lintSources)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('watch', ['build'], function() {
  gulp.watch(buildSources, ['build']);
});

gulp.task('gh-pages', ['build'], function() {
  var tempDir = temp.mkdirSync();

  return gulp.src([
    'companion.js',
    'sw-toolbox.js',
    'sw-toolbox.map.json',
    'recipes/**/*'
  ], {base: __dirname})
    .pipe(ghPages({cacheDir: tempDir}));
});

gulp.task('default', ['lint', 'build']);
