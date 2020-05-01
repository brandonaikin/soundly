class Pattern{
  
  #json = "";
  constructor(json = null) {
    this.#json = {};
    this.title = "Untitled";
    this.tempo = 120;
    this.filterType = "lowpass";
    this.sequence = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    this.filterFrequency = 5000;
    this.distortion = 0;
    this.resonance = 0;
    this.trackMix = [];
    if (json !== null) {
      this.parseFromJson(json);
    }
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
  parseFromJson(json) {
    this.#json = json;
    this.title = json.title;
    this.tempo = json.tempo;
    this.filterType = json.filterType;
    this.sequence = json.sequence;
    this.filterFrequency = json.filterFrequency;
    this.distortion = json.distortion;
    if(typeof json.trackMix !== "undefined") {
    this.trackMix = json.trackMix;
    }
  }
  

}
window.Pattern = Pattern;