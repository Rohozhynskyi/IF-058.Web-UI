;
app.controller('groupsCtrl', ['$scope', '$stateParams', '$state', 'entitiesSrvc', function($scope, $stateParams, $state, entitiesSrvc){


  $scope.thisEntity = "group";
//function gets a list of entities

		entitiesSrvc.getEntities($scope.thisEntity).then(function(httpData) {
          	$scope.groups = httpData;

                console.log('Andriy says groups ', $scope.groups);
        });



  $scope.enterToEntity = function(to, entityId) {
    $state.go(to ,{'id': entityId});
  };


//function shows and hides the form for creating new entity
  $scope.showAddForm = function () {
    if (!$scope.showingAdd) {
      $scope.showingAdd = true;
    } else {
      $scope.showingAdd = false;
      $scope.newDescription = "";
      $scope.newName = "";
    };
  };
//function creates new element of array and sends new entity on server
  $scope.addGroup = function () {
    var newDataServer = {
      speciality_id: $scope.newSpeciality_id,
      faculty_id: $scope.newFaculty_id,
      group_name: $scope.newName
    };
    var newData = {
      speciality_id: $scope.newSpeciality_id,
      faculty_id: $scope.newFaculty_id,
      group_name: $scope.newName,
      speciality_name: $scope.groups.speciality[$scope.newSpeciality_id],
      faculty_name: $scope.groups.faculty[$scope.newFaculty_id]
    };
    // console.log(newData);
    entitiesSrvc.createEntity($scope.thisEntity, newDataServer).then(function (resp) {
      switch (resp.data.response) {
        case "ok":
          newData.group_id = resp.data.id;
          $scope.groups.list.push(newData);
          $scope.showAddForm();
          break;
        case "error 23000":
          $scope.showInformModal("Зазначене ім'я вже існує");
          break;
        default:
          $scope.showInformModal("Помилка запису: " + resp.data.response);
      };
    });
  };




  //function opens a form for editing
    $scope.showEditForm = function (group) {
      if (group !== null) {
        $scope.currentId = group.group_id;
      }
        $scope.editingData = group;
      };
  //function updates an element of array and send updating of entity to server
    $scope.editGroup = function () {
      var editedDataServer = {
        speciality_id: $scope.editingData.speciality_id,
        faculty_id: $scope.editingData.faculty_id,
        group_name: $scope.editingData.group_name
      };
      var editingData = $scope.editingData;
      editingData.faculty_name = $scope.groups.faculty[editingData.faculty_id];
      editingData.speciality_name = $scope.groups.speciality[editingData.speciality_id];
      var currentId = $scope.currentId;
      entitiesSrvc.updateEntity($scope.thisEntity, currentId, editedDataServer).then(function (resp) {
      switch (resp.data.response) {
        case "ok":
          for (var i = 1; i < $scope.groups.list.length; i++) {

            if ($scope.groups.list[i].group_id == currentId) {
              $scope.groups.list[i] = editingData;
            };
          };
          $scope.editingData = null;
          break;
        case "error 23000":
          $scope.showInformModal("Зазначене ім'я вже існує");
          break;
        case "error":
          $scope.showInformModal("Дані не змінено");
          break;
        default:
          $scope.showInformModal("Помилка запису: " + resp.data.response);
      };
    });
    $scope.currentId = null;
    };




//function for initiate of entity for delete in modal
    $scope.activateGroup = function (group) {

      if ($scope.activeGroup != group) {
        $scope.activeGroup = group;
      } else {
        $scope.activeGroup = null;
      };
    };
//function removes an entity from array and from server
  $scope.removeGroup = function () {
    var currentGroup = $scope.activeGroup;
    var currentId = $scope.activeGroup;
    entitiesSrvc.deleteEntity($scope.thisEntity, currentId).then(function (resp) {
      switch (resp.data.response) {
        case "ok":
            var index = $scope.groups.list.indexOf(currentGroup);
            $scope.groups.list.splice(index, 1);
        break;
        case "error 23000":
          $scope.showInformModal("Неможливо видалити запис. Запис має залежні об'єкти.");
          break;
        default:
          $scope.showInformModal("Помилка видалення запису: " + resp.data.response);
      };
    });
    $scope.activateGroup();
  };

  $scope.showInformModal = function(infMsg) {
    $scope.infMsg = infMsg;
    angular.element(document.querySelector('#informModal')).modal();
  };

}]);
