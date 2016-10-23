var C2 = 65.41; // C2 note, in Hz.
var notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];
var test_frequencies = [];
for (var i = 0; i < 30; i++)
{
	var note_frequency = C2 * Math.pow(2, i / 12);
	var note_name = notes[i % 12];
	var note = { "frequency": note_frequency, "name": note_name };
	var just_above = { "frequency": note_frequency * Math.pow(2, 1 / 48), "name": note_name + " (a bit sharp)" };
	var just_below = { "frequency": note_frequency * Math.pow(2, -1 / 48), "name": note_name + " (a bit flat)" };
	test_frequencies = test_frequencies.concat([ just_below, note, just_above ]);
}

var audio;
var correlation_worker = new Worker("correlation_worker.js");
correlation_worker.addEventListener("message", interpret_correlation_result);

function initialize(blob){
	audio=blob;
	use_stream(audio);
}
var audioBuffer;
function use_stream(a){
	
 	 var audio_context = new AudioContext();
 	 audioBuffer = audio_context.createBufferSource();
 	 var xhr = new XMLHttpRequest();
 	xhr.responseType = 'blob'
	var arrayBuffer;
	var fileReader = new FileReader();
	fileReader.onload = function() {
    	arrayBuffer = this.result;
	};
	console.log("dafds" +a)
	fileReader.readAsArrayBuffer(a);
	xhr.onload = function() {
    var audioData = xhr.response;

    audio_context.decodeAudioData(audioData, function(buffer) {
        audioBuffer.buffer = buffer;

        audioBuffer.connect(audio_context.destination);
        audioBuffer.loop = true;
      },

      function(e){"Error with decoding audio data" + e.err});

  }
 	// console.log(audio)
 	window.source = audioBuffer; // Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=934512
 	 var script_processor = audio_context.createScriptProcessor(1024, 1, 1);
 	 script_processor.connect(audio_context.destination);
 	 audioBuffer.connect(script_processor);
 	console.log(audio_context.destination)
	console.log(1)
	var buffer = [];
	var stop = false;
	window.capture_audio = function(event)
	{
		
		if(stop){
			return;
		}
		buffer = buffer.concat(Array.prototype.slice.call(event.inputBuffer.getChannelData(0)));
		console.log(buffer.length)
		if(buffer.length>500){
			stop=true;
			console.log(correlation_worker)
			correlation_worker.postMessage
			(
				{
					"timeseries": buffer,
					"test_frequencies": test_frequencies,
					"sample_rate": audio_context.sampleRate
				}
			);
			console.log(correlation_worker)
			buffer = [];
			setTimeout(function() { stop = false; }, 1000);
		}
		

	};

	script_processor.onaudioprocess = window.capture_audio;
}

function interpret_correlation_result(event)
{
	console.log(3)
	var timeseries = event.data.timeseries;
	var frequency_amplitudes = event.data.frequency_amplitudes;

	// Compute the (squared) magnitudes of the complex amplitudes for each
	// test frequency.
	var magnitudes = frequency_amplitudes.map(function(z) { return z[0] * z[0] + z[1] * z[1]; });

	// Find the maximum in the list of magnitudes.
	var maximum_index = -1;
	var maximum_magnitude = 0;
	for (var i = 0; i < magnitudes.length; i++)
	{
		if (magnitudes[i] <= maximum_magnitude)
			continue;

		maximum_index = i;
		maximum_magnitude = magnitudes[i];
	}

	// Compute the average magnitude. We'll only pay attention to frequencies
	// with magnitudes significantly above average.
	var average = magnitudes.reduce(function(a, b) { return a + b; }, 0) / magnitudes.length;
	var confidence = maximum_magnitude / average;
	var confidence_threshold = 10; // empirical, arbitrary.
	if (confidence > confidence_threshold)
	{
		var dominant_frequency = test_frequencies[maximum_index];
		console.log(dominant_frequency.frequency);
	}
}
