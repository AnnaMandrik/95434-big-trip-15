import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._data = [];
  }

  setPoints(updatePoint, data) {
    this._data = data.slice();

    this._notify(updatePoint);
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

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        timeFrom: point['date_from'],
        timeTo: point['date_to'],
        price: point['base_price'],
        isFavorite: point['is_favorite'],
      },
    );

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.timeFrom,
        'date_to': point.timeTo,
        'base_price': point.price,
        'is_favorite': point.isFavorite,
      },
    );

    delete adaptedPoint.timeFrom;
    delete adaptedPoint.timeTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;

    return adaptedPoint;
  }
}

