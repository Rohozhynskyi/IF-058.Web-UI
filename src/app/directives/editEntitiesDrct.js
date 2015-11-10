;
app.directive('editEntitiesDrct', ['entitiesSrvc', function(entitiesSrvc){
  return {
    link: function (scope, element, attrs) {
          scope.editingEntity = null;
          //function opens a form for editing
          scope.showEditForm = function (entity) {
            if (scope.editingEntity != entity) {
              scope.editingEntity = entity;
              createEditedEntityStorage(entity);
            } else {
              scope.editingEntity = null;
            };
          };

          //creates buffer (storage) for editing object
          function createEditedEntityStorage (entity) {
            scope.editedEntity = {};
            for (prop in entity) {
              scope.editedEntity["new_" + prop] = entity[prop];
              if(scope.thisEntity == "AdminUser"){
                scope.editedEntity.new_password = "";
                scope.editedEntity.new_password_confirm = "";
              };
            };
          };

          //updates an element of array and send updating of entity to server
          scope.editEntity = function (entity) {
            var fieldsFulled;
            var editedData = {};
            fieldsFulled = checkEmptyFields (entity, editedData);
            if (fieldsFulled == true) {
              entitiesSrvc.updateEntity(scope.thisEntity, entity[scope.commonId], editedData)
              .then(function (resp) {
                editRespHandler (resp, editedData, entity);
              });
            } else {
              scope.showInformModal("Будь ласка, заповніть всі поля");
            };
          };

          //checks on empty fields, appropriationing all properties except ID of property
          function checkEmptyFields (entity, editedData) {
            for (prop in entity) {
              //new_prop is not empty and is not ID
              if (scope.editedEntity["new_" + prop] != "" || prop == "attachment") {
                fieldsFulled = true;
                createPropForSendingObj (prop, editedData);
              } else {
                fieldsFulled = false;
                break;
              };
            };
            return fieldsFulled;
          };

          //prop = scope.commonId ("id" or "entity_id")
          function createPropForSendingObj (prop, editedData) {
            if(prop != scope.commonId) {
              editedData[prop] = scope.editedEntity["new_" + prop];
            };
          };

          //handing success and error response
          function editRespHandler (resp, editedData, entity) {
            switch (resp.data.response) {
              case "ok":
                successEditRespHandler (resp, editedData, entity);
                break;
              case "error 23000":
                scope.showInformModal("Зазначене ім'я вже існує");
                break;
              case "error":
                scope.showInformModal("Дані не змінено");
                break;
              default:
                scope.showInformModal("Помилка запису: " + resp.data.response);
            };
          };

          //changes in array scope.entities an edited object
          function successEditRespHandler (resp, editedData, entity) {
            for (var i = 0; i < scope.entities.length; i++) {
              if (scope.entities[i][scope.commonId] == entity[scope.commonId]) {
                for (prop in editedData) {
                  scope.entities[i][prop] = editedData[prop];
                };
              };
            };
            scope.editingEntity = null;
          };
      }
  };
}])
