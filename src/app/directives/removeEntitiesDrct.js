;
app.directive('removeEntitiesDrct', ['entitiesSrvc', function(entitiesSrvc){
  return {
    link: function (scope, element, attrs) {
          //function for initiate of entity for delete in modal
            scope.activateEntity = function (entity) {
              if (scope.deletingEntity != entity) {
                scope.deletingEntity = entity;
              } else {
                scope.deletingEntity = null;
              };
            };

          //function removes an entity from array and from server
            scope.removeEntity = function () {
              var currentEntity = scope.deletingEntity;
              var currentId = scope.deletingEntity[scope.commonId];
              entitiesSrvc.deleteEntity(scope.thisEntity, currentId).then(function (resp) {
                removingResponseHandler (resp, currentEntity);
              });
              scope.activateEntity();
            };

            function removingResponseHandler (resp, currentEntity) {
              switch (resp.data.response) {
                case "ok":
                  var index = scope.entities.indexOf(currentEntity);
                  scope.entities.splice(index, 1);
                  break;
                case "error 23000":
                  scope.showInformModal("Неможливо видалити запис. Запис має залежні об'єкти.");
                  break;
                default:
                  scope.showInformModal("Помилка редагування запису: " + resp.data.response);
              };
            };
      }
  };
}])
