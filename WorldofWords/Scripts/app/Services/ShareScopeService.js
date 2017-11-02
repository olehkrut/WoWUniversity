app.service('ShareScopeService', function ($rootScope) {
    var service = {};
    service.data = false;
    service.record = false;
    service.sendWordId = function (data) {
        this.data = data;
        $rootScope.$broadcast('data_shared');
    };
    service.getWordId = function () {
        return this.data;
    };
    return service;
});