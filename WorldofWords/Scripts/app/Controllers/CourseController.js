app.controller('CourseController', ["$modal", "$scope", "$window", "CourseService", "UserService",
    function ($modal, $scope, $window, CourseService, UserService) {
        var initialize = function () {
            $scope.topCount = 5;
            if (UserService.getUserData())
                CourseService.getEnrollCourses()
                    .then(function (response) {
                        $scope.enrollCourses = response;
                        if (!response.length) {
                            location.replace('Index#/UnassignedModal');
                        };
                    });
        };

        initialize();
    }]);