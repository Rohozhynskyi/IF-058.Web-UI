;
var app = angular.module('app', ['ui.router']);

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
			templateUrl: 'app/views/admin.html'
		}).
		state('admin.main', {
			url: '/main',
			templateUrl: 'app/views/main.html'
		}).
		state('user', {
			url: '/user',
			templateUrl: 'app/views/user.html'
		}).
		state('admin.educationInfo', {
			url: '/educationInfo',
			templateUrl: 'app/views/educationInfo.html'
		}).
		state('admin.educationInfo.groups', {
			url: '/groups',
			templateUrl: 'app/views/groupList.html',
			controller: 'groupsCtrl'
		}).
		state('admin.educationInfo.faculties', {
			url:'/faculties',
			templateUrl: 'app/views/facultyList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.educationInfo.specialities', {
			url:'/specialities',
			templateUrl: 'app/views/specialitiesList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.subjects', {
		url:'/subjects',
			templateUrl: 'app/views/subjectsList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.tests', {
			url:'/tests/:id',
			templateUrl: 'app/views/testsList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.questions', {
			url:'/questions/:id',
			templateUrl: 'app/views/questionsList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.answers', {
			url:'/answers/:id',
			templateUrl: 'app/views/answersList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.testDetails', {
			url:'/TestDetail/:id',
			templateUrl: 'app/views/testDetails.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.usersTabs', {
			url: '/usersTabs',
			templateUrl: 'app/views/usersTabs.html'
		}).
		state('admin.usersTabs.students', {
			url:'/students',
			templateUrl: 'app/views/studentsList.html'
		}).
		state('admin.addStudent', {
			url:'/students/addStudent',
			templateUrl: 'app/views/addStudentRecord.html'
		}).
		state('admin.timeTable', {
			url:'/timeTable/:id',
			templateUrl: 'app/views/timeTableList.html',
			controller: 'entitiesCtrl'
		}).
		state('admin.usersTabs.addAdmin', {
			url: '/addAdmin',
			templateUrl: 'app/views/addAdmin.html',
			controller: 'entitiesCtrl'
	});

		$urlRouterProvider.otherwise('/');
}]);
