;
app.directive('entitiesDrct', ['entitiesSrvc', function(entitiesSrvc){
  return {
    link: function (scope, element, attrs) {
              scope.thisEntity = attrs.entitiesDrct;
              // console.log(scope.thisEntity);
              scope.getEntetyList();
          },
    restrict: "A"
    // template: ""
  };
}]);
