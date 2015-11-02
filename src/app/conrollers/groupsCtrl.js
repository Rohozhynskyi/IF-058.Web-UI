;
app.controller('groupsCtrl', function($scope, entitiesSrvc){


  $scope.thisEntity = "group";
//function gets a list of entities

		entitiesSrvc.getEntities($scope.thisEntity).then(function(httpData) {
          	$scope.groups = httpData;
        });




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
      if (resp.data.response == "ok") {
        newData.group_id = resp.data.id;
        // console.log(resp);
        $scope.groups.list.push(newData);
      } else {
        alert ("Помилка " + resp.data.response);
      };
    });
    $scope.showAddForm();
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
      if (resp.data.response == "ok") {
        for (var i = 1; i < $scope.groups.list.length; i++) {

          if ($scope.groups.list[i].group_id == currentId) {
            $scope.groups.list[i] = editingData;
          } ; 
        };
      } else {
        alert ("Помилка " + resp.data.response);
      };
    });
    $scope.editingData = null;
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
    console.log(currentGroup);
    entitiesSrvc.deleteEntity($scope.thisEntity, currentId).then(function (resp) {
      if (resp.data.response == "ok") {
            var index = $scope.groups.list.indexOf(currentGroup);
            $scope.groups.list.splice(index, 1);
      } else {
        alert ("Помилка " + resp.data.response);
      };
    });
    $scope.activateGroup();
  };

});
