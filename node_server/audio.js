var context = new AudioContext();
var audioBuffers = [];
var bufferSourceNodes = [];
var gainNodes = [];
var jsonData;

audioFiles = ["sound1", "sound2", "sound3", "sound4"];

// function that reads json file 
function loadJson() {
  fetch('data.json')
    .then((response) => response.json())
    .then((json) => console.log(json.sounds));
}

// functiion that gehts server respons from freesound.org and returns preview url
function getSoundUrl() { 
  fetch('https://freesound.org/apiv2/search/text/?query=dog/')
    .then((response) => response.json())
    .then((json) => console.log(json));
}

// https://freesound.org/apiv2/sounds/<soundId>/?token=U9mJwlmAi3dbEvWYtkJaKe4GgY1Sl09KsiO5iC7b


// function that loads audio buffer data from web in the audioBuffers array
function loadWebSound(url, i) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function () {
    context.decodeAudioData(request.response, function (buffer) {
      audioBuffers[i] = buffer;});
  }
  request.send();
}

// connects an buffer from the audioBuffers array to a gain node and then to the destination, 
// plays the sound at the given time
function playSoundAtTime(i, time) {
  bufferSourceNodes[i] = context.createBufferSource();
  bufferSourceNodes[i].buffer = audioBuffers[i];
  if (typeof gainNodes[i] == 'undefined') {
    gainNodes[i] = context.createGain();
    gainNodes[i].gain.value = 0.5;
  }
  bufferSourceNodes[i].connect(gainNodes[i]);
  gainNodes[i].connect(context.destination);
  bufferSourceNodes[i].start(context.currentTime + time);
}

//create div elements with audio control elements attaches event listeners to sliders
function createAudioDiv(audioFiles) {
  let parentDiv = document.getElementById("audioElementsFrame");
  let heading = document.createElement("h1")
  heading.textContent = "Audio Mixer"
  parentDiv.appendChild(heading)

  for (let i = 0; i < audioFiles.length; i++) {
    let channel = document.createElement("div")
    channel.setAttribute("class", "channel")
    channel.setAttribute("id", `channel${i}`)
    channel.innerHTML = returnAudioElement(audioFiles[i], i)
    parentDiv.appendChild(channel)
    document.querySelector("#volumeSlider" + i).addEventListener("input", function (e) {
      changeParameter(e, i)
    });
  }
}
// event handler for all sliders
function changeParameter(e, i) {
  switch (e.target.id) {
    case "volumeSlider" + i:
      document.querySelector("#volumeOutput" + i).innerHTML = (e.target.value / 100);
      gainNodes[i].gain.value = e.target.value / 100;

      break;
    case "detuneSlider":
      filter.detune.value = (this.value);
      document.querySelector("#detuneOutput").innerHTML = (this.value) + " cents";
      break;
  }
}
// function that returns html for audio control elements
function returnAudioElement(name, channel) {
  return `
  <div>
  <label for="name">${name}</label>
  </div>
    <div>
    <label for="volume">Volume</label>
    <input class="slider" type="range" id="volumeSlider${channel}" name="volume" min="0" max="100" value="50">
    <span id="volumeOutput${channel}" class="output"> 0.5 </span>
    </div>

  `
}
// play button for testing
document.querySelector("#playPauseButton").addEventListener("click", function (e) {
  playSoundAtTime(0, 0);
  playSoundAtTime(1, 1);
  playSoundAtTime(2, 2);
  playSoundAtTime(3, 3);
  playSoundAtTime(0, 4);
});
// for testing
loadWebSound("https://cdn.freesound.org/previews/316/316920_4921277-lq.mp3", 0)
loadWebSound("https://cdn.freesound.org/previews/316/316920_4921277-lq.mp3", 1)
loadWebSound("https://cdn.freesound.org/previews/316/316920_4921277-lq.mp3", 2)
loadWebSound("https://cdn.freesound.org/previews/316/316920_4921277-lq.mp3", 3)

createAudioDiv(audioFiles);
loadJson();
getSoundUrl();
console.log(jsonData);