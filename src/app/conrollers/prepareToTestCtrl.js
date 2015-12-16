var testPlayerApp = angular.module('testPlayerApp', ['ui.router']);
//список вопросов
testPlayerApp.controller('prepareToTestCtrl', ['$scope', '$rootScope', 'userSrvc', '$stateParams', '$state', '$q', '$timeout', function ($scope, $rootScope, userSrvc, $stateParams, $state, $q, $timeout) {

  function getId () {
    var id = $stateParams.id
    return id
  }
  var id = $stateParams.id
 
  $scope.showInformModal = function (infMsg) {
    $scope.infMsg = infMsg;
    angular.element(document.querySelector('#informModal')).modal();
  };
  $scope.getRecordsByStudent = function(getId){
    userSrvc.checkStudent(id).then(function(resp){
      $scope.questionsQuantity = resp.questionList.length
      $scope.testData = resp
      console.log('$scope.testData', $scope.testData)
    })
  } 
  $scope.getRecordsByStudent(getId);
  
  $scope.startTest = function () {
    function saveData (){
      var url = 'testPlayer/saveData';
      var data = $scope.testData;
      userSrvc.postInfoForStudent(url, data)
    }
    saveData()
  }


}]);





