app.controller('entitiesCtrl', ['$scope', 'entitiesSrvc', '$stateParams', '$timeout', 'entityObj', function ($scope, entitiesSrvc, $stateParams, $timeout, entityObj) {

  //it defines from entitiesDrct
  $scope.thisEntity = "";

  //$scope.entityObj contains entities of application
  $scope.entityObj = entityObj;

  //create empty object for adding of entity
  $scope.newEntity = {};

  //show inform message about error
  $scope.showInformModal = function(infMsg) {
    $scope.infMsg = infMsg;
    angular.element(document.querySelector('#informModal')).modal();
  };
}]);