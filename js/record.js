'use strict';

let log = console.log.bind(console),
    id = val => document.getElementById(val),
    toggle = id('toggle'),
    mic = id('mic'),
    playback = id('playback'),
    recording = false,
    recorder,
    counter = 1,
    chunks,
    stream,
    blob,
    url,
    media = {
      tag: 'audio',
      type: 'audio/ogg',
      ext: '.ogg',
      media: {audio: true}
    };

log('This is only supported in Firefox 25+ or Chrome 47+!!');

toggle.onclick = e => {
  if (stream == null || recorder == null) {
    navigator.mediaDevices.getUserMedia(media.media).then(_stream => {
      stream = _stream;
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
        chunks.push(e.data);
        if (recorder.state == 'inactive') handleAudio();
      }
      log('Successfully gotten stream.');
      toggleRecord();
    }).catch(log);
  } else {
    toggleRecord();
  }
};

function toggleRecord() {
  if (toggle.disabled) return;
  if (recording) {
    toggle.disabled = true;
    recorder.stop();
    stream.getTracks()[0].stop();
    stream = null;
    recording = false;
    mic.className = '';
    toggle.disabled = false;
  } else {
    toggle.disabled = true;
    chunks = [];
    recorder.start();
    recording = true;
    mic.className = 'active';
    toggle.disabled = false;
  }
}

function processAudio() {
  blob = new Blob(chunks, {type: media.type });
  url = URL.createObjectURL(blob);
}

function makeLink() {
  let div = document.createElement('div'),
      br = document.createElement('br'),
      player = document.createElement(media.tag),
      link = document.createElement('a');

  player.controls = true;
  player.src = url;
  link.href = url;
  link.download = `sound${counter++}${media.ext}`;
  link.innerHTML = `${link.download}`;
  div.appendChild(player);
  div.appendChild(br);
  div.appendChild(link);
  playback.appendChild(div);
}

function handleAudio() {
  processAudio();
  makeLink();
  // do other things here!
  //   -- chunks are the buffered audio binaries
  //   -- blob is the combined audio binary
  //   -- url is the accessor to the audio file
  //   -- stream and recorder are invalid here
  //   -- media.type is the mime-type of the blob
  //   -- media.ext is the extension of the file
}
