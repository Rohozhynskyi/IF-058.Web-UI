app.directive('fileread', [function () {

	// Cut file name
	function fileCutName (str, slength) {
			if (str.length >= 10) {
				return '... ' + str.slice(slength);
			}
		return str;
	}

	return {
		scope: {
			fileread: '=',
			getstr: '&'
		},
		link: function (scope, element, attributes) {
			element.bind("change", function (changeEvent) {

				// Gets file name and cut it
				var fileName = changeEvent.target.files[0].name;
				scope.cutName = fileCutName(fileName, -11);

				// var el = element.hadClass('.file-name');
				var el = element.parent().find('.file-name');
				el.text(scope.cutName);

				var reader = new FileReader();
				reader.onload = function (loadEvent) {

					scope.$apply(function () {
						//string base64 encoded
						scope.fileread = loadEvent.target.result;
					});
				}
				reader.readAsDataURL(changeEvent.target.files[0]);
			}); // END BIND
		} // END LINK FUNCTION
	};
}]);

//EXPERIMENTAL!
//DO NOT USE IN YOUR APP!
app.directive('toggl', [function () {
	return {
		restrict: 'A',
		scope: {},
		link: function (scope, element, attrs) {
			if (!attrs.toggle == 'popover') { return; }
			$(element).popover({
				html: true,
				trigger: 'hover',
				placement: 'top',
				title: 'SOME INFO',
				content: function () {
					// return '<img src="HALLO" />';
				}
			});
		}
	};
}]);
