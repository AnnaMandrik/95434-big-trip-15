import AbstractObserver from '../utils/abstract-observer';

export default class Destination extends AbstractObserver{
  constructor() {
    super();
    this._destination = [];
  }

  setDestinations(destination) {
    this._destination = destination;
  }

  getDestinations() {
    return this._destination;
  }
}
