/* _________________________________________________________________________
 *
 *
 * Created by Home on 21.09.2015
 * MegaREFACTORED on 03.11.2015
 *
 * _________________________________________________________________________
*/
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	csscomb = require('gulp-csscomb'),
	cssmin = require('gulp-cssmin'),
	less = require('gulp-less'),
	sass = require('gulp-sass'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),

//Added for moving files to virtual machine through GULP PLUGIN
	GulpSSH = require('gulp-ssh');


var path = {
	build:{
		css:'build/css/',
		js:'build/js/', // Tell your group to fix this for creating min js file for project
		html:'build/', // Tell your group that this file doesn't build in build folder because of no slash
		img:'build/img/',
		fonts: 'build/fonts/'
	},
	src:{
		css:'src/scss/**/*.scss',
		js: 'src/app/**/*.js', // Tell your group to change this path according to a new file structure and to be consistent
		html:'src/**/*.html',
		img:'src/img/*'
	},
	watch:{
		css:'src/scss/**/*.scss',
		js:'src/app/**/*.js',
		html:'src/**/*.html',
		img: 'src/img/**.*'
	},
	dist: {
		css:'dist/css/',
		js:'dist/js/', // Tell your group to fix this for creating min js file for project
		html:'dist/', // Tell your group that this file doesn't build in build folder because of no slash
		img:'dist/img/',
		fonts: 'dist/fonts/'
	}
};

/* _________________________________________________________________________
 *
 *
 * START BUILD DEV Task for building developer full project (NOT minified)
 *
 * _________________________________________________________________________
*/

gulp.task('default', ['build', 'watch']);

gulp.task("vendor-fonts", function() {
	gulp.src('bower_components/bootstrap/fonts/**.*')
		.pipe(gulp.dest(path.build.fonts));
});

// Task for compiling bootstrap LESS files
gulp.task("vendor-css", function() {
		// Merging all vendor less files
		gulp.src([
			'bower_components/bootstrap/dist/css/bootstrap.css',
			'bower_components/bootstrap/dist/css/bootstrap-theme.css'
		])
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest(path.build.css));
});

// Task for compiling all bootstrap, angular and angular modules js files
gulp.task("build-all-js", function() {
		// Merging all vendor js files
		gulp.src([
			'bower_components/jquery/dist/jquery.js',
			'bower_components/bootstrap/js/affix.js',
			'bower_components/bootstrap/js/transition.js',
			'bower_components/bootstrap/js/tooltip.js',
			'bower_components/bootstrap/js/alert.js',
			'bower_components/bootstrap/js/button.js',
			'bower_components/bootstrap/js/carousel.js',
			'bower_components/bootstrap/js/collapse.js',
			'bower_components/bootstrap/js/dropdown.js',
			'bower_components/bootstrap/js/modal.js',
			'bower_components/bootstrap/js/popover.js',
			'bower_components/bootstrap/js/scrollspy.js',
			'bower_components/bootstrap/js/tab.js',
			'bower_components/angular/angular.js',
			'bower_components/angular-ui-router/release/angular-ui-router.js',
			path.src.js // Path for compiling all project js files
		])
			.pipe(concat("app.js"))
			.pipe(gulp.dest(path.build.js));
});

// Task for moving all html files into destination folder
gulp.task('build-html', function() {
	gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html));
});

gulp.task('build-img', function() {
	gulp.src(path.src.img)
		.pipe(gulp.dest(path.build.img));
});

// Task for compiling all project sass files
gulp.task('build-sass', function() {
	gulp.src(path.src.css)
		.pipe(sass().on('error', sass.logError))// Gives opportunity to see all errors
		.pipe(concat('styles.css'))
		.pipe(gulp.dest(path.build.css))
});

gulp.task('build', ['vendor-css', 'build-sass', 'build-all-js', 'build-html', 'build-img', 'vendor-fonts']);

gulp.task('watch', function() {
	gulp.watch(path.watch.html, ['build-html']); // END OF WORK
	gulp.watch(path.watch.css, ["build-sass"]);
	gulp.watch(path.watch.js, ["build-all-js"]);
	gulp.watch(path.watch.img, ["build-img"]);
});


