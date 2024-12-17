const autoprefixer = require("autoprefixer");
const gulp = require('gulp');
const {watch, series} = require('gulp');
const sass = require('gulp-sass');
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");

// CSS task
function scss() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "normal" }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer('last 2 versions', 'ie 8', 'ie 9', 'android 4'), cssnano()]))
    .pipe(gulp.dest("./css/"));
}

// Build task.
const styles = gulp.series(scss, gulp.parallel(scss));
exports.scss = styles;

// Default task. Just use "gulp" to run it.
exports.default = function() {
  watch("./src/scss/**/*.scss", scss);
};