;

app.factory('entitiesSrvc', ['$http', 'baseUrl', function ($http, baseUrl) {

    var dependencies = {
        group: 'speciality,faculty',
        student: 'group',
        test: 'subject',
        timeTable: 'group'
    };

    var getDependecies = function (data, dep) {
        var entityId = dep + '_id';
        var entityName = dep + '_name';

        return $http.get(baseUrl + dep + '/getRecords')
            .then(function (response) {
                var entityForInject = response.data;


                var entityForInjectArray = [];
                var entityForInjectObject = {};

                for (row in entityForInject) {
                    entityForInjectArray[+entityForInject[row][entityId]] = entityForInject[row][entityName];
                    entityForInjectObject[entityForInject[row][entityId]] = entityForInject[row][entityName];
                }
                data[dep] = entityForInjectObject;
                for (row in data['list']) {
                    var id = parseInt(data['list'][row][entityId]);
                    data['list'][row][entityName] = entityForInjectArray[id];
                }
                ;
                return data;

                // return result;
            }, function () {
                console.error('Error')
            });

    }

    return {

        getEntitiesByEntity: function (entity, parentEntity, id) {
            return $http.get(baseUrl + entity + '/get' + entity[0].toUpperCase() + entity.slice(1) + 's' + 'By' + parentEntity[0].toUpperCase() + parentEntity.slice(1) + '/' + id)
                .then(fulfilled, rejected);
        },

        getRecordsRangeByEntity: function (entity, parentEntity, id) {
            return $http.get(baseUrl + entity + '/getRecordsRangeBy' + parentEntity[0].toUpperCase() + parentEntity.slice(1) + '/' + id + '/' + '100/' + '0')
                .then(fulfilled, rejected);
        },

        getEntitiesForEntity: function (entity, parentEntity, id) {
            return $http.get(baseUrl + entity + '/getTimeTablesForSubject' + '/' + id)
                .then(function (response) {
                    if (dependencies[entity] != undefined) {
                        var depArr = dependencies[entity].split(',');
                        data = {};
                        data.list = response.data;
                        for (depId in depArr) {
                            if (depId != (depArr.length - 1)) {
                                getDependecies(data, depArr[depId]);
                            }
                            else {
                                return getDependecies(data, depArr[depId]);
                            }
                        }
                    }
                    return response;
                }, rejected);
        },

        getEntities: function (entity) {
            return $http.get(baseUrl + entity + '/getRecords')
                .then(function (response) {
                    if (dependencies[entity] != undefined) {
                        var depArr = dependencies[entity].split(',');
                        data = {};
                        data.list = response.data;
                        for (depId in depArr) {
                            if (depId != (depArr.length - 1)) {
                                getDependecies(data, depArr[depId]);
                            }
                            else {
                                return getDependecies(data, depArr[depId]);
                            }
                        }
                    }
                    return response;
                }, rejected);
        },

        getEntByEnt: function (entity, parentEntity, id) {
            return $http.get(baseUrl + entity + '/get' + entity[0].toUpperCase() + entity.slice(1) + 's' + 'By' + parentEntity[0].toUpperCase() + parentEntity.slice(1) + '/' + id)
                .then(function (response) {
                    if (response.data[0][0] === 'record_id' && response.data[0][1] === 'null') {
                        return {
                            response: null
                        };
                    }
                    return response;
                }, rejected);
        },

        getUsersById: function (entity, id) {
            return $http.get(baseUrl + entity + '/getRecords' + '/' + id)
                .then(function (response) {
                    return response.data;
                }, rejected);
        },


        getRecordsByStudent: function (entity, id) {
            return $http.get(baseUrl + entity + '/getRecordsByStudent' + '/' + id)
                .then(function (responseResult) {

                    return $http.get(baseUrl + "student" + '/getRecords' + '/' + id)
                        .then(function (responseStudent) {

                            if (responseResult.data[0][0] == "record_id" && responseResult.data[0][1] == "null") {
                                responseResult.data[1] = {};
                                responseResult.data[1].student_fullname = responseStudent.data[0].student_surname
                                    + " " + responseStudent.data[0].student_name;

                                return responseResult;

                            } else {
                                responseResult.data[0].student_fullname = responseStudent.data[0].student_surname
                                    + " " + responseStudent.data[0].student_name;

                                return $http.get(baseUrl + "test" + '/getRecords')
                                    .then(function (responseTest) {
                                        for (var i = 0; i < responseResult.data.length; i++) {
                                            for (var j = 0; j < responseTest.data.length; j++) {
                                                if (responseResult.data[i].test_id === responseTest.data[j].test_id) {
                                                    responseResult.data[i].test_name = responseTest.data[j].test_name;
                                                    responseResult.data[i].subject_id = responseTest.data[j].subject_id;
                                                }
                                                ;
                                            }
                                            ;
                                        }
                                        ;

                                        return $http.get(baseUrl + "subject" + '/getRecords')
                                            .then(function (responseSubject) {
                                                for (var i = 0; i < responseResult.data.length; i++) {
                                                    for (var j = 0; j < responseSubject.data.length; j++) {
                                                        if (responseResult.data[i].subject_id === responseSubject.data[j].subject_id) {
                                                            responseResult.data[i].subject_name = responseSubject.data[j].subject_name;
                                                        }
                                                        ;
                                                    }
                                                    ;
                                                }
                                                ;

                                                return responseResult;

                                            }, rejected);
                                    }, rejected);
                            }
                            ;
                        }, rejected);
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
