var app = angular.module('app', ['ui.router']);

app.constant("baseUrl", "http://dtapi.local/");

app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.
		state('login', {
			url: '/',
			templateUrl: 'app/views/login.html',
			controller: 'loginCtrl'
		}).
		state('admin', {
			url: '/admin',
			templateUrl: 'app/views/admin.html'
		}).
		state('admin.main', {
			url: '/main',
			templateUrl: 'app/views/main.html'
		}).
		state('user', {
			url: '/user',
			templateUrl: 'app/views/user.html'
		}).
		state('admin.educationInfo', {
			url: '/educationInfo',
			templateUrl: 'app/views/educationInfo.html'
		}).
		state('admin.educationInfo.groups', {
			url: '/groups',
			templateUrl: 'app/views/groupList.html',
			controller: 'groupsCtrl'
		}).
		state('admin.educationInfo.faculties', {
			url:'/faculties',
			templateUrl: 'app/views/facultyList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.educationInfo.specialities', {
			url:'/specialities',
			templateUrl: 'app/views/specialitiesList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.subjects', {
		url:'/subjects',
			templateUrl: 'app/views/subjectsList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.tests', {
			url:'/tests/:id',
			templateUrl: 'app/views/testsList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.students', {
			url:'/students',
			templateUrl: 'app/views/getStudents.html',
			controller: 'getStudentsCtrl'
		}).
		state('admin.addStudent', {
			url:'/students/addStudent',
			templateUrl: 'app/views/addStudentRecord.html',
			controller: 'addStudentCtrl'
		}).
		state('admin.addAdmin', {
			url: '/addAdmin',
			templateUrl: 'app/views/addAdmin.html',
			controller: 'addAdminCtrl'
	});

		$urlRouterProvider.otherwise('/');
});
