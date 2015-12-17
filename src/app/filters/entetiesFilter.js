app.filter('unsafe', ['$sce', function ($sce) {
    return $sce.trustAsHtml;
}]);
app.filter("decode", [function () {
    return function (str) {
        var el = document.createElement("div");
        el.innerHTML = str;
        str = el.innerText || el.textContent;
        return str;
    }
}]);
app.filter('testStatus', [function () {
    return function (value) {
        if (value == 1) {
            return 'доступно';
        } else if (value == 0) {
            return 'недоступно'
        } else {
            'вибір не виконано'
        }
    }
}]);
app.filter('avialibility', [function () {
    return function (value) {
        if (value == '1') {
            return 'простий вибір';
        } else if (value == '2') {
            return 'мульти вибір'
        } else {
            'вибір не виконано'
        }
    }
}]);
app.filter('correctAnswer', [function () {
    return function (value) {
        if (value == '1') {
            return 'так';
        } else if (value == '0') {
            return 'ні'
        } else {
            'вибір не виконано'
        }
    }
}]);
app.filter('formatTimer', [function () {
    return function (input) {
        function z(n) {
            return (n < 10 ? '0' : '') + n;
        }

        var seconds = input % 60;
        var minutes = Math.floor(input % 3600 / 60);
        var hours = Math.floor(input / 3600);
        return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
    };
}]);