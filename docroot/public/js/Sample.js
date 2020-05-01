class Sample {
  _url;
  _name;
  _buffer;
  constructor(){}


  get url() {
    return this._url;
  }

  set url(value) {
    this._url = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get buffer() {
    return this._buffer;
  }

  set buffer(value) {
    this._buffer = value;
  }
}
window.Sample = Sample;