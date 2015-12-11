app.directive('imageLoad', ['$timeout', '$interval', function ($timeout, $interval) {

	// imageLoad directive link function
	function link ($scope, $element, $attrs, $ctrls) {

	}

	// imageLoad directive controller function
	function imageLoadCtrl ($scope) {
		$scope.studPhoto = {};
		$scope.path = $scope.studPhoto;
	}


	return {
		restrict: 'E',
		template: [
			'<div class="form-group navbar-btn">',
				'<image-label image-src="{{ studPhoto.src }}" image-name="{{ studPhoto.name }}"></image-label>',
				'<image-input pic-src="studPhoto.src" pic-name="studPhoto.name"></image-input>',
				'<div class="progress">',
					'<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">',
						'60%',
					'</div>',
				'</div>',
			'</div>'
			].join('\n'),
		controller: ['$scope', imageLoadCtrl],
		link: link,
		scope: {
			path: '=options',
		}
	};
}]);


app.directive('imageLabel', ['$timeout', '$interval', function ($timeout, $interval) {

	function link ($scope, $element, $attrs, ctrls) {
		var parentCtrl = ctrls[0]
			, img
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

			console.log('here is progress', progress);
			console.log('here is progress', progressBar);
			// console.log('here are attrs', progress.attr());
		// This functionality needs to be here ...
		// ... because of access to parentCtrl methods after onload event



//////////////////////////////////////////////////////////////////////


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
							console.log('percent loaded ', percentLoaded);
							// progress.style.width = percentLoaded + '%';
							// progress.textContent = percentLoaded + '%';
						}
					}
				}






//////////////////////////////////////////////////////////////////////




		function myFileSelect (changeEvent) {

			// Check for the File API in the window object.
			if ($window.File && $window.FileReader && $window.FileList && $window.Blob) {


			// Define fileTarget and fileName after change method (jqLite method)
			fileTarget = changeEvent.target.files[0];
			fileName = fileTarget.name;

			// Define cutted nama of the file and change the value of the button
			$scope.cutName = fileCutName(fileName, -11);
			el.text($scope.cutName); // HERE must be a problem


				reader = new FileReader(); // Creates new FileReaser Object
				reader.onerror = errorHandler;
				reader.onprogress = updateProgress;
				reader.onabort = function(e) {
					alert('File read cancelled');
				};

				reader.onloadstart = function(e) {
					// document.getElementById('progress_bar').className = 'loading';
				};

				reader.onload = function(e) {
					// Ensure that the progress bar displays 100% at the end.


					// My scope apply
					$scope.$apply(function () {
						$scope.pictureSrc = e.target.result;
						$scope.pictureName = $scope.cutName;
					});
					// progress.style.width = '100%';
					// progress.textContent = '100%';

					setTimeout("document.getElementById('progress_bar').className='';", 2000);

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
		},
		require: ['^imageLoad'],
		link: link
	};
}]);
