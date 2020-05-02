class Envelope {
  constructor(paramater, audioContext) {
    this.audioContext = audioContext;
    this.paramater    = paramater;
    this.attack   = 0.5;
    this.decay    = 1.0;
    this.sustain  = 1.0;
    this.release  = 0.0;
    this.duration = this.duration;
  }
  
  trigger() {
    let now = this.audioContext.currentTime;
    let values = new  Float32Array(4);
    let originalValue = this.paramater.value;
    values[0] = this.attack;
    values[1] = this.decay;
    values[2] = this.sustain;
    values[3] = this.release;
    this.paramater.cancelScheduledValues(now);
    this.paramater.setValueCurveAtTime(values, now, this.duration);
    this.paramater.linearRampToValueAtTime(originalValue, now + this.duration * 2);
    return this;
  }
  
  setAttack(value) {
    this.attack = this.normalizeValue(value);
    return this;
  }
  
  setDecay(value) {
    this.decay = this.normalizeValue(value);
    return this;
  }
  
  setSustain(value) {
    this.sustain = this.normalizeValue(value);
    return this;
  }
  
  setRelease(value) {
    this.release = this.normalizeValue(value);
    return this;
  }
  
  setDuration(value) {
    this.duration = value;
    return this;
  }
  
  normalizeValue(value) {
    if(value < this.paramater.minValue) {
      value  = this.paramater.minValue;
    }
    if(value > this.paramater.maxValue) {
      value  = this.paramater.maxValue;
    }
    return value;
  }
}
window.Envelope = Envelope;