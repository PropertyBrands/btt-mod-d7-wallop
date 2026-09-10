const autoprefixer = require("autoprefixer");
const gulp = require('gulp');
const {watch} = require('gulp');
const sass = require('gulp-sass');
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');

// CSS task
function scss() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "nested" }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer('last 2 versions', 'ie 8', 'ie 9', 'android 4'), cssnano()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(notify({
      title: "SCSS Parsed / Minified",
      message: "All SCSS files in the module have been parsed and minified.",
      onLast: true
    }));
}

// Build task.
const styles = gulp.series(scss, gulp.parallel(scss));
exports.scss = styles;

// Default task. Just use "gulp" to run it.
exports.default = function() {
  watch("./src/scss/**/*.scss", scss);
};