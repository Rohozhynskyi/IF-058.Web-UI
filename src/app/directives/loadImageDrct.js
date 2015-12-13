app.directive('imageLoad', ['$timeout', '$interval', function ($timeout, $interval) {

	// imageLoad directive link function
	function link ($scope, $element, $attrs, $ctrls) {


	}

	// imageLoad directive controller function
	function imageLoadCtrl ($scope) {
		$scope.studPhoto = {};
		// $scope.path = $scope.studPhoto;


		$scope.$watch('path', function (newValue, oldValue, scope) {
			console.log('updated through watcher', $scope.path);

			$scope.studPhoto = newValue;

			console.log('naw yobanui object ', $scope.studPhoto);

///////
/// проблема з об'єктами. студфото і едітінгстудент мають різні поля. тому директива буде працювати по різному з різними операціями або будеть помилки'
//////////////////////
			// if (!(newValue.photo) || (newValue.photo === '')) {
			// 	// some context
			// } else {
			// 	$scope.studPhoto.src = newValue.photo;
			// }

		});




	}


	return {
		restrict: 'E',
		template: [
			'<div class="form-group navbar-btn">',
				'<image-label image-src="{{ studPhoto.src ? studPhoto.src : studPhoto.photo }}" image-name="{{ studPhoto.name ? studPhoto.name : studPhoto.student_name }}"></image-label>',
				'<image-input pic-src="studPhoto.src" pic-name="studPhoto.name" pic-load-text="studPhoto.text" pic-load-num="studPhoto.num"></image-input>',
				'<image-bar load-text="{{ studPhoto.text }}" load-num="{{ studPhoto.num }}"></image-bar>',
			'</div>'
			].join('\n'),
		controller: ['$scope', imageLoadCtrl],
		link: link,
		scope: {
			path: '=options',
		}
	};
}]);


/*
/ __________________________________________________________________________________
/ 
/ IMAGE LABEL
/ __________________________________________________________________________________
/ 
*/
app.directive('imageLabel', ['$timeout', '$interval', function ($timeout, $interval) {

	function link ($scope, $element, $attrs, ctrls) {
		var parentCtrl = ctrls[0]
			, picSrc
			, picName;

		$scope.$watch('[imageSrc, imageName]', changePicturePopover, true);

		function changePicturePopover (newValue, oldValue, scope) {

			// inner variables
			picSrc = newValue[0];
			picName = newValue[1];

			if (picSrc && picName) {
				$($element).popover({
					html: true,
					trigger: 'hover',
					placement: 'right',
					title: function () {
						return '<strong>Фото: </strong>' + picName;
					},
					content: function () {
						return '<img class="img-popover" src="' + picSrc + '" />';
					}
				}); // END jquery element selecting
			} // END if statement
		} // END changePicturePopover

	}// END link function


	return {
		restrict: 'E',
		scope: {
			imageSrc: '@',
			imageName: '@'
		},
		require: ['^imageLoad'],
		template: [
			'<label class="btn btn-default btn-sm" for="photo">',
				'<span class="glyphicon glyphicon-cloud-upload"></span>',
				'<span class="file-name">Виберіть фото студента</span>',
			'</label>'
		].join('\n'),
		link: link
	};

}]);



/*
/ __________________________________________________________________________________
/ 
/ IMAGE BAR
/ __________________________________________________________________________________
/ 
*/
app.directive('imageBar', ['$timeout', '$interval', function ($timeout, $interval) {

	function link ($scope, $element, $attrs, ctrls) {
		var parentCtrl = ctrls[0]
			, loadingText
			, loadingNumber;

		$scope.$watch('[loadText, loadNum]', changeBarMetrics, true);


		function changeBarMetrics (newValue, oldValue, scope) {

			// inner variables
			$scope.loadText = newValue[0];
			$scope.loadNumber = newValue[1];

		} // END changeBarMetrics

	}// END link function


	return {
		restrict: 'E',
		scope: {
			loadText: '@',
			loadNum: '@'
		},
		require: ['^imageLoad'],
		template: [
			'<div class="progress press">',
				'<div class="progress-bar press-bar" role="progressbar" aria-valuenow="{{ loadNum }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ loadNum }}%;">',
					'{{ loadNum }}%',
				'</div>',
			'</div>'
		].join('\n'),
		link: link
	};

}]);


