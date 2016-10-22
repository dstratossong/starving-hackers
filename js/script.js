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
