var client;
var request;

function useMic() {
	return true;
}

function getMode() {
	return Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase;
}

function getKey() {
	return '6c924158d275486ea18d4d3e7038fdd0';
}

function getLanguage() {
	return "en-us";
}

function clearText() {
	document.getElementById("output").value = "";
}

function setText(text) {
	document.getElementById("output").value += text;
}

function getLuisConfig() {
	var appid = '';
	var subid = '';

	if (appid.length > 0 && subid.length > 0) {
		return {
			appid : appid,
			subid : subid
		};
	}

	return null;
}

function start() {
	var mode = getMode();
	var luisCfg = getLuisConfig();
	
	var listenDur = 2000;

	clearText();

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
		}, listenDur);
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
		console.log(JSON.stringify(response));
	}

	client.onFinalResponseReceived = function(response) {
		setText(JSON.stringify(response));
	}

	client.onIntentReceived = function(response) {
		setText(JSON.stringify(response));
	};
}