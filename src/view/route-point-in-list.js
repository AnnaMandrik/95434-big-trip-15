import dayjs from 'dayjs';
import {getDateISO, getDateHoursMinutes, getDateMonthDay, getDateFormat, createElement} from '../util.js';

const MILLISECONDS_IN_DAY = 86400000;
const MILLISECONDS_IN_HOURS = 3600000;

const createRoutePointInList = (data) => {
  const {type, name, timeFrom, timeTo, price, offers, isFavorite} = data;


  const getDueDate = () => {
    const startDate = dayjs(getDateFormat(timeFrom));
    const endDate = dayjs(getDateFormat(timeTo));
    const deuDate = endDate.diff(startDate);
    if (deuDate <= MILLISECONDS_IN_DAY) {
      return `${dayjs(deuDate).format('hh')  }H ${  dayjs(deuDate).format('mm')  }M`;
    }else if (deuDate > MILLISECONDS_IN_DAY) {
      return `${dayjs(deuDate).format('DD')  }D ${  dayjs(deuDate).format('DD')  }H ${  dayjs(deuDate).format('mm')  }M`;
    } else if (deuDate <= MILLISECONDS_IN_HOURS) {
      return `${dayjs(deuDate).format('mm')  }M`;
    }
  };

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
        <p class="event__duration">${getDueDate()}</p>
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

export default class ListPoint {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createRoutePointInList(this._data);
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
