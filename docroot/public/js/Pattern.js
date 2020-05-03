class Pattern{
  
  #json = "";
  constructor(json = null) {
    this.#json = {};
    this.title = "Untitled";
    this.tempo = 120;
    this.filterType = "lowpass";
    this.samples = [];
    this.instruments = ["sample","sample","sample","sample","synth"];
    this.sequence = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    this.beatDetails = [
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}], 
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}], 
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}], 
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}], 
      [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
    ];
    this.filterFrequency = 5000;
    this.distortion = 0;
    this.resonance = 0;
    this.trackMix = [];
    if (json !== null) {
      this.parseFromJson(json);
    }
  }
  
  addBeatDetail(trackIndex, beatIndex, property, value) {
    if(trackIndex >= this.beatDetails.length) {
      this.beatDetails.push([{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]);
    }
    this.beatDetails[trackIndex][beatIndex][property] = value;
  }
  
  getBeatDetail(trackIndex, beatIndex) {
    if(typeof this.beatDetails[trackIndex] !== "undefined"){
      return this.beatDetails[trackIndex][beatIndex];
    }
    return null;
  }
  
  setInstrument(index, instrument) {
    if(index >= this.instruments.length) return;
    this.instruments[index] = instrument;
  }
  getInstrument(index) {
    if(index >= this.instruments.length) return;
    return this.instruments[index];
  }
  setTrackVolume(track, volume) {
    let divisor = 1;
    if(volume > 1) {
      divisor = 10;
      if(volume > 10) {
        divisor = 100;
      }
      volume /= divisor;
    }
    if(track < this.trackMix.length){
      this.trackMix[track] = volume;
    }
    else {
      this.trackMix.push(volume);
    }
  }


  hasSamples() {
    return this.samples.length > 0;
  }

  parseFromJson(json) {
    this.#json = json;
    this.title = json.title;
    this.tempo = json.tempo;
    this.filterType = json.filterType;
    this.sequence = json.sequence;
    this.filterFrequency = json.filterFrequency;
    this.distortion = json.distortion;
    this.resonance  = json.resonance;
    if(typeof json.beatDetails !== "undefined") {
      this.beatDetails = json.beatDetails;
    }
    if(typeof json.trackMix !== "undefined") {
      this.trackMix = json.trackMix;
    }
    if(typeof json.samples !== "undefined" && Array.isArray(json.samples)){
      this.samples = json.samples;
    }
  }
}
window.Pattern = Pattern;