/* _________________________________________________________________________
 *
 *
 * START BUILD PRODUCTION (DIST TASK - minified and uglified)
 *
 * _________________________________________________________________________
*/

gulp.task("dist-fonts", function() {
	gulp.src('bower_components/bootstrap/fonts/**.*')
		.pipe(gulp.dest(path.dist.fonts));
});

gulp.task("dist-js", function() {
		// Merging all vendor js files AND project js files
		gulp.src([
			'bower_components/jquery/dist/jquery.js',
			'bower_components/bootstrap/js/affix.js',
			'bower_components/bootstrap/js/transition.js',
			'bower_components/bootstrap/js/tooltip.js',
			'bower_components/bootstrap/js/alert.js',
			'bower_components/bootstrap/js/button.js',
			'bower_components/bootstrap/js/carousel.js',
			'bower_components/bootstrap/js/collapse.js',
			'bower_components/bootstrap/js/dropdown.js',
			'bower_components/bootstrap/js/modal.js',
			'bower_components/bootstrap/js/popover.js',
			'bower_components/bootstrap/js/scrollspy.js',
			'bower_components/bootstrap/js/tab.js',
			'bower_components/angular/angular.js',
			'bower_components/angular-ui-router/release/angular-ui-router.js',
			// Our project JS files
			path.src.js

		])
			.pipe(concat("app.js"))
			.pipe(uglify())
			.pipe(gulp.dest(path.dist.js));
})

gulp.task("dist-ven-css", function() {
		// First of all we need to compile LESS vendor files
		gulp.src([
			'bower_components/bootstrap/dist/css/bootstrap.css',
			'bower_components/bootstrap/dist/css/bootstrap-theme.css'
		])
			.pipe(concat('vendor.css'))
			.pipe(cssmin())
			.pipe(gulp.dest(path.dist.css));
});

// Task for moving all html files into destination folder
gulp.task('dist-html', function() {
	gulp.src(path.src.html)
		.pipe(gulp.dest(path.dist.html));
});

gulp.task('dist-img', function() {
	gulp.src(path.src.img)
		.pipe(imagemin({
						progressive: true,
						svgoPlugins: [{removeViewBox: false}],
						use: [pngquant()]
				}))
		.pipe(gulp.dest(path.dist.img));
});

// Task for compiling all project sass files
gulp.task('dist-sass', function() {
	gulp.src(path.src.css)
		.pipe(sass().on('error', sass.logError))// Gives opportunity to see all errors
		.pipe(concat('styles.css'))
		.pipe(cssmin())
		.pipe(gulp.dest(path.dist.css))
});

gulp.task('dist', ['dist-js', 'dist-ven-css', 'dist-sass', 'dist-html', 'dist-img', 'dist-fonts']);



/* _________________________________________________________________________
 *
 *
 * START BUILD PRODUCTION (DIST TASK - minified and uglified)
 *
 * Please, don't remove this code.
 * It's using to move files to virtual machine
 *
 * _________________________________________________________________________
*/

gulp.task('ext-move', ['build', 'move', 'ext-watch']);

gulp.task('ext-watch', function() {
	gulp.watch(path.watch.html, ['build-html', 'ext-move']); // END OF WORK
	gulp.watch(path.watch.css, ['build-sass', 'ext-move']);
	gulp.watch(path.watch.js, ['build-all-js', 'ext-move']);
	gulp.watch(path.watch.img, ['build-img', 'ext-move']);
});

var config = {
	host: '192.168.56.101',
	port: 22,
	username: 'uran',
	password: '1qaz2wsx',
};

var gulpSSH = new GulpSSH({
	ignoreErrors: false,
	sshConfig: config //Here is our configs
});

gulp.task('move', function () {
	return gulp
		.src([
			'./*',
			'!./src/**',
			'!./*.json',
			'!./*.md',
			'!./gulpfile.js',
			'!**/node_modules/**',
			'!**/bower_components/**',
			'**/build/**',
			'!**/libs/**',
			])
		.pipe(gulpSSH.dest('/home/uran/public_html/'));
});
