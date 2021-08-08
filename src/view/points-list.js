import {createElement} from '../util.js';

const createTripEventsListTemplate = () => '<li class="trip-events__item"></li>';

export default class TripEventsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripEventsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
