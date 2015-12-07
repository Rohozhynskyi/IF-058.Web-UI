testPlayerApp.controller('userQuestionListCtrl', ['$scope', '$rootScope', 'userSrvc', '$stateParams', '$state', '$q', '$timeout',
    function ($scope, $rootScope, userSrvc, $stateParams, $state, $q, $timeout) {
        $scope.beginTest = function () {
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
                            $scope.mytimeout = $timeout($scope.onTimeout, 1000);
                            if ($scope.counter === 0) {
                                timeIsOut();
                            }
                        })
                    };
                    $scope.mytimeout = $timeout($scope.onTimeout, 1000);
                }

                timer();
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
                            for (var i = 0; i< levelsArr.length; i++){

                                for (var j = 0; j<savedTestData.rate.length; j++){

                                    if (levelsArr[i].level == savedTestData.rate[j].level){
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
                $scope.submitQuestion = function (radioValue) {
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
                    var nextState = +$stateParams.id + 1;
                    $state.go('user.testPlayer', {id: nextState});
                };

                var countResultArr = []
                $scope.finishTest = function () {
                    var url = 'SAnswer/checkAnswers';
                    var data = localStorage.getItem('userAnswers');
                    userSrvc.postInfoForStudent(url, data).then(function (resp) {
                        $scope.testResult = resp.data;
                        for (var i = 0; i < $scope.testResult.length; i++) {
                            for (var j = 0; j < $scope.levelsArr.length; j++) {
                                console.log('$scope.levelsArr[j].id', $scope.levelsArr[j].id)
                                console.log($scope.testResult[i].question_id == $scope.levelsArr[j].id, 'if');
                                if ($scope.testResult[i].question_id == $scope.levelsArr[j].id) {
                                    countResultArr.push({
                                        'id': $scope.testResult[i].question_id,
                                        'level': $scope.levelsArr[j].level,
                                        'rate': $scope.levelsArr[j].rate,
                                        'true': $scope.testResult[i].true
                                    })
                                }
                            }
                        }
                        timeIsOut();
                        console.log('countResultArr', countResultArr)

                        getStudentGrade ()
                    });
                    
                }
                 function getStudentGrade () {
                            var studentRightAns = 0
                            var maxAvilable = 0
                            //var studentGradeArr = []
                            for (var i = 0; i<countResultArr.length; i++){
                                studentRightAns += ((+countResultArr[i].level)*(+countResultArr[i].rate)*(+countResultArr[i].true))
                                maxAvilable += ((+countResultArr[i].level)*(+countResultArr[i].rate))
                            }
                            $scope.finalGrade = studentRightAns/maxAvilable*100
                            console.log('finalGrade', $scope.finalGrade)
                            localStorage.removeItem('levelsArr')
                            localStorage.removeItem('userAnswers')
                            $state.go('user.finalGrade');
                        }
            });
        };
        $scope.beginTest();
    }]);