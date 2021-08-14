import dayjs from 'dayjs';
import {getDateISO, getDateHoursMinutes, getDateMonthDay} from '../utils/task.js';
import AbstractView from './abstract.js';

const MINUTES_IN_A_DAY = 1440;
const MINUTES_IN_A_HOUR = 60;

const createRoutePointInList = (data) => {
  const {type, name, price, offers, isFavorite} = data;
  let {timeFrom, timeTo} = data;

  const padNumberWithZeros = (number, padCount = 2) =>
    Number(number).toString(10).padStart(padCount, '0');


  const formatTripEventDuration = (durationInMinutes) => {
    let formattedDuration = '';
    const daysNumber = Math.floor(durationInMinutes / MINUTES_IN_A_DAY);
    const hoursNumber = Math.floor(durationInMinutes / MINUTES_IN_A_HOUR);
    let leftMinutes;

    if (daysNumber) {
      const leftHours = Math.floor((durationInMinutes - daysNumber * MINUTES_IN_A_DAY) / MINUTES_IN_A_HOUR);
      leftMinutes = durationInMinutes - daysNumber * MINUTES_IN_A_DAY - leftHours * MINUTES_IN_A_HOUR;
      formattedDuration = `${padNumberWithZeros(daysNumber)}D ${padNumberWithZeros(leftHours)}H ${padNumberWithZeros(leftMinutes)}M`;
    } else if (hoursNumber) {
      leftMinutes = durationInMinutes - hoursNumber * MINUTES_IN_A_HOUR;
      formattedDuration = `${padNumberWithZeros(hoursNumber)}H ${padNumberWithZeros(leftMinutes)}M`;
    } else {
      formattedDuration = `${padNumberWithZeros(leftMinutes)}M`;
    }

    return formattedDuration;
  };

  timeFrom = dayjs(timeFrom);
  timeTo = dayjs(timeTo);
  const tripEventDuration = formatTripEventDuration(timeTo.diff(timeFrom, 'minute'));


  const createOfferElement =  (offer) =>`<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;


  const offersList = offers.map((item) => createOfferElement(item)).join(' ');


  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getDateISO(timeFrom)}">${getDateMonthDay(timeFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
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
        ${offersList}
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
}
