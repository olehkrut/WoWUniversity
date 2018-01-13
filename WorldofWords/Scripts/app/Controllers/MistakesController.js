app.controller('MistakesController', ["$scope", "$window", "$modal", "$routeParams", "WordSuiteService", "LanguageService", "RecordsService",
    function ($scope, $window, $modal, $routeParams, WordSuiteService, LanguageService, RecordsService) {

        $scope.sort = function (order, property) {
            $scope.wordSuite.WordTranslations.sort(orderBy(property));
            if (!order) {
                $scope.wordSuite.WordTranslations.reverse();
            };
        };

        var language;
        var loadedRecords = [];

        var initialize = function () {
            WordSuiteService.getMistakesWordsFromWordSuite($routeParams.wordSuiteId)
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