;

app.factory('countEntitiesSrvc', ['$http', 'baseUrl', function ($http, baseUrl) {

  function countEntity(entityName) {
    return $http.get(baseUrl + entityName + '/countRecords')
      .then(function (response) {
        return [entityName, response.data.numberOfRecords]
      });
  };

  return {
    countQuestions: countEntity,
    countTests: countEntity,
    countSubjects: countEntity,
    countStudents: countEntity,
    countGroups: countEntity,
    countSpecialities: countEntity,
    countFaculties: countEntity
  };
}]);
