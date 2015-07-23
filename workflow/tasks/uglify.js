var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('compress', function() {
  return gulp.src('dist/napos-jssdk.js')
    .pipe(uglify())
    .pipe(rename('napos-jssdk.min.js'))
    .pipe(gulp.dest('dist'));
});