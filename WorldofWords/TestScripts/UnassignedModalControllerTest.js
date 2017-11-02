// this references are needed to run test using Ghutsbah tool
///// <reference path="../Scripts/angular/angular.min.js" />
///// <reference path="../Scripts/angular/angular-mocks.js" />
///// <reference path="../Scripts/app/app.js" />
///// <reference path="../Scripts/jasmine/jasmine.js" />
///// <reference path="../Scripts/jasmine/jasmine-html.js" />
///// <reference path="../Scripts/app/Controllers/UnassignedModalController.js" />
///// <reference path="../node_modules/karma-jasmine/lib/jasmine.js" />

describe('UnassignedModalController', function () {
    // arrange
    beforeEach(module('MyApp'));
    var scope;
    var controller;
    var modalInstance = {};

    beforeEach(inject(function (_$controller, $rootScope) {
        scope = $rootScope.$new();
        modalInstance = {
            close: jasmine.createSpy('modalInstance.close')
        };

        controller = _$controller('UnassignedModalController', {
            $scope: scope,
            $modalInstance: modalInstance
        });
    }));


    it('modal instance should be closed', function () {
        // act
        scope.actionResult();

        //assert
        expect(modalInstance.close).toHaveBeenCalled();
    });
});