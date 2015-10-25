var app=angular.module("app",[]);app.factory("groupsSrvc",["$http",function(t){var n={},r="http://dtapi.local/group/";return n.getGroup=function(n){return t.get(r+"getRecords/"+n).then(function(t){return result=t.data,result},function(){console.error("Error")})},n.getGroups=function(){var n={};return t.get(r+"getRecords").then(function(r){return n.groups=r.data,t.get("http://dtapi.local/faculty/getRecords")},null).then(function(t){return n.faculty=t.data,n},null).then(function(t){var n=[],r=t.groups,e=t.faculty;for(row in e)n[+e[row].faculty_id]=e[row].faculty_name;for(row in r){var o=parseInt(r[row].faculty_id);r[row].faculty_name=n[o]}return r})},n.setGroup=function(n){return t.post(r+"update/2",n).then(function(t){return t.data.response})},n.delGroup=function(n){return t({method:"DELETE",url:r+"del/"+n}).then(function(t){return t.data.response})},n.createGroup=function(n){return t.post(r+"insertData",n).then(function(t){return t.data.response})},n}]),app.factory("facultySrvc",["$http",function(t){var n={},r="http://dtapi.local/faculty/";return n.getFaculties=function(){return t.get(r+"getRecords").success(function(t){return t}).error(function(t){console.log("error")})},n}]),angular.module("app").factory("addStudentSrvc",["$http",function(t){var n="http://dtapi.local/",r={};return r.addStudent=function(r){function e(t){condole.log("Everything is OK. Student record is added.")}function o(t){console.log("Something goes wrong. Student record was not added."),console.log(t)}return t({method:"POST",url:n+"student/insertData"},r).then(e,o)},r}]),app.controller("groupsCtrl",["$scope","groupsSrvc",function(t,n){n.getGroups().then(function(n){t.groups=n}),n.getGroup(5).then(function(n){t.group=n});n.delGroup(18).then(function(n){t.del=n})}]),app.controller("facultiesCtrl",["$scope","facultySrvc",function(t,n){n.getFaculties().then(function(n){t.faculties=n.data})}]),angular.module("app").controller("addStudentCtrl",["$scope","addStudentSrvc",function(t,n){t.addNewStudent=function(t){console.log(t);var r=t;n.addStudent(r)}}]);