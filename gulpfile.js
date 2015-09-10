var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');


gulp.task('build', function() {
    // Single entry point to browserify 
    gulp.src('src/nanoflux.js')
        .pipe(browserify())
        .pipe(uglify({
            output : {
                ascii_only : true
            }
        }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('default', ['build']);