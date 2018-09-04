// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat'),
    spritesmith = require('gulp.spritesmith'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    cheerio = require('gulp-cheerio'),
    pump = require('pump'),
    imagemin = require('gulp-imagemin');

var pluginsJS = [
    '_plugins/jquery-2.2.4.min.js',
    '_plugins/magnific-popup/dist/jquery.magnific-popup.min.js',
    '_plugins/jquery.maskedinput/jquery.maskedinput.min.js',
    '_plugins/lightslider/lightslider.min.js',
    '_plugins/flipclock/flipclock.min.js',
    '_plugins/flipclock/ru-ru.js',
    '_plugins/jquery.mb.YTPlayer.min.js',
    '_plugins/jquery.waypoints.min.js',
];

//////////////////////////////////////////////

// WATCH AREA

// compile scss -> .css -> min.css
gulp.task('scss', function () {
    gulp.src('_scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 20 version'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('../scss-maps/'))
        .pipe(gulp.dest('css/'));
});

gulp.task('bootstrap', function () {
    gulp.src('_plugins/bootstrap/style/_bootstrap.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('css/'));
});

// Compile _js -> _js.min
gulp.task('_js.min', function (cb) {
    pump([
            gulp.src('./_js/*.js'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest('./_js.min/')
        ],
        cb
    );
});

// Create sprite from _assets/img/sprite/*.png, write less, create sprite.png
gulp.task('sprite', function () {
    var spriteData = gulp.src('img/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/sprite.png',
        cssName: '_sprite.scss',
        cssVarMap: function(sprite) {
            sprite.name = 's-' + sprite.name
        }
    }));
    spriteData.img.pipe(gulp.dest('img')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('_scss')); // путь, куда сохраняем стили
});

// Watch for changes, and live reload
gulp.task('watch', function () {
    gulp.watch('_scss/**/*.scss', ['scss']);
    gulp.watch('_js/*.js', ['_js.min']);
});

//////////////////////////////////////////////


// Concatenate & Minify JS, CSS PLUGINS
gulp.task('plugins', function() {
    // concat minify plugins JS
    gulp.src(pluginsJS)
        .pipe(concat('_plugins-all.min.js')).on('error', sass.logError)
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

// {include file="svg-all.svg"}
// <span><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/_assets/img/svg-all.svg#icon-success"></use></svg></span>
gulp.task('svgstore', function () {
    return gulp
        .src('img/svg/*.svg')
        .pipe(svgmin())
        .pipe(rename({prefix: 'icon-'}))
        .pipe(cheerio({
            run: function ($, file) {
                $('[fill="none"]').removeAttr('fill');
                var filePathStr = file.history[1],
                    regexFileName = /(icon-.*?\.svg)/g,
                    fileNameArray = filePathStr.match(regexFileName),
                    fileName = fileNameArray[fileNameArray.length-1];
                fileName = fileName.replace('.svg', '');
                var fileHtml = $('svg').html(),
                    regClassAttr = /class="cls/g,
                    replClassAttr = 'class="' + fileName;
                fileHtml = fileHtml.replace(regClassAttr, replClassAttr);
                var regClassSelector = /.cls/g,
                    replClassSelector = '.' + fileName;
                fileHtml = fileHtml.replace(regClassSelector, replClassSelector);
                $('svg').html(fileHtml);
                $('style').each(function () {
                    var style = $(this),
                        pre = '{literal}',
                        after = '{/literal}';

                    if (style.text().indexOf('fill:none;') > -1){
                        style.text(style.text().replace(/fill:none;/g, ''));
                    }

                    style.text(pre + style.text() + after);
                });
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore())
        .pipe(rename('svg-all.svg'))
        .pipe(gulp.dest('img/'));
});

// Optimization Image
gulp.task('image-min', function () {
    return gulp.src('img/official/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('img/official/'));
});

// RUN console: gulp
gulp.task('default', ['watch']);
gulp.task('all', ['scss', 'plugins', '_js.min']);
