;
app.directive('testDetailsStatDrct', function(){
  return {
    link: function (scope, element, attrs) {
      scope.$watch("entities.length", function (newValue, oldValue) {
        if (newValue != undefined) {
          scope.totalCountTasks = 0;
          scope.totalCountRate = 0;
          for (var i=0; i<scope.entities.length; i++) {
            scope.totalCountTasks += +scope.entities[i].tasks;
            scope.totalCountRate += +scope.entities[i].rate;
          };
        };
      });
    },
    restrict: "A"
  };
});
