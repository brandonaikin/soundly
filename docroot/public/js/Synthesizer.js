class Synthesizer {
  #muted = false;
  constructor(audioContext, waveforms){
    this.audioContext = audioContext;
    this.volume       = 0.5;
    this.amp          = this.audioContext.createGain();
    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.lowFreqOsc   = null;
    this.waveform     = "sawtooth";
    this.filterType   = "lowpass";
    this.lfo = 0;
    this.resonance    = 10;
    this.filterFrequency = 5000;
    this.envelopeConfig = null;
    this.activeOscillators = [];
    this.oscillators = [];
    this.started = false;
    Synthesizer.this = this;
    if(Array.isArray(waveforms)) {
      this.initializeOscillators(waveforms);
    }
    let compressor = this.audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, this.audioContext.currentTime);
    compressor.knee.setValueAtTime(40, this.audioContext.currentTime);
    compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
    compressor.attack.setValueAtTime(0, this.audioContext.currentTime);
    compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
    this.amp.connect(compressor);
    compressor.connect(this.audioContext.destination);
  }
  
  initializeOscillators(waveforms) {
    waveforms.forEach(function(wave){
      if(["sawtooth","square","triangle","sine"].includes(wave)){
        Synthesizer.this.createOscillator(wave);
      }
    });
  }
  
  get isMuted() {
    return this.#muted;
  }
  
  setVolume(value) {
    this.volume = value * 0.01;
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
  
  setLfo(value) {
    this.lfo = value;
    if(this.lowFreqOsc != null) {
      this.lowFreqOsc.frequency.value = this.lfo;
    }
    
  }
  setEnvelopeConfig(config) {
    this.envelopeConfig = config;
  }
  
  play(note, duration = 1) {
    
    if (this.oscillators.length === 0) {
      this.createOscillator("sawtooth");
    }
    for (var i = 0; i < this.oscillators.length; i++) {
      let osc = this.oscillators[i];
      this.amp.gain.value = this.volume;
      osc.frequency.value = note;
      if(this.started === false) {
        osc.start();
      }
      
    }
    
    this.started = true;
    
  }
  
  createOscillator(waveform) {
    let osc = this.audioContext.createOscillator();
    this.amp.connect(this.audioContext.destination);
    osc.type = waveform;
    osc.connect(this.biquadFilter)
       .connect(this.amp);
    this.oscillators.push(osc);
  }
  
  mute(){
    this.amp.gain.value = 0.0;
    this.#muted = true;
  }
  
  unmute() {
    if(this.envelopeConfig !== null) {
      this.applyEnvelope();
    }
    
    this.amp.gain.value = this.volume;
    this.#muted = false;
  }
  
  applyEnvelope() {
    if(Array.isArray(this.envelopeConfig.properties)) {
      if(this.envelopeConfig.properties.includes("filter")){
        this.createEnvelope(this.biquadFilter.frequency, this.envelopeConfig);
      }
      if(this.envelopeConfig.properties.includes("amp")){
        this.createEnvelope(this.amp.gain, this.envelopeConfig);
      }
      if(this.envelopeConfig.properties.includes("osc")){
        for(var i = 0; i < this.oscillators.length;  i++) {
          this.createEnvelope(this.oscillators[i].frequency, this.envelopeConfig);
        }
      }
    }
  
  }
  
  createEnvelope(param, config) {
    new Envelope(param, this.audioContext)
      .setAttack(config.attack)
      .setDecay(config.decay)
      .setSustain(config.sustain)
      .setRelease(config.release)
      .setDuration(config.duration)
      .triggerA();
  }
  
}

window.Synthesizer = Synthesizer;