const { src, dest, series, parallel, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const cssnano = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const clean = require('gulp-clean')
const kit = require('gulp-kit')
const reload = browserSync.reload

const paths = {
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/*',
	dist: './dist',
	sassDest: './dist/css',
	jsDest: './dist/js',
	imgDest: './dist/img',
}

function sassCompiler(cb) {
	src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(
			rename({
				suffix: '.mim',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest))
	cb()
}

function javaScript(cb) {
	src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(
			rename({
				suffix: '.mim',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest))
	cb()
}

function imagesMim(cb) {
	src(paths.img)
		.pipe(imagemin())
		.pipe(
			rename({
				suffix: '.mim',
			})
		)
		.pipe(dest(paths.imgDest))
	cb()
}

function cleanStuff(cb) {
	return src(paths.dist, { read: false }).pipe(clean())
	cb()
}

function handleKit(cb) {
	src(paths.html)
	.pipe(kit())
	.pipe(dest('./'))
	cb()
}

function startBrowserSync(cb) {
	browserSync.init({
		server: {
			baseDir: './',
		},
	})

	cb()
}

function watchForChanges(cb) {
	watch('./*.html').on('change', reload)
	watch([paths.html, paths.sass, paths.js], parallel(handleKit, sassCompiler, javaScript)).on('change', reload)
	watch(paths.img, imagesMim).on('change', reload)

	cb()
}

const functions = parallel(handleKit,sassCompiler, javaScript, imagesMim)
exports.cleanStuff = cleanStuff
exports.default = series(functions, startBrowserSync, watchForChanges)
