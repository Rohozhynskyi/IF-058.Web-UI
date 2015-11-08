;
app.directive('testDetailsStatDrct', [function(){
  return {
    link: function (scope, element, attrs) {
      scope.editingEntity = "";
      scope.$watch("entities.length", function (newValue, oldValue) {
        if (newValue != undefined) {
          changingHandler() };
      });
      scope.$watch("editingEntity", function (newValue, oldValue) {
        if (newValue == undefined) { changingHandler() };
      });
      function changingHandler () {
        scope.totalCountTasks = 0;
        scope.totalCountRate = 0;
        for (var i=0; i<scope.entities.length; i++) {
          scope.totalCountTasks += +scope.entities[i].tasks;
          scope.totalCountRate += +scope.entities[i].rate;
        };
      };
    },
    restrict: "A"
  };
}]);
