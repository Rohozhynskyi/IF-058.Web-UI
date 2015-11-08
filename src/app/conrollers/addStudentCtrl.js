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


	//function shows and hides the form for creating new entity
		$scope.showAddForm = function () {
			if (!$scope.showingAdd) {
				$scope.showingAdd = true;
			} else {
				$scope.showingAdd = false;
				$scope.newEntity = {};
			};
		};

		// Create variable of a string for student photo string
		$scope.studPhoto;

		$scope.addImageFile = function (element) {

			// Function for cutting file name string
			function fileCutName (str, slength) {
				if (str.length >= 10) {
					return str.slice(slength) + '...';
				}
				return str;
			}

			$scope.$apply(function (scope) {
				var fileName = '',
						// Get uploading image
						studImage = element.files[0],
						// Create FileReader Object
						reader = new FileReader();

				// Getting cutted uploading file name into a variable
				fileName = fileCutName(studImage.name, -11);
				// Find text of our button for uploading image
				var el = angular.element(document.querySelector('.file-name'));
				// Add cutted text of an image to the button
				el.text(fileName);

				//Create event handler
				reader.onload = function (e) {
					//Getting target event result
					var imageFile = e.target.result,
							// Encoding to BASE64 
							imageStr = btoa(imageFile);

					// Putting image base64 string into a variable
					$scope.studPhoto = imageStr;
				};

				reader.readAsDataURL(studImage);
			});
		};// END addImageFile Function

		$scope.addNewStudent = function (recordData) {


			// Some tricks with fields we don't know how to work with
			if(!recordData.group_id) {
				recordData.group_id = '3';
			}

			if($scope.studPhoto !== '') {
				//Transfer photo string inside addNew Student method
				recordData.photo = $scope.studPhoto;
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
			// addStudentSrvc.addStudent(studentRecordData);
		}; // End $scope.addStudent

	}]);