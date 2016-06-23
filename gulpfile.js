'use strict';

var gulp = require('gulp');
var gulpprint = require('gulp-print');
var gulpjshint = require('gulp-jshint');
var gulpjscs = require('gulp-jscs');
var gulputil = require('gulp-util');
var browserSync = require('browser-sync');
var gulpif = require('gulp-if');
var gulporder = require('gulp-order');
var gulptasklisting = require('gulp-task-listing');
var gulpeslint = require('gulp-eslint');

var paths = {
    webroot: './'
};

/**
 * Config
 */
var config = {
    rootDirectory: './',
    index: 'index.html',
    alljs: [
        './*.js'
    ],
};

/**
 * List the available gulp tasks
 */
gulp.task('help', gulptasklisting);
gulp.task('default', ['help']);

gulp.task('dev', function() {
	browserSync.init({
		notify: false,
		port: 8080,
		server: {
			baseDir: ['./'],
	 		routes: { 
				'/bower_components' : 'bower_components', 
			}
		}
	});
	gulp.watch(['jscripts/**/*.*', 'stylesheets/**/*.*', '*.*'])
		.on('change', browserSync.reload);
});

gulp.task('analyse', function () {
    log('Analyzing source with ESLint');
    return gulp
        .src(config.alljs)
        .pipe(gulpeslint())
        .pipe(gulpeslint.format());
});

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        //.pipe(gulpprint())
        .pipe(gulpjshint())
        .pipe(gulpjshint.reporter('jshint-stylish', { verbose: true }))
        .pipe(gulpjshint.reporter('fail'))
        .pipe(gulpjscs());
});

gulp.task('jscs', function () {
    log('Analyzing source with JSCS');

    return gulp
        .src(config.alljs)
        .pipe(gulpjscs());
});

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                gulputil.log(gulputil.colors.blue(msg[item]));
            }
        }
    } else {
        gulputil.log(gulputil.colors.blue(msg));
    }
}
