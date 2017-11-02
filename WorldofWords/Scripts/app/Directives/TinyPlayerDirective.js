app.directive('tinyPlayer', [
    function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: "=data"
            },
            templateUrl: '../Views/TinyPlayerView.html',
            controller: 'TinyPlayerController'
        }
    }
]);