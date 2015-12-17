testPlayerApp.controller('userSubjectListCtrl', ['$scope', 'userSrvc', '$stateParams', '$state',
    function ($scope, userSrvc, $stateParams, $state) {
    function absentData(resp) {
        return resp.data[0][0] == "record_id" && resp.data[0][1] == "null"
    }
    $scope.enterToEntity = function (to, entityId) {
        $state.go(to, {'id': entityId});
    };
    $scope.showInformModal = function (infMsg) {
        $scope.infMsg = infMsg;
        angular.element(document.querySelector('#informModal')).modal();
    };
    $scope.getStudentSubjects = function () {
        var url = 'student/getRecords/';
        var data = localStorage.userId;
        userSrvc.getInfoForStudent(url, data).then(function (resp) {
            if (absentData(resp)) {
                return $scope.noData = "Немає записів";
            } else {
                url = 'timeTable/getTimeTablesForGroup/';
                data = resp.data[0].group_id;
                return userSrvc.getInfoForStudent(url, data)
            }
        }).then(function (groupInfo) {
            if (absentData(groupInfo)) {
                return $scope.noData = "Немає записів";
            }
            url = 'subject/getRecords/';
            data = groupInfo.data[0].subject_id;
            for (var i in groupInfo.data) {
                return userSrvc.getInfoForStudent(url, data)
            }
        }).then(function (subjectInfo) {
            data = subjectInfo.data;
            $scope.entities = data;
        })
    };
    $scope.getStudentSubjects();
}]);

testPlayerApp.controller('userTestListCtrl', ['$scope', 'userSrvc', '$stateParams', '$state',
    function ($scope, userSrvc, $stateParams, $state) {
    $scope.getStudentTests = function () {
        var url = 'test/getTestsBySubject/';
        var data = $stateParams.id;
        userSrvc.getInfoForStudent(url, data).then(function (resp) {
            if (resp.data[0][0] == "record_id" && resp.data[0][1] == "null") {
                $scope.noData = "Немає записів";
            } else {
                $scope.entities = resp.data;
            }
        })
    };
    $scope.getStudentTests();
    $scope.enterToEntity = function (to, entityId) {
        $state.go(to, {'id': entityId});
    };
}]);
