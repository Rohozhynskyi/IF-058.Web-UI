var app=angular.module("app",[]);app.controller("mainCtrl",["$scope","mainFctr",function(t,r){r.group2().then(function(r){t.test=r.faculty,console.log(t.test)}),r.group1(function(r){t.test2=r})}]),app.factory("mainFctr",["$http",function(t){var r={};return r.faculty=function(r){t.get("http://dtapi.local/faculty/getRecords").then(function(t){var r={};return data=t.data,r.faculty=data,r},function(){console.error("Error")}).then(function(t){r(t.faculty)},function(){console.error("Error")})},r.groups=function(r){function o(t,o){if(void 0===n&&void 0===a){var c=[];for(row in o)c[+o[row].faculty_id]=o[row].faculty_name;for(row in data_group){var u=parseInt(data_group[row].faculty_id);data_group[row].faculty_name=c[u]}r(data_group)}}var a,n;t.get("http://dtapi.local/group/getRecords").success(function(t){a=t,o(a,n)}),t.get("http://dtapi.local/faculty/getRecords").success(function(t){n=t,o(a,n)})},r.group1=function(r){Promise.all([t.get("http://dtapi.local/group/getRecords"),t.get("http://dtapi.local/faculty/getRecords")]).then(function(t){var o=[],a=t[0].data,n=t[1].data;for(row in n)o[+n[row].faculty_id]=n[row].faculty_name;for(row in a){var c=parseInt(a[row].faculty_id);a[row].faculty_name=o[c]}return r(a),null},function(){console.error("Error")})},r.group2=function(r){var o={};return t.get("http://dtapi.local/group/getRecords").then(function(r){return o.groups=r.data,t.get("http://dtapi.local/faculty/getRecords")},null).then(function(t){return o.faculty=t.data,o},null)},r}]);var b="firstCtrl.js",a="firstDirect.js";