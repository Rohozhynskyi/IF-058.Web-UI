;
var app = angular.module('app', ['ui.router']);

app.constant("baseUrl", "http://dtapi.local/");

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
		state('admin.questions', {
			url:'/questions/:id',
			templateUrl: 'app/views/questionsList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.testDetails', {
			url:'/TestDetail/:id',
			templateUrl: 'app/views/testDetails.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.usersTabs', {
			url: '/usersTabs',
			templateUrl: 'app/views/usersTabs.html'
		}).
		state('admin.usersTabs.students', {
			url:'/students',
			templateUrl: 'app/views/studentsList.html',
			controller: 'getStudentsCtrl'
		}).
		state('admin.addStudent', {
			url:'/students/addStudent',
			templateUrl: 'app/views/addStudentRecord.html',
			controller: 'addStudentCtrl'
		}).
		state('admin.usersTabs.addAdmin', {
			url: '/addAdmin',
			templateUrl: 'app/views/addAdmin.html',
			controller: 'entitiesCtrl'
	});

		$urlRouterProvider.otherwise('/');
}]);
