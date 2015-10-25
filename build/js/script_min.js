var app=angular.module("app",["ui.router"]);app.config(function(t,e){t.state("login",{url:"/",templateUrl:"app/views/login.html",controller:"loginCtrl"}).state("admin",{url:"/admin",templateUrl:"app/views/admin.html"}).state("user",{url:"/user",templateUrl:"app/views/user.html"}).state("admin.groups",{url:"/groups",templateUrl:"app/views/listGroups.html",controller:"groupsCtrl"}).state("admin.addGroup",{url:"/addGroup",templateUrl:"app/views/addGroup.html",controller:"addGroupsCtrl"}).state("admin.editGroup/:group_id",{url:"/editGroup",templateUrl:"app/views/editGroup.html",controller:"editGroupsCtrl"}).state("admin.faculties",{url:"/faculties",templateUrl:"app/views/facultyList.html",controller:"facultiesCtrl"}).state("admin.specialities",{url:"/specialities",templateUrl:"app/views/specialitiesList.html",controller:"specialitiesCtrl"}).state("admin.subjects",{url:"/subjects",templateUrl:"app/views/subjectsList.html",controller:"subjectsCtrl"}).state("admin.students",{url:"/students/addStudent",templateUrl:"app/views/addStudentRecord.html",controller:"addStudentCtrl"}),e.otherwise("/")}),angular.module("app").controller("addStudentCtrl",["$scope","addStudentSrvc",function(t,e){t.addNewStudent=function(t){var n=t;e.addStudent(n)}}]),app.controller("facultiesCtrl",function(t,e){function n(){e.getFaculties(function(e){t.faculties=e.data})}t.showingAddBtn="Додавання факультетів",n(),t.showAddForm=function(){t.showingAdd?(t.showingAdd=!1,t.showingAddBtn="Додавання факультетів",t.newDescription="",t.newName=""):(t.showingAdd=!0,t.showingAddBtn="Скасувати додавання")},t.addFaculty=function(){var o={faculty_description:t.newDescription,faculty_name:t.newName};e.createFaculty(function(t){n()},o),t.showAddForm()},t.editingData={},t.showEditForm=function(e){t.editingFaculty!=e?(t.editingFaculty=e,t.editingData.editingDescription=e.faculty_description,t.editingData.editingName=e.faculty_name,t.currentId=e.faculty_id):t.editingFaculty=null},t.editFaculty=function(){var o={faculty_description:t.editingData.editingDescription,faculty_name:t.editingData.editingName};console.log(t.editingData,t.currentId),e.updateFaculty(function(){n()},t.currentId,o),t.showEditForm(),t.activateFaculty()},t.activateFaculty=function(e){t.activeFaculty!=e?t.activeFaculty=e:t.activeFaculty=null,console.log(t.activeFaculty)},t.removeFaculty=function(){var o=t.activeFaculty.faculty_id;e.deleteFaculty(function(){n()},o),t.activateFaculty()}}),app.controller("groupsCtrl",["$scope","groupsSrvc",function(t,e){e.getGroups().then(function(e){t.groups=e}),t.delGroupAction=function(n){e.delGroup(n).then(function(e){t.del=e});for(row in t.groups)t.groups[row].group_id==n&&t.groups.splice(row,1)}}]),app.controller("addGroupsCtrl",["$scope","groupsSrvc","$state",function(t,e,n){e.getFacultys().then(function(e){t.facultys=e}),t.addGroupAction=function(){var o={};o.group_name=t.groupName,o.speciality_id=1,o.faculty_id=+t.facultyId,console.log(o),e.createGroup(o).then(function(e){t.add=e,n.go("groups")})}}]),app.controller("editGroupsCtrl",["$scope","groupsSrvc","$routeParams","$location",function(t,e,n,o){var a=n.group_id;e.getGroup(a).then(function(e){t.groupName=e[0].group_name,t.facultyId=e[0].faculty_id}),e.getFacultys().then(function(e){t.facultys=e}),t.editGroupAction=function(){var n={};n.group_name=t.groupName,n.speciality_id=1,n.faculty_id=+t.facultyId,console.log(n),e.setGroup(a,n).then(function(e){t.add=e,$state.go("groups")})}}]),app.controller("loginCtrl",function(t,e,n,o){t.getError=function(t){if(angular.isDefined(t)){if(t.required)return"Field can't be empty!";if(t.minlength)return"No less than 4 characters!"}},t.enter=function(){console.log("enter works"),t.wrongCredentials=!1;var n={username:t.username,password:t.password};o.enterLogin(function(n){console.log(n),"ok"===n.data.response&&"admin"===n.data.roles[1]?(console.log("hello admin"),e.path("/admin")):"ok"===n.data.response&&"student"===n.data.roles[1]?(console.log("hello student"),e.path("/user")):(console.log("wrong credentials"),t.wrongCredentials=!0)},n)}}),app.controller("specialitiesCtrl",function(t,e,n){function o(){e.getSpecialities().then(function(e){t.specialities=e.data})}t.showAdd=function(){t.addSpec=!t.addSpec,console.log(t.addSpec)},e.getSpecialities().then(function(e){t.specialities=e.data}),t.add=function(){var a={speciality_name:t.name,speciality_code:t.code};e.createSpeciality(a),o(),t.name="",t.code="",console.log(n),console.log("add made"),console.log(t)},t["delete"]=function(t){console.log(t.speciality_id),e.delSpeciality(t.speciality_id),console.log(e.delSpeciality(t.speciality_id)),o()},t.edit=function(t){var n=prompt("������� ����� (Write speciality name)",t.speciality_name),a=prompt("������� ��� (Write speciality code)",t.speciality_code),r={speciality_name:n,speciality_code:a},i=t.speciality_id;o(e.editSpeciality(i,r))}}),app.controller("subjectsCtrl",function(t,e){function n(){e.getSubjects().then(function(e){t.subjects=e.data})}console.log("hidhsfo"),t.showAdd=function(){t.addSubj=!t.addSubj,console.log(t.addSubj)},e.getSubjects().then(function(e){t.subjects=e.data}),t.add=function(){var o={subject_name:t.name,subject_description:t.description};e.createSubject(o),n(),t.name="",t.description="",console.log("add made")},t["delete"]=function(t){e.delSubject(t.subject_id),n()},t.edit=function(t){var o=prompt("Введіть назву предмету",t.subject_name),a=prompt("Введіть опис предмету",t.subject_description),r={subject_name:o,subject_description:a},i=t.subject_id;n(e.editSubject(i,r))}}),angular.module("app").factory("addStudentSrvc",["$http",function(t){var e="http://dtapi.local/",n={};return n.addStudent=function(n){function o(t){condole.log("Everything is OK. Student record is added.")}function a(t){console.log("Something goes wrong. Student record was not added.")}return t({method:"POST",url:e+"student/insertData"},n).then(o,a)},n}]),app.factory("auth",function(t){var e={},n="http://dtapi.local/";return e.enterLogin=function(e,o){t({method:"POST",url:n+"login/index",data:o}).then(function(t){e(t)},function(t){e(t)})},e}),app.factory("facultiesSrvc",function(t){var e={};return e.getFaculties=function(e){var n="http://dtapi.local/";t({method:"GET",url:n+"faculty/getRecords"}).then(function(t){e(t)},function(t){e(t)})},e.createFaculty=function(e,n){var o="http://dtapi.local/";t({method:"POST",url:o+"faculty/insertData",data:n}).then(function(t){e(t)},function(t){e(t)})},e.deleteFaculty=function(e,n){var o="http://dtapi.local/";t({method:"DELETE",url:o+"faculty/del/"+n}).then(function(t){e(t)},function(t){e(t)})},e.updateFaculty=function(e,n,o){console.log(o,n);var a="http://dtapi.local/";t({method:"POST",url:a+"faculty/update/"+n,data:o}).then(function(t){e(t)},function(t){e(t)})},e}),app.factory("groupsSrvc",["$http",function(t){var e={},n="http://dtapi.local/group/";return e.getGroup=function(e){return t.get(n+"getRecords/"+e).then(function(t){return result=t.data,result},function(){console.error("Error")})},e.getFacultys=function(){return t.get("http://dtapi.local/faculty/getRecords").then(function(t){return result=t.data,result},function(){console.error("Error")})},e.getGroups=function(){var e={};return t.get(n+"getRecords").then(function(n){return e.groups=n.data,t.get("http://dtapi.local/faculty/getRecords")},null).then(function(t){return e.faculty=t.data,e},null).then(function(t){var e=[],n=t.groups,o=t.faculty;for(row in o)e[+o[row].faculty_id]=o[row].faculty_name;for(row in n){var a=parseInt(n[row].faculty_id);n[row].faculty_name=e[a]}return n})},e.setGroup=function(e,o){return t.post(n+"update/"+e,o).then(function(t){return t.data.response})},e.delGroup=function(e){return t({method:"DELETE",url:n+"del/"+e}).then(function(t){return t.data.response})},e.createGroup=function(e){return t.post(n+"insertData",e).then(function(t){return t.data.response})},e}]),app.factory("specialitiesSrvc",["$http",function(t){var e={},n="http://dtapi.local/speciality/";return e.getSpecialities=function(){return t.get(n+"getRecords").success(function(t){return t}).error(function(t){console.log("error")})},e.createSpeciality=function(e){return t.post(n+"insertData",e).then(function(t){return t.data.response})},e.delSpeciality=function(e){return t.get(n+"del/"+e).then(function(t){return t.data.response})},e.editSpeciality=function(e,o){return console.log(e,o),t.post(n+"update/"+e,o).then(function(t){return t.data.response})},e}]),app.factory("subjectsSrvc",["$http",function(t){var e={},n="http://dtapi.local/subject/";return e.getSubjects=function(){return t.get(n+"getRecords").success(function(t){return t}).error(function(t){console.log("error")})},e.createSubject=function(e){return t.post(n+"insertData",e).then(function(t){return t.data.response})},e.delSubject=function(e){return t.get(n+"del/"+e).then(function(t){return t.data.response})},e.editSubject=function(e,o){return console.log(e,o),t.post(n+"update/"+e,o).then(function(t){return t.data.response})},e}]);