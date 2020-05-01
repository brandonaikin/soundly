
const urlParams = new URLSearchParams(window.location.search);
// TODO delegate moreee
class Sequencer {
  #tempo;
  #eventDispatcher;
  constructor(){
    this.#eventDispatcher = new EventTarget();
    this.patterns = [];
    this.sounds   = [];
    this.playing  = false;
    this.audioContext     = null;
    this.currentPattern   = null;
    this.beatClock        = new BeatClock();
    this.synth     = null;
    this.userId    = urlParams.get("id");
    Sequencer.this = this;
  }
  
  initialize() {
    this.audioContext = new AudioContext();
    this.synth = new Synthesizer(Sequencer.this.audioContext);
    this.#eventDispatcher.dispatchEvent(new Event("initialized"));
  }
  
  loadPatterns(){
    let params = {
      method:"POST"
    };
    let self = this;
    let url = "/public/home/patterns?id=" + self.userId;
    return fetch(url, params)
       .then((response) => response.json())
       .then((result) => {
         self.createPatterns(result);
         self.#eventDispatcher.dispatchEvent(new Event("sequencesLoaded"));
    });
  }
  
  createPatterns(jsonArray) {
    let self = this;
    jsonArray.forEach(function(jsonPattern){
      self.patterns.push(new Pattern(jsonPattern));
    });
  }
  
  getPatterns(){
    return this.patterns;
  }
  
  getCurrentPattern(){
    return this.currentPattern;
  }
  
  setTempo(t) {
    this.beatClock.tempo = t;
    if(this.currentPattern === null) {
      this.createEmptyPattern();
    }
    this.currentPattern.tempo = t;
    let evt = new CustomEvent('tempoChange', {
      bubbles: true,
      detail: { tempo: this.beatClock.tempo }
    });
    this.#eventDispatcher.dispatchEvent(evt);
    this.restart();
    
  }
  
  get tempo() {
    return this.beatClock.tempo;
  }
  
  findSounds() {
    let params = {
      method:"POST"
    };
    let self = this;
    let url = "/public/home/sounds?id=" + self.userId;
    return fetch(url, params)
       .then((response) => response.json())
       .then((result) => {
         self.createPatterns(result);
         self.#eventDispatcher.dispatchEvent(new Event("soundUrlsLoaded"));
    });
  }
  
  // TODO
  addSound(file, name) {
    this.sounds.push({"url":file, "name":name});
    return this;
  }
  
  loadSounds() {
    let self = this;
    this.sounds.forEach(function(soundObj){
      self.loadSound(soundObj.url);
    });
    this.#eventDispatcher.dispatchEvent(new Event("soundsLoaded"));
  }
  
  loadSound(url) {
    var soundObj = {};
    var playSound = undefined;
    var getSound = new XMLHttpRequest();
    soundObj.fileDirectory = url;
    getSound.open("GET", soundObj.fileDirectory, true);
    getSound.responseType = "arraybuffer";
    let self = this;
    getSound.onload = function() {
      self.audioContext.decodeAudioData(getSound.response, function(buffer) {
        soundObj= new SampleSound(self.audioContext, buffer);
        self.sounds.forEach(function(obj){
          if(obj.url === url){
            obj.sound = soundObj;
          }
        });
      });
    };
    getSound.send();
  }
  
  /*
    Fucking play it
  */
  play() {
    this.beatClock.addEventListener("tick", this.onClockTick);
    let self = Sequencer.this;
    if(self.synth !== null && typeof self.synth !== "undefined"){
      self.synth.mute();
    }
    // TODO Eliminate / encapsulate these flags
    self.playing = !self.playing;
    if(!self.playing){
      self.stop();
      return;
    }
    let t = self.currentPattern.tempo;
    if(t !== self.beatClock.tempo) {
      self.beatClock.tempo = t;
    }
    self.beatClock.step = 0;
    self.beatClock.futureTickTime = self.audioContext.currentTime;
    this.beatClock.start();
  }
  
  onClockTick(evt) {
    let self = Sequencer.this;
    let step = self.beatClock.step;
    self.playSounds();
    self.beatClock.step = step+1;
    if (self.beatClock.step > 15) {
        self.beatClock.step = 0;
    }
  }
  
  findPattern(title) {
    for(let i = 0; i < this.patterns.length; i++) {
      if(this.patterns[i].title.toLowerCase() == title.toLowerCase()) {
        this.currentPattern = this.patterns[i];
        if(self.synth !== null && typeof self.synth !== "undefined"){
          self.synth.mute();
        }
        return this.currentPattern;
      }
    }
    return null;
  }
  
