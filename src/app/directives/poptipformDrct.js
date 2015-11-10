app.directive('poptip', [function () {
	return {
		restrict: 'A',
		scope: {},
		link: function (scope, element, attrs) {
			if (attrs.toggle != 'tooltip') { return; }
			$(element).tooltip({
				// container: 'body',
				trigger: 'hover',
			});
		}
	};
}]);