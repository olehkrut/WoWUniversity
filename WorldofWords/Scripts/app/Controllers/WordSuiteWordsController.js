app.controller('WordSuiteWordsController',["$scope", "$window", "$modal", "$routeParams", "WordSuiteService", "LanguageService","RecordsService",
    function ($scope, $window, $modal, $routeParams, WordSuiteService, LanguageService, RecordsService) {

    $scope.PdfWords = function () {
        $window.open("../api/wordsuite/pdfwords?id=" + $scope.wordSuite.Id);
    }

    $scope.PdfTask = function () {
        $window.open("../api/wordsuite/pdftask?id=" + $scope.wordSuite.Id);
    }

    $scope.openAddWordTranslationModal = function () {
        var modalInstance = $modal.open({
            templateUrl: 'addWordTranslationModal',
            controller: 'AddWordTranslationsModalController',
            size: 'lg',
            resolve: {
                id: function () {
                    return $scope.wordSuite.Id;
                },
                languageId: function () {
                    return $scope.wordSuite.LanguageId;
                },
                existingWordTranslations: function () {
                    return $scope.wordSuite.WordTranslations;
                }
            }
        });

        modalInstance.result.then(function (success) {
            if (success) {
                initialize();
            }
        });
    }

    $scope.listen = function (word) {
        if ('speechSynthesis' in window && language) {
            var speech = new SpeechSynthesisUtterance(word);
            speech.lang = language;
            window.speechSynthesis.speak(speech);
            console.log(word);
        }
    }

    $scope.remove = function (index) {
        var modalInstance = $modal.open({
            templateUrl: 'confirmModal',
            controller: 'ConfirmModalController',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                titleText: function () {
                    return 'Delete Word Translation';
                },
                bodyText: function () {
                    return 'Are you sure you want to delete this Word Translation?';
                }
            }
        });

        modalInstance.result.then(function (answer) {
            if (answer) {
                WordSuiteService
                    .removeWordProgress({
                    WordSuiteId: $scope.wordSuite.Id,
                    WordTranslationId: $scope.wordSuite.WordTranslations[index].Id
                })
                .then(function (ok) {
                    initialize();
                },
                function (badRequest) {
                    console.log('fail');
                });
            }
        });
    }

    $scope.sort = function (order, property) {
        $scope.wordSuite.WordTranslations.sort(orderBy(property));
        if (!order) {
            $scope.wordSuite.WordTranslations.reverse();
        };
    };

    var language;
    var loadedRecords = [];
   
    var initialize = function () {
        WordSuiteService.getWordsFromWordSuite($routeParams.wordSuiteId)
        .then(function (response) {
            $scope.wordSuite = response;
            getLanguageCode($scope.wordSuite.LanguageId);

            $scope.records = new Array($scope.wordSuite.WordTranslations.length);
            for (var i = 0; i < $scope.records.length; i++) {
                $scope.records[i] = [];
            }
        });
    };

    var getLanguageCode = function (languageId) {
        LanguageService.getAllLanguages()
        .then(function (languages) {
            var languageName;
            for (var i = 0; i < languages.length; i++) {
                if (languages[i].Id === languageId) {
                    languageName = languages[i].Name;
                    break;
                }
            }
            if (languageName) {
                switch (languageName) {
                    case 'English':
                        language = 'en-US';
                        break;
                    case 'German':
                        language = 'de-DE';
                        break;
                    case 'French':
                        language = 'fr-FR';
                        break;
                }
            }
        });
    }

    var orderBy = function (property) {
        return function (a, b) {
            return (String(a[property]).toLowerCase() < String(b[property]).toLowerCase()) ?
                -1 : (String(a[property]).toLowerCase() > String(b[property]).toLowerCase()) ? 1 : 0;
        }
    };

    var getRecordsForWords = function () {
        var total = $scope.wordSuite.WordTranslations.length;
        for (var i = 0; i < total; i++) {
            RecordsService.getRecordByWordId($scope.wordSuite.WordTranslations[i].OriginalWordId)
                .then(function (responce) {
                    $scope.records.push(responce ? { wordId: responce.WordId, Content: responce.Content } : null);
                });
        };
    }

    $scope.getSound = function (id, index) {
        console.log('pressed');
        RecordsService.getRecordByWordId(id)
            .then(function (responce) {
                $scope.records[index] = responce.Content;
            });
    }

    $scope.getRecord = function (id, index) {
        if (loadedRecords.indexOf(id) === -1) {
            RecordsService.getRecordByWordId(id)
            .then(function (responce) {
                $scope.records[index] = responce.Content;
                loadedRecords.push(responce.WordId);
            });
        }
    }

    initialize();
}]);