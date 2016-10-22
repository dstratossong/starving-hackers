var client;
var request;

function useMic() {
	return document.getElementById("useMic").checked;
}

function getMode() {
	return Microsoft.CognitiveServices.SpeechRecognition.SpeechRecognitionMode.shortPhrase;
}

function getKey() {
	return document.getElementById("key").value;
}

function getLanguage() {
	return "en-us";
}

function clearText() {
	document.getElementById("output").value = "";
	document.getElementbyId("sentiment").value = "";
}

function setText(text) {
	document.getElementById("output").value += text;
}

function getLuisConfig() {
	var appid = document.getElementById("luis_appid").value;
	var subid = document.getElementById("luis_subid").value;

	if (appid.length > 0 && subid.length > 0) {
		return {
			appid : appid,
			subid : subid
		};
	}

	return null;
}

function getSentiment() {
	var text = document.getElementById("output").value.trim();
	var request_url = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

	// open a new request object
	var request = new XMLHttpRequest();
	request.open('POST', request_url, true);

	// set headers
	request.setRequestHeader("Content-Type", "application/json");
	request.setRequestHeader("Ocp-Apim-Subscription-Key", "88148d2194ee4870a6fdfff9ba20807f");

	// set body
	request_json = {
		"documents": [
			{
				"language": "en",
				"id": "1",
				"text": text
			}
		]
	};

	request_body = JSON.stringify(request_json);

	request.responseType = "json";
	request.onload = function() {
		if (request.status !== 200) {
			console.log("failed to get sentiment`");
		} else {
			// on success, update the content of the div just to confirm
			var response = request.response;
			console.log(response);
			var sentiment = response.documents[0].score;
			console.log(sentiment);
		}
	};

	// send the request
	request.send(request_body);
}

function start() {
	var mode = getMode();
	var luisCfg = getLuisConfig();

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
		}, 2000);
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
	};

	client.onFinalResponseReceived = function(response) {
		setText(JSON.stringify(response));
		getSentiment();
	};

	client.onIntentReceived = function(response) {
		setText(JSON.stringify(response));
	};
}
