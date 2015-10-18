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
  //������� ��������� ������ ��������������
  function update () {
    specialitySrvc.getSpecialities().then(function (response) {
      $scope.specialities = response.data;
    })
  }

  //������ ������������
  $scope.add = function () {
    var data = {
      speciality_name: $scope.name,
      speciality_code: $scope.code
    };
    specialitySrvc.createSpeciality(data)
    update()
    $scope.name = '';
    $scope.code = '';
    console.log('add made')
    console.log($scope)
  }

  //�������� ������������
  $scope.delete = function (speciality) {
    console.log(speciality.speciality_id)
    specialitySrvc.delSpeciality(speciality.speciality_id)
    console.log(specialitySrvc.delSpeciality(speciality.speciality_id))
    update()
  }

  //���������� ������������
  $scope.edit = function (speciality) {
    var name = prompt('������ ����� (Write speciality name)', speciality.speciality_name);
    var code = prompt('������ ��� (Write speciality code)', speciality.speciality_code)
    var newData = {
      speciality_name: name,
      speciality_code: code
    }
    var id = speciality.speciality_id
    update(specialitySrvc.editSpeciality(id, newData))
  }

});


