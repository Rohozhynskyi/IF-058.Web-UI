var testPlayerApp = angular.module('testPlayerApp', ['ui.router']);
//список вопросов
testPlayerApp.controller('userQuestionListCtrl', ['$scope', 'userSrvc', '$stateParams', '$state', '$q', function ($scope, userSrvc, $stateParams, $state, $q) {
  var data = localStorage.userId/*'4'*///захардкоджено, внести в базу нужне значення і поміняти
  console.log('userId',data)
  var url = 'result/getRecordsByStudent/'
  var id = $stateParams.id
  function unique(resp) {
    var repeatedTest_id = {
      test_id: '',
      result: ''
    }
    for (var i = 0; i < resp.data.length; i++) {
      if (resp.data[i].test_id == id){
        repeatedTest_id.test_id = resp.data[i].test_id;
        repeatedTest_id.result++;
      }
    }
    return repeatedTest_id
  }
  $scope.showInformModal = function (infMsg) {
    $scope.infMsg = infMsg;
    angular.element(document.querySelector('#informModal')).modal();
  };
  $scope.getRecordsByStudent = function () {
    userSrvc.getInfoForStudent(url, data).then(function (resp) {
      var data = unique(resp).test_id
      var result = unique(resp).result
      var url = 'test/getRecords/'
      return userSrvc.getInfoForStudent(url, data, result)
    }).then(function(test){
      if (test[0].data[0].attempts < test[1]){
        alert('Немає предметів з доступними тестами для вашої групи')//убрати коли запрацює модалка
     $scope.showInformModal("Немає предметів з доступними тестами для вашої групи");
      }
      var data =  $stateParams.id
      var url = 'TestDetail/getTestDetailsByTest/'
      return userSrvc.getInfoForStudent(url, data)
    }).then(function(resp){
      //console.log('testDetails',resp)
      console.log('id',resp.data[0].id)
      if (!resp.data[0].id){
        alert('Немає деталей тесту')
         $scope.showInformModal("Немає деталей тесту");//дописати щоб запрацювала модалка
      }
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
    }, function(error){
      console.log('Відсутні деталі тесту по данному тесту')
      alert('Відсутні деталі тесту по данному тесту')
    })
    
  }
  $scope.getRecordsByStudent()

  $scope.beginTest = function(){
    if (!$scope.showTest){
      console.log($scope.showTest)
    $scope.showTest = true;
    /*angular.element(element.getElementsById(".multi-files"))*/
    }
    var userId = localStorage.userId;
    var testId = localStorage.testId;
    /*userSrvc.getTestInfo(userId, testId).then(function (resp) {
      $state.go('user.testPlayer');
    });*/
     /* var id = localStorage.userId + '/' + localStorage.testId
    var url = 'log/startTest/'
    userSrvc.getInfoForStudent(url, id).then(function (resp) {
      console.log(resp)
    })*/

      var data = localStorage.questionList[0];
      var questionUrl = 'question/getRecords/';
      var answerUrl = 'answer/getAnswersByQuestion/';
$q.all[(
    userSrvc.getInfoForStudent(questionUrl, data),
    userSrvc.getInfoForStudent(answerUrl, data)
  )]
   .then(function (resp) {
      console.log('resp',resp)
   })
  
  }
  //наступний запит використовуємо щоб залогініти юзера
   
}]);





