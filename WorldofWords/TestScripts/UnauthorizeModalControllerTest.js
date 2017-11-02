///// <reference path="..\Scripts\angular\angular.min.js" />
///// <reference path="..\Scripts\angular\angular-mocks.js" />
///// <reference path="..\Scripts\app\app.js" />
///// <reference path="..\Scripts\jasmine\jasmine.js" />
///// <reference path="..\Scripts\jasmine\jasmine-html.js" />
///// <reference path="..\Scripts\app\Controllers\UnauthorizeModalController.js" />
///// <reference path="../node_modules/karma-jasmine/lib/jasmine.js" />

describe('UnauthorizeModalController', function () {

    // arrange
    beforeEach(module('MyApp'));

    var scope,
        controller,
        modalInstance = {},
        rootScope,
        modal,
        ConstServiceJasmine = {};

    beforeEach(angular.mock.inject(function($controller, $rootScope,$ingector){
        scope = $rootScope.$new();
        rootScope = $rootScope;
        modalInstance = {
            close : jasmine.createSpy('modalInstance.close'),
        };


        // Object.create - це спосіб створити новий об'єкт використовуючи наслідування ) Переданий у нього об'єкт сетається, як прототип новоствореного) Створюється ланцюг прототипів )
        // Можна використовувати для розширення об'єкту ) У даному випадку це альтернативний до new спосіб створення об'єкту )
        // Чи я правильно це зрозумів ? Бо я перечитав десь 10 статтей по тому і всюди пишуть трохи по різному )
        ConstServiceJasmine = Object.create($ingector.get("ConstService"));
        modal = {
            open: jasmine.createSpy('modal.open'),
        };

        controller = $controller('UnauthorizeModalController', {
            $scope: scope,
            $modalInstanse: modalInstance,
            $rootScope: rootScope
        });

    }));

    describe('scope.loginButton', function () {
        
        it('login button test', function () {
            // act
            scope.loginButton();
            expect(rootScope.isPrivete).toBe(true);
            expect(modal.open).toHaveBeenCalled();
        });
   });

    describe('scope.registerButton', function () {
        it('register button test', function () {
            // act     
            scope.registerButton();

            //assert
            expect(rootScope.isPrivete).toBe(true);
            expect(modal.open).toHaveBeenCalled();
        });
    });

    describe('scope.closeModal', function () {
        it('modal to be closed', function () {
            // act     
            scope.closeModal();

            //assert
            expect(modalInstance.close).toHaveBeenCalled();
        });
    });
});