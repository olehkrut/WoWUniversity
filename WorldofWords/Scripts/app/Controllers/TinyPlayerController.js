app.controller('TinyPlayerController', ['$scope', 'TinyPlayerService', function ($scope, TinyPlayerService) {
    var initialize = function () {
        var togo = [];
        togo.push(new Float32Array($scope.data));
        togo.push(new Float32Array($scope.data));
        TinyPlayerService.initializeRecord(togo);

        $scope.buttonClass = "btn btn-default";
        $scope.buttonStyle = "padding: 2px 10px";
    };

    $scope.playButtonPressed = function () {
        TinyPlayerService.play();
    };

    initialize();
}]);