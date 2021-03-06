class SoundlyUIBridge {
  /**
  This class will (eventually) handle all of the build and display of the UI...
  removing the resonsibility of knowledge of the DOM from the sequencer.
  Too smart to be a view class, but hopefully oblivious to the inner workings of the sequencer.
  Kind of a ViewController or whatever.
  **/
  constructor(sequencer) {
    this.sequencer = sequencer;
    this.sequencer.addEventListener("tempoChange", this.onSequencerTempoChange);
    this.playButton = document.querySelector(".play-stop-button");
    this.saveButton = document.querySelector("button.save-button"); 
    this.saveForm   = document.querySelector("form#saveForm");
    this.paused     = true;
    document.querySelector("#filterTypeSelect").addEventListener("change", this.onFilterTypeChange);
    SoundlyUIBridge.this = this;
    this.initialize();
  }
  
  initialize() {
    document.getElementById("saveInput").value = "Untitled";
    document.querySelector("#tempo").addEventListener("change", this.onUITempoChange);
    let p = this.sequencer.createEmptyPattern();
    this.frequencyKnob  = this.addFrequencyKnob();
    this.distortionKnob = this.addDistortionKnob();
    this.resonanceKnob  = this.addResonanceKnob();
    this.loadSequence(p);
    this.playButton.innerText = "\u25B6";
    this.playButton.addEventListener("click",function(evt){
      SoundlyUIBridge.this.playPause();
    } );
    this.saveForm.addEventListener("submit", this.save);
    this.sequencer.addEventListener("soundsLoaded", this.onSoundsLoaded);
    this.sequencer.loadSounds();
    this.sequencer.addEventListener("soundUrlsLoaded", this.onUserSoundsLoaded);
    this.sequencer.findSounds();
  }
  
  onUserSoundsLoaded(evt) {
    console.log(evt);
    let sounds = evt.detail;
  }
  
  get currentPattern() {
    return this.sequencer.getCurrentPattern();
  }
  
  onSequencerTempoChange(evt) {
    SoundlyUIBridge.this.updateTempoLabel(evt.detail.tempo + " ");
  }
  
  updateTempoLabel(value) {
    document.querySelector("#showTempo").innerText = value;
  }
  
  onUITempoChange(evt){
    SoundlyUIBridge.this.sequencer.setTempo(evt.target.value);
  }
  
  buildPatternSelect() {
    let patterns = this.sequencer.getPatterns();
    let select = document.getElementById("patternSelect");
    for(let i = 0; i < patterns.length; i++) {
      let o = document.createElement("option");
      let t = document.createTextNode(patterns[i].title);
      o.appendChild(t);
      select.appendChild(o);
    }
    select.addEventListener("change", this.changePattern);
  }
  
  changePattern(evt) {
    let sequencer = SoundlyUIBridge.this.sequencer;
    if(evt.target.selectedIndex < 1) {
      SoundlyUIBridge.this.initialize();
      return;
    }
    let pattern = sequencer.findPattern(evt.target.value);
    let data = pattern.sequence;
    document.getElementById("saveInput").value = pattern.title;
    SoundlyUIBridge.this.loadSequence(pattern);
    // TODO
    SoundlyUIBridge.this.playPause();
  }
  
  loadSequence(p) {
    let data = p.sequence;
    this.loadTracks(data);
    let select = document.getElementById("filterTypeSelect");
    let options = select.options;
    let filter = this.sequencer.getCurrentPattern().filterType;
    for (var i = 0; i < options.length; i++) {
      let option = options.item(i);
      let value  = option.value.toLowerCase();
      if (this.isDefined(filter) && filter.toLowerCase() === value) {
        select.selectedIndex = i; 
      }
    }
    this.buildSequenceForPattern(p,filter);
  }
  
  buildSequenceForPattern(p, filter) {
    let t = p.tempo || this.sequencer.tempo;
    let distortion = p.distortion;
    let freq = p.filterFrequency;
    let res  = p.resonance;
    this.sequencer.setTempo(t);
    this.frequencyKnob.setValue(freq);
    this.resonanceKnob.setValue(res);
    this.distortionKnob.setValue(distortion);
    this.sequencer.setGlobalFrequency(null,freq);
    this.sequencer.setGlobalResonance(null,res);
    this.sequencer.setGlobalFilterType(filter);
    this.sequencer.setGlobalDistortion(null, distortion);
    this.updateTempoLabel(t + " ");
    this.addEditTrackButtons();
  }
  
  loadTracks(data) {
    document.querySelector(".app-grid").innerHTML = "";
    let mix = this.sequencer.getCurrentPattern().trackMix;
    let self = SoundlyUIBridge.this;
    if(typeof mix === "undefined") {
      mix = [0.5,0.5,0.5,0.5];
    }
    for(var i = 0; i < data.length; i++) {
      let vol  = 50; 
      if(!isNaN(mix[i])) {
        vol = Math.floor(parseFloat(mix[i]) * 100); 
      }
      let track = this.buildTrack(i + 1, vol);
      this.buildTilesForTrack(track, i, data);
      this.sequencer.setVolumeForTrack(i, vol);
    }
  }

  buildTilesForTrack(track, trackIndex, data) {
    let self = this;
    for (var i = 0; i < data[trackIndex].length; i++) {
      const cell = data[trackIndex][i];
      let tile = this.buildTile(track, (i + 1), cell);
      tile.addEventListener("dblclick", function(evt){
        self.showBeatPopup(evt);
      })
    }
  }
  
  addEditTrackButtons() {
    let appGrid = document.querySelector(".app-grid");
    let addDrumBtn = document.createElement("button");
    console.log("addEditTrackButtons")
  }
  
  addTrack() {
    let numTracks = document.querySelector(".app-grid").children.length;
    let trackDiv  = this.buildTrack(numTracks);
    
  }
  
  buildTrack(trackNumber, volume = 50) {
    let trackDiv  = document.createElement("div");
    let trackCss  = "grid row track-" + trackNumber + "-container";
    let gridDiv   = document.querySelector(".app-grid");
    trackDiv.setAttribute("data-track-index", trackNumber - 1);
    trackDiv.setAttribute("class", trackCss);
    gridDiv.appendChild(trackDiv);
    this.addTrackVolumeKnob(trackDiv, volume);
    return trackDiv;
  }
  
  buildTile(trackDiv, col, cell) {
    let selected = cell > 0;
    let tileDiv  = document.createElement("div");
    let css = "grid-item track-step step-" + col;
    tileDiv.setAttribute("class", css);
    if(selected) {
      tileDiv.classList.add("selected");
    }
    if(trackDiv === null) {
      return tileDiv;
    }
    tileDiv.setAttribute("data-beat-index", col-1);
    tileDiv.setAttribute("data-track-index", trackDiv.dataset.trackIndex);
    tileDiv.setAttribute("data-selected", selected);
    tileDiv.addEventListener("pointerup", this.onTilePress);
    trackDiv.appendChild(tileDiv);
    return tileDiv;
  }
  
  addTrackVolumeKnob(track, initVal = 50) {
    let knob = pureknob.createKnob(40, 40);
    let knobNode = knob.node();
    knob.setValue(initVal);
    knobNode.classList.add("track-volume-knob");
    track.appendChild(knobNode);
    knobNode.setAttribute("data-track-index", track.dataset.trackIndex);
    knobNode.id = "volumeKnob" + track.dataset.trackIndex;
    knob.addListener(this.onTrackVolumeKnobChange);
    
    return knob;
  }

  addFrequencyKnob() {
    let knob = this.createEffectKnob(50, 5000, "Frequency", 5000);
    knob.addListener(this.sequencer.setGlobalFrequency);
    return knob;
  }
  
  addDistortionKnob() {
    let knob = this.createEffectKnob(0, 50, "Distortion");
    knob.addListener(this.sequencer.setGlobalDistortion);
    return knob;
  }
  
  addResonanceKnob() {
    let knob = this.createEffectKnob(0, 75, "Resonance");
    knob.addListener(this.sequencer.setGlobalResonance);
    return knob;
  }

  createEffectKnob(min, max, label = "", initial = null) {
    let knob = pureknob.createKnob(60, 60);
    let knobNode = knob.node();
    let div = document.querySelector("#effects");
    knob.setProperty("valMin", min);
    knob.setProperty("valMax", max);
    if (initial === null) {
      knob.setValue(min);
    }
    else {
      knob.setValue(initial);
    }
    if(label.length > 0) {
      knob.setProperty("label", label);
      knob.setProperty("colorLabel", "#FFFFFF");
    }
    knobNode.classList.add("global-effect-knob");
    div.appendChild(knobNode);
    return knob;
  }
  
  onFilterTypeChange(evt) {
    SoundlyUIBridge.this
      .sequencer
      .setGlobalFilterType(evt.target.value);
  }
  
  onTrackVolumeKnobChange(knob, value){
    SoundlyUIBridge.this
      .sequencer
      .setVolumeForTrack(knob.node().dataset.trackIndex, value);
  }
  
  buildTonesSelectContainer() {
    let div = document.createElement("div");
    let sel = this.buildTonesSelect();
    div.appendChild(sel);
    return div;
  }
  
  buildTonesSelect(){
    let sel = document.createElement("select");
    let option = document.createElement("option");
    let label  = document.createTextNode("Note");
    option.appendChild(label);
    sel.appendChild(option);
    for(let i = 0; i < Constants.TONE_VALUES.length; i++) {
      let obj = Constants.TONE_VALUES[i];
      label  = document.createTextNode(obj.name);
      option = document.createElement("option");
      option.appendChild(label);
      option.setAttribute("value", obj.frequency);
      sel.appendChild(option);
    }
    return sel;
  }
  onTilePress(evt) {
    let cList = evt.target.classList;
    let value = 0;
    if(cList.contains("selected")){
      cList.remove("selected");
    }
    else {
      cList.add("selected");
      value = 1;
    }
    let t = evt.target.dataset.trackIndex;
    let b = evt.target.dataset.beatIndex;
    SoundlyUIBridge.this.sequencer.updateCurrentPattern(t, b, value);
  }
  
  playPause() {
    this.paused = !this.paused;
    let label = this.paused ? "\u25B6" : "\u23F5" ;
    this.playButton.innerText = label;
    if(this.paused) {
      this.sequencer.stop();
    }
    else {
      this.sequencer.play();
    }
  }
  
  save(evt) {
    evt.preventDefault();
    let self = SoundlyUIBridge.this;
    let titleInput = document.getElementById("saveInput");
    titleInput.classList.remove("hidden");
    self.saveButton.innerText = "Confirm";
    self.saveButton.removeEventListener("click", self.save);
    self.saveButton.addEventListener("click", self.confirmSave);
  }
  
  confirmSave(evt) {
    evt.preventDefault();
    let self = SoundlyUIBridge.this;
    let titleInput = document.getElementById("saveInput");
    let title = titleInput.value;
    titleInput.classList.remove("hidden");
    if(title === null || typeof title === "undefined" || title.length < 1) {
      console.log("title is null or undefined.");
      return;
    }
    titleInput.classList.add("hidden");
    self.saveButton.disabled = true;
    self.sequencer.addEventListener("patternSaved", self.onPatternSaved);
    self.sequencer.save(title);
  }
  
  onPatternSaved(evt) {
    let self = SoundlyUIBridge.this;
    self.saveButton.disabled = false;
    self.saveButton.innerText = "Save";
    self.saveButton.addEventListener("click", self.save);
    self.saveButton.removeEventListener("click", self.confirmSave);
  }
  
  showBeatPopup(evt) {
    let popup = new BeatPopup(evt);
    popup.id = "cellPopup";
    popup.addEventListener("beatValueChange", this.sequencer.onBeatDetailChange);
    let inst = this.sequencer.currentPattern.getInstrument(evt.target.dataset.trackIndex);
    if(inst === "synth") {
      popup.addToneSelect(this.buildTonesSelect());
    }
    popup.render();
  }
  
  isDefined(value){
    return (value !== null && typeof value !== "undefined");
  }
 
  
}