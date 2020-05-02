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
      <div id="controls" class="tall">
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
            <option >Lowpass</option>
            <option >Bandpass</option>
            <option >Highpass</option>
            <option >Notch</option>
            <option >Allpass</option>
          </select>
        </div>
         
<!--
          <select name="envelopeProperties" multiple>
            <option value="osc">Oscillator Frequency</option>
            <option value="filter">Filter Frequency</option>
            <option value="amp">Amplitude</option>
          </select>
          -->
        
        <div>
          <label for="frequency">Frequency:</label>
          <input type="range" min="100" max="5000" step="10" value="2500" id="frequency">
        </div>
        <div>
          <label for="attack">Attack:&nbsp;</label><span id="attackValue">0</span>
          <input type="range" min="0" max="5000" step="10" value="0" id="attack">
        </div>
        <div>
          <label for="attack">Decay:&nbsp;</label><span id="decayValue">0</span>
          <input type="range" min="0" max="5000" step="10" value="0" id="decay">
        </div>
        <div>
          <label for="attack">Sustain:&nbsp;</label><span id="sustainValue">0</span>
          <input type="range" min="0" max="5000" step="10" value="0" id="sustain">
        </div>
        <div>
          <label for="attack">Release:&nbsp;</label><span id="releaseValue">0</span>
          <input type="range" min="0" max="5000" step="10" value="0" id="release">
        </div>
        <div>
          <label for="attack">LFO: &nbsp;</label><span id="lfoValue">1</span>
          <input type="range" min="1" max="80" step="1" value="1" id="lfo">
        </div>
        <div>
          <label for="attack">Resonance: &nbsp;</label>
          <input type="range" min="1" max="100" step="1" value="1" id="resonance">
        </div>
        <div>
          <label for="attack">Duration: &nbsp;</label><span id="durationValue">0.5</span>
          <input type="range" min="0.1" max="10" step="0.1" value="0.5" id="duration">
        </div>
        <div>
           <div>
            <span>Envelope Properties: </span>
            <div class="inline-checkbox-group">
              <div class="inline-checkbox">
                <label for="oscCheckbox">Oscillator Frequency</label>
                <input type="checkbox" value="osc" id="oscCheckbox"></input>
              </div>
              <div class="inline-checkbox">
                <label for="filterCheckbox">Filter Frequency</label>
                <input type="checkbox" value="filter" id="filterCheckbox"></input>
              </div>
              <div class="inline-checkbox">
                <label for="ampCheckbox">Amplitude</label>
                <input type="checkbox" value="amp" id="ampCheckbox"></input>
              </div>
            </div>
          </div>
          <div id="buttonSet">

            <button id="startButton">Start</button>
            <button id="muteButton">Mute</button>
          </div>
        </div>
        
      </div>
      
    </div>
  
    <script src="/public/js/Constants.js"></script> 
    <script src="/public/js/Envelope.js"></script> 
    <script src="/public/js/Synthesizer.js"></script> 
    <script src="/public/js/SoundlyUIBridge.js"></script> 
    <script src="/public/js/pureknob.js"></script> 
        
    <script>
      let wavePicker       = document.querySelector("select[name='waveform']");
      let filterPicker     = document.querySelector("select[name='filter']");
      let envPropsPicker   = document.querySelector("select[name='envelopeProperties']");
      let frequencyPicker  = document.querySelector("input#frequency");
      let attackControl    = document.querySelector("input#attack");
      let decayControl     = document.querySelector("input#decay");
      let sustainControl   = document.querySelector("input#sustain");
      let releaseControl   = document.querySelector("input#release");
      let lfoControl       = document.querySelector("input#lfo");
      let durationControl  = document.querySelector("input#duration");
      let resonanceControl = document.querySelector("input#resonance");
      let volumeControl    = document.querySelector("input[name='volume']");
      let startButton      = document.querySelector("button#startButton");
      let muteButton       = document.querySelector("button#muteButton");
      let oscCheckbox      = document.querySelector("input#oscCheckbox");
      let filterCheckbox   = document.querySelector("input#filterCheckbox");
      let ampCheckbox      = document.querySelector("input#ampCheckbox");
      let synth = new Synthesizer(new AudioContext(),["sawtooth","square","triangle","sine"]);
      
      let config = {
        properties:[],
        attack:0,
        decay:0,
        sustain:0,
        release:0,
        duration:1
      };
      attackControl.addEventListener("change", function(evt){
        config.attack = evt.target.value;
        trigger();
        document.querySelector("span#attackValue").innerText = evt.target.value;
      });
      decayControl.addEventListener("change", function(evt){
        config.decay = evt.target.value;
        
        document.querySelector("span#decayValue").innerText = evt.target.value;
      });
      sustainControl.addEventListener("change", function(evt){
        config.sustain = evt.target.value;
        trigger();
        document.querySelector("span#sustainValue").innerText = evt.target.value;
      });
      releaseControl.addEventListener("change", function(evt){
        config.release = evt.target.value;
        trigger();
        document.querySelector("span#releaseValue").innerText = evt.target.value;
      });
      lfoControl.addEventListener("change", function(evt){
        synth.setLfo(Number(evt.target.value))
        document.querySelector("span#lfoValue").innerText = evt.target.value;
      });
      resonanceControl.addEventListener("change", function(evt){
        synth.setResonance(evt.target.value);
      });
      durationControl.addEventListener("change", function(evt){
        config.duration = Number(evt.target.value);
        trigger();
        document.querySelector("span#durationValue").innerText = evt.target.value;
      });
      filterPicker.addEventListener("change", function(evt){
        synth.setFilterType(evt.target.value.toLowerCase());
      });
    
      frequencyPicker.addEventListener("input", function(evt){
        synth.setFilterFrequency(evt.target.value);
      });

      oscCheckbox.addEventListener("change", updateEnvelopeProperties);
      filterCheckbox.addEventListener("change", updateEnvelopeProperties);
      ampCheckbox.addEventListener("change", updateEnvelopeProperties);
      
      function updateEnvelopeProperties(evt) {
        let c = evt.target.checked;
        let v = evt.target.value;
        if(c) {
          if(!config.properties.includes(v)) {
            config.properties.push(evt.target.value);
          }
        }
        else{
          if(config.properties.includes(v)) {
            let index = config.properties.indexOf(v);
            config.properties.splice(index, 1);
          }
        }
        console.log(config.properties);
        trigger();
      }

      let trigger = function(evt) {
        synth.setEnvelopeConfig(config);
        synth.mute();
        synth.unmute();
      }
      var start = function (evt) {
        synth.play(32.703125);
        startButton.removeEventListener("click", this);
        startButton.addEventListener("click", trigger);
        startButton.innerText = "Trigger";
      }
      startButton.addEventListener("click", start);
      
      muteButton.addEventListener("click", toggleMute);
    
      volumeControl.addEventListener("change", changeVolume, false);

      function toggleMute(evt){
        if (synth.isMuted) {
          synth.setEnvelopeConfig(config);
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
