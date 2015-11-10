;

app.factory('entitiesSrvc', ['$http', 'baseUrl', function ($http, baseUrl) {

var dependencies = {
    group : 'speciality,faculty',
    student : 'group'
};


  var getDependecies = function (data, dep) {
    var entityId = dep+'_id';
    var entityName = dep+'_name';

    return $http.get(baseUrl + dep + '/getRecords')
      .then(function(response) {
        var entityForInject = response.data;


      var entityForInjectArray = [];
      var entityForInjectObject = {};

      for (row in entityForInject) {
        entityForInjectArray[+entityForInject[row][entityId]] = entityForInject[row][entityName];
        entityForInjectObject[entityForInject[row][entityId]] = entityForInject[row][entityName];
      }
      data[dep] = entityForInjectObject;
      for (row in data['list']) {
        var id = parseInt(data['list'][row][entityId]);
        data['list'][row][entityName] = entityForInjectArray[id];
      };
      return data;

          // return result;
        }, function() {console.error('Error')});

  }

  return {

    getEntitiesByEntity: function (entity, parentEntity, id) {
      return $http.get(baseUrl + entity + '/get'+entity[0].toUpperCase()+entity.slice(1) + 's' + 'By' + parentEntity[0].toUpperCase()+parentEntity.slice(1) +'/' + id)
        .then(fulfilled, rejected);
    },

    getRecordsRangeByEntity: function (entity, parentEntity, id) {
      return $http.get(baseUrl + entity + '/getRecordsRangeBy' + parentEntity[0].toUpperCase()+parentEntity.slice(1) +'/'+ id + '/' + '100/' + '0')
        .then(fulfilled, rejected);
    },

    getEntitiesForEntity: function (entity, parentEntity, id) {
      return $http.get(baseUrl + entity + '/getTimeTablesForSubject' + '/' + id)
        .then(fulfilled, rejected);
    },

    getEntities: function (entity) {
      return $http.get(baseUrl + entity + '/getRecords')
      .then(  function (response) {
        if (dependencies[entity] != undefined) {
            var depArr = dependencies[entity].split(',');
            data = {};
            data.list =response.data;
            for (depId in depArr) {
              if (depId != (depArr.length - 1)) {
                getDependecies(data, depArr[depId]);
              }
              else {
                return getDependecies(data, depArr[depId]);
              }
            }
          }
        return response;
      }, rejected);
    },

    createEntity: function (entity, data) {
      return $http.post(baseUrl + entity + '/insertData', data)
        .then(fulfilled, rejected);
    },

    deleteEntity: function (entity, id) {
      return $http.delete(baseUrl + entity + '/del/' + id)
        .then(fulfilled, rejected);
    },

    updateEntity: function (entity, id, data) {
      return $http.post(baseUrl + entity + '/update/' + id, data)
      .then(fulfilled, rejected);
    }
  };

  function fulfilled(response) {
    return response;
  };



  function rejected(error) {
    alert("Помилка " + error.status + " " + error.statusText);
  };

}]);
