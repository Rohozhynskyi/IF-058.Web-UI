app.controller('studentsCtrl', ['$scope', '$stateParams', 'entityObj', 'entitiesSrvc', '$timeout', '$state', function ($scope, $stateParams, entityObj, entitiesSrvc, $timeout, $state) {


	$scope.enterToEntity = function (to, entityId) {
		$state.go(to, {'id': entityId});
	};

/*_________________________________________________
/*
/* GETTING RECORDS BY GROUP ID
/*_________________________________________________
*/
	// Declares Entity parameters for getting records request
	$scope.thisEntity = 'student';
	$scope.thisEntParent = entityObj[$scope.thisEntity].by.parentEntity;
	$scope.idOfParent = $stateParams.id;
	$scope.imgStr = 'img/def-stud.jpg';

}]);