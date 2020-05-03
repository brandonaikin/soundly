class BeatPopup {
  #title;
  #message;
  #parentElement;
  #element;
  #id;
  #x;
  #y;
  constructor(event) {
    this.#parentElement =  event.target;
    this.#element = document.createElement("div");
    this.#x = event.pageX - event.target.clientWidth;
    this.#y = event.pageY - event.target.clientHeight;
    this.templates = [];
    let _close = document.createElement("div");
    let _closeBtn = document.createElement("button");
    _closeBtn.innerText = "x";
    _closeBtn.classList.add("close-button");
    _closeBtn.addEventListener("click", function(evt){
      evt.target.parentElement.parentElement.removeChild(evt.target.parentElement);
    });
    this.beatIndex = event.target.dataset.beatIndex;
    this.trackIndex = event.target.dataset.trackIndex;
    this.title = "Edit " + this.trackIndex + ":" + this.beatIndex;
    this.additionalElements = [];
    this.#element.appendChild(_closeBtn);
    this.addTitle();
    this.accordian = document.createElement("div");
    this.accordian.setAttribute("id", "accordian");
    this.#element.appendChild(this.accordian);
    BeatPopup.this = this;
  }
  
  set id(value) {
    this.#id = value;
  }
  set message(value) {
    this.#message = value;
    return this;
  }
  
  set title(value) {
    this.#title = value;
    return this;
  }
  
  render(){
    let existing = document.getElementById(this.#id);
    if(existing != null) {
      existing.parentElement.removeChild(existing);
    }
    //this.addMessage();
    this.setAttributes();
    this.addVolumeKnob();
    this.addFilterKnob();
    this.additionalElements.forEach(function(element){
      BeatPopup.this.#element.appendChild(element);
    });
    this.#element.style.overflow = "scroll";
    this.#parentElement.parentElement.appendChild(this.#element);
    return this;
  }
  
  setAttributes() {
    this.#element.setAttribute("id", this.#id);
    this.#element.setAttribute("data-beat-index",  this.beatIndex);
    this.#element.setAttribute("data-track-index", this.trackIndex);
    this.#element.style.left = this.#x + "px";
    this.#element.style.top  = this.#y + "px";
  }
  
  addTitle() {
    if(this.#title !== null && this.#title.length > 0) {
      let t = document.createTextNode(this.#title);
      let h = document.createElement("div");
      h.style.fontWeight = "bold";
      h.appendChild(t);
      this.#element.appendChild(h);
    }
  }
  createKnob(min, max,value, labelText){
    let knob = pureknob.createKnob(40, 40);
    let knobNode = knob.node();
    knob.setProperty("valMin", min);
    knob.setProperty("valMax", max);
    knob.setValue(value);
    
    let div = document.createElement("div");
    let text  = document.createTextNode(labelText);
    div.appendChild(text);
    div.classList.add("accordian-label");
    this.#element.appendChild(div);
    div.appendChild(knobNode);
    this.accordian.appendChild(div);
    knobNode.style.display = "none";
    knobNode.classList.add("knob");
    div.addEventListener("click", this.onAccordianClick);
    return knob;
  }
  
  onAccordianClick(evt){
    let child = evt.target.querySelector("div");
    let display = child.style.display;
    child.style.display = display === "none" ? "inline-block" : "none";
  }
  
  addToneSelect(select) {
    select.setAttribute("data-track-index", this.trackIndex);
    select.setAttribute("data-beat-index", this.beatIndex);
    select.addEventListener("change", this.onToneChange);
    this.addElement(select);
  }
  
  addElement(element) {
    this.additionalElements.push(element);
  }
  
  addVolumeKnob(value = 50 ) {
    let knob = this.createKnob(0, 100, value, "Volume");
    knob.addListener(this.onVolumeChange);
  }
  
  addFilterKnob(value = 2500) {
    let knob = this.createKnob(100, 5000,value, "Filter");
    knob.addListener(this.onFilterChange);
  }
  
  onVolumeChange(knob, value) {
    let evt = BeatPopup.this.makeEvent("volume",value);
    BeatPopup.this.#element.dispatchEvent(evt);
  }
  
  onFilterChange(knob, value) {
    let evt = BeatPopup.this.makeEvent("filter",value);
    BeatPopup.this.#element.dispatchEvent(evt);
  }
  
  onToneChange(evt) {
    let value = evt.target.options.item(evt.target.selectedIndex).value;
    let e = BeatPopup.this.makeEvent("tone", value);
    BeatPopup.this.#element.dispatchEvent(e);
  }
  
  makeEvent(propertyName, value) {
    let evt = new CustomEvent("beatValueChange", {
      bubbles: true,
      detail: { 
        beatIndex:BeatPopup.this.beatIndex,
        trackIndex:BeatPopup.this.trackIndex,
        property:propertyName,
        value:value
      }
    });
    return evt;
  }
  
  addMessage() {
    if(this.#message !== null && this.#message.length > 0) {
       let m = document.createTextNode(this.#message);
       let p = document.createElement("div");
       p.appendChild(m);
       p.classList.add("description");
       this.#element.appendChild(p);
    }
  }
  
  addEventListener(type, callback) {
    this.#element.addEventListener(type, callback);
  }
  
  addSaveButton() {
    let saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.classList.add("save");
    saveBtn.addEventListener("click", function(evt){
      evt.target.parentElement.parentElement.removeChild(evt.target.parentElement);
    });
    this.#element.appendChild(saveBtn);
  }
  
}
window.BeatPopup = BeatPopup;