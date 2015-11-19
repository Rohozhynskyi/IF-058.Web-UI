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
			'<div class="form-group">',
				'<image-label image-src="{{ studPhoto.src }}" image-name="{{ studPhoto.name }}"></image-label>',
				'<image-input pic-src="studPhoto.src" pic-name="studPhoto.name"></image-input>',
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
					placement: 'top',
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
				'<span class="file-name">Choose Student\'s Photo</span>',
			'</label>'
		].join('\n'),
		link: link
	};

}]);





app.directive('imageInput', ['$timeout', function ($timeout) {

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
			, reader;
		// This functionality needs to be here ...
		// ... because of access to parentCtrl methods after onload event
		$element.bind('change', function (changeEvent) {

			// Define fileTarget and fileName after change method (jqLite method)
			fileTarget = changeEvent.target.files[0];
			fileName = fileTarget.name;

			// Define cutted nama of the file and change the value of the button 
			$scope.cutName = fileCutName(fileName, -11);
			el.text($scope.cutName); // HERE must be a problem

			reader = new FileReader();
			reader.onload = function (loadEvent) {
				$scope.$apply(function () {
					$scope.pictureSrc = loadEvent.target.result;
					$scope.pictureName = $scope.cutName;
				});
			};
			reader.readAsDataURL(fileTarget);
		}); // END element bind


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
