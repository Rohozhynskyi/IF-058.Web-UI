app.controller('loginCtrl', function($scope, $state, $rootScope, authSrvc){
    $scope.getError = function (error) {
        if (angular.isDefined(error)) {
            if (error.required) {
                return "Field can't be empty!";
            } else if (error.minlength) {
                return "No less than 4 characters!";
            }
        }
    };

    $scope.enter = function(){
        $scope.wrongCredentials = false;
        var user = {
            username: $scope.username,
            password: $scope.password
        };
        authSrvc.enterLogin(user).then(function(response){
            if (response.data.response === "ok" && response.data.roles[1] === 'admin') {
                localStorage.adminName = response.data.username;
                localStorage.adminId = response.data.id;
                $state.go('admin.main');
            } else if (response.data.response === "ok" && response.data.roles[1] === 'student') {
                localStorage.userName = response.data.username;
                localStorage.userId = response.data.id;
                $state.go('user');
            } else {
                $scope.wrongCredentials = true;
            };

        });
    };

    $scope.exit = function() {
        authSrvc.logOut().then();
    };

});
