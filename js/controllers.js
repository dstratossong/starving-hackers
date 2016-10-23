var mainControllers = angular.module('mainControllers', ['ngStorage']);

mainControllers.controller('MainController', ['$rootScope', '$scope', '$http', '$localStorage', '$timeout', '$interval',
function($rootScope, $scope, $http, $localStorage, $timeout, $interval) {

	// To store the string from user input
	$scope.dataField = '';
	$scope.listBtnText = 'Add';
	$scope.$storage = $localStorage.$default({
		guestsList : $scope.guests
	});

	$scope.hide_logo = false;

	// function to set the default data
	$scope.reset = function() {

		$scope.hey = "Hey" + (numb++);
	};
	var numb = 0;
	$scope.hey = "___";

	$scope.$storage.x = '';

	$scope.start = function() {
		var mode = getMode();
		var luisCfg = getLuisConfig();

		var listenDur = 5000;

		if (useMic()) {
			if (luisCfg) {
				client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClientWithIntent(getLanguage(), getKey(), luisCfg.appid, luisCfg.subid);
				console.log("using 1");
			} else {
				client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(mode, getLanguage(), getKey());
				console.log("using 2 " + mode);
			}
			client.startMicAndRecognition();
			setTimeout(function() {
				$scope.cgColor = !$scope.cgColor;
				client.endMicAndRecognition();
			}, listenDur);
		} else {
			if (luisCfg) {
				client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createDataClientWithIntent(getLanguage(), getKey(), luisCfg.appid, luisCfg.subid);
			} else {
				client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createDataClient(mode, getLanguage(), getKey());
			}
			request = new XMLHttpRequest();
			request.open('GET', (mode == Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase) ? "sounds/amy.wav" : "batman.wav", true);
			request.responseType = 'arraybuffer';
			request.onload = function() {
				if (request.status !== 200) {
					setText("unable to receive audio file");
				} else {
					client.sendAudio(request.response, request.response.length);
				}
			};
			request.send();
		}

		client.onPartialResponseReceived = function(response) {
			setText(JSON.stringify(response));
			console.log(JSON.stringify(response));
		};

		client.onFinalResponseReceived = function(response) {
			setText(response[0].lexical);
			loop(getSentiment(response[0].lexical));
		};

		client.onIntentReceived = function(response) {
			setText(JSON.stringify(response));
		};
	};
}]);
