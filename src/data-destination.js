import AbstractObserver from './utils/abstract-observer';

export default class Destination extends AbstractObserver{
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }
}
