;
app.controller('addAdminCtrl', ['$scope', 'entitiesSrvc', function($scope, entitiesSrvc) {

    $scope.thisEntity = "AdminUser";
    //function gets a list of entities
    function getAdmins() {
        entitiesSrvc.getEntities($scope.thisEntity).then(function(resp){
            $scope.admins = resp.data;
            $scope.noData = "Not found";
            console.log($scope.admins);
        });
    };

    //function shows and hides the form for creating new entity
    $scope.showAddForm = function () {
        if (!$scope.showingAdd) {
            $scope.showingAdd = true;
        } else {
            $scope.showingAdd = false;
            $scope.newUsername = "";
            $scope.newEmail = "";
        };
    };

    //function creates new element of array and sends new entity on server
    $scope.addAdmin = function () {
        var newData = {
            username: $scope.newUsername,
            password: $scope.newPassword,
            password_confirm: $scope.newPasswordConfirm,
            email: $scope.newEmail
        };
        // console.log(newData);
        entitiesSrvc.createEntity($scope.thisEntity, newData).then(function (resp) {
            if (resp.data.response == "ok") {
                newData.admin_id = resp.data.id;
                // console.log(resp);
                $scope.admins.push(newData);
            } else {
                alert ("Помилка " + resp.data.response);
            };
        });
        $scope.showAddForm();
    };

    //function opens a form for editing
    $scope.showEditForm = function (admin) {
        if ($scope.editingAdmin != admin) {
            $scope.editingAdmin = admin;
            $scope.editingData = {};
            $scope.editingData.editingUsername = admin.username;
            $scope.editingData.editingPassword = "";
            $scope.editingData.editingPasswordConfirm = "";
            $scope.editingData.editingEmail = admin.email;
            $scope.currentId = admin.id;
        } else {
            $scope.editingAdmin = null;
        };
    };

    //function updates an element of array and send updating of entity to server
    $scope.editAdmin = function () {
        var editedData = {
            username: $scope.editingData.editingUsername,
            password: $scope.editingData.editingPassword,
            password_confirm: $scope.editingData.editingPasswordConfirm,
            email: $scope.editingData.editingEmail
        };
        // console.log($scope.editingData, $scope.currentId);
        entitiesSrvc.updateEntity($scope.thisEntity, $scope.currentId, editedData).then(function (resp) {
            if (resp.data.response == "ok") {
                for (var i = 1; i < $scope.admins.length; i++) {
                    if ($scope.admins[i].id == $scope.currentId) {
                        $scope.admins[i].username = editedData.username;
                        $scope.admins[i].password = editedData.password;
                        $scope.admins[i].password_confirm = editedData.password_confirm;
                        $scope.admins[i].email = editedData.email;
                    } ;
                };
            } else {
                alert ("Помилка " + resp.data.response);
            };
        });;
        $scope.editingAdmin = null;
    };

    //function for initiate of entity for delete in modal
    $scope.activateAdmin = function (admin) {
        if ($scope.activeAdmin != admin) {
            $scope.activeAdmin = admin;
        } else {
            $scope.activeAdmin = null;
        };
    };

    //function removes an entity from array and from server
    $scope.removeAdmin = function () {
        var currentAdmin = $scope.activeAdmin;
        var currentId = $scope.activeAdmin.id;
        entitiesSrvc.deleteEntity($scope.thisEntity, currentId).then(function (resp) {
            if (resp.data.response == "ok") {
                var index = $scope.admins.indexOf(currentAdmin);
                $scope.admins.splice(index, 1);
            } else {
                alert ("Помилка " + resp.data.response);
            };
        });
        $scope.activateAdmin();
    };



    getAdmins();
}]);
