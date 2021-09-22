import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._data = [];
  }

  setPoints(updateType, data) {
    this._data = data.slice();

    this._notify(updateType);
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
    const adaptedPoint= Object.assign(
      {},
      point,
      {
        name: point.destination.name,
        info: point.destination.description ? point.destination.description : '',
        photo: point.destination.pictures ? point.destination.pictures : [],
        timeFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
        timeTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        offers: point['offers'],
        price: point.base_price,
        isFavorite: point.is_favorite,
        type: point.type,
        id: point.id,
      },
    );

    delete adaptedPoint.destination.name;
    delete adaptedPoint.destination.description;
    delete adaptedPoint.destination.pictures;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;
    delete adaptedPoint.destination;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.timeFrom instanceof Date ? point.timeFrom.toISOString() :new Date,
        'date_to': point.timeTo instanceof Date ? point.timeTo.toISOString() : new Date,
        'is_favorite': point.isFavorite ? point.isFavorite : false,
        'base_price': point.price,
        'id': point.id,
        'type': point.type,
        destination: {
          name: point.name,
          description: point.info ? point.info : ' ',
          pictures: point.photo ? point.photo : [],
        },
        'offers': point.offers ? point.offers : [],
      },
    );

    delete adaptedPoint.name;
    delete adaptedPoint.info;
    delete adaptedPoint.photo;
    delete adaptedPoint.timeFrom;
    delete adaptedPoint.timeTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.price;
    return adaptedPoint;
  }
}

