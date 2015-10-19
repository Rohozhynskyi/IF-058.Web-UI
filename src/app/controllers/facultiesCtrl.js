app.controller('facultiesCtrl', ['$scope', 'facultySrvc', function ($scope, facultySrvc) {

	facultySrvc.getFaculties().then(function (response) {
		$scope.faculties = response.data;
	});
}]);