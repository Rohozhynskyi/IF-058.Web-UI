app.factory('authSrvc', ['$http', '$state', 'baseUrl', function ($http, $state, baseUrl) {
    var toAuth = function () {
        $state.go('login');
    };
    return {
        enterLogin: function (data) {
            return $http.post(baseUrl + 'login/index', data)
                .then(fulfilled, rejected);
        },

        logOut: function () {
            return $http.get(baseUrl + 'login/logout')
                .then(
                function () {
                    return toAuth();
                },
                function () {
                    return toAuth();
                }
            );
        }
    };
    function fulfilled(response) {
        return response;
    }
    function rejected(error) {
        return error;
    }
}]);
