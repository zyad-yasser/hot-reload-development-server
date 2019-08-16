const gulp = require("gulp");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const replace = require("gulp-replace");
const imagemin = require("gulp-imagemin");
const connect = require("gulp-connect");
const autoprefixer = require('gulp-autoprefixer');
var del = require('del');

gulp.task("webserver", async () => {
  await connect.server({
    livereload: true,
    port: 13200,
    host: "localhost"
  });
});

gulp.task("sass", async () => {
  await gulp
    .src("src/sass/*.sass")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
		.pipe(gulp.dest("dist/css"))
		.pipe(connect.reload());
});

gulp.task("babel", async () => {
	await gulp
		.src("src/js/*.js")
		.pipe(
			babel({
				presets: ["@babel/env"]
			})
		)
		.pipe(gulp.dest("dist/js"))
		.pipe(connect.reload());
});

gulp.task("templates", async () => {
  await gulp
    .src(["src/*.html", "src/**/*.html"])
    .pipe(replace("sass", "css"))
		.pipe(gulp.dest("dist/"))
		.pipe(connect.reload());
});

gulp.task("images", async () => {
  await gulp
    .src("src/assets/images/*")
    .pipe(imagemin())
		.pipe(gulp.dest("dist/assets/images"))
		.pipe(connect.reload());
});

gulp.task("watch", () => {
  gulp.watch(["src/js/*.js"], gulp.series(["babel"]));
	gulp.watch(["src/sass/*.sass"], gulp.series(["sass"]));
	gulp.watch(["src/assets/images/*"], gulp.series(["images"]));
	gulp.watch(["src/**/*.html", "src/*.html"], gulp.series(["templates"]));
});

gulp.task('clean', () => {
  return del([
    'dist/*'
  ]);
});


gulp.task("default", gulp.series([
    "clean",
    "babel",
    "sass",
    "templates",
    "images",
    "webserver",
    "watch"
  ])
);
