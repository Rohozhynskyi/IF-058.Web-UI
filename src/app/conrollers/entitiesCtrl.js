;
app.controller('entitiesCtrl', function ($scope, entitiesSrvc, $stateParams, $timeout) {


  $scope.thisEntity = ""; //можна привязати через привязку з вьюхи, або через директиву (але нашо директива?)

  var entityObj = {
    "faculty": {
      faculty_name: "",
      faculty_description: ""
    },
    "speciality": {
      speciality_name: "",
      speciality_code: ""
    },
    "subject": {
      subject_name: "",
      subject_description: ""
    },
    "test": {
      test_name: "",
      tasks: "",
      time_for_test: "",
      enabled: "",
      attempts: "",
      by: {
        parentEntity: 'subject'
      }
    }

    //... and othe entities
  };

  for (ent in entityObj) {
    if (ent == $scope.thisEntity) {
      $scope.currentEntity = entityObj[ent];
      console.log($scope.currentEntity)
    }
    ;
  }
  ;

//function gets a list of entities
  $scope.getEntetyList = function () {
    for (ent in entityObj) {
      if (ent == $scope.thisEntity) {
        $scope.currentEntity = entityObj[ent];
        //console.log($scope.currentEntity)
      };
    };
    if ($scope.currentEntity.by){
      //console.log('has by')
        var id = $stateParams.id//замінити на універсальну змінну
        entitiesSrvc.getEntitiesByEntity($scope.thisEntity, $scope.currentEntity.by.parentEntity, id).then(function (resp) {
          $scope.entities = resp.data;
          $scope.noData = "Немає записів";
        });
    } else {
      //console.log('dont have by')
      entitiesSrvc.getEntities($scope.thisEntity).then(function (resp) {
        $scope.entities = resp.data;
        $scope.noData = "Немає записів";
      });
    }

  };



//function shows and hides the form for creating new entity
  $scope.showAddForm = function () {
    if (!$scope.showingAdd) {
      $scope.showingAdd = true;
    } else {
      $scope.showingAdd = false;
      $scope.newEntity = $scope.currentEntity;
    }
    ;
  };
//function creates new element of array and sends new entity on server
  $scope.addEntity = function () {
    if ($scope.currentEntity.by){
      var newData = $scope.newEntity;
      newData[$scope.currentEntity.by.parentEntity + "_id"] = $stateParams.id
    } else {
      var newData = $scope.newEntity;
    }
      entitiesSrvc.createEntity($scope.thisEntity, newData).then(function (resp) {
        switch (resp.data.response) {
          case "ok":
            newData[$scope.thisEntity + "_id"] = resp.data.id;
            $scope.entities.push(newData);
            break;
          case "error 23000":
            showInformModal("Зазначене ім'я вже існує");
            break;
          default:
            showInformModal("Помилка редагування запису: " + resp.data.response);
        };
      });


    $scope.showAddForm();
  };


  //function opens a form for editing
  $scope.showEditForm = function (entity) {
    if ($scope.editingEntity != entity) {
      $scope.editingEntity = entity;
      $scope.editedEntity = {};
      for (prop in entity) {
        $scope.editedEntity["new_" + prop] = entity[prop];
      }
      ;
    } else {
      $scope.editingEntity = null;
    };
  };
//function updates an element of array and send updating of entity to server
  $scope.editEntity = function (entity) {
    var fieldsFulled;
    var editedData = {};
    //checking on empty fields, appropriationing all properties except ID of property
    for (prop in entity) {
      if ($scope.editedEntity["new_" + prop] != "" && prop != ($scope.thisEntity + "_id")) {
        fieldsFulled = true;
        editedData[prop] = $scope.editedEntity["new_" + prop];
      } else if ($scope.editedEntity["new_" + prop] != "") {
        fieldsFulled = true;
      } else {
        fieldsFulled = false;
        break;
      }
      ;
    }
    ;
//updates an element of array and send updating of entity to server
    if (fieldsFulled == true) {
      entitiesSrvc.updateEntity($scope.thisEntity, entity[$scope.thisEntity + "_id"], editedData).then(function (resp) {
        switch (resp.data.response) {
          case "ok":
            for (var i = 1; i < $scope.entities.length; i++) {
              if ($scope.entities[i][$scope.thisEntity + "_id"] == entity[$scope.thisEntity + "_id"]) {
                for (prop in editedData) {
                  $scope.entities[i][prop] = editedData[prop];
                }
                ;
                //lightins of editedRow for ... seconds
                // console.log(angular.element(document.querySelector('#row'+(i+1))));
                // var succeedRow = angular.element(document.querySelector('#row'+(i+1)))[0];
                // var standartClass = succeedRow.className;
                // succeedRow.className = succeedRow.className + " success";
                // $timeout(function () {
                //   succeedRow.className = standartClass;
                // }, 2000);
              }
              ;
            }
            ;
            $scope.editingEntity = null;
            break;
          case "error 23000":
            showInformModal("Зазначене ім'я вже існує");
            break;
          default:
            showInformModal("Помилка редагування запису: " + resp.data.response);
        }
        ;
      });
    } else {
      showInformModal("Будь ласка, заповніть всі поля");
    }
    ;
  };


//function for initiate of entity for delete in modal
  $scope.activateEntity = function (entity) {
    if ($scope.deletingEntity != entity) {
      $scope.deletingEntity = entity;
    } else {
      $scope.deletingEntity = null;
    }
    ;
  };
//function removes an entity from array and from server
  $scope.removeEntity = function () {
    var currentEntity = $scope.deletingEntity;
    var currentId = $scope.deletingEntity[$scope.thisEntity + "_id"];
    entitiesSrvc.deleteEntity($scope.thisEntity, currentId).then(function (resp) {
      switch (resp.data.response) {
        case "ok":
          var index = $scope.entities.indexOf(currentEntity);
          $scope.entities.splice(index, 1);
          break;
        case "error 23000":
          showInformModal("Неможливо видалити запис. Запис має залежні об'єкти.");
          break;
        default:
          showInformModal("Помилка редагування запису: " + resp.data.response);
      }
      ;
    });
    $scope.activateEntity();
  };

//show inform message about error
  function showInformModal(infMsg) {
    $scope.infMsg = infMsg;
    angular.element(document.querySelector('#informModal')).modal();
  };

});
