// Documentation

// Gulp:
// http://gulpjs.com/
// https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
// https://github.com/gulpjs/gulp/blob/master/docs/API.md
// https://zellwk.com/blog/nunjucks-with-gulp/
// https://mozilla.github.io/nunjucks/templating.html#raw

// JS Beautify:
// https://github.com/tarunc/gulp-jsbeautifier
// https://github.com/einars/js-beautify/
// https://github.com/victorporof/Sublime-HTMLPrettify

// Gulp 4.0 alpha
// https://demisx.github.io/gulp4/2015/01/15/install-gulp4.html
// https://www.npmjs.com/package/gulp-4.0.build
// http://stackoverflow.com/questions/22824546/how-to-run-gulp-tasks-sequentially-one-after-the-other

'use strict';

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const data = require('gulp-data');
const del = require('del');
const minifyCSS = require('gulp-clean-css');
const nunjucksRender = require('gulp-nunjucks-render');
const prettify = require('gulp-jsbeautifier');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sitemap = require('gulp-sitemap');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');

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

// Copy the outdatedbrowser script
function copyOutdatedBrowser() {
  return gulp.src('bower_components/outdated-browser/outdatedbrowser/outdatedbrowser.min.js')
    .pipe(gulp.dest('dist/assets/js/'))
}

// Compile all HTML
function compileHtml() {
  return gulp.src('src/templates/pages/**/*.+(html|nunjucks)')
    .pipe(data(function() { return require('./src/templates/data/partners.json') }))
    .pipe(data(function() { return require('./src/templates/data/people.json') }))
    .pipe(data(function() { return require('./src/templates/data/videos.json') }))
    .pipe(nunjucksRender({ path: ['src/templates'] }))
    .pipe(prettify({ config: './jsbeautifyrc.json' }))
    .pipe(gulp.dest('dist'))
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
  return gulp.src('src/styles/app.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(autoprefixer({
      browsers: ['> 1% in AU', 'Explorer > 9', 'Firefox >= 17', 'Chrome >= 10', 'Safari >= 6', 'iOS >= 6'],
      cascade: false
    }))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(minifyCSS({
      keepSpecialComments: 'none'
    }))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(connect.reload());
}

function lintJs() {
  return gulp.src(['src/js/app.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function transformAndMinifyJs() {
  return gulp.src(['src/js/app.js'])
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(rename('scripts.js'))
    .pipe(gulp.dest('temp'))
    .pipe(uglify({ preserveComments: 'license' }))
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('temp'));
}

// Merge the vendor JS and project JS (unminified)
function concatJs() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/velocity/velocity.min.js',
      'bower_components/countUp.js/dist/countUp.min.js',
      'src/js/vendor/google-analytics.js',
      'temp/scripts.js'
    ])
    .pipe(concat('scripts.js'), { newLine: '\n\n' })
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(connect.reload());
}

// Merge the vendor JS and minified project JS
function concatJsMin() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/velocity/velocity.min.js',
      'bower_components/countUp.js/dist/countUp.min.js',
      'src/js/vendor/google-analytics.js',
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
  // gulp.watch(['src/js/**/*.js'], compileJs); // TODO
  // gulp.watch(['gulpfile.js', 'package.json', 'bower.json'], build); // TODO
}

// Run a local server on http://localhost:9000
function serve() {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 9000,
  });
}

// Create Gulp commands
gulp.task(watch);
gulp.task(serve);
gulp.task('compileJs',
  gulp.series(
    gulp.series(
      lintJs,
      transformAndMinifyJs
    ),
    gulp.parallel(
      concatJs,
      concatJsMin,
      copyOutdatedBrowser
    )
  )
);
gulp.task('build',
  gulp.series(
    deleteDist,
    gulp.parallel(
      copyPublic,
      compileHtml,
      compileCss,
      'compileJs'
    ),
    deleteTemp
  )
);
gulp.task('default',
  gulp.series(
    'build',
    gulp.parallel(
      'watch',
      'serve'
    )
  )
);
