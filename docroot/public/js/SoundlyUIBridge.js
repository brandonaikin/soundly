class SoundlyUIBridge {
  
  constructor(sequencer) {
    this.sequencer = sequencer;
    this.sequencer.addEventListener("tempoChange", this.onSequencerTempoChange);
    SoundlyUIBridge.this = this;
    
    document.querySelector("#filterTypeSelect").addEventListener("change", this.onFilterTypeChange);
    this.initialize();
  }
  
  initialize() {
    let p = this.sequencer.createEmptyPattern();
    this.loadSequence(p.sequence);
    document.getElementById("saveInput").value = "Untitled";
    document.querySelector("#tempo").addEventListener("change", this.onUITempoChange);
    this.addFrequencyKnob();
    this.addDistortionKnob();
    this.addResonanceKnob();
    
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
    const newPattern  = document.querySelector(".new-pattern-button");
    newPattern.style.display = "inline-flex";
    newPattern.addEventListener("click", function(evt){
      let p = sequencer.createEmptyPattern();
      SoundlyUIBridge.this.loadSequence(p.sequence);
      document.getElementById("saveInput").value = "Untitled";
    });
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
    //sequencer.stop();
    SoundlyUIBridge.this.loadSequence(data);
  }
  
  loadSequence(data) {
    document.querySelector(".app-grid").innerHTML = "";
    for(var i = 0; i < data.length; i++) {
      let track = this.buildTrack(i + 1);
      for (var j = 0; j < data[i].length; j++) {
        let cell = data[i][j];
        let tile = this.buildTile(track, (j + 1), cell > 0);
      }
    }
    let t = this.sequencer.getCurrentPattern().tempo || this.sequencer.tempo;
    this.updateTempoLabel(t + " ");
  }
  
  addSynthTrack() {
    let trackDiv  = this.buildTrack(5);
    let track = {};
    track.sequence = [];
    let i = 0;
    while(i < 16) {
      let tile = this.buildTile(trackDiv, (i + 1), false);

      tile.setAttribute("data-tone", 0);
      
      tile.addEventListener("click", function(evt){
        
        let t = evt.target.dataset.trackIndex;
        let b = evt.target.dataset.beatIndex;
        let value = evt.target.value;
        let selected = true;
        if(typeof evt.target.dataset.selected === "undefined") {
          evt.target.setAttribute("data-selected", true);
        }
        else {
          selected = evt.target.dataset.selected;
          evt.target.setAttribute("data-selected", !selected);
        }
        let tone = parseFloat(evt.target.dataset.tone) || 0;
        SoundlyUIBridge.this.sequencer.updateCurrentPattern(t, b, tone, selected);
      });
      let toneSelectDiv = this.buildTonesSelect();
      let toneSelect    = toneSelectDiv.querySelector("select");
      toneSelect.setAttribute("data-track-index", trackDiv.dataset.trackIndex);
      toneSelect.setAttribute("data-beat-index", i);
      toneSelect.addEventListener("change", function(evt){
        let t = evt.target;
        let s = parseInt(t.dataset.beatIndex) +1;
        let tile = trackDiv.querySelector("div.step-" + s);
        tile.setAttribute("data-tone", parseFloat(t.value));
        if(tile.dataset.selected) {
          SoundlyUIBridge.this.sequencer.updateCurrentPattern(tile.dataset.trackIndex, tile.dataset.beatIndex, parseFloat(t.value), true);
        }
      });
      trackDiv.appendChild(toneSelectDiv);
      track.index = trackDiv.dataset.trackIndex;
      track.sequence.push(0);
      i++;
    }
    this.sequencer.addTrackToPattern(track);
  }
  
  buildTrack(trackNumber) {
    let trackDiv  = document.createElement("div");
    let trackCss  = "grid row track-" + trackNumber + "-container";
    let gridDiv   = document.querySelector(".app-grid");
    trackDiv.setAttribute("data-track-index", trackNumber - 1);
    trackDiv.setAttribute("class", trackCss);
    gridDiv.appendChild(trackDiv);
    this.addTrackVolumeKnob(trackDiv);
    return trackDiv;
  }
  
  buildTile(trackDiv, col, selected) {
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
  
  addTrackVolumeKnob(track) {
    let knob = pureknob.createKnob(40, 40);
    let knobNode = knob.node();
    knob.setValue(50);
    knobNode.classList.add("track-volume-knob");
    track.appendChild(knobNode);
    knobNode.setAttribute("data-track-index", track.dataset.trackIndex);
    knob.addListener(this.onTrackVolumeKnobChange);
  }

  addFrequencyKnob() {
    let knob = this.createEffectKnob(50, 5000, "Frequency", 5000);
    knob.addListener(this.sequencer.setGlobalFrequency);
  }
  
  addDistortionKnob() {
    let knob = this.createEffectKnob(0, 50, "Distortion");
    knob.addListener(this.sequencer.setGlobalDistortion);
  }
  addResonanceKnob() {
    let knob = this.createEffectKnob(0, 75, "Resonance");
    knob.addListener(this.sequencer.setGlobalResonance);
  }

  addReverbKnob() {
    let knob = this.createEffectKnob(0, 50, "Reverb");
    knob.addListener(this.sequencer.setGlobalResonance);
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
  
  buildTonesSelect() {
    let div = document.createElement("div");
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
    div.appendChild(sel);
    return div;
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
  
  frequencyKnobChange(knob, value){
  }
  
  
}