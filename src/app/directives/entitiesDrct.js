;
app.directive('entitiesDrct', ['entitiesSrvc', function(entitiesSrvc){
  return {
    transclude: true,
    template: "<div>" +
                  "<get-entities-drct></get-entities-drct>" +
                  "<add-entities-drct></add-entities-drct>" +
                  "<edit-entities-drct></edit-entities-drct>" +
                  "<remove-entities-drct></remove-entities-drct>" +
                  "<ng-transclude></ng-transclude>" +
              "</div>",
    link: function (scope, element, attrs) {
              scope.thisEntity = attrs.entitiesDrct;
              scope.getEntityList();
          }
  };
}])


