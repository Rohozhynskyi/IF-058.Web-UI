/**
 * Created by Серёга on 15.11.2015.
 */
var testPlayerApp = angular.module('testPlayerApp', ['ui.router']);


testPlayerApp.controller('userSubjectListCtrl', ['$scope', 'userSrvc', '$stateParams', '$state', function ($scope, userSrvc, $stateParams, $state) {
  $scope.enterToEntity = function (to, entityId) {
    $state.go(to, {'id': entityId});
  };
  $scope.showInformModal = function (infMsg) {
    $scope.infMsg = infMsg;
    angular.element(document.querySelector('#informModal')).modal();
  };
  $scope.getStudentSubjects = function () {
    var url = 'student/getRecords/';
    var data = localStorage.userId
    userSrvc.getInfoForStudent(url, data).then(function (resp) {
      url = 'timeTable/getTimeTablesForGroup/'
      data = resp.data[0].group_id;
      return userSrvc.getInfoForStudent(url, data)
    }).then(function (groupInfo) {
      url = 'subject/getRecords/'
      data = groupInfo.data[0].subject_id
      if (!data) {
        $scope.showInformModal("Немає предметів з доступними тестами для вашої групи");
      } else {
        for (i in groupInfo.data) {
          return userSrvc.getInfoForStudent(url, data)
        }
      }
    }).then(function (subjectInfo) {
      data = subjectInfo.data
      $scope.entities = data;
    })
  };
  $scope.getStudentSubjects();
}]);

testPlayerApp.controller('userTestListCtrl', ['$scope', 'userSrvc', '$stateParams', '$state', function ($scope, userSrvc, $stateParams, $state) {
  $scope.getStudentTests = function () {
    var url = 'test/getTestsBySubject/';
    var data = $stateParams.id
    userSrvc.getInfoForStudent(url, data).then(function (resp) {
      //console.log('response', resp.data)
      $scope.entities = resp.data
    })
  }
  $scope.getStudentTests();
  $scope.enterToEntity = function (to, entityId) {
    $state.go(to, {'id': entityId});
  };
}]);

//список вопросов
testPlayerApp.controller('userQuestionListCtrl', ['$scope', 'userSrvc', '$stateParams', '$state', function ($scope, userSrvc, $stateParams, $state) {
  var data = /*localStorage.userId*/'4'//захардкоджено, внести в базу нужне значення і поміняти
  var url = 'result/getRecordsByStudent/'
  $scope.getRecordsByStudent = function () {
    userSrvc.getInfoForStudent(url, data).then(function (resp) {
        console.log(resp)
      function unique(resp) {
        for (var i = 0; i < resp.data.length; i++) {
          //var result = resp.data[i].test_id
          for (var j = 0; j < resp.data.length; j++) {
              var repeatedTest_id = {
                test_id: resp.data[i].test_id,
                result: ''
              }
            if (resp.data[i].test_id === resp.data[j].test_id){
              repeatedTest_id.result++;
            }
          }
        }
        
      }
      unique(resp)

    }).then(function(resp){
      var data =  $stateParams.id
      var url = 'TestDetail/getTestDetailsByTest/'
      return userSrvc.getInfoForStudent(url, data)
    }).then(function(resp){
     /* console.log('tDetails',resp.data[0].id)
      if (resp.data[0].id){
        $scope.showInformModal("Немає параметрів тесту з обраного тесту");
      }*/
      var id = $stateParams.id
      localStorage.testId = id;
      var data = [id, resp.data[0].level, resp.data[0].tasks]

      var url = 'question/getQuestionIdsByLevelRand/'
      return userSrvc.getInfoForStudent(url, data)
    }).then(function(resp){
      var questionList = []
      for (i in resp.data){
        questionList.push(resp.data[i].question_id)
      }
      localStorage.questionList = questionList
      $scope.questionsQuantity = questionList.length
    })
  }
  $scope.getRecordsByStudent()

  $scope.beginTest = function(){
    var userId = localStorage.userId;
    var testId = localStorage.testId;
    userSrvc.getTestInfo(userId, testId).then(function (resp) {
      $state.go('user.testPlayer');
    });
  }

}]);




/*for (var i = 0; i < arr.length; i++) {
 var str = arr[i]; // для каждого элемента
 for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
 if (result[j] == str) continue nextInput; // если да, то следующий
 }
 result.push(str);
 }

 return result;
 }*/

/*


 student_id: studentId,
 test_id: testId,
 session_date: tpServices.getSessionDate(),
 start_time: '',
 end_time: '',
 result: $scope.scoreForTest,
 questions: tpServices.serializeArray(allResults.questions),
 true_answers: tpServices.serializeArray(trueAnswers),
 answers: tpServices.serializeArray(allResults.answers)


 */


testPlayerApp.controller('userResultListCtrl', ['$scope', 'userSrvc', '$stateParams', '$state', function ($scope, userSrvc, $stateParams, $state) {
  $scope.getStudentResults = function () {
    var url = 'result/getRecordsByStudent/'
    var data = '69'//захардкоджено, потім внести в базу данних і поміняти
    /*localStorage.userId*/
    userSrvc.getInfoForStudent(url, data).then(function (resp) {
      console.log('response', resp.data[0])
      console.log('resp.data', resp.data)
      return resp.data
    }).then(function (resp) {
      console.log('resp', resp)
      var entities = []
      for (var i = 0; i < resp.length; i++) {
        entities.push(resp[i].result)//вывести во вью
        entities.push(resp[i].session_date)
        idArr = []
        idArr.push(resp[i].test_id)
      }
      url = 'EntityManager/getEntityValues'
      postData = {entity: "Test", ids: idArr}
      $scope.entities = entities
      return userSrvc.postInfoForStudent(url, postData)
    }).then(function (resp) {
      for (var i = 0; i < resp.length; i++) {
        idArr = []
        idArr.push(resp.data[0].subject_id)
      }
      console.log('idArr', idArr)
      postData = {entity: "Subject", ids: idArr}
      //console.log('postdata', postData)
      return userSrvc.postInfoForStudent(url, postData)
    }).then(function (resp) {
      console.log('resp', resp)
      for (var i = 0; i < resp.data.length; i++) {
        console.log('resp[i].data.subject_name', resp.data[i].subject_name)
        $scope.entities.push(resp.data[i].subject_name)
      }
      console.log($scope.entities)
      console.log('lastresp', resp)
      console.log('$scope.entities[0]')
    })
  }
  $scope.getStudentResults()
}]);


testPlayerApp.factory('userSrvc', ['$http', 'baseUrl', function ($http, baseUrl) {
  return {
    getInfoForStudent: function (url, data) {
      console.log('serviceData',data)
      if (Array.isArray(data)){
        console.log('is Array')
        var sum = ''
        for (i=0; i<data.length; i++){
          sum = sum + data[i]+'/'
        }
        data = sum
      }
      return $http.get(baseUrl + url + data)
        .then(fulfilled, rejected);
    },
    postInfoForStudent: function (url, postData) {
      return $http.post(baseUrl + url, postData)
        .then(fulfilled, rejected);

    },
    getTestInfo: function(userId, testId) {
      return $http.get(baseUrl + 'Log/startTest' + '/' + userId + '/' + testId)
        .then(fulfilled, rejected);
    }
  }
  function fulfilled(response) {
    console.log('hello', 'testInfo');
    return response;
  };
  function rejected(error) {
    alert("Помилка " + error.status + " " + error.statusText);
  };

}]);