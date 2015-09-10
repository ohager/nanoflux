var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var preprocess = require('gulp-preprocess');
var jasmine = require('gulp-jasmine');
var sequence = require('gulp-run-sequence');


gulp.task('build', function() {
    gulp.src('src/nanoflux.js')
        .pipe(browserify({
            standalone : 'NanoFlux'
        }))
        .pipe(uglify({
            output : {
                ascii_only : true
            }
        }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('build:test', function() {
    gulp.src('spec/nanoflux-spec.js')
        .pipe(preprocess({context: {DIST: true}}))
        .pipe(jasmine({verbose:true}));
});

gulp.task('default', function(cb){
    sequence('build','build:test',cb);
});