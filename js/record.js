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
        if (recorder.state == 'inactive') makeLink();
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

function makeLink() {
  let blob = new Blob(chunks, {type: media.type }),
      url = URL.createObjectURL(blob),
      div = document.createElement('div'),
      br = document.createElement('br'),
      player = document.createElement(media.tag),
      link = document.createElement('a');

  player.controls = true;
  player.src = url;
  link.href = url;
  link.download = `sound${counter++}${media.ext}`;
  link.innerHTML = `download ${link.download}`;
  div.appendChild(player);
  div.appendChild(br);
  div.appendChild(link);
  playback.appendChild(div);
}
