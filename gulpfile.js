const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buff = require('vinyl-buffer');
const uglify = require('gulp-uglify');



let styleSRC = 'src/scss/style.scss';
let styleDIST = './dist/css';
let styleWatch = 'src/scss/**/*.scss';

let jsSRC = 'script.js';
let jsFolder = 'src/js/'
let jsDIST = './dist/js';
let jsWatch = 'src/js/**/*.js';
let jsFiles = [jsSRC];



gulp.task('style', function () {
  return gulp.src(styleSRC)
    .pipe(sourcemaps.init())
    .pipe(sass({
      errorLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({ brower: ['last 2 versions'], cascade: false }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(styleDIST));
});

gulp.task('js', function (done) {
  jsFiles.map(function (entry) {
    return browserify({
      entries: [jsFolder + entry]
    })
      .transform(babelify, { presets: ['@babel/env'] })
      .bundle()
      .pipe(source(entry))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(buff())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(jsDIST))


  })
  // browserify
  // transform babelify[env]
  // bundle 
  // sourse
  // remane .min
  // buffer(buff)
  // uglify
  // write sourcemap
  // dist
  done();

});


gulp.task('default', gulp.series(['style', 'js']));

gulp.task('watch', gulp.parallel('default', function () {
  gulp.watch(styleWatch, gulp.series('style'));
  gulp.watch(jsWatch, gulp.series('js'));
}));

