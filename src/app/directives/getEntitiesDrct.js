;
app.directive('getEntitiesDrct', ['entitiesSrvc', '$stateParams', function(entitiesSrvc, $stateParams){
  return {
    link: function (scope, element, attrs) {
          //gets a list of entities
          scope.getEntityList = function () {
            defineCurrentEntity();
            defineNameOfId();
            checkForPropertyBy();
          };
          //define currentEntity by comparing of thisEntity and properties of scope.entityObj
          function defineCurrentEntity () {
            if (scope.entityObj[scope.thisEntity] != undefined) {
              scope.currentEntity = scope.entityObj[scope.thisEntity];
            };
          };

          //define id of entity: "entity_id" or "id" (it returns from server)
          function defineNameOfId (){
            scope.commonId =
            scope.thisEntity !== "AdminUser" &&
            scope.thisEntity !== "TestDetail"
            ? scope.thisEntity + "_id"
            : "id";
            if (scope.thisEntity === "result") {
              scope.commonId = "session_id";
            };
            return scope.commonId;
          };

          //check for dependencies in currentEntity
          function checkForPropertyBy () {
            if (scope.currentEntity.by) {
              getEntitiesWithDependencies();
            }
            else {
              getEntitiesWithoutDependencies();
            };
          };

          function getEntitiesWithDependencies() {
            var id = $stateParams.id;

            //using different methods for dependencies of different entities
            switch (scope.thisEntity) {
              case 'test':
              case 'TestDetail':
              case 'answer':
                entitiesSrvc.getEntitiesByEntity(
                  scope.thisEntity, scope.currentEntity.by.parentEntity, id
                  )
                .then(function (resp) {
                  gettingResponseHandler (resp);
                });
                break;
              case 'question':
                entitiesSrvc.getRecordsRangeByEntity(
                  scope.thisEntity, scope.currentEntity.by.parentEntity, id
                  )
                .then(function (resp) {
                  gettingResponseHandler (resp);
                });
                break;
             
              case 'result':
              if (!id) { 
                id = localStorage.userId;
              };

                entitiesSrvc.getRecordsByStudent(scope.thisEntity, id)
                .then(function (resp) {
                  gettingResponseHandler (resp);
                });

            };
          };

          function getEntitiesWithoutDependencies () {
            entitiesSrvc.getEntities(scope.thisEntity).then(function (resp) {
              gettingResponseHandler (resp);
            });
          };

          //create array with entities if response has data
          function gettingResponseHandler (resp) {
            if (resp.data[0][0] == "record_id" && resp.data[0][1] == "null") {
              scope.noData = "Немає записів";
              scope.student_fullname = resp.data[1].student_fullname;
            } else {
              scope.entities = resp.data;
            }

            scope.noData = "Немає записів";
          };

      }
  };
}])
