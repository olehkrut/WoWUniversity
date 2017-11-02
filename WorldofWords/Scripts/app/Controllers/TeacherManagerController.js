/// <reference path="IndexController.js" />
app.controller('TeacherManagerController', ["$scope", function ($scope) {
    $scope.replaseToCourses = function () {
        location.replace('Index#/UserCourses');
    };
    $scope.replaseToWordSuites = function () {
        location.replace('Index#/WordSuites');
    };
    $scope.replaseToWords = function () {
        location.replace('Index#/GlobalDictionary');
    };
    $scope.replaseToGroups = function () {
        location.replace('Index#/Groups');
    };
    if ($scope.$parent.showManagerList) {
        $scope.$parent.showManagersList();
    };
    if ($scope.$parent.showCourseList) {
        $scope.$parent.showCoursesList();
    };
}]);
