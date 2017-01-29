// Documentation

// Gulp:
// http://gulpjs.com/
// https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
// https://github.com/gulpjs/gulp/blob/master/docs/API.md
// https://zellwk.com/blog/nunjucks-with-gulp/

// JS Beautify:
// https://github.com/tarunc/gulp-jsbeautifier
// https://github.com/einars/js-beautify/
// https://github.com/victorporof/Sublime-HTMLPrettify

'use strict';

var gulp = require('gulp');
var del = require('del');
var nunjucksRender = require('gulp-nunjucks-render');
var prettify = require('gulp-jsbeautifier');
var data = require('gulp-data');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

// Watch all the files and run specific tasks if one changes
// gulp.task('watch', function() {
//   gulp.watch(['src/public/**/*'], ['copy-public']);
//   gulp.watch(['src/templates/**/*.+(html|nunjucks)', 'src/data/**/*.json'], ['compile-html']);
//   gulp.watch(['src/styles/**/*.scss'], ['scss']);
//   gulp.watch(['src/js/**/*.js'], ['js']);
// });

// Delete the dist folder
gulp.task('delete-dist', function() {
  return del(['dist']);
});

// Copy over the files in the public folder "as they are" to the dist folder
gulp.task('copy-public', ['delete-dist'], function() {
  return gulp.src('src/public/**/*')
    .pipe(gulp.dest('dist/'));
});

// Compile all HTML
gulp.task('compile-html', ['delete-dist'], function() {
  return gulp.src('src/templates/pages/**/*.+(html|nunjucks)')
    .pipe(data(function() { return require('./src/data/partners.json') }))
    .pipe(data(function() { return require('./src/data/people.json') }))
    .pipe(data(function() { return require('./src/data/videos.json') }))
    .pipe(nunjucksRender({ path: ['src/templates'] }))
    .pipe(prettify({ config: './jsbeautifyrc.json' }))
    .pipe(gulp.dest('dist'))
});

// Compile all CSS
gulp.task('compile-css', ['delete-dist'], function() {
  return gulp.src('src/styles/imports.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({
      browsers: ['> 1% in AU', 'Explorer > 9', 'Firefox >= 17', 'Chrome >= 10', 'Safari >= 6', 'iOS >= 6'],
      cascade: false
    }))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(minifyCSS())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('dist/assets/css'));
});

// Compile all JS
gulp.task('compile-js', ['delete-dist', 'minify-js', 'concat-js', 'concat-js-min'], function() {});

// Uglify the JS file of this project (not the vendors)
gulp.task('minify-js', ['delete-dist'], function() {
  return gulp.src('./src/js/main.js')
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('tmp'));
});

gulp.task('concat-js', ['delete-dist'], function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/velocity/velocity.min.js',
      'bower_components/countUp.js/dist/countUp.min.js',
      'src/js/main.js'
    ])
    .pipe(concat('scripts.js'), { newLine: '\n\n' })
    .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('concat-js-min', ['delete-dist', 'minify-js'], function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/velocity/velocity.min.js',
      'bower_components/countUp.js/dist/countUp.min.js',
      'tmp/scripts.min.js'
    ])
    .pipe(concat('scripts.min.js'), { newLine: '\n\n\n\n' })
    .pipe(replace(/^\s*\r?\n/gm, ''))
    .pipe(gulp.dest('dist/assets/js'))
});

// TODO: sitemap
// TODO: outdated browsers
// TODO: watch and rebuild

// Build the entire dist folder
gulp.task('build', ['copy-public', 'compile-html', 'compile-css', 'compile-js']);
