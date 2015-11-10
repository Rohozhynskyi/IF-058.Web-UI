

app.directive('loadfileDrct', function() {
  return {
    restrict: 'E',
    template: '<input type="file" class="button" loadfile-drct="customer.file" onchange="angular.element(this).scope().loadFile(this.files)"/>' +
    '<img id="imageAttachment" ng-src="{{newEntity.attachment}}" ng-show="newEntity.attachment"  alt="" height="200px"/>',
    link:function(scope, element, attrs, ctrl){

      scope.newEntity.attachment = '';
      scope.loadFile = function(files){
        scope.files = files;
        var reader = new FileReader();
        reader.onload = function(e) {
          scope.$apply(function () {
            scope.newEntity.attachment = e.target.result;
          });
          scope.$watch('showingAdd', function (newValue, oldValue) {
            if (newValue == false) {
              console.log(scope.newEntity)
              angular.element(document.querySelector('#imageAttachment'))[0].attributes["src"].value = "";
            }
          })
        };
        reader.readAsDataURL(files[0]);
        scope.$apply(function () {
          scope.newEntity.attachment =''
          console.log(scope.newEntity.attachment)
        });

      }
    }}
})



app.directive('fileModel', function() {
  return {
    restrict: 'E',
    template: '<input type="file" class="button change navbar-btn" onchange="angular.element(this).scope().loadEditedFile(this.files)"/>',
    link:function(scope, element, attrs){
      scope.loadEditedFile = function(files){
        scope.files = files;
        var reader = new FileReader();
        reader.onload = function(e) {
          scope.$apply(function () {
            scope.editedEntity.new_attachment = e.target.result
          });
        };
        reader.readAsDataURL(files[0]);
      }
      scope.closePicture = function () {
        console.log('asdasd')
        scope.editedEntity.new_attachment = ''
        scope.entity.attachment=''
      }
    }}
})

