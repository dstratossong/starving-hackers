'use strict';

var recognitionURL = 'https://speech.platform.bing.com/recognize';
var sentimentURL = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';

function azureRecognize(blob) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  // Listen to the upload progress.
  var progressBar = document.querySelector('progress');
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      progressBar.value = (e.loaded / e.total) * 100;
      progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
    }
  };

  xhr.send(blob);
}

upload(new Blob(['hello world'], {type: 'text/plain'}));
