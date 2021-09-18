import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._data = [];
  }

  setPoints(updateType, data) {
    this._data = [...data];
    this._notify(updateType);
  }

  getPoints() {
    return this._data;
  }

  updatePoint(updateType, update) {
    const index = this._data.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._data = [
      ...this._data.slice(0, index),
      update,
      ...this._data.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._data = [
      update,
      ...this._data,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._data.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._data = [
      ...this._data.slice(0, index),
      ...this._data.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint= {
      ...point,
      ...{
        timeFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
        timeTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        price: point.base_price,
        isFavorite: point.is_favorite,
        id: point.id,
      },
    };

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      ...{
        'date_from': point.timeFrom instanceof Date ? point.timeFrom.toISOString() : new Date,
        'date_to': point.timeTo instanceof Date ? point.timeTo.toISOString() : new Date,
        'is_favorite': point.isFavorite ? point.isFavorite : false,
        'base_price': point.price,
        'id': point.id,
      },
    };

    delete adaptedPoint.timeFrom;
    delete adaptedPoint.timeTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;

    return adaptedPoint;

  }
}

