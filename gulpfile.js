(function () {
  'use strict';
  var gulp = require('gulp'),

    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    karma       = require('gulp-karma'),
    connect     = require('gulp-connect'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    Q = require('q'),

    paths = {
      scripts: ['src/**/*.js'],
      styles: ['src/*.scss'],
      dest: 'dist',
      destFileName: 'aes_crypto.js',
      app: ['./app/*.html', './app/scripts/*.js']
    };

  gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
      .pipe(concat(paths.destFileName))
      .pipe(rename({extname: '.js'}))
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('scripts_min', function() {
    return gulp.src(paths.scripts)
      .pipe(concat(paths.destFileName))
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('sass', function () {
    gulp.src(paths.styles)
      .pipe(sass())
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('test', function() {
    return gulp.src('take files from karma.conf please')
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }));
  });

  gulp.task('e2e_test', ['connect'], function(cb) {
    var deferred = Q.defer();

    var spawn = require('child_process').spawn;
    var ls    = spawn('./node_modules/protractor/bin/protractor', ['protractor.conf.js']);
    ls.stdout.on('data', function (data) {
      console.log('' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('Test error: ' + data);
    });

    ls.on('close', function (code) {
      if (code === 0) {
        deferred.resolve();
        process.exit(1);
      } else {
        cb('Test failed');
      }
    });

    return deferred.promise;
  });

  gulp.task('connect', ['build'], connect.server({
    root: ['app', 'dist'],
    port: 1336,
    livereload: true,
    open: {
      browser: 'Google Chrome'
    }
  }));

  gulp.task('html', ['build'], function() {
    gulp.src('./app/*.html').pipe(connect.reload());
  });

  gulp.task('watch', function() {
    gulp.watch(paths.app, ['html']);
  });

  gulp.task('watch_source', function() {
    gulp.watch(paths.scripts.concat(paths.styles), ['html']);
  });

  gulp.task('build', ['scripts', 'scripts_min', 'sass']);
  gulp.task('serve', ['connect', 'watch', 'watch_source']);
  gulp.task('default', ['build']);
})();
