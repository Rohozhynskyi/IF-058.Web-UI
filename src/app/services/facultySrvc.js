app.factory('facultySrvc', ['$http', function ($http) {
	//Creating an object for adding methods to it and more efficient work
	var service = {};

	var URL = 'http://dtapi.local/faculty/';

	// This method returns students
	service.getFaculties = function () {
		return $http.get(URL + 'getRecords')
			.success(function (response) {
				return response;
			})
			.error(function (response) {
				console.log('error');
			});
	};

	return service;
}]);