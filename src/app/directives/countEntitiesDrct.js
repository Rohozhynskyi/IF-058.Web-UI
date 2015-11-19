;
app.directive('countEntitiesDrct', ['countEntitiesSrvc', '$q', function(countEntitiesSrvc, $q) {
  return {
    link: function(scope, element, attrs) {
      scope.statistics = {};
      $q.all([
        countEntitiesSrvc.countQuestions("question"),
        countEntitiesSrvc.countTests("test"),
        countEntitiesSrvc.countSubjects("subject"),
        countEntitiesSrvc.countStudents("student"),
        countEntitiesSrvc.countGroups("group"),
        countEntitiesSrvc.countSpecialities("speciality"),
        countEntitiesSrvc.countFaculties("faculty")
        ]).then(function (data) {
        for (var i = 0; i < data.length; i++) {
          scope.statistics["count_" + data[i][0]] = data[i][1];
        };
        });
    }
  };
}]);
