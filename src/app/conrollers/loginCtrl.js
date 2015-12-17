app.controller('loginCtrl', ['$scope', '$state', 'authSrvc', function ($scope, $state, authSrvc) {
    $scope.getError = function (error) {
        if (angular.isDefined(error)) {
            if (error.required) {
                return "Поле не може бути пустим!";
            } else if (error.minlength) {
                return "Поле не може містити менше 4-х символів!";
            }
        }
    };

    $scope.enter = function () {
        $scope.wrongCredentials = false;
        var user = {
            username: $scope.username,
            password: $scope.password
        };
        authSrvc.enterLogin(user).then(function (response) {
            if (response.data.response === "ok" && response.data.roles[1] === 'admin') {
                localStorage.adminName = response.data.username;
                localStorage.adminId = response.data.id;
                $state.go('admin.main');
            } else if (response.data.response === "ok" && response.data.roles[1] === 'student') {
                localStorage.userName = response.data.username;
                localStorage.userId = response.data.id;
                $state.go('user.subjects');
            } else {
                $scope.wrongCredentials = true;
            };
        });
    };
    $scope.detectUser = localStorage.adminName || localStorage.userName;
    $scope.exit = function () {
        localStorage.clear();
        authSrvc.logOut().then();
    };
}]);
