/**
 * Created by ����� on 09.10.2015.
 */
var app = angular.module('app', []);
app.controller('mainCtrl', function ($scope, specialitySrvc, $http) {

//�������� ���� ����������� �����
  $scope.showAdd = function () {
    $scope.addSpec = !$scope.addSpec
    console.log($scope.addSpec)
  }

  //�������� �� �����������
  specialitySrvc.getSpecialities().then(function (response) {
    $scope.specialities = response.data;
  });

  //������ ������������
  $scope.add = function () {
    var data = {
      speciality_name: $scope.name,
      speciality_code: $scope.code
    }
    specialitySrvc.createGroup(data);
  }
  //�������� ������������
  $scope.delete = function (speciality) {
    console.log(speciality.speciality_id)
    specialitySrvc.delGroup(speciality.speciality_id)
  }
  //�����������
  $scope.edit = function (speciality) {
    var name = prompt('������ �����', speciality.speciality_name);
    var code = prompt('������ ���', speciality.speciality_code)
    var newData = {
      speciality_name: name,
      speciality_code: code
    }
    var id = speciality.speciality_id
    specialitySrvc.editGroup(id, newData)
  }

});


