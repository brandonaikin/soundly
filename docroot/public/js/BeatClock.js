class BeatClock {
  #tempo;
  #step;
  #eventDispatcher;
  constructor() {
    this.#tempo = 120;
    this.#step  = 0;
    this.#eventDispatcher = new EventTarget();
    this.timerId = null;
    this.secondsPerBeat = 60 / this.#tempo;
    this.counterTimeValue = this.secondsPerBeat / 4;
    this.futureTickTime = 0;
    BeatClock.this = this;
  }
  
  start() {
    let self = BeatClock.this;
    let millis = self.counterTimeValue * 1000;
    self.timerId = window.setInterval(self.tick, millis);
    self.secondsPerBeat = 60 / self.#tempo;
    self.counterTimeValue = (self.secondsPerBeat / 4);
  }
  
  stop() {
    BeatClock.this.step  = 0;
    window.clearInterval(BeatClock.this.timerId);
  }
  
  tick() {
    let self = BeatClock.this;
    self.secondsPerBeat = 60 / self.#tempo;
    self.counterTimeValue = (self.secondsPerBeat / 4);
    let evt = new CustomEvent("tick", {
      bubbles: true,
      detail: { time:self.counterTimeValue}
    });
    BeatClock.this.fireEvent(evt);
  }
  
  getCounter() {
    return this.counterTimeValue;
  }
  
  set tempo(value) {
    this.#tempo = value;
  }
  
  get tempo() {
    return this.#tempo;
  }
  
  set step(value){
    if(value > 15) {
      value = 0;
    }
    this.#step = value;
  }
  
  get step() {
    return this.#step;
  }
  
  addEventListener(type, listener) {
    this.#eventDispatcher.addEventListener(type, listener);
  }
  
  removeEventListener(type, listener) {
    this.#eventDispatcher.removeEventListener(type, listener);
  }
  
  fireEvent(evt) {
    this.#eventDispatcher.dispatchEvent(evt);
  }
  
}