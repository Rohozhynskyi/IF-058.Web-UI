;
app.controller('entitiesCtrl', ['$scope', 'entitiesSrvc', '$stateParams', '$timeout', function ($scope, entitiesSrvc, $stateParams, $timeout) {

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
    "student": {
      // Students Values
      gradebook_id: "",
      student_surname: "",
      student_name: "",
      student_fname: "",
      group_id: "",
      plain_password: "",
      photo: ""
    },
    "subject": {
      subject_name: "",
      subject_description: ""
    },
    "AdminUser": {
      username: "",
      password: "",
      password_confirm: "",
      email: ""
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
    },
    question: {
      question_text: '',
      level: '',
      type: '',
      attachment: '',
      by: {
        parentEntity: 'test'
      }
    },
    "TestDetail": {
      level: "",
      tasks: "",
      rate: "",
      by: {
        parentEntity: 'test'
      }
    }

    //... and other entities
  };

  function changeId (){
    return $scope.commonId = $scope.thisEntity !== "AdminUser" && $scope.thisEntity !== "TestDetail" ? $scope.thisEntity + "_id" : "id";
  };

//function gets a list of entities
  $scope.getEntetyList = function () {
    for (ent in entityObj) {
      if (ent == $scope.thisEntity) {
        $scope.currentEntity = entityObj[ent];
      };
    };
    changeId();
    if ($scope.currentEntity.by) {
      switch ($scope.thisEntity) {
        case 'test':
          var id = $stateParams.id//замінити на універсальну змінну
          entitiesSrvc.getEntitiesByEntity($scope.thisEntity, $scope.currentEntity.by.parentEntity, id).then(function (resp) {
            $scope.entities = resp.data;
            $scope.noData = "Немає записів";
          });
          break
        case "TestDetail":
          var id = $stateParams.id//замінити на універсальну змінну
          entitiesSrvc.getEntitiesByEntity($scope.thisEntity, $scope.currentEntity.by.parentEntity, id).then(function (resp) {
            $scope.entities = resp.data;
            $scope.noData = "Немає записів";
          });
          break
        case 'question':
          var id = $stateParams.id
          entitiesSrvc.getRecordsRangeByEntity($scope.thisEntity, $scope.currentEntity.by.parentEntity, id).then(function (resp) {
            $scope.entities = resp.data;
            $scope.noData = "Немає записів";
          });
          break
      }
    }
    else {
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
      $scope.newEntity = {};
    };
  };
//function creates new element of array and sends new entity on server
  $scope.addEntity = function () {
    var newData = $scope.newEntity;
    if ($scope.currentEntity.by) {
      newData[$scope.currentEntity.by.parentEntity + "_id"] = $stateParams.id;
    };
      entitiesSrvc.createEntity($scope.thisEntity, newData).then(function (resp) {
        switch (resp.data.response) {
          case "ok":
            newData[$scope.commonId] = resp.data.id;
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
        if(entityObj["AdminUser"]){
          $scope.editedEntity.new_password = "";
          $scope.editedEntity.new_password_confirm = "";
        };
      };
    } else {
      $scope.editingEntity = null;
    }
    ;
  };
//function updates an element of array and send updating of entity to server
  $scope.editEntity = function (entity) {
    var fieldsFulled;
    var editedData = {};
    //checking on empty fields, appropriationing all properties except ID of property
    for (prop in entity) {
      if ($scope.editedEntity["new_" + prop] != "" && prop != ($scope.commonId)) {
        fieldsFulled = true;
        editedData[prop] = $scope.editedEntity["new_" + prop];
      } else if ($scope.editedEntity["new_" + prop] != "") {
        fieldsFulled = true;
      } else {
        fieldsFulled = false;
        break;
      };
    };
//updates an element of array and send updating of entity to server
    if (fieldsFulled == true) {
      entitiesSrvc.updateEntity($scope.thisEntity, entity[$scope.commonId], editedData).then(function (resp) {
        switch (resp.data.response) {
          case "ok":
            for (var i = 0; i < $scope.entities.length; i++) {
              if ($scope.entities[i][$scope.commonId] == entity[$scope.commonId]) {
                for (prop in editedData) {
                  $scope.entities[i][prop] = editedData[prop];
                };
                //lightins of editedRow for ... seconds
                // console.log(angular.element(document.querySelector('#row'+(i+1))));
                // var succeedRow = angular.element(document.querySelector('#row'+(i+1)))[0];
                // var standartClass = succeedRow.className;
                // succeedRow.className = succeedRow.className + " success";
                // $timeout(function () {
                //   succeedRow.className = standartClass;
                // }, 2000);
              };
            };
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
    };
  };
//function removes an entity from array and from server
  $scope.removeEntity = function () {
    var currentEntity = $scope.deletingEntity;
    var currentId = $scope.deletingEntity[$scope.commonId];
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

}]);
