app.controller('CourseDetailController', ["$scope", "$window", "$routeParams", "UserService", "CourseService",
    function ($scope, $window, $routeParams, UserService, CourseService) {
        'use strict';
        var initialize = function () {
            localStorage.setItem('courseId', JSON.stringify($routeParams.Id));
            CourseService.getCourseDetailWithUserId($routeParams.Id, UserService.getUserData().id)
                .then(function (response) {
                    $scope.course = response;
                });
        };
        initialize();
    }]);