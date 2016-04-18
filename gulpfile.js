var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function () {
  gulp.src('scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 25 version'],
        cascade: false
      }))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function(){
	gulp.watch('scss/*.scss', ['sass']);
})

gulp.task('default', ['watch']);