/*
/ __________________________________________________________________________________
/ 
/ IMAGE INPUT
/ __________________________________________________________________________________
/ 
*/
app.directive('imageInput', ['$timeout', '$window', function ($timeout, $window) {

	// Cut file name function
	function fileCutName (str, slength) {
		if (str.length >= 10) {
			return '... ' + str.slice(slength);
		}
		return str;
	}


	function link ($scope, $element, $attrs, ctrls) {

		var parentCtrl = ctrls[0]
			, fileTarget
			, fileName
			, el = $element.parent().find('.file-name')
			, reader
			, progress = $element.parent().find('.progress')
			, progressBar = progress['0'].firstElementChild;

		function abortRead() {
			reader.abort();
		}

		function errorHandler(evt) {
			switch(evt.target.error.code) {
				case evt.target.error.NOT_FOUND_ERR:
					alert('Файл не знайдено!');
					break;
				case evt.target.error.NOT_READABLE_ERR:
					alert('Не вдалося прочитати файл.');
					break;
				case evt.target.error.ABORT_ERR:
					break; // noop
				default:
					alert('Виникла помилка при спробі прочитати файл.');
			};
		}

		function updateProgress(evt) {
			// evt is an ProgressEvent.
			if (evt.lengthComputable) {
				var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
				// Increase the progress bar length.
				if (percentLoaded < 100) {
					$scope.$apply(function () {
						$scope.pictureLoadNum = percentLoaded; // Update scope pictureLoadNum variable
					});
				}
			}
		}


		function myFileSelect (changeEvent) {

			// Check for the File API in the window object.
			if ($window.File && $window.FileReader && $window.FileList && $window.Blob) {

			// Define fileTarget and fileName after change method (jqLite method)
			fileTarget = changeEvent.target.files[0];
			fileName = fileTarget.name;

				reader = new FileReader(); // Creates new FileReaser Object
				reader.onerror = errorHandler;
				reader.onprogress = updateProgress;
				reader.onabort = function(e) {
					alert('Завантаження відмінено. Мабуть розмір файлу більший ніж 2Mb.');
				};

				reader.onloadstart = function(e) {
					if (fileTarget.size > 2000000) {
						abortRead();
						return;
					} else {
						// Define cutted nama of the file and change the value of the button
						$scope.cutName = fileCutName(fileName, -11);
						el.text($scope.cutName); // HERE must be a problem
					}

					progress.css('opacity', 1);
					// document.getElementById('progress_bar').className = 'loading';
				};

				reader.onload = function(e) {

					// My scope apply
					$scope.$apply(function () {
						$scope.pictureSrc = e.target.result;
						$scope.pictureName = $scope.cutName;
						$scope.pictureLoadNum = 100; // Ensure that the progress bar displays 100% at the end.
					});

					// Hide progress bar after loading
					$timeout(function () {
						progress.css('opacity', 0);
					}, 2000);

				};

				reader.readAsDataURL(fileTarget);

			} else {
				$window.alert('File APIs неповністю підтримується в даному браузері.');
			}
		}

		$element.bind('change', myFileSelect); // END element bind

	} // END LINK FUNCTION



	return {
		template: '<input type="file" name="studPhoto" id="photo" class="form-control inputfile" aria-describedby="helpPhoto" tabindex="9" accept="image/*">',
		scope: {
			pictureSrc: '=picSrc',
			pictureName: '=picName',
			pictureLoadText: '=picLoadText',
			pictureLoadNum: '=picLoadNum',
		},
		require: ['^imageLoad'],
		link: link
	};
}]);
