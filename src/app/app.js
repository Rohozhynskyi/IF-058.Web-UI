var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider.
	when('/', {
			templateUrl: 'app/views/login.html',
			controller: 'loginCtrl'
		}).
	when('/admin', {
			templateUrl: 'app/views/main.html'
		}).
	when('/user', {
			templateUrl: 'app/views/main.html'
		}).
	when('/groups', {
		templateUrl: 'app/views/listGroups.html',
		controller: 'groupsCtrl'
	}).
	when('/addGroup', {
		templateUrl: 'app/views/addGroup.html',
		controller: 'addGroupsCtrl'
	}).
	when('/editGroup/:group_id', {
		templateUrl: 'app/views/editGroup.html',
		controller: 'editGroupsCtrl'
	}).
	when('/faculties', {
		templateUrl: 'app/views/facultyList.html',
		controller: 'facultiesCtrl'
	}).
	when('/specialities', {
			templateUrl: 'app/views/specialitiesList.html',
			controller: 'specialitiesCtrl'
		}).
	otherwise({
		redirectTo: '/'
	});
});


