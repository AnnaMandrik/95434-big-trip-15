import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._data = [];
  }

  setPoints(data) {
    this._data = data.slice();
  }

  getPoints() {
    return this._data;
  }

  updatePoint(updatePoint, update) {
    const index = this._data.findIndex((data) => data.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._data = [
      ...this._data.slice(0, index),
      update,
      ...this._data.slice(index + 1),
    ];

    this._notify(updatePoint, update);
  }

  addPoint(updatePoint, update) {
    this._data = [
      update,
      ...this._data,
    ];

    this._notify(updatePoint, update);
  }

  deletePoint(updatePoint, update) {
    const index = this._data.findIndex((data) => data.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._data = [
      ...this._data.slice(0, index),
      ...this._data.slice(index + 1),
    ];

    this._notify(updatePoint);
  }
}

