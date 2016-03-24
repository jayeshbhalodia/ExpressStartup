// Gulpfile.js
var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    typescript = require('gulp-tsc'),
    shell = require('gulp-shell'),
    sass = require('gulp-sass');



gulp.task('nodemon', function() {
    nodemon({
            script: 'index.js',
            ext: 'html js',
            ignore: ['ignored.js'],
            tasks: []
        })
        .on('restart', function() {
            console.log('restarted!')
        })
})


gulp.task('tsc', shell.task(['cd public;npm run tsc:w']))


gulp.task('sass', function() {
    return gulp.src('./public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});



gulp.task('sass:watch', function() {
    console.log(' Started ! ');
    gulp.watch('./public/sass/*.scss', ['sass']);
});


gulp.task('default', ['tsc', 'sass', 'sass:watch', 'nodemon']);