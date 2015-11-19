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
              console.log('define', scope.currentEntity);
            };
          };

          //define id of entity: "entity_id" or "id" (it returns from server)
          function defineNameOfId (){
            scope.commonId =
            scope.thisEntity !== "AdminUser" && scope.thisEntity !== "TestDetail"
            ? scope.thisEntity + "_id"
            : "id";

            console.log('commonId', scope.commonId);
            // Student has another id clasification
            if (scope.commonId !== 'user_id') {
              scope.commonId = 'user_id';
              return scope.commonId;
              console.log('commonId reset', scope.commonId);
            } else {
              console.log('We don\'t have to see this');
              return scope.commonId;
            }
          };

          //check for dependencies in currentEntity
          function checkForPropertyBy () {
            if (scope.currentEntity.by) {
              getEntitiesWithDependencies();
              console.log('check BY YES == TRUE', scope.currentEntity.by === true);
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
              case 'student':
                entitiesSrvc.getEntitiesByEntity(
                  scope.thisEntity, scope.currentEntity.by.parentEntity, id
                  )
                .then(function (resp) {
                  console.log('resp inside directive', resp);
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
                case 'timeTable':
                entitiesSrvc.getEntitiesForEntity(
                  scope.thisEntity, scope.currentEntity.by.parentEntity, id
                  )
                .then(function (respTimeTable) {
                  entitiesSrvc.getEntities("group").then(function (respGroups) {
                      var groupsForTimeTable = respGroups.list;             
                      for (var g=0; g<groupsForTimeTable.length; g++) {
                        for (var i=0; i<respTimeTable.data.length; i++) {
                          if (respTimeTable.data[i].group_id == groupsForTimeTable[g].group_id) {
                            respTimeTable.data[i].group_name = groupsForTimeTable[g].group_name;
                          };
                        };
                      };
                      gettingResponseHandler (respTimeTable);
                    });
                });
                break;

            };
          };

          function getEntitiesWithoutDependencies () {
            entitiesSrvc.getEntities(scope.thisEntity).then(function (resp) {
              gettingResponseHandler (resp);
            });
          };

          //create array with entities if response has data
          function gettingResponseHandler (resp) {
            scope.entities = resp;
            console.log('Beautiful response ', resp);
            scope.noData = "Немає записів";
          };

      }
  };
}])
