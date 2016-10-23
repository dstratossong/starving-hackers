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
	var appid = "";
	var subid = "";

	if (appid.length > 0 && subid.length > 0) {
		return {
			appid : appid,
			subid : subid
		};
	}

	return null;
}

function getSentiment(input) {
	// var text = document.getElementById("output").value.trim();
	var request_url = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

	// open a new request object
	var request = new XMLHttpRequest();
	request.open('POST', request_url, true);

	// set headers
	request.setRequestHeader("Content-Type", "application/json");
	request.setRequestHeader("Ocp-Apim-Subscription-Key", "88148d2194ee4870a6fdfff9ba20807f");

	// set body
	request_json = {
		"documents" : [{
			"language" : "en",
			"id" : "1",
			"text" : input
		}]
	};

	request_body = JSON.stringify(request_json);

	request.responseType = "json";
	request.onload = function() {
		if (request.status !== 200) {
			console.log("failed to get sentiment`");
			return null;
		} else {
			// on success, run the music loop
			var response = request.response;
			var sentiment = response.documents[0].score;
			console.log(sentiment);
			return sentiment;
		}
	};

	// send the request
	request.send(request_body);
}