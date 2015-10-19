/**
 * Created by Home on 21.09.2015.
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
		img:'build/img/'
	},
	src:{
		css:'src/scss/**/*.scss',
		js: [
			'src/app/app.js',
			'src/app/services/groupsSrvc.js',
			'src/app/services/facultySrvc.js',
			'src/app/controllers/groupsCtrl.js',
			'src/app/controllers/facultiesCtrl.js'
			], // Tell your group to change this path according to a new file structure and to be consistent
		html:'src/**/*.html',
		img:'src/img/*'
	},
	watch:{
		css:'src/scss/**/*.scss',
		js:'src/app/**/*.js',
		html:'src/**/*.html'
	}
};

gulp.task('less', function () {
		gulp.src('bower_components/bootstrap/less/bootstrap.less')
				.pipe(less())
				.pipe(concat('bootstrap.css'))
				.pipe(gulp.dest('build/css/')); //Added build/ folder to create css file in right directory
});

gulp.task('js', function() {
	gulp.src(path.src.js)
		.pipe(concat('script_min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js));
});

gulp.task('html', function() {
	gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html));
});

gulp.task('img', function() {
	gulp.src(path.src.img)
		.pipe(imagemin({
						progressive: true,
						svgoPlugins: [{removeViewBox: false}],
						use: [pngquant()]
				}))
		.pipe(gulp.dest(path.build.img));
});

gulp.task('sass', function() {
	gulp.src(path.src.css)
		.pipe(sass().on('error', sass.logError))// Gives opportunity to see all errors
		.pipe(csscomb())
		.pipe(cssmin())
		.pipe(concat('main.css'))
		.pipe(gulp.dest(path.build.css))
});

gulp.task('libs', function() {
		gulp.src('./bower.json')
				.pipe(gulp.dest('libs'))
});

gulp.task('default', function() {
	gulp.watch(path.watch.css, function(event) {
		gulp.run('sass');
	});
	gulp.watch(path.watch.js, function(event) {
		gulp.run('js');
	});
	gulp.watch(path.watch.html, function(event) {
		gulp.run('html');
	});
});

//MOVE TASK - Please, don't remove this code
//It has been used by Yaroslav ))

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

gulp.task('dest', function () {
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
			'**/libs/**',
			])
		.pipe(gulpSSH.dest('/home/uran/public_html/'));
});

// GULP task for creating min version of Bootstrap jQuery Files
gulp.task('boot-js', function() {
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
			'bower_components/bootstrap/js/tab.js'
		])
		.pipe(concat('bootstrap.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/js/bootstrap-jquery/'));
});


