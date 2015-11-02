/*
app.factory('addAdminSrvc', function ($http) {
    var baseURL = 'http://dtapi.local/';
    return {
        getAdmins: function(){
            return $http.get(baseURL + 'AdminUser/getRecords')
                .then(fulfilled, rejected);
        },
    };
    function fulfilled(response) {
        return response;
        console.log(response);
    };

    function rejected(error) {
        return error;
        console.log(error);
    };
});*/
