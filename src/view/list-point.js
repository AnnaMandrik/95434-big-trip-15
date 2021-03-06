import dayjs from 'dayjs';
import {getDateISO, getDateHoursMinutes, getDateMonthDay, getDiffDate} from '../utils/task.js';
import AbstractView from './abstract.js';

const createRoutePointInList = (data) => {
  const {type, name, price, offers, isFavorite, timeFrom, timeTo} = data;

  const tripEventDuration = getDiffDate(dayjs(timeTo).diff(dayjs(timeFrom), 'minute'));

  const createOfferElement =  () => offers.map((item) => `<li class="event__offer">
      <span class="event__offer-title">${item.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${item.price}</span>
    </li>`);


  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getDateISO(timeFrom)}">${getDateMonthDay(timeFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${getDateISO(timeFrom)}>${getDateHoursMinutes(timeFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime=${getDateISO(timeTo)}>${getDateHoursMinutes(timeTo)}</time>
        </p>
        <p class="event__duration">${tripEventDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOfferElement(offers).join('')}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class ListPoint extends AbstractView{
  constructor(data) {
    super();
    this._data = data;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._editFavoriteClickHandler = this._editFavoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createRoutePointInList(this._data);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  _editFavoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.editFavoriteClick();
  }

  setEditFavoriteClickHandler(callback) {
    this._callback.editFavoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._editFavoriteClickHandler);
  }
}
