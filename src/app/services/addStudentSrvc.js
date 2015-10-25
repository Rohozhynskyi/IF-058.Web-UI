angular.module('app')
	.factory('addStudentSrvc', ['$http', function ($http) {
		var URL_BASE = 'http://dtapi.local/'
			, service = {};

		service.addStudent = function (studentRecordData) {

			return $http({
				//Creating object with parameters
				method: 'POST',
				url: URL_BASE + 'student/insertData'
			}, studentRecordData)
				.then(addSuccess, addError);

				// Success Function for Promise
				function addSuccess (response) {
					condole.log('Everything is OK. Student record is added.');
				}

				//Error Function for Promise
				function addError (response) {
					console.log('Something goes wrong. Student record was not added.');
					console.log(response);
				}
		};

		return service;

	}]);