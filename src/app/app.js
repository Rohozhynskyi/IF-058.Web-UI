var app = angular.module('app', ['ui.router', 'testPlayerApp', 'materialDatePicker', 'checklist-model']);
var testPlayerApp = angular.module('testPlayerApp', ['ui.router']);

app.constant("baseUrl", "http://dtapi.local/");
app.value("entityObj", {
  "faculty": {
    faculty_name: "",
    faculty_description: ""
  },
  "speciality": {
    speciality_name: "",
    speciality_code: ""
  },
  "subject": {
    subject_name: "",
    subject_description: ""
  },
  "AdminUser": {
    username: "",
    password: "",
    password_confirm: "",
    email: ""
  },
  "test": {
    test_name: "",
    tasks: "",
    time_for_test: "",
    enabled: "",
    attempts: "",
    by: {
      parentEntity: "subject"
    }
  },
  "question": {
    question_text: '',
    level: '',
    type: '',
    attachment: '',
    by: {
      parentEntity: "test"
    }
  },
  "TestDetail": {
    level: "",
    tasks: "",
    rate: "",
    by: {
      parentEntity: "test"
    }
  },
  "answer": {
    by: {
      parentEntity: "question"
    },
    true_answer: '',
    answer_text: '',
    attachment: ''
  },
  "timeTable": {
    by: {
      parentEntity: "subject"
    },
    group_name: '',
    event_date: ''
  },
  "student": {
    username: "",
    password: "",
    password_confirm: "",
    email: "",
    gradebook_id: "",
    student_surname: "",
    student_name: "",
    student_fname: "",
    group_id: "",
    plain_password: "",
    photo: "",
    by: {
      parentEntity: "group"
    }
  },
  "result": {
    session_id:"",
    student_id:"",
    test_id:"",
    session_date:"",
    start_time:"",
    end_time:"",
    result:"",
    questions:"",
    true_answers:"",
    answers:"",
    by: {

    }
  }

  //... and other entities
});

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider.
    state('login', {
      url: '/',
      templateUrl: 'app/views/login.html',
      controller: 'loginCtrl'
    }).
    state('admin', {
      url: '/admin',
      templateUrl: 'app/views/admin.html',
      controller: 'loginCtrl'
    }).
    state('admin.main', {
      url: '/main',
      templateUrl: 'app/views/main.html',
      controller: 'entitiesCtrl'
    }).
    state('user', {
      url: '/user',
      templateUrl: 'app/views/user.html',
      controller: 'loginCtrl'
    }).
    state('admin.educationInfo', {
      url: '/educationInfo',
      templateUrl: 'app/views/educationInfo.html'
    }).
    state('admin.groups', {
      url: '/groups',
      templateUrl: 'app/views/groupList.html',
      controller: 'groupsCtrl'
    }).
    state('admin.educationInfo.faculties', {
      url: '/faculties',
      templateUrl: 'app/views/facultyList.html',
      controller: 'entitiesCtrl'
    }).
    state('admin.educationInfo.specialities', {
      url: '/specialities',
      templateUrl: 'app/views/specialitiesList.html',
      controller: 'entitiesCtrl'
    }).
    state('admin.subjects', {
      url: '/subjects',
      templateUrl: 'app/views/subjectsList.html',
      controller: 'entitiesCtrl'
    }).
    state('admin.tests', {
      url: '/tests/:id',
      templateUrl: 'app/views/testsList.html',
      controller: 'entitiesCtrl'
    }).
    state('admin.questions', {
      url: '/questions/:id',
      templateUrl: 'app/views/questionsList.html',
      controller: 'entitiesCtrl'
    }).
    state('admin.answers', {
      url: '/answers/:id',
      templateUrl: 'app/views/answersList.html',
      controller: 'entitiesCtrl'
    }).
    state('admin.testDetails', {
      url: '/TestDetail/:id',
      templateUrl: 'app/views/testDetails.html',
      controller: 'entitiesCtrl'
    }).
    state('admin.students', {
          url: '/students/:id',
          templateUrl: 'app/views/studentsList.html',
    }).
    state('admin.timeTable', {
      url: '/timeTable/:id',
      templateUrl: 'app/views/timeTableList.html',
      //controller: 'timeTableCtrl'
    }).
    state('admin.addAdmin', {
      url: '/addAdmin',
      templateUrl: 'app/views/addAdmin.html',
      controller: 'entitiesCtrl'
    }).
    state('admin.resultsByStudent', {
      url: '/resultsByStudent/:id',
      templateUrl: 'app/views/resultsByStudentList.html',
      controller: 'entitiesCtrl'
    }).
    state('user.subjects', {
      url: '/subjects',
      templateUrl: 'app/views/userSubjects.html',
      controller: 'userSubjectListCtrl'
    }).
    state('user.results', {
      url: '/results',
      templateUrl: 'app/views/userResults.html',
      // controller: 'userResultListCtrl',
      // HERE CHANGE SOMETHING
      controller: 'entitiesCtrl'
    }).
    state('user.tests', {
      url: '/tests/:id',
      templateUrl: 'app/views/userTests.html',
      controller: 'userTestListCtrl'
    }).
    state('user.questions', {
      url: '/testDetail/:id',
      templateUrl: 'app/views/userQuestions.html',
      controller: 'prepareToTestCtrl'
    }).
    state('user.testPlayer', {
      url: '/question/:id',
      templateUrl: 'app/views/testPlayer.html',
      controller: 'userQuestionListCtrl'
    }).
    state('user.testResult', {
      url: '/question',
      templateUrl: 'app/views/testResult.html',
      controller: 'userQuestionListCtrl'
    }).
    state('user.finalGrade', {
      url: '/finalGrade',
      templateUrl: 'app/views/userFinalGrade.html',
      controller: 'userQuestionListCtrl'
    });

  $urlRouterProvider.otherwise('/');
}]);
