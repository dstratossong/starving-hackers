'use strict';
function sendRequest() {
	var mode = getMode();
	var luisCfg = getLuisConfig();

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
			client.endMicAndRecognition();
		}, 3000);

	} else {
		if (luisCfg) {
			client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createDataClientWithIntent(getLanguage(), getKey(), luisCfg.appid, luisCfg.subid);
		} else {
			client = Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionServiceFactory.createDataClient(mode, getLanguage(), getKey());
		}
		request = new XMLHttpRequest();
		request.open('GET', (mode == Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase) ? "whatstheweatherlike.wav" : "batman.wav", true);
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
	}
	var gottenStr = "";

	client.onFinalResponseReceived = function(response) {
		setText(JSON.stringify(response));
		getSentiment(response[0].lexical);
		gottenStr = response[0].lexical;
		gottenStr = gottenStr.split(" ");
		getFirstStrings();
		
		getBGB();
	}

	client.onIntentReceived = function(response) {
		setText(JSON.stringify(response));
	};

	var apiStr = "http://api.datamuse.com/words";

	function getFirstStrings() {
		console.log(gottenStr[0]);
		$.get(apiStr + "?ml=" + gottenStr[0] + "?max=15", function(data, status) {
			console.log(data);
			console.log(status);
		});
	}

	function getBGB() {
		console.log(gottenStr[1]);
		for ( i = 0; i < gottenStr.length; i++) {
			$.get(apiStr + "?rel_bgb=" + gottenStr[i] + "?max=1", function(data, status) {
				console.log(data);
				console.log(status);
			});
		}
	}

}