<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>
      Soundly!
    </title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="/public/css/app.css">
  </head>
  <body>
   
    <div id="container"> 
      <div class="heading">
        <h1>SOUNDLY</h1>
      </div>
      <div class="app-grid"></div>
      <div class="controls col-4" id="filterControls">
        <label for="filterControls">Filter</label>
        <div id="effects" style="display:inline-flex;">
          <select id="filterTypeSelect">
            <option value="">None</option>
            <option>Lowpass</option>
            <option>Bandpass</option>
            <option>Highpass</option>
            <option>Lowshelf</option>
            <option>Highshelf</option>
            <option>Notch</option>
          </select>
        </div>
        
        </div>
      <div class="controls col-4">
        <button class="play-stop-button">Load</button> 
        <button class="new-pattern-button" style="display:none;">NEW</button>
        <form id="saveForm" name="saveForm">
          <input id="saveInput" required=""> <button class="save-button">Save</button>
        </form>
        <div id="tempoBox">
          Tempo: <span id="showTempo">120</span>BPM <input id="tempo" type="range" min="30.0" max="160.0" step="1" value="120">
        </div>
        <div>
          <select id="patternSelect">
            <option>
              - NEW PATTERN -
            </option>
          </select>
        </div>
      </div>
    </div>
  
    <template id="popup">
      <div id="popupWrapper">
        <div class="popup-title">
          {title}
        </div>
        <div class="popup-message">
          {message}
        </div>
      </div>
    </template>
    <script src="/public/js/Constants.js"></script> 
    <script src="/public/js/BeatClock.js"></script> 
    <script src="/public/js/Pattern.js"></script> 
    <script src="/public/js/SampleSound.js"></script> 
    <script src="/public/js/Synthesizer.js"></script> 
    <script src="/public/js/Sequencer.js"></script> 
    <script src="/public/js/SoundlyUIBridge.js"></script> 
    <script src="/public/js/pureknob.js"></script> 
    <script src="/public/js/soundly.js"></script><!--______________________________________________________END APP-->
  </body>
</html>
