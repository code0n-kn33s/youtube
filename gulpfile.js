var gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-clean-css');

gulp.task('less', function() {
    return gulp.src('app/less/**/*.less')
        .pipe(less())
        .pipe(autoprefixer('last 50 versions'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('cache', function() {
    return cache.clearAll();
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: true
    })
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/less/**/*.less', ['less']);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload);

});

gulp.task('build', ['clean', 'img', 'less'], function() {
    var buildHtml = gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist')),
        buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});
