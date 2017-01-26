// Documentation
// https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
// https://github.com/gulpjs/gulp/blob/master/docs/API.md
// https://zellwk.com/blog/nunjucks-with-gulp/
// http://gulpjs.com/

'use strict';

var gulp = require('gulp');
var del = require('del');
var nunjucksRender = require('gulp-nunjucks-render');
var prettify = require('gulp-jsbeautifier');
var data = require('gulp-data');

// Watch all the files and run specific tasks if one changes
gulp.task('watch', function() {
  gulp.watch(['src/public/**/*'], ['copy-public']);
  gulp.watch(['src/templates/**/*.+(html|nunjucks)', 'src/data/**/*.json'], ['compile-html']);
  gulp.watch(['src/styles/**/*.scss'], ['scss']);
  gulp.watch(['src/js/**/*.js'], ['js']);
});

// Delete the dist folder
gulp.task('delete-dist', function() {
  return del(['dist']);
});

// Copy over the files in the public folder "as they are" to the dist folder
gulp.task('copy-public', ['delete-dist'], function() {
  return gulp.src('src/public/**/*')
    .pipe(gulp.dest('dist/'));
});

// Compile all HTML pages
gulp.task('compile-html', ['delete-dist'], function() {
  return gulp.src('src/templates/pages/**/*.+(html|nunjucks)')
    .pipe(data(function() { return require('./src/data/partners.json') }))
    .pipe(data(function() { return require('./src/data/people.json') }))
    .pipe(data(function() { return require('./src/data/music-videos-top.json') }))
    .pipe(data(function() { return require('./src/data/music-videos-bottom.json') }))
    .pipe(nunjucksRender({ path: ['src/templates'] }))
    .pipe(prettify({ config: './prettify.json' }))
    .pipe(gulp.dest('dist'))
});
