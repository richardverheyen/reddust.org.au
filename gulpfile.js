// Required

var gulp = require('gulp');
var layouts = require('handlebars-layouts');
var hb = require('gulp-hb');

var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// html task

// gulp.task('compile-handlebars', function() {
//
//   var hbStream = hb()
//     .partials('./templates/partials/**/*.hbs')
//     .partials('./templates/components/**/*.hbs')
//     .helpers(layouts());
//
//   return gulp
//     .src('./src/templates/layouts/layout.html')
//     .pipe(hbStream)
//     .pipe(gulp.dest('./dist'));
//
// });

// Sass Task

// JavaScript Task

gulp.task('minify-js', function() {
  gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
    .pipe(plumber())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('temp/assets/js'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('concat-js', ['minify-js'], function() {
  return gulp.src(['./bower_components/jquery/dist/jquery.min.js', './bower_components/velocity/velocity.min.js',
      './temp/assets/js/main.min.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js/'))
});

gulp.task('destroy', ['minify-js', 'concat-js'], function() {
  return gulp.src('./temp')
    .pipe(clean({
      force: true
    }))
});

// Browser-sync tasks

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

// Watch Tasks

gulp.task('watch', function() {
  gulp.watch('gulpfile.js', ['default']);
  gulp.watch('src/js/**/*.js', ['javascript']);
  // gulp.watch('src/styles/**/*.scss', ['compass']);
})

// Default task

gulp.task('default', ['minify-js', 'concat-js', 'destroy', 'watch']);
