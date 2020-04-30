class SampleSound {
  #bufferSource;
  constructor(audioContext, buffer){
    this.audioContext = audioContext;
    this.buffer       = buffer;
    this.volume       = 0.5;
    this.distortion   = this.audioContext.createWaveShaper();
    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.amp          = this.audioContext.createGain();
    this.reverb       = this.audioContext.createConvolver();
    this.filterType   = "";
    this.frequency    = 0;
    this.resonance    = 0;
    this.reverbLevel  = 0; 
    this.distortionLevel = 0;
    this.amp.connect(this.audioContext.destination);
    this.delay = 5;
    SampleSound.originalDelay = 5;
  }
  
  setVolume(value) {
    this.volume = value;
  }
  
  setFilterFrequency(value) {
    this.frequency = value;
  }
  
  setFilterType(value) {
    this.filterType = value;
  }
  
  setFilterResonance(value) {
    this.resonance = value / 3;
  }
  
  setDistortionLevel(value) {
    this.distortionLevel = value;
  }
  
  setReverbLevel(value) {
    this.reverbLevel = value;
  }
  
  makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  }
  
  play(delay = 0) {
    let bufferSource = this.audioContext.createBufferSource();
    if(["lowpass","bandpass","highpass","notch", "lowshelf", "highshelf"].includes(this.filterType)) {
      this.biquadFilter.frequency.setValueAtTime(this.frequency, this.audioContext.currentTime);
      this.biquadFilter.Q.setValueAtTime(this.resonance, this.audioContext.currentTime);
      this.biquadFilter.type = this.filterType;
    }
    this.distortion.curve = this.makeDistortionCurve(this.distortionLevel);
    this.distortion.oversample = '4x';
    bufferSource.buffer = this.buffer;
    this.amp.gain.value = this.volume;
    bufferSource.connect(this.distortion)
      .connect(this.biquadFilter)
      .connect(this.amp)
      .connect(this.audioContext.destination);
    bufferSource.start(delay);
  }
  
}
window.SampleSound = SampleSound;