app.controller('RecorderController', ['$scope', '$window', '$timeout', '$interval','RecorderService', 'ConstService', 'toastr',
    function ($scope, $window, $timeout, $interval, RecorderService, ConstService, toastr) {
    var initialize = function () {
        $window.URL = $window.URL || $window.webkitURL;
        $window.AudioContext = $window.AudioContext || $window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
       
        $scope.isRecording = false;
        $scope.isPlaying = false;
        $scope.canBePlayed = false;
        $scope.canBeDeleted = true;
        $scope.recordButtonClass = 'btn btn-default';
        $scope.playButtonClass = 'btn btn-default';
        $scope.recordProgressBarClass = 'progress hideable';
        $scope.recordProgressBarState = 0;
        $scope.playProgressBarClass = 'progress hideable';
        $scope.disableComment = true;
        $scope.playProgressBarState = 0;
        $scope.submitButtonClass = 'btn btn-default no-margin-left no-margin-right pull-right';
        $scope.submit = false;

        $scope.currentTime = 0;
        $scope.totalTime = 0;
    }

    var recorderIsInitialized = false;
    var cancelPromise;
    var output = {
        Content: [],
        Description: '',
        WordId: 0
    };
    
    var onFailConnectionToMicrophone = function (e) {
        toastr.error(ConstService.unableToConnectToMicrophone);
        $scope.recordButtonPressed();
    }

    var onSuccessConnectionToMicrophone = function (source) {
        var context = new AudioContext()
        var mediaStreamSource = context.createMediaStreamSource(source);
        RecorderService.initializeSource(mediaStreamSource);
        recorderIsInitialized = true;
        startRecording();
    }

    function initRecorder() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ audio: true },
                onSuccessConnectionToMicrophone,
                onFailConnectionToMicrophone);
        } else {
            toastr.error(ConstService.unableToConnectToMicrophone);
        }
    }

    var resetProgressBars = function (resolver) {
        switch (resolver) {
            case 'record':
                $scope.recordProgressBarState = 0.25;
                $scope.currentTime = 1;
                $scope.totalTime = 4;
                break;
            case 'play':
                $scope.playProgressBarState = 0;
                $scope.currentTime = 0;
                $scope.totalTime = Math.round(RecorderService.getTotalTime());
                if ($scope.totalTime === 0) { $scope.totalTime = 1; }
                break;
        }
    }

    var startRecording = function () {
        RecorderService.record();
        $timeout(stopRecording, 4000);
    }

    var stopRecording = function () {
            $scope.recordButtonClass = 'btn  btn-primary';
            $scope.recordProgressBarClass = 'progress hideable';
            $scope.canBePlayed = true;
            $scope.isRecording = false;
            $scope.disableComment = false;
            RecorderService.stop();
        resetProgressBars('play');
    }

    var playRecord = function () {
        RecorderService.play();
        resetProgressBars('play');
        $interval(trackTime, 1000, $scope.totalTime);
    }

    var stopPlayingRecord = function () {
        RecorderService.stopPlaying();
    }

    var deleteRecord = function () {
        RecorderService.deleteRecord();
    }

    var trackTime = function () {
        if ($scope.playProgressBarState < 1) {
            $scope.currentTime++;
            $scope.playProgressBarState = ($scope.currentTime / $scope.totalTime) <= 1 ? ($scope.currentTime / $scope.totalTime) : 1;

        } else {
            $scope.playButtonClass = 'btn btn-default';
        }
    }

    $scope.recordButtonPressed = function () {
        $scope.isRecording = !$scope.isRecording;
        if ($scope.isRecording) {
            $scope.recordButtonClass = 'btn btn-danger active';
            $scope.recordProgressBarClass = 'progress hideable expand';
            resetProgressBars('record');
            if (!recorderIsInitialized) {
                initRecorder();
            } else {
                startRecording();
            }

            $interval(function () {
                $scope.currentTime++;
                $scope.recordProgressBarState = $scope.currentTime / $scope.totalTime;
            }, 1000, 5);
        } else {
            stopRecording();
        }
    }

    $scope.playButtonPressed = function () {
        $scope.isPlaying = !$scope.isPlaying;
        $scope.canBeDeleted = !$scope.canBeDeleted;
        if ($scope.isPlaying) {
            resetProgressBars('play');
            $scope.playButtonClass = 'btn btn-primary active';
            $scope.playProgressBarClass = 'progress hideable expand';
            $scope.commentAreaClass = 'form-control comment pull-right trim';
            $scope.canBeDeleted = false;
            playRecord();
        } else {
            $scope.stopButtonPressed();
        }
    }

    $scope.stopButtonPressed = function () {
        $scope.isPlaying = false;
        $scope.playButtonClass = 'btn btn-default';
        $scope.playProgressBarClass = 'progress hideable';
        $scope.commentAreaClass = 'form-control comment pull-right';
        $scope.canBeDeleted = true;
        resetProgressBars('play');
        stopPlayingRecord();
    }

    $scope.deleteButtonPressed = function () {
        deleteRecord();
        $scope.canBePlayed = false;
        $scope.recordButtonClass = 'btn btn-default';
        $scope.disableComment = true;
    }

    //Added from last review
    $scope.submitButtonPressed = function () {
        $scope.submit = !$scope.submit;
        if ($scope.submit) {
            $scope.submitButtonClass = 'btn btn-success no-margin-left no-margin-right pull-right';
            $scope.tickColor = '#fff';
            RecorderService.fillRecord(output);
            $scope.input[0] = output;
            $scope.input[0].Description = $scope.recordDescription;
            toastr.success("Record submited");
        } else {
            $scope.submitButtonClass = 'btn btn-default no-margin-left no-margin-right pull-right';
            $scope.tickColor = '#41be47';
        }
    }

    initialize();
}]);