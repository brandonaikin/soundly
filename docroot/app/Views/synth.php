<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>
      Soundly!
    </title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/app.css">
    <style type="text/css">
    .container {
      overflow-x: scroll;
      overflow-y: hidden;
      width: 660px;
      height: 110px;
      white-space: nowrap;
      margin: 10px;
    }

    body {
      background:black;
      color:white;
    }
    div#controls {
      margin-left:80px;
    }
    div#controls div{
      height:40px;
    }
    div#controls select, div#controls input {
      float:right;
      clear:both;
    }

    .settingsBar {
      padding-top: 8px;
      font: 14px "Open Sans", "Lucida Grande", "Arial", sans-serif;
      position: relative;
      vertical-align: middle;
      width: 100%;
      height: 30px;
    }

    .left {
      width: 50%;
      position: absolute;
      left: 0;
      display: table-cell;
      vertical-align: middle;
    }

    .left span, .left input {
      vertical-align: middle;
    }

    .right {
      width: 50%;
      position: absolute;
      right: 0;
      display: table-cell;
      vertical-align: middle;
    }

    .right span {
      vertical-align: middle;
    }

    .right input {
      vertical-align: baseline;
    }
    div#controls {
      width:320px;
      border:thin solid white;
      padding:30px;
    }
    input, button, select, option {
      background: black;
          color: white;
    }
    </style>
    
  </head>
  <body>
   
    <div id="container"> 
      <div class="heading">
        <h1>SOUNDLY SYNTH</h1>
      </div>
      <div id="controls">
        <div>
          <span>Volume: </span>
          <input type="range" min="0.0" max="1.0" step="0.01"
              value="0.5" list="volumes" name="volume">
          <datalist id="volumes">
            <option value="0.0" label="Mute">
            <option value="1.0" label="100%">
          </datalist>
        </div>
         <div>
          <span>Waveform: </span>
          <select name="waveform">
            <option value="sine">Sine</option>
            <option value="square" selected>Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
            <option value="custom">Custom</option>
          </select>
        </div>
         <div>
          <span>Filter: </span>
          <select name="filter">
            <option value="0">Lowpass</option>
            <option value="1">Bandpass</option>
            <option value="2">Highpass</option>
            <option value="3">Notch</option>
            <option value="4">Allpass</option>
          </select>
        </div>
        <div>
          <label for="frequency">Frequency:</label>
          <input type="range" min="100" max="5000" step="10" value="1000" id="frequency">
        </div>
        <div>
          <button id="startButton">Start</button>
          <button id="muteButton">Mute</button>
          <button id="stopButton">Stop</button>
        </div>
      </div>
    </div>
  
    <script src="/public/js/Constants.js"></script> 
    <script src="/public/js/Synthesizer.js"></script> 
    <script src="/public/js/SoundlyUIBridge.js"></script> 
    <script src="/public/js/pureknob.js"></script> 
        
    <script>
      let wavePicker         = document.querySelector("select[name='waveform']");
      let filterPicker       = document.querySelector("select[name='filter']");
      let frequencyPicker    = document.querySelector("input#frequency");
      let volumeControl      = document.querySelector("input[name='volume']");
      let startButton        = document.querySelector("button#startButton");
      let stopButton         = document.querySelector("button#stopButton");
      let muteButton         = document.querySelector("button#muteButton");
      let synth = new Synthesizer(new AudioContext());

      wavePicker.addEventListener("change", function(evt){
        synth.setWaveform(evt.target.value);
        restart();
      });
    
      filterPicker.addEventListener("change", function(evt){
        synth.setFilterType(evt.target.value);
        restart();
      });
    
      frequencyPicker.addEventListener("input", function(evt){
        synth.setFilterFrequency(evt.target.value);
        restart();
      });
    
      startButton.addEventListener("click", restart);
      
      function restart(evt) {
        synth.playChord([
          {tone:32.703125, waveform:getWaveform()},
          {tone:329.62755691287, waveform:getWaveform()},
          {tone:783.990871963499, waveform:getWaveform()}
        ]);
      }
      
      function getWaveform() {
        let wave = "sine";
        if(typeof wavePicker.value !== "undefined") {
          wave = wavePicker.value;
        }
        return wave;
      }
      
      muteButton.addEventListener("click", toggleMute);
    
      volumeControl.addEventListener("change", changeVolume, false);

      function toggleMute(evt){
        if (synth.isMuted) {
          synth.unmute();
        }
        else{
          synth.mute();
        }
      }
      
      function changeVolume(event) {
         synth.setVolume(volumeControl.value);
      }

    </script>
    
  </body>
</html>
