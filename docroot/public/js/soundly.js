
    const sequencer  = new Sequencer();
    const uiBridge   = new SoundlyUIBridge(sequencer);
    //const playButton = document.querySelector(".play-stop-button");
    //const saveButton = document.querySelector(".save-button");
    //const newPattern = document.querySelector(".new-pattern-button");
    sequencer.addEventListener("initialized", onInit);
    //saveButton.addEventListener("click", save);
    sequencer.initialize();
    let paused = true;
    
    function onInit(evt) {
      sequencer.addEventListener("soundsLoaded", onSoundsLoaded);
      sequencer.addEventListener("sequencesLoaded", onSequencesLoaded);
      sequencer.addSound("/writable/uploads/soundly/49er/samples/Swell_Kick_ss.mp3", "Kick")
        .addSound("/writable/uploads/soundly/49er/samples/LittlePunch_Snare_ss.mp3", "Snare")
        .addSound("/public/sounds/hihat.mp3", "HiHat")
        .addSound("/public/sounds/shaker.mp3", "Shaker")
        .loadSounds();
    }
  /*"/uploads/soundly/49er/samples/Swell_Kick_ss.mp3",
  "/uploads/soundly/49er/samples/Bounce_Tom_ss.mp3",
  "/uploads/soundly/49er/samples/SuperLow_Kick_ss.mp3",
  "/uploads/soundly/49er/samples/Saturated_Snare02_ss.mp3",
  "/uploads/soundly/49er/samples/Gunge_Kick_ss.mp3",
  "/uploads/soundly/49er/samples/LittlePunch_Snare_ss.mp3",
  "/uploads/soundly/49er/samples/Saturated_Snare1_ss.mp3",
  "/uploads/soundly/49er/samples/SmashHit_Snare01_ss.mp3"
  */
    function onSoundsLoaded(){
      sequencer.loadPatterns();
    }

    function onSequencesLoaded(evt) {
      /*
      playButton.addEventListener("click",playPause );
      playButton.innerText = "\u25B6";
      */
      uiBridge.buildPatternSelect();
      let freq = 5000;
      if(uiBridge.currentPattern.filterFrequency) {
        freq = uiBridge.currentPattern.filterFrequency;
      }
      sequencer.setGlobalFrequency(null, freq);
      //uiBridge.addSynthTrack();
    }
    
/*
    function playPause() {
      paused = !paused;
      let label = paused ? "\u25B6" : "\u23F5" ;
      playButton.innerText = label;
      sequencer.play();
    }
    function save(evt) {
      evt.preventDefault();
      let title = document.getElementById("saveInput").value;
      if(title === null || typeof title === "undefined" || title.length < 1) {
        console.log("title is null or undefined.");
        return;
      }
      
      sequencer.save( title);
    }
*/

