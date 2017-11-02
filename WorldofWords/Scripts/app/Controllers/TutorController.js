app.controller('TutorController', ["$scope", "$window", "$modal", "$routeParams", "TutorService", "PictureService", function ($scope, $window, $modal, 
    $routeParams, TutorService, PictureService) {

    $scope.open = function (url, callback, data) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: url,
            controller: 'ModalController',
            size: 'sm',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(callback);
    };

    $scope.goToCourses = function () {
        $window.location.replace('Index#/CourseDetail/' + JSON.parse(localStorage.getItem('courseId')));
    };

    $scope.isSoundOn = true;

    $scope.turnMusic = function () {
        $scope.isSoundOn = !$scope.isSoundOn;
    }

    $scope.check = function (index) {
        $scope.isCheck = true;
        $scope.classes[$scope.rightNumber] = 'btn btn-success';
        $scope.timeInterval = $window.setTimeout(changeTask, 700);
        if (index !== $scope.rightNumber) {
            $scope.classes[index] = 'btn btn-danger';
            if ($scope.isSoundOn) PlaySound('errorAudio');
        }
        else {
            if ($scope.isSoundOn) PlaySound('rightAudio');
        }
    }

    var randoms = [];
    var buttonCount = 4;

    var getRandomNum = function () {
        var rnd = Math.floor(Math.random() * $scope.words.length);
        if (randoms[rnd] !== true) {
            randoms[rnd] = true;
            return rnd;
        }
        else {
            return getRandomNum();
        }
    };

    var PlaySound = function (audioId) {
        document.getElementById(audioId).play();
    };

    var getRightNumber = function () {
        $scope.rightNumber = Math.floor((Math.random() * buttonCount));
    };

    var getchosenWords = function () {
        for (var i = 0; i < buttonCount; i++) {
            $scope.chosenWords[i] = $scope.words[getRandomNum()];
        }
    };

    var changeTask = function () {
        $scope.isCheck = false;
        randoms = [];
        $scope.chosenWords = [];
        $scope.classes = [
            'btn btn-default',
            'btn btn-default',
            'btn btn-default',
            'btn btn-default'
        ];
        $scope.pictureToShow = null;
        $scope.hideWords = true;
        $scope.rightNumber = 0;
        $window.clearTimeout($scope.timeInterval);
        getchosenWords();
        getRightNumber();
        getPicture();
    }

    $scope.pictureToShow = null;
    $scope.hideWords = true;
    $scope.messege = null;
    var containsPictures = null;

    var getPicture = function () {
        if ($window.location.hash.indexOf('#/TutorPicture') > -1) {
            if (containsPictures === null) {
                TutorService.doesContainAtLeastOnePicture($routeParams.wordSuiteId)
                    .then(function (response) {
                        containsPictures = response;
                        console.log(containsPictures);
                    })
            }
            if (containsPictures) {
                PictureService.getPictureByWordId($scope.chosenWords[$scope.rightNumber].OriginalWordId)
                    .then(function (response) {
                        if (response != null) {
                            $scope.pictureToShow = response.Content;
                            $scope.hideWords = false;
                        } else {
                            changeTask();
                        }
              });
            } else {
                $scope.messege = "Sorry, but this word suit doen't contains pictures!";
            }
        } else {
            $scope.$apply();
        }
    }

    var initialize = function () {
        TutorService.getWords($routeParams.wordSuiteId)
            .then(function (response) {
                $scope.label = response.Name;
                $scope.words = response.WordTranslations;
                if ($scope.words.length < buttonCount) {
                    $scope.open('smallWordSuite', $scope.goToCourses)
                } else {
                    changeTask();
                }
            });
    };

    initialize();
}]);

app.controller('ModalController', ["$scope", "$modalInstance", "data", function ($scope, $modalInstance, data) {
    $scope.data = data;
    $scope.close = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);