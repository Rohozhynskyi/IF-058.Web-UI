angular.module('app')
	// .controller('addStudentCtrl', ['$scope', 'addStudentSrvc', function ($scope, addStudentSrvc) {
	.controller('addStudentCtrl', ['$scope','$timeout', function ($scope, $timeout) {

		$scope.getError = function(error) {

			if(angular.isDefined(error)) {

				if(error.required) {
					return 'Please, fill in this field';
				}

				// Create an error when length is too short
				if(error.minlength) {
					return 'Your information is too short. Please, fill in more information.';
				}

				// Create an error when length is too long
				if(error.maxlength) {
					return 'There are to much symbols. Please, try to be more laconical.';
				}

				// Create an error when email is invalid
				if (error.email) {
					return 'Please, enter valid email address';
				}

				// Checks if the password confirmation is filled in
				if (error.studConfPassword) {
					return 'Please, confirm the password';
				}
			}
		};


	}]);