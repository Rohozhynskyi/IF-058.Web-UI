app.controller('groupsCtrl', ['$scope', 'groupsSrvc', function($scope, groupsSrvc) {

		groupsSrvc.getGroups().then(function(httpData) {
          	$scope.groups = httpData;
        });

		groupsSrvc.getGroup(5).then(function(httpData) {
          	$scope.group = httpData;
        });

		var new_group = {
			group_name:"ІВТ-97",
			speciality_id:1,
			faculty_id:1
		}


        // groupsSrvc.setGroup(new_group).then(function(httpData) {
        //   	$scope.change = httpData;
        // });
        //groupsSrvc.createGroup(new_group).then(function(httpData) {
        //   	$scope.add = httpData;
        // });
        groupsSrvc.delGroup(18).then(function(httpData) {
          	$scope.del = httpData;
        });
}]);