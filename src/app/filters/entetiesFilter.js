/**
 * Created by ����� on 04.11.2015.
 */
app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
app.filter('testStatus', function() {
  return function(value){
    if (value == 1) {
      return 'доступно';
    } else if (value == 0){
      return 'недоступно'
    } else {
      'вибір не виконано'
    }
  }
});
app.filter('avialibility', function() {
  return function(value){
    if (value == '1') {
      return 'простий вибір';
    } else if (value == '2'){
      return 'мульти вибір'
    } else {
      'вибір не виконано'
    }
  }
});
app.filter('correctAnswer', function() {
  return function(value){
    if (value == '1') {
      return 'так';
    } else if (value == '0'){
      return 'ні'
    } else {
      'вибір не виконано'
    }
  }
});
