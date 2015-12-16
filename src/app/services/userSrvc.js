testPlayerApp.factory('userSrvc', ['$http', 'baseUrl', '$q', function ($http, baseUrl, $q) {
  var testData = {
    //counter: '',
    startTime: '',
    questionList: '',
    timeForTest: '',
    rate: [],
    maxAvilable: 0
  }




  return {
    checkStudent: function (id) {
      var id = id
      var questQty = ''
      var data = localStorage.userId
      //console.log('userId', data)
      var url = 'result/getRecordsByStudent/'
   return getInfoHelper(url, data).then(function (resp) {
      var data = defineAttempts(resp).test_id
      var result = defineAttempts(resp).result
      var url = 'test/getRecords/'
      return getInfoHelper(url, data, result)
    }).then(function (test) {
      //$scope.timeForTest = test[0].data[0].time_for_test;
      testData.timeForTest = test[0].data[0].time_for_test;
      if (test[0].data[0].attempts < test[1]) {
        alert('Немає предметів з доступними тестами для вашої групи')//убрати коли запрацює модалка
      }
      var url = 'TestDetail/getTestDetailsByTest/'

      return getInfoHelper(url, id)
    }).then(function (resp) {
      if (!resp.data[0].id) {
        alert('Немає деталей тесту')
        return
      } else {
        for (var i = 0; i<resp.data.length; i++){
          testData.maxAvilable += resp.data[i].tasks * resp.data[i].rate
        }
        localStorage.testId = id;
        var url = 'question/getQuestionIdsByLevelRand/'
        var dataLevels = []
        for (var i = 0; i<resp.data.length; i++){
           dataLevels.push([id, resp.data[i].level, resp.data[i].tasks])
          testData.rate.push({'level': resp.data[i].level, 'rate': resp.data[i].rate})

           
        }
          function reqArr () {
            var newArr = []
            for (var k = 0; k<dataLevels.length; k++){
              newArr.push(getInfoHelper(url, dataLevels[k]))
            }
            return newArr
          }
         return $q.all(
          reqArr()
          )
      }
    }).then(function (resp) {
      var questionList = []
     for (var i = 0; i<resp.length; i++){
        for (k in resp[i].data) {
          questionList.push(resp[i].data[k].question_id)
        }
      testData.questionList = questionList;
      console.log('questionList.length', questionList.length)
//return /*$scope.questionsQuantity =*/ questionList.length;
     }
     //questQty = questionList.length
     console.log('questQty', questQty)
     console.log('testData', testData)
     var data = '';
      var url = 'TestPlayer/getTimeStamp';
      getInfoHelper(url, data).then(function (resp) {
        testData.startTime = resp.data.unix_timestamp
    });
      console.log('testDataService', testData)

     return testData
     //return /*$scope.questionsQuantity =*/ questionList.length;
    })

    
  },




    getInfoForStudent: function (url, data, result) {
      if (Array.isArray(data)){
        var sum = ''
        for (i=0; i<data.length; i++){
          sum = sum + data[i]+'/'
        }
        data = sum
      }
      if (url == 'test/getRecords/'){
        return $http.get(baseUrl + url + data)
        .then(function(response){
            return [response, result];
        }, rejected);
      } else {
        return $http.get(baseUrl + url + data)
          .then(fulfilled, rejected);
      }
    },

    getTimeStamp: function(){
      var data = '';
      var url = 'TestPlayer/getTimeStamp';
      return getInfoHelper(url, data).then(fulfilled, rejected)
    },
    getTestInfo: function(userId, testId) {
     return $http.get(baseUrl + 'Log/startTest' + '/' + userId + '/' + testId)
       .then(fulfilled, rejected);
   },
    postInfoForStudent: function (url, postData) {
      return $http.post(baseUrl + url, postData)
        .then(fulfilled, rejected);

    },
    getSavedData: function(){
    var url = 'testPlayer/getData';
    var data = '';
    return getInfoHelper(url, data)
    .then(fulfilled, rejected);
},

    timer: function(startTime, timeForTest) {
                    var data = '';
                    var url = 'TestPlayer/getTimeStamp';
                        return getInfoHelper(url, data).then(function (resp) {
                            var timeDifference = new Date((resp.data.unix_timestamp - timeForTest * 60) * 1000);
                            var timeStart = new Date(startTime * 1000);
                            console.log('startTime', startTime)
                            console.log('timeDifference', timeDifference)
                            var remeinedTime = (timeStart - timeDifference);
                            counter = (remeinedTime / 1000);
                            console.log('counterService', counter)
                            return counter
                            //console.log('$scope.counter1', $scope.counter);
                        })
                },
                finishTest: function (){
                  var url = 'SAnswer/checkAnswers';
                    var data = localStorage.getItem('userAnswers');
                    console.log('datasdasdasdasd', data)
                    return postInfoHelper(url, data)
                    .then(fulfilled, rejected);
                },
                nextQuestion: function(data){
                  var questionUrl = 'question/getRecords/';
                    var answerUrl = 'SAnswer/getAnswersByQuestion/';
                    return $q.all([
                        getInfoHelper(questionUrl, data),
                        getInfoHelper(answerUrl, data)
                    ]).then(fulfilled, rejected);
                },
                endTime: function(){
                  var url = 'TestPlayer/getTimeStamp';
                  var data = ''
                  return getInfoHelper(url, data).then(fulfilled, rejected)
                }
  }



  function defineAttempts (resp, id) {
    var repeatedTest_id = {
      test_id: '',
      result: ''
    }
    console.log('resp', resp)
    for (var i = 0; i < resp.data.length; i++) {
      console.log('resp.data[i].test_id', resp.data[i].test_id)
      if (resp.data[i].test_id == id) {
        repeatedTest_id.test_id = resp.data[i].test_id;
        repeatedTest_id.result++;
      }
    }
    console.log('repeatedTest_id', repeatedTest_id)
    return repeatedTest_id
  }

  function getInfoHelper (url, data, result) {
      if (Array.isArray(data)){
        var sum = ''
        for (i=0; i<data.length; i++){
          sum = sum + data[i]+'/'
        }
        data = sum
      }
      if (url == 'test/getRecords/'){
        return $http.get(baseUrl + url + data)
        .then(function(response){
            return [response, result];
        }, rejected);
      } else {
        return $http.get(baseUrl + url + data)
          .then(fulfilled, rejected);
      }
    }

    function postInfoHelper (url, postData) {
      return $http.post(baseUrl + url, postData)
        .then(fulfilled, rejected);

    }


  function fulfilled(response) {
    return response;
  };
  function rejected(error) {
    alert("Помилка " + error.status + " " + error.statusText);
  };
}]);