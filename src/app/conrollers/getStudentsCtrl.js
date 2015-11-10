app.controller('getStudentsCtrl', ['$scope', 'entitiesSrvc', '$interval', function ($scope, entitiesSrvc, $interval) {

	// Declares Entity of the controller
	$scope.thisEntity = 'student';

	entitiesSrvc.getEntities($scope.thisEntity)
		.then(function (response) {
			$scope.students = response;
			$scope.noData = "There is no entities here.";
		});

	//function shows and hides the form for creating new entity
	$scope.showAddForm = function () {
		if (!$scope.showingAdd) {
			$scope.showingAdd = true;
		} else {
			$scope.showingAdd = false;
			$scope.newEntity = {};
		};
	};

	// $interval(function () {
	// 	console.log($scope.group_id);
	// }, 1500);

	$scope.addNewStudent = function (recordData) {

		// Some tricks with fields we don't know how to work with
		if(!recordData.group_id || recordData.group_id == '') {
			return; 
		}

		if(!$scope.studPhoto || $scope.studPhoto == '') {
			return;
		}

		//Transfer photo string inside addNew Student method
		recordData.photo = $scope.studPhoto;

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
			group_id: recordData.group_id,
			plain_password: recordData.password_confirm,
			photo: recordData.photo
		};

		var jsonData = JSON.stringify(studentRecordData);

		// Gives data to a service
		entitiesSrvc.createEntity($scope.thisEntity, jsonData)
			.then(function (response) {
				console.log(response);
				// addRespHandler(resp, newData);
			});

		//handing success and error response
		function addRespHandler (resp, newData) {
			if (resp.data.response == 'ok' && resp.status == 200) {
				$scope.showingAdd = false;
				$scope.newEntity = {};
			} else if (resp.data.response == 'orror 23000') {
				console.log('pop up with error that there is such record');
			} else {
				console.log('Error of Record' + resp.data.response);
			}
		}// END addRespHandler

	}; // End $scope.addStudent





	// Show edit panel for a student
	$scope.showEditingForm = function (stud) {
		// if stud Object is not equal to null
		if (stud !== null) {
			$scope.currId = stud.user_id;
		}
			$scope.editingStudent = stud;
	};

	// Editing and updating student record functionality
	$scope.editStud = function () {

		// Put student data we need to update
		var editStudData = {
			user_id: $scope.editingStudent.user_id,
			// Students Values
			gradebook_id: $scope.editingStudent.gradebook_id,
			student_surname: $scope.editingStudent.student_surname,
			student_name: $scope.editingStudent.student_name,
			student_fname: $scope.editingStudent.student_fname,
			group_id: $scope.editingStudent.group_id,
			// plain_password: $scope.editingStudent.plain_password
			photo: ""
		};

		var eStud = $scope.editingStudent;

		// Need local variable for using in service
		// Then we will need to null the scope's same variable
		var currId = $scope.currId;

		entitiesSrvc.updateEntity($scope.thisEntity, currId, editStudData)
			.then(function (response) {
				if(response.data.response == 'ok') {
					for (var i = 1; i < $scope.students.list.length; i++) {
						if ($scope.students.list[i].user_id != currId) {
							// Need to say about error if it needed
							throw new Error ($scope.students.list[i] + ' is different from ' + currId + ' id.. Try to solve this or, please, contact with your back-end administrator.');
						}
					} // END for loop
				} else {
					throw new Error ('Server response was not "OK" - ' + response.data.response);
				}
			}); // END .then

			// 'Nulls' all scope variables
			$scope.editingStudent = null;
			$scope.currId = null;
	};



	// Getting confirmation before deleting a student
	$scope.confirmDelete = function (studentId) {
		if ( $scope.confirmedStud != studentId ) {
			$scope.confirmedStud = studentId;
		} else {
			$scope.confirmedStud = null;
		}
	};

	// Deleting student record
	$scope.deleteStudent = function () {
		var currentId = $scope.confirmedStud,
				currentStud = $scope.confirmedStud;

		entitiesSrvc.deleteEntity($scope.thisEntity, currentId)
			.then(function (response) {
				if (response.data.response == 'ok') {

					// Place currentStud into index variable ..
					var index = $scope.students.list.indexOf(currentStud);
					// .. to splice it in the list of students
					$scope.students.list.splice(index, 1);
				} else {
					alert('Error ' + response.data.response);
				}
			}); //END .then
		$scope.confirmDelete();
	}; // END deleteStudent

	}]);