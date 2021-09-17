import AbstractObserver from '../utils/abstract-observer.js';

export default class Offers extends AbstractObserver{
  constructor() {
    super();
    this._offers = null;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  static adaptToClient(offers) {
    const adaptedOffers = {};

    offers.forEach((offer) => {
      adaptedOffers[offer.type] = offer.offers.slice();
    });

    return adaptedOffers;
  }
}
