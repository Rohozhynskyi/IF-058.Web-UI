testPlayerApp.controller('userQuestionListCtrl', ['$scope', '$rootScope', 'userSrvc', '$stateParams', '$state', '$q', '$timeout', '$filter',
    function ($scope, $rootScope, userSrvc, $stateParams, $state, $q, $timeout, $filter) {
        $scope.beginTest = function () {
            var data = '';
            var url = 'TestPlayer/getTimeStamp';
            var startTime
            var startTestDate
            var startTestTime

            userSrvc.getInfoForStudent(url, data).then(function (resp) {
                //console.log('getTimeStamp', resp.data)
                startTime = resp.data.unix_timestamp;
                var currentTime = new Date(startTime * 1000)
                startTestDate = $filter('date')(currentTime, 'yyyy-MM-dd')
                startTestTime = $filter('date')(currentTime, 'hh:mm:ss')


                console.log('start1', startTime)
                //console.log('testData.startTime',testData.startTime)
            });


            console.log('start2', startTime)

            if (JSON.parse(localStorage.getItem('finalGrade'))) {
                $scope.finalGrade = (JSON.parse(localStorage.getItem('finalGrade'))).toFixed(2)
            }
            var url = 'testPlayer/getData';
            var data = '';
            userSrvc.getInfoForStudent(url, data).then(function (resp) {
                var savedTestData = resp.data;

                var questionArray = savedTestData.questionList;
                $scope.questionList = questionArray;

                function timer() {
                    var data = '';
                    var url = 'TestPlayer/getTimeStamp';
                    $scope.onTimeout = function () {
                        userSrvc.getInfoForStudent(url, data).then(function (resp) {
                            var timeDifference = new Date((resp.data.unix_timestamp - savedTestData.timeForTest * 60) * 1000);
                            var timeStart = new Date(savedTestData.startTime * 1000);
                            var remeinedTime = (timeStart - timeDifference);
                            $scope.counter = (remeinedTime / 1000);
                            console.log($scope.counter, '$scope.counter');
                        })
                    };
                }

                timer();

                $scope.leftTime = function () {
                    if ($scope.counter === 0) {
                        timeIsOut();
                    }
                    $scope.counter--;
                    mytimeout = $timeout($scope.leftTime, 1000);
                };
                var mytimeout = $timeout($scope.leftTime, 1000);

                function timeIsOut() {
                    $scope.counter = 0;
                    $timeout.cancel($scope.mytimeout);
                    //$state.go('user.testResult');
                }

                var userId = localStorage.userId;
                var testId = localStorage.testId;
                var answerObj = {};
                var answerArray = [];
                $scope.checklistValue = [];
                var userAnswers = [];
                answerObj.answer_ids = [];
                var userAnswersIdsArr = [];

                var quest;
                $scope.choosenQuestion = function (quest, index) {
                    $scope.selected = index - 1;
                    console.log('quest', quest);
                    $scope.quest = quest;
                    nextQuestion(quest);
                };
                if ($stateParams.id !== '1') {

                    quest = +questionArray[$stateParams.id - 1];
                    $scope.choosenQuestion(quest, $stateParams.id);
                } else {
                    quest = questionArray[0];
                    $scope.choosenQuestion(quest, '1');
                    $scope.selected = 0;
                }

                var levelsArr = [];

                function nextQuestion(data) {
                    $scope.onTimeout();
                    var questionUrl = 'question/getRecords/';
                    var answerUrl = 'SAnswer/getAnswersByQuestion/';
                    $q.all([
                        userSrvc.getInfoForStudent(questionUrl, data),
                        userSrvc.getInfoForStudent(answerUrl, data)
                    ])
                        .then(function (resp) {
                            $scope.question = resp[0].data[0].question_text;
                            $scope.answers = resp[1].data;
                            $scope.type = resp[0].data[0].type == '1' ? 'radio' : 'checkbox';
                            if (localStorage.getItem('levelsArr')) {
                                levelsArr = JSON.parse(localStorage.getItem('levelsArr'))
                            }

                            levelsArr.push({id: resp[0].data[0].question_id, level: resp[0].data[0].level});
                            var newLevelsArr = []
                            for (var i = 0; i < levelsArr.length; i++) {

                                for (var j = 0; j < savedTestData.rate.length; j++) {

                                    if (levelsArr[i].level == savedTestData.rate[j].level) {
                                        console.log('id', resp[0].data[0].question_id[i])

                                        levelsArr[i].rate = savedTestData.rate[j].rate
                                    }
                                }
                            }

                            localStorage.setItem('levelsArr', JSON.stringify(levelsArr));
                            $scope.levelsArr = levelsArr;
                            console.log('levelsArr', $scope.levelsArr);


                        })
                }


                if (!localStorage.getItem('userAnswers')) {
                    localStorage.setItem('userAnswers', JSON.stringify(userAnswers))
                }
                $scope.submitQuestion = function (radioValue, index) {
                    //$scope.checked = index;
                    userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
                    answerObj.question_id = $scope.quest;
                    if ($scope.type === 'radio') {
                        answerObj.answer_ids.push(radioValue)
                    } else {
                        answerObj.answer_ids = $scope.checklistValue
                    }
                    userAnswers.push(answerObj);
                    /*$scope.allAnswers = userAnswers*/
                    console.log('$scope.allAnswers', $scope.allAnswers);
                    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
                    console.log('userAnswers', userAnswers);

                    var quesArrLen = questionArray.length;
                    var nextState = +$stateParams.id + 1;
                    if (nextState <= quesArrLen) {
                        $state.go('user.testPlayer', {id: nextState});
                    } else {
                        $state.go('user.testPlayer', {id: 1});
                    }

                };

                var countResultArr = []
                $scope.finishTest = function () {
                    var url = 'SAnswer/checkAnswers';
                    var data = localStorage.getItem('userAnswers');
                    userSrvc.postInfoForStudent(url, data).then(function (resp) {
                        $scope.testResult = resp.data;
                        for (var i = 0; i < $scope.testResult.length; i++) {
                            for (var j = 0; j < $scope.levelsArr.length; j++) {
                                console.log('$scope.levelsArr[j].id', $scope.levelsArr[j].id);
                                console.log($scope.testResult[i].question_id == $scope.levelsArr[j].id, 'if');
                                if ($scope.testResult[i].question_id == $scope.levelsArr[j].id) {
                                    countResultArr.push({
                                        'id': $scope.testResult[i].question_id,
                                        'level': $scope.levelsArr[j].level,
                                        'rate': $scope.levelsArr[j].rate,
                                        'true': $scope.testResult[i].true
                                    })
                                    userAnswersIdsArr.push($scope.testResult[i].question_id);
                                }
                            }
                        }
                        timeIsOut();
                        console.log('countResultArr', countResultArr)

                        getStudentGrade()
                    });

                }
                function getStudentGrade() {
                    var studentRightAns = 0
                    var maxAvilable = 0
                    //var studentGradeArr = []
                    for (var i = 0; i < countResultArr.length; i++) {
                        studentRightAns += ((+countResultArr[i].level) * (+countResultArr[i].rate) * (+countResultArr[i].true))
                    }
                    maxAvilable = savedTestData.maxAvilable

                    var finalGrade = studentRightAns / maxAvilable * 100
                    console.log('studentRightAns', studentRightAns)
                    console.log('maxAvilable', maxAvilable)
                    localStorage.setItem('finalGrade', JSON.stringify(finalGrade));//потім можна зробити вьюху результата як директиву

                    console.log('countResultArr.id.join', localStorage.getItem('userAnswers'))
                    console.log('$scope.questionList', userAnswersIdsArr.join('\\/'))
                    var resultStorage = {
                        "student_id": localStorage.userId,
                        "test_id": localStorage.testId,
                        "session_date": startTestDate,
                        "start_time": startTestTime,
                        "end_time": "10:30:00",//поміняти коли буде нормальний таймер
                        "result": finalGrade,
                        "questions": $scope.questionList.join('\\/'),
                        "true_answers": '3\/2\/5\/8',
                        "answers": userAnswersIdsArr.join('\\/')
                    }
                    var url = 'result/insertData';
                    var data = resultStorage;
                    userSrvc.postInfoForStudent(url, data)

                    localStorage.removeItem('levelsArr')
                    localStorage.removeItem('userAnswers')
                    $state.go('user.finalGrade');
                }
            });
        };
        $scope.beginTest();
    }]);