testPlayerApp.controller('userQuestionListCtrl', ['$scope', 'userSrvc', '$stateParams', '$state', '$q', '$timeout', '$filter',
    function ($scope, userSrvc, $stateParams, $state, $q, $timeout, $filter) {
        $scope.beginTest = function () {
            var startTestDate;
            var startTestTime;
            if (JSON.parse(localStorage.getItem('finalGrade'))) {
                $scope.finalGrade = (JSON.parse(localStorage.getItem('finalGrade'))).toFixed(2)
            }
            (function () {
                userSrvc.getSavedData().then(function (resp) {
                    var savedTestData = resp.data;
                    var questionArray = resp.data.questionList;
                    $scope.questionList = questionArray;
                    var startTime = resp.data.startTime;
                    var currentTime = new Date(startTime * 1000);
                    startTestDate = $filter('date')(currentTime, 'yyyy-MM-dd');
                    startTestTime = $filter('date')(currentTime, 'hh:mm:ss');
                    var updateTime = function () {
                        userSrvc.timer(savedTestData.startTime, savedTestData.timeForTest).then(function (resp) {
                            $scope.counter = resp
                        })
                    };
                    updateTime();

                    $scope.leftTime = function () {
                        if ($scope.counter === 0) {
                            $scope.finishTest()
                        }
                        $scope.counter--;
                        mytimeout = $timeout($scope.leftTime, 1000);
                    };
                    var mytimeout = $timeout($scope.leftTime, 1000);
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
                        updateTime();
                        userSrvc.nextQuestion(data).then(function (resp) {
                            $scope.question = resp[0].data[0];
                            $scope.answers = resp[1].data;
                            $scope.type = resp[0].data[0].type == '1' ? 'radio' : 'checkbox';
                            if (localStorage.getItem('levelsArr')) {
                                levelsArr = JSON.parse(localStorage.getItem('levelsArr'))
                            }
                            levelsArr.push({id: resp[0].data[0].question_id, level: resp[0].data[0].level});
                            for (var i = 0; i < levelsArr.length; i++) {
                                for (var j = 0; j < savedTestData.rate.length; j++) {
                                    if (levelsArr[i].level == savedTestData.rate[j].level) {
                                        levelsArr[i].rate = savedTestData.rate[j].rate
                                    }
                                }
                            }
                            localStorage.setItem('levelsArr', JSON.stringify(levelsArr));
                            $scope.levelsArr = levelsArr;
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
                        var arr = {};
                        for (var i = 0; i < userAnswers.length; i++) {
                            arr[userAnswers[i]['question_id']] = userAnswers[i];
                        }
                        userAnswers = [];
                        for (var key in arr) {
                            userAnswers.push(arr[key]);
                        }
                        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
                        var quesArrLen = questionArray.length;
                        var nextState = +$stateParams.id + 1;
                        if (nextState <= quesArrLen) {
                            $state.go('user.testPlayer', {id: nextState});
                        } else {
                            $state.go('user.testPlayer', {id: 1});
                        }
                    };
                    var countResultArr = [];
                    $scope.finishTest = function () {
                        userSrvc.finishTest().then(function (resp) {
                            $scope.testResult = resp.data;
                            countResultArr = $scope.testResult.map(function (key, i) {
                                for (var j = 0; j < $scope.levelsArr.length; j++) {
                                    if ($scope.testResult[i].question_id == $scope.levelsArr[j].id) {
                                        $scope.testResult[i].level = $scope.levelsArr[j].level;
                                        $scope.testResult[i].rate = $scope.levelsArr[j].rate;
                                    }
                                }
                                userAnswersIdsArr.push($scope.testResult[i].question_id);
                                return $scope.testResult[i];
                            });
                            getStudentGrade()
                        });
                    };

                    function getStudentGrade() {
                        var studentRightAns = 0;
                        var maxAvilable = 0;
                        var userTrueAnswersArr = [];
                        userSrvc.endTime().then(function (resp) {
                            var time = new Date(resp.data.unix_timestamp * 1000);
                            var endTime = $filter('date')(time, 'h:mm:ss');
                            return endTime
                        }).then(function (endTime) {
                            for (var i = 0; i < countResultArr.length; i++) {
                                studentRightAns += ((+countResultArr[i].level) * (+countResultArr[i].rate) * (+countResultArr[i].true));
                                userTrueAnswersArr.push(countResultArr[i].true)
                            }
                            maxAvilable = savedTestData.maxAvilable;
                            var finalGrade = studentRightAns / maxAvilable * 100;
                            localStorage.setItem('finalGrade', JSON.stringify(finalGrade));
                            var resultStorage = {
                                "student_id": localStorage.userId,
                                "test_id": localStorage.testId,
                                "session_date": startTestDate,
                                "start_time": startTestTime,
                                "end_time": endTime,
                                "result": finalGrade,
                                "questions": $scope.questionList.join('\\/'),
                                "true_answers": userTrueAnswersArr.join('\\/'),
                                "answers": userAnswersIdsArr.join('\\/')
                            };
                            var url = 'result/insertData';
                            var data = resultStorage;
                            userSrvc.postInfoForStudent(url, data);
                            localStorage.removeItem('levelsArr');
                            localStorage.removeItem('userAnswers');
                            $state.go('user.finalGrade');
                        });
                    }
                })
            }());
        };
        $scope.beginTest();
    }]);