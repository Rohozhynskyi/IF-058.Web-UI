;
app.factory('entitiesExtSrvc', ['$http', 'baseUrl', function ($http, baseUrl) {

    // We need to write dependdencies we need in our future getting data
    var dependencies = {
        group: 'speciality,faculty',
        student: 'group,faculty'
    };

    var getDependecies = function (data, dep) {
        // Some entities do not have any _id (only id)
        // So we need here if statement block
        var entityId = dep + '_id';
        var entityName = dep + '_name';
        return $http.get(baseUrl + dep + '/getRecords')
            .then(function (response) {
                // Array of dependencies we will need later
                // Here we have all dependencies we've written inside the dependencies object
                // response.data it is an array
                var entityForInject = response.data;
                // Create buffer array and object
                var entityForInjectArray = [];
                var entityForInjectObject = {};

                // Go through all rows (indexes of the array) inside entityForInject (response.data array)
                for (row in entityForInject) {
                    // Create row (INDEX) inside BUFFER ARRAY with entityId...
                    // ... from row (index in array) of entityForInject (response.data) ...
                    // ... and give it value of entityName from row (index in array) of entityForInject (response.data)
                    entityForInjectArray[+entityForInject[row][entityId]] = entityForInject[row][entityName];
                    // Create row (PROPERTY) inside BUFFER OBJECT with entityId...
                    // ... from row (index in array) of entityForInject (response.data) ...
                    // ... and give it value of entityName from row (index in array) of entityForInject (response.data)
                    entityForInjectObject[entityForInject[row][entityId]] = entityForInject[row][entityName];
                }
                // data is a parameter of this function
                // Put in data property created BUFFER OBJECT
                data[dep] = entityForInjectObject;

                // Run over positions (rows) in data['list'] property
                for (row in data['list']) {
                    // Creates variable with data type of intager ...
                    // ... from data['list'] row in it with special unique entityId
                    var id = parseInt(data['list'][row][entityId]);
                    // Every dependency name have unique dependency id ...
                    // ... from the buffer array
                    data['list'][row][entityName] = entityForInjectArray[id];
                }
                ;
                return data;

            }, function () {
                console.error('Error')
            });

    };

    return {

        getEntitiesByEntity: function (entity, parentEntity, id) {
            return $http.get(baseUrl + entity + '/get' + entity[0].toUpperCase() + entity.slice(1) + 's' + 'By' + parentEntity[0].toUpperCase() + parentEntity.slice(1) + '/' + id)
                .then(fulfilled, rejected);
        },

        getRecordsRangeByEntity: function (entity, parentEntity, id) {
            return $http.get(baseUrl + entity + '/getRecordsRangeBy' + parentEntity[0].toUpperCase() + parentEntity.slice(1) + '/' + id + '/' + '100/' + '0')
                .then(fulfilled, rejected);
        },

        getEntities: function (entity) {
            return $http.get(baseUrl + entity + '/getRecords')
                .then(function (response) {
                    if (dependencies[entity] != undefined) {
                        // Split dependencies in the config object by coma
                        var depArr = dependencies[entity].split(',');
                        // Create new data object
                        data = {};
                        // Put all array of response.data into data.list property
                        data.list = response.data;
                        // Go through depArr by depId (through indexes)
                        for (depId in depArr) {
                            if (depId != (depArr.length - 1)) {
                                // Run function getDependecies
                                // first parameter - put data object we have just created
                                // second parameter - put position in array (index of depArr) we need
                                getDependecies(data, depArr[depId]);
                            }
                            else {
                                return getDependecies(data, depArr[depId]);
                            }
                        } // END for loop
                    } // END if statement dependencies
                    return response;
                }, rejected);
        },

        createEntity: function (entity, data) {
            return $http.post(baseUrl + entity + '/insertData', data)
                .then(fulfilled, rejected);
        },

        deleteEntity: function (entity, id) {
            return $http.delete(baseUrl + entity + '/del/' + id)
                .then(fulfilled, rejected);
        },

        updateEntity: function (entity, id, data) {
            return $http.post(baseUrl + entity + '/update/' + id, data)
                .then(fulfilled, rejected);
        }
    };

    function fulfilled(response) {
        return response;
    };


    function rejected(error) {
        alert("Помилка " + error.status + " " + error.statusText);
    };

}]);
