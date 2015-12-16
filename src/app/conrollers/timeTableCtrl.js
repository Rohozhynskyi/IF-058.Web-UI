app.controller('timeTableCtrl', ['$scope', '$stateParams', 'entityObj', 'entitiesSrvc', '$interval', function ($scope, $stateParams, entityObj, entitiesSrvc, $interval) {

    $scope.date = null;
    $scope.arrows = {
        year: {
            left: 'img/white_arrow_left.svg',
            right: 'img/white_arrow_right.svg'
        },
        month: {
            left: 'img/grey_arrow_left.svg',
            right: 'img/grey_arrow_right.svg'
        }
    }
    $scope.header = {
        monday: 'Пн',
        tuesday: 'Вт',
        wednesday: 'Ср',
        thursday: 'Чт',
        friday: 'Пт',
        saturday: 'Сб',
        sunday: 'Нд',
    }
/*_________________________________________________
/*
/* GETTING RECORDS BY GROUP ID
/*_________________________________________________
*/
	// Declares Entity parameters for getting records request
	$scope.thisEntity = 'timeTable';
	var	thisEntParent = entityObj[$scope.thisEntity].by.parentEntity
		, idOfParent = $stateParams.id;

	// Getting records request
	entitiesSrvc.getEntitiesForEntity($scope.thisEntity, thisEntParent, idOfParent)
	.then(function (resp) {
		gettingResponseHandler (resp);
	});

	//Getting records request handler
	function gettingResponseHandler (resp) {
		 if (resp.list[0][0] == "record_id" && resp.list[0][1] == "null") {
		  $scope.noData = "Немає записів";
		 } else {
		  $scope.agendaItems = resp;
		}	
	};
/*_________________________________________________
/*
/* ADDING RECORDS BY GROUP AND SUBJECT ID
/*_________________________________________________
*/

	//function shows and hides the form for creating new entity
	$scope.showAddForm = function () {
		if (!$scope.showingAdd) {
			$scope.showingAdd = true;
		} else {
			$scope.showingAdd = false;
			 $scope.resetEntity();
		};
	};

      $scope.addNewTimeTable = function (recordData) {

		// Creating middle object
		recordData = {
			// values
			subject_id : $stateParams.id,
			group_id: recordData.group_id,
			event_date: $scope.date
		};

		// Gives data to a service
		entitiesSrvc.createEntity($scope.thisEntity, recordData)
			.then(function (response) {
				addRespHandler(response, recordData);
			});

		//handing success and error response
		function addRespHandler (resp, recordData) {
			if (resp.data.response === 'ok' && resp.status === 200) {
				$scope.showingAdd = false;
				okAddResponseHandler (resp, recordData);				

			} else if (resp.data.response == 'error 2300') {
				console.log('Помилка: ' + resp.data.response + '. Такі дані вже наявні у базі даних.');
			} else if (resp.data.response === 'Failed to validate array') {
				console.log('Помилка: ' + resp.data.response + '. Будь-ласка, введіть унікальні дані.');
			} else {
				console.log('Помилка: ' + resp.data.response + '. Будь-ласка, зверніться до системного адміністратора');
			}
		}// END addRespHandler

		 function okAddResponseHandler (resp, recordData) {
			recordData.timeTable_id = resp.data.id;
			recordData.group_name = $scope.agendaItems.group[recordData.group_id];
			$scope.agendaItems.list.push(recordData);
		};

	}; // End $scope.addTimeTable

  $scope.activateEntity = function (agendaItems) {
    // angular.element(document.querySelector('#deleteModal')).modal();
    $scope.deletingEntity = agendaItems;
    // if ($event) {
    //   $event.stopPropagation();
    // }
  };

//function removes an entity from array and from server
  $scope.removeEntity = function () {
    var currentEntity = $scope.deletingEntity;
    var currentId = $scope.deletingEntity.timetable_id;

    entitiesSrvc.deleteEntity($scope.thisEntity, currentId).then(function (resp) {
      removingResponseHandler (resp, currentEntity);
    });
  };

  function removingResponseHandler (resp, currentEntity) {
    switch (resp.data.response) {
      case "ok":
        var index = $scope.agendaItems.list.indexOf(currentEntity);
        $scope.agendaItems.list.splice(index, 1);
        if ($scope.agendaItems.length === 0) {
          delete $scope.agendaItems.list;
        };
        break;
      case "error 23000":
        $scope.showInformModal("Неможливо видалити запис. Запис має залежні об'єкти.");
        break;
      default:
        $scope.showInformModal("Помилка видалення запису: " + resp.data.response);
    };
  };

  $scope.showInformModal = function(infMsg) {
  		$scope.infMsg = infMsg;
  		angular.element(document.querySelector('#informModal')).modal();
  	};


}]);