angular.module('app')
	.factory('addStudentSrvc', ['$http', function ($http) {
		var URL_BASE = 'http://dtapi.local/'
			, service = {};

		service.addStudent = function (studentRecordData) {

			// Transforming data into JSON string
			var jsonData = JSON.stringify(studentRecordData);

			// Return promise with POST request to the back-end
			return $http.post(URL_BASE + 'student/insertData', jsonData)
				.then(addSuccess, addError);

			// Success Function for Promise
			function addSuccess (response) {
				var result = response.data.response;
				return result;
			}

			//Error Function for Promise
			function addError (response) {
				var result = response.data.response;
				return result;
			}
		};

		// Return full service
		return service;

	}]);