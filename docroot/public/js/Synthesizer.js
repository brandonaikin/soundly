class Synthesizer {
  #muted = false;
  constructor(audioContext){
    this.audioContext = audioContext;
    this.volume       = 0.5;
    this.amp          = this.audioContext.createGain();
    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.waveform     = "sawtooth";
    this.filterType   = "lowpass";
    
    this.resonance    = 0;
    this.attack       = 0;
    this.decay        = 1;
    this.envelopeMin  = 100;
    this.envelopeMax  = 5000;
    this.filterFrequency = this.envelopeMax;
    this.amp.connect(this.audioContext.destination);
    this.activeOscillators = [];
    this.oscillators = [];
    Synthesizer.this = this;
  }
  
  get isMuted() {
    return this.#muted;
  }
  
  setVolume(value) {
    this.volume = value * 0.01;
    //this.amp.gain.value = value;
    return this;
  }
  
  setFilterFrequency(value) {
    this.filterFrequency = value;
    this.biquadFilter.frequency.value = value;
    return this;
  }
  
  setFilterType(value) {
    if(["lowpass","bandpass","highpass","notch", "lowshelf", "highshelf"].includes(value)) {
      this.biquadFilter.type  = value;
    }
    return this;
  }
  
  setResonance(value) {
    this.biquadFilter.Q.value = value / 2;
    return this;
  }
  
  setWaveform(value) {
    if(["sawtooth","square","triangle","sine"].includes(value)) {
      this.waveform = value;
    }
    return this;
  }
  
  play(note, duration = 1) {
    
    if (this.oscillators.length === 0) {
      this.startOscillator();
    }
    let osc = this.oscillators[0];
    this.amp.gain.value = this.volume;
    osc.type = this.waveform;
    osc.frequency.value = note;
    this.activeOscillators.push(note);
    
  }
  
  startOscillator() {
    let osc = this.audioContext.createOscillator();
    this.amp.connect(this.audioContext.destination);
    
    
    osc.connect(this.biquadFilter)
       .connect(this.amp);
    osc.start();
    this.oscillators.push(osc);
  }
  
  playChord(oscOptions) {
    this.stopActiveOscillators();
    let self = this;
    this.amp.connect(this.audioContext.destination);
    oscOptions.forEach(function(optionSet){
      let filter  = self.audioContext.createBiquadFilter();
      let osc     = self.audioContext.createOscillator();
      let tone    = optionSet.tone || 0;
      if(tone === 0) {
        throw new Error("Tone is required.")
      }
      if(self.activeOscillators.includes(tone)){
        return;
      }
      filter.type = optionSet.filterType || "lowpass";
      osc.frequency.value = optionSet.tone || 220;
      osc.type = optionSet.waveform || "sawtooth";
      osc.connect(self.biquadFilter)
          .connect(self.amp);
      osc.start();
      self.activeOscillators.push(tone);
    });
  }
    
  mute(){
    this.amp.gain.value = 0.0;
    this.#muted = true;
  }
  
  unmute() {
    this.amp.gain.value = this.volume;
    this.#muted = false;
  }
  
  stopActiveOscillators() {
    let n = this.activeOscillators.length;
    let i = 0;
    while (i < n) {
      let osc = this.activeOscillators[i];
      osc.stop();
      i++;
    }
      this.activeOscillators.splice(0);
  }
}

window.Synthesizer = Synthesizer;