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

// Gulp 4.0 alpha
// https://demisx.github.io/gulp4/2015/01/15/install-gulp4.html
// https://www.npmjs.com/package/gulp-4.0.build
// http://stackoverflow.com/questions/22824546/how-to-run-gulp-tasks-sequentially-one-after-the-other

'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var data = require('gulp-data');
var del = require('del');
var minifyCSS = require('gulp-clean-css');
var nunjucksRender = require('gulp-nunjucks-render');
var prettify = require('gulp-jsbeautifier');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var sitemap = require('gulp-sitemap');
var uglify = require('gulp-uglify');

// Delete the dist folder
function deleteDist() {
  return del(['dist']);
}

// Delete the temp folder
function deleteTemp() {
  return del(['temp']);
}

// Copy over the files in the public folder "as they are" to the dist folder
function copyPublic() {
  return gulp.src('src/public/**/*')
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
}

// Compile all HTML
function compileHtml() {
  return gulp.src('src/templates/pages/**/*.+(html|nunjucks)')
    .pipe(data(function() { return require('./src/templates/data/partners.json') }))
    .pipe(data(function() { return require('./src/templates/data/people.json') }))
    .pipe(data(function() { return require('./src/templates/data/videos.json') }))
    .pipe(nunjucksRender({ path: ['src/templates'] }))
    .pipe(prettify({ config: './jsbeautifyrc.json' }))
    .pipe(sitemap({
      siteUrl: 'http://www.reddust.org.au',
      changefreq: 'monthly',
      priority: 0.5
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
}

// Compile all CSS
function compileCss() {
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
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(connect.reload());
}

function minifyTempJs() {
  return gulp.src('./src/js/main.js')
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('temp'));
}

function concatJs() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/velocity/velocity.min.js',
      'bower_components/countUp.js/dist/countUp.min.js',
      'src/js/main.js'
    ])
    .pipe(concat('scripts.js'), { newLine: '\n\n' })
    .pipe(gulp.dest('dist/assets/js'));
}

function concatJsMin() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/velocity/velocity.min.js',
      'bower_components/countUp.js/dist/countUp.min.js',
      'temp/scripts.min.js'
    ])
    .pipe(concat('scripts.min.js'), { newLine: '\n\n\n\n' })
    .pipe(replace(/^\s*\r?\n/gm, ''))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(connect.reload());
}

// Rerun the task when a file changes
function watch() {
  gulp.watch(['src/public/**/*'], copyPublic);
  gulp.watch(['src/templates/**/*.+(html|nunjucks|json)'], compileHtml);
  gulp.watch(['src/styles/**/*.scss'], compileCss);
  // gulp.watch(['src/js/**/*.js'], compileJs);
}

// Run a local server on
function serve() {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 9000,
  });
}

// TODO: outdated browsers

gulp.task(watch);
gulp.task(serve);
gulp.task('compileJs', gulp.parallel(concatJs, gulp.series(minifyTempJs, concatJsMin)));
gulp.task('build', gulp.series(deleteDist, gulp.parallel(copyPublic, compileHtml, compileCss, 'compileJs'), deleteTemp));
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));
