app.service('CourseService', ["$q", "HttpRequest", function ($q, HttpRequest) {
    this.getEnrollCourses = function () {
        var deferred = $q.defer();
        HttpRequest.get('/api/Course/StudentCourses', deferred);
        return deferred.promise;
    };

    this.getUserCourses = function () {
        var deferred = $q.defer();
        HttpRequest.get('/api/course/TeacherCourses', deferred);
        return deferred.promise;
    };

    this.getCourse = function (id) {
        var deferred = $q.defer();
        HttpRequest.get('/api/course/' + id, deferred);
        return deferred.promise;
    };

    this.getCourseDetailWithUserId = function (courseId, userId) {
        var deferred = $q.defer();
        HttpRequest.get('/api/course/progress?courseId=' + courseId + '&userId=' + userId, deferred);
        return deferred.promise;
    }

    this.createCourse = function (course) {
        var deferred = $q.defer();
        HttpRequest.post("api/course/createcourse", course, deferred);
        return deferred.promise;
    }

    this.removeCourse = function (courseId) {
        var deferred = $q.defer();
        HttpRequest.delete('/api/course?courseId='+ courseId, deferred);
        return deferred.promise;
    };

    this.editCourse = function (course) {
        var deferred = $q.defer();
        HttpRequest.post("api/course/editcourse", course, deferred);
        return deferred.promise;
    }

}]);