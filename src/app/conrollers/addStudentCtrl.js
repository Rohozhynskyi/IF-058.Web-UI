angular.module('app')
	.controller('addStudentCtrl', ['$scope', 'addStudentSrvc', function ($scope, addStudentSrvc) {

		$scope.getError = function(error) {
			//
			// 
			// We need to add here true validation
			// 
			//
			if(angular.isDefined(error)) {
				if(error.required) {
					return 'Please, fill in this field';
				}
				if(error.minlength) {
					return 'Your information is too short. Please, fill in more information.';
				}
				if(error.maxlength) {
					return 'There are to much symbols. Please, try to be more laconical.';
				}
				if (error.email) {
					return 'Please, enter valid email address';
				}
			}
		};

		$scope.addNewStudent = function (recordData) {

			// Some tricks with fields we don't know how to work with
			if(!recordData.group_id) {
				recordData.group_id = '3';
			}
			if(!recordData.photo) {
				recordData.photo = ' ';
			}

			// Put recordData Object into a variable
			var studentRecordData = {
				// User Values
				username: recordData.username,
				password: recordData.password,
				password_confirm: recordData.password_confirm,
				email: recordData.email,
				// Students Values
				gradebook_id: recordData.gradebook_id,
				student_surname: recordData.student_surname,
				student_name: recordData.student_name,
				student_fname: recordData.student_fname,
				group_id: recordData.group_id,// something we need to invent
				plain_password: recordData.password_confirm,
				photo: recordData.photo //need to invent
			};

			// Gives data to a service file
			addStudentSrvc.addStudent(studentRecordData);
		}; // End $scope.addStudent

	}]);