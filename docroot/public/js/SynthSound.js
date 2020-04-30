class SynthSound {
  
  constructor(audioContext){
    this.audioContext = audioContext;
    this.volume       = 0.5;
    this.amp          = this.audioContext.createGain();
    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.filterType   = "sawtooth";
    this.filterFrequency = 5000;
    this.resonance    = 0;
    this.amp.connect(this.audioContext.destination);
    this.waveform     = "sine";
    SynthSound.this = this;
  }
  
  setVolume(value) {
    this.volume = value;
    return this;
  }
  setWaveform(value) {
    if(["sawtooth","square","triangle","sine"].includes(value)) {
      this.waveform = value;
    }
    return this;
  }
  setFilterFrequency(value) {
    this.filterFrequency = value;
    return this;
  }
  
  setFilterType(value) {
    if(["lowpass","bandpass","highpass","notch", "lowshelf", "highshelf"].includes(value)) {
      this.biquadFilter.type  = value;
    }
    return this;
  }
  
  setFilterResonance(value) {
    this.resonance = value / 3;
    return this;
  }
  
  play(note, duration = 1) {
    let time = Math.round(this.audioContext.currentTime) + duration;
    if (this.filterType.length > 0){
      this.biquadFilter.type = this.filterType;
      this.biquadFilter.Q.setValueAtTime(this.resonance, this.audioContext.currentTime);
      this.biquadFilter.frequency.setValueAtTime(this.filterFrequency, this.audioContext.currentTime);
      this.biquadFilter.frequency.exponentialRampToValueAtTime(100, time);
    }
    this.distortion.curve = this.makeDistortionCurve(this.distortionLevel);
    this.distortion.oversample = '4x';
    this.amp.connect(this.audioContext.destination);
    this.amp.gain.value = this.volume;
    let osc = this.audioContext.createOscillator();
    osc.type = this.waveform;
    osc.frequency.value = note;
    osc.addEventListener("ended", this.oscillatorEnded);
    osc.connect(this.distortion)
       .connect(this.biquadFilter)
       .connect(this.amp);
   osc.start();
   osc.stop(time);
  }
  
  oscillatorEnded(evt) {
    console.log(evt.type+":"+this.frequency.value);
  }
  
  
}
window.SynthSound = SynthSound;