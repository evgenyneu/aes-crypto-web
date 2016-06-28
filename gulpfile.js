(function () {
  'use strict';
  var gulp = require('gulp'),

    uglify      = require('gulp-uglify'),
    karma       = require('gulp-karma'),
    connect     = require('gulp-connect'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    prefix      = require('gulp-autoprefixer'),
    minifyCss   = require('gulp-minify-css'),
    usemin      = require('gulp-usemin'),
    rev         = require('gulp-rev'),
    clean       = require('gulp-clean'),
    open        = require('gulp-open'),
    shell       = require('gulp-shell'),

    paths = {
      scripts: ['src/js/**/*.js'],
      dest: 'dist',
      temp: '_tmp',
      destFileName: 'aes_crypto.js',
      destFileNameCSS: 'aes_crypto.css',
      app: ['./app/*.html', './app/scripts/*.js']
    };

  gulp.task('sass', ['copy_to_dist'], function () {
    return gulp.src('app/scss/app.scss')
      .pipe(concat(paths.destFileNameCSS))
      .pipe(sass())
      .pipe(prefix(['last 1 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest(paths.temp + '/css'));
  });

  gulp.task('test', function() {
    return gulp.src('take files from karma.conf please')
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }));
  });

  gulp.task('connect', ['sass'], function() {
    connect.server({
      root: ['app', paths.temp, paths.dest],
      port: 1336,
      livereload: true
    });
  });

  gulp.task('connectDist', ['build'], function(){
    connect.server({
      root: ['dist'],
      port: 1337
    });
  });

  gulp.task('html', ['sass'], function() {
    gulp.src('./app/*.html').pipe(connect.reload());
  });

  gulp.task('watch', ['sass'], function() {
    gulp.watch(['app/*.html', 'app/help/*.html', 'app/scss/**/*', 'app/js/**/*'], ['html']);
  });

  gulp.task('copy_to_dist', ['clean'], function(){
    gulp.src(['redist/aes_crypto.html'])
    .pipe(gulp.dest(paths.dest + '/redist'));

    gulp.src(['app/images/**/*', 'app/favicon.ico'], {base: 'app/'})
    .pipe(gulp.dest(paths.dest));
  });

  gulp.task('usemin', ['sass'], function() {
    return gulp.src(['./app/**/index.html'])
      .pipe(usemin({
        css: [minifyCss({keepBreaks:true}), rev()],
        js: [uglify(), rev()]
      }))
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('clean', function () {
    return gulp.src([paths.dest, paths.temp], {read: false})
      .pipe(clean());
  });

  gulp.task('open', ['connect', 'watch'], function(){
    gulp.src('app/index.html')
    .pipe(open('', { url: 'http://localhost:1336' }));
  });

  gulp.task('openDist', ['connectDist'], function(){
    gulp.src('app/index.html')
    .pipe(open('', { url: 'http://localhost:1337' }));
  });

  gulp.task('deploy', ['build'], shell.task([
    'rsync -rvz dist/ aws:web/aescrypto.com',
    'echo world'
  ]));

  gulp.task('build', ['usemin', 'copy_to_dist']);

  gulp.task('serve', ['open']);

  gulp.task('serveDist', ['openDist']);

  gulp.task('default', ['build']);
})();
