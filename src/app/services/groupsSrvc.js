app.factory('groupsSrvc', ['$http',  function($http){
	var group = {};
	var URL = 'http://dtapi.local/group/';

// одна група 
	group.getGroup = function(id) {
		return $http.get(URL + 'getRecords/' + id)
			.then(function(response) {
					result = response.data;
					return result;
				}, function() {console.error('Error')});
	},

// список груп
 	group.getGroups = function() {
		var all_response = {};

		return $http.get(URL + 'getRecords')
		.then(function(response) {
			all_response.groups = response.data;
			return $http.get('http://dtapi.local/faculty/getRecords');
		}, null)
		.then(function(response) {
			all_response.faculty = response.data;
			return all_response;
		}, null)
		.then(function(response) {
			var facultyArray = [];
			var data_group = response.groups;
			var faculty = response.faculty;
			
			for (row in faculty) {
				facultyArray[+faculty[row].faculty_id] = faculty[row].faculty_name;
			}
			for (row in data_group) {
			 	var id = parseInt(data_group[row].faculty_id);
			 	data_group[row].faculty_name = facultyArray[id];
			};
			return data_group;
		});
	},
// запис
	group.setGroup = function(data) {
		return $http.post(URL + 'update/2', data)
		.then(function(response) {
			return response.data.response;
		});
	},

// видалення
	group.delGroup = function(id) {
		return $http({
			method:'DELETE',
			url: URL +'del/' + id
		})
		.then(function(response) {
			return response.data.response;
		});
	},
// створення
	group.createGroup = function(data) {
		return $http.post(URL + 'insertData', data)
		.then(function(response) {
			return response.data.response;
		});
	}

	
	return group;

//спрацьовує через раз
	// group.getGroups = function() {
	// 	return Promise.all([
	// 		$http.get(URL + 'getRecords'),
	// 		$http.get('http://dtapi.local/faculty/getRecords')
	// 	])
	// 	.then(function(response) {
	// 			var facultyArray = [];
	// 			var data_group = response[0].data;
	// 			var faculty = response[1].data;
	// 			for (row in faculty) {
	// 				facultyArray[+faculty[row].faculty_id] = faculty[row].faculty_name;
	// 			}
	// 			for (row in data_group) {
	// 			 	var id = parseInt(data_group[row].faculty_id);
	// 			 	data_group[row].faculty_name = facultyArray[id];
	// 			};
	// 		return data_group;
	// 	}, function() {console.error('Error')})

	// }


}]);