  playSounds() {
    let beatIndex = this.beatClock.step;
    let trax = this.currentPattern.sequence;
    for(var index in trax) {
      let beat = trax[index][beatIndex];
      if(!isNaN(beat)) {
        if(beat === 1) {
          let audio = this.sounds[index].sound;
          audio.play();
        }
        else if(parseInt(index) === 4 && parseInt(beat) === 0) {
          this.synth.mute();
        }
        else if (beat > 10) {
          this.synth.unmute();
          this.synth.play(beat);
        }
      }
    }
  }
  
  save(title) {
    if(this.currentPattern !== null) {
      this.currentPattern.title = title;
      let url = "/public/home?id=" + this.userId +"&title=" + title;
      let data = JSON.stringify(this.currentPattern);
      let params = {
        method:"POST",
        body:data,
        contentType:"application/json"
      };
      const self = this;
      return fetch(url, params)
          .then((response) => response.json())
          .then((result) => {
            self.#eventDispatcher.dispatchEvent(new Event("patternSaved"));
            console.log('Success:', result);
       });
    }
  }
  
  updateCurrentPattern(trackIndex, beatIndex, value, selected=false) {
    if(null === this.currentPattern) return;
    if(isNaN(this.currentPattern.sequence[trackIndex][beatIndex])) {
      return;
    }
    if(typeof this.currentPattern.sequence[trackIndex] == "undefined") {
      return;
    }
    if((selected===false || selected == "false") && value > 1) {
      value = 0;
    }
    this.currentPattern.sequence[trackIndex][beatIndex] = value;
    if(typeof this.sounds[trackIndex] !== "undefined" && 
       typeof this.sounds[trackIndex].sound !== "undefined"){
         if(value === 1 ){
           this.sounds[trackIndex].sound.play();
         }
      }
      else if (selected && value > 1) {
        let time = this.beatClock.secondsPerBeat;
        
      }
  }
  
  addTrackToPattern(track) {
    this.currentPattern.sequence[track.index] = track.sequence;
  }
  
  createEmptyPattern(){
    let p = new Pattern();
    this.patterns.push(p);
    this.currentPattern = p;
    return p;
  }
  
  setVolumeForTrack(trackIndex, volume) {
    
    if (this.sounds[trackIndex] && this.sounds[trackIndex].sound) {
      let audio = this.sounds[trackIndex].sound;
      volume *=  0.01;
      audio.setVolume(volume);
    }
    // TODO
    else if (parseInt(trackIndex) === 4){
      volume *=  0.1;
      this.synth.setVolume(volume);
    }
    this.currentPattern.setTrackVolume(trackIndex, volume);
  }
  
  setGlobalFrequency(knob, value) {
    Sequencer.this.sounds.forEach(function(soundObj){
      soundObj.sound.setFilterFrequency(value);
    });
    Sequencer.this.currentPattern.filterFrequency = value;
    if(Sequencer.this.synth !== null){
      Sequencer.this.synth.setFilterFrequency(value);
    }
  }
  
  setGlobalFilterType(value) {
    Sequencer.this.sounds.forEach(function(soundObj){
      soundObj.sound.setFilterType(value.toLowerCase());
    });
    Sequencer.this.currentPattern.filterType = value.toLowerCase();
    if(Sequencer.this.synth !== null){
      Sequencer.this.synth.setFilterType(value);
    }
    
  }
  
  setGlobalResonance(knob, value) {
    Sequencer.this.sounds.forEach(function(soundObj){
      soundObj.sound.setFilterResonance(value);
    });
    Sequencer.this.currentPattern.resonance = value;
    if(Sequencer.this.synth !== null && typeof Sequencer.this.synth !== "undefined"){
      Sequencer.this.synth.setResonance(value);
    }
  }
  
  setGlobalDistortion(knob, value) {
    Sequencer.this.sounds.forEach(function(soundObj){
      soundObj.sound.setDistortionLevel(value);
    });
    if(Sequencer.this.synth !== null){
      Sequencer.this.currentPattern.distortion = value;
    }
  }

  setSynthVolume(knob, value){
    if(Sequencer.this.synth !== null){
      Sequencer.this.synth.setVolume(value);
    }
  }
  
  addEventListener(type, listener){
    this.#eventDispatcher.addEventListener(type, listener);
  }
  
  removeEventListener(type,listener){
    this.#eventDispatcher.removeEventListener(type, listener);
  }
  
  /*
    Fucking stop it
  */
  stop() {
    this.beatClock.stop();
    this.beatClock.removeEventListener("tick", this.onClockTick);
    this.playing = false;
    if(this.synth !== null) {
      this.synth.mute();
    }
  }
  
  restart(){
    if(this.audioContext !== null) {
      this.stop();
      this.play();
    }
  }
}
window.Sequencer = Sequencer;