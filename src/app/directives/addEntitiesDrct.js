;
app.directive('addEntitiesDrct', ['entitiesSrvc', '$stateParams', function(entitiesSrvc, $stateParams){
  return {
    link: function (scope, element, attrs) {
          //shows and hides the form for creating new entity
          scope.showAddForm = function () {
            if (!scope.showingAdd) {
              scope.showingAdd = true;
            } else {
              scope.showingAdd = false;
              scope.resetEntity();
            };
          };

          //makes newEntity and all fields of adding form empty,
          //it's click handler on button "Очистити"
          scope.resetEntity = function(){
            scope.newEntity = {};
          };

          //creates new element of array and sends new entity on server
          scope.addEntity = function () {
            var newData = scope.newEntity;
            addParentEntityId(newData);
            entitiesSrvc.createEntity(scope.thisEntity, newData)
            .then(function (resp) {
              addRespHandler (resp, newData);
            });
          };
          //if entity depends of some entity function adds parentEntity_id property
          function addParentEntityId (newData) {
            if (scope.currentEntity.by) {
              newData[scope.currentEntity.by.parentEntity + "_id"] = $stateParams.id;
            };
          };

          //handing success and error response
          function addRespHandler (resp, newData) {
            switch (resp.data.response) {
              case "ok":
                successAddRespHandler (resp, newData);
                scope.showAddForm();
                break;
              case "error 23000":
                scope.showInformModal("Зазначене ім'я вже існує");
                break;
              default:
                scope.showInformModal("Помилка запису: " + resp.data.response);
            };
          };
          //pushes to array scope.entities a new added object
          function successAddRespHandler (resp, newData) {
            newData[scope.commonId] = resp.data.id;
            scope.entities.push(newData);
          };
      }
  };
}])
