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
	
	$scope.options = {};

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
				$scope.options.showText = true;
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
			setText(response[0].lexical);
			getSentiment();
			$scope.reqData = response;
			console.log($scope.reqData);
		}

		client.onFinalResponseReceived = function(response) {
			setText(response[0].lexical);
			getSentiment();
			$scope.reqData = response;
			console.log($scope.reqData);
		}
		client.onIntentReceived = function(response) {
			setText(response[0].lexical);
			$scope.reqData = response;
			console.log($scope.reqData);
		};
	};
}]);

// Replace with Syn: http://thesaurus.altervista.org/thesaurus/v1?word=peace&language=en_US&output=json&key=IjKnZVwcqOdJYHfzW3D7&callback=process