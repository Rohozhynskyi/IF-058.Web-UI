/**
 * Created by ����� on 09.10.2015.
 */

app.factory('specialitySrvc', ['$http', function ($http) {
  var service = {};
  var URL = 'http://dtapi.local/speciality/';
// ������ ����
  service.getSpecialities = function () {
    return $http.get(URL + 'getRecords')
      .success(function (result) {
        return result
      })
      .error(function (result) {
        console.log('error')
      })
  }

  // ���������
  service.createGroup = function(data) {
    return $http.post(URL + 'insertData', data)
      .then(function(response) {
        return response.data.response;
      });
  }

 // ���������
 service.delGroup = function(data) {
  return $http.get(URL +'del/' + data)
    .then(function(response) {
     return response.data.response;
    });
 }
//�����������
  service.editGroup = function(id, newData) {
    console.log(id, newData)
    return $http.post(URL +'update/'+ id, newData)
      .then(function(response) {
        return response.data.response;
      });
  }
 return service
}]);

/*
for (row in $scope.groups) {
  if ($scope.groups[row].group_id == id) {
    $scope.groups.splice(row,1);
  };
}*/
