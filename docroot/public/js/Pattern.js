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
    this.trackMix = [];
    if (json !== null) {
      this.parseFromJson(json);
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
    this.trackMix = json.trackMix;
  }
  

}
window.Pattern = Pattern;