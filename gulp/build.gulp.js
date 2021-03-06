'use strict';

var gulp = require('gulp'),
	prefix = require('gulp-autoprefixer'),
	gulpif = require('gulp-if'),
	cache = require('gulp-cache'),
	del = require('del'),
	pls = require('gulp-load-plugins')();

//Error Handler
var errorLog = function (error) {
	console.error(error.toString());
	this.emit('end');
};

//Paths
var paths = {
	jade: 'app/jade/index.jade',
	sass: 'app/sass/styles.scss',
	html: 'app/*.html'
};

//HTML
gulp.task('html', ['wiredep'], function () {
	var assets = pls.useref.assets();

	return gulp.src(paths.html)
		.pipe(assets)
			// Uglify, Concat Libs 
			.pipe( gulpif('*.js', pls.uglify()) )
			//Minify, Optimize CSS
			.pipe( gulpif('*.css', pls.csso()) )
		.pipe(assets.restore())
		.pipe(pls.useref())
		.pipe(gulp.dest('dist'));
});

//Jade to HTML
gulp.task('jade', function () {
	return gulp.src(paths.jade)
		.pipe(pls.jade({
			pretty: true
		}))
		.on('error', errorLog)
		.pipe(gulp.dest('./app/'))
		.pipe(pls.notify('HTML compile complete!'));
});

//Sass to CSS
gulp.task('sass', function () {
	return gulp.src(paths.sass)
		.pipe(pls.rubySass())
		.on('error', errorLog)
		.pipe(pls.csscomb())
		.pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4', { map: true }))
		.pipe(gulp.dest('app/css'))
		.pipe(pls.notify('Sass compile complete'));
});

//Clean Dirs
gulp.task('clean', function (done) {
	del(['app/css', 'dist'], done);
});

//Clear Cache
gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

//Build
gulp.task('build', ['sass', 'jade'], function () {
	gulp.start('html');
});

