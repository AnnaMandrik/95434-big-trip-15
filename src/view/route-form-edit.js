import {getDateFormat} from '../utils/task.js';
import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const createRouteFormEdit = (data = {}) => {
  const {type,
    name,
    timeFrom = dayjs().toDate(),
    timeTo = dayjs(timeFrom).add(1, 'hour'),
    price = 0,
    offers,
    info,
    photo,
  } = data;

  const createTripTypeItem = ( isChecked = false) => `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`;

  // const createNameDataList = () => `<datalist id="destination-list-1">
  //           <option value="${name.names}"></option>
  //         </datalist>`;

  // const nameDataList = names.map((item) => createNameDataList(item)).join('');

  const createOfferMarkup = (offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.title}" type="checkbox" name="event-offer-${offer.title}"}>
      <label class="event__offer-label" for="${offer.title}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="even__offer-price">${offer.price}</span>
      </label>
    </div>`;


  const offersMarkup = offers.map((item) => createOfferMarkup(item)).join(' ');

  const createOffersSectionContainer =() => offersMarkup
    ? `<section class="event__section  event__section--offers">
         <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersMarkup}
        </div>
      </section>`
    : '';

  const createPictureMarkup = () => photo
    ? photo.map((item) => `<img class="event__photo" src="${item.src}" alt="${item.description}">`).join(' ')
    : '';

  const createDestinationSectionContainer = () => info || createPictureMarkup
    ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${info}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPictureMarkup()}
          </div>
        </div>
      </section>`
    : '';

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
           ${createTripTypeItem()}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
        <datalist id="destination-list-1">
            <option value="${name}"></option>
            <option value="${name}"></option>
            <option value="${name}"></option>
       </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${getDateFormat(timeFrom)}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${getDateFormat(timeTo)}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${price}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${createOffersSectionContainer()}

      ${createDestinationSectionContainer()}
    </section>
  </form>
</li>`;
};

export default class FormPoint extends AbstractView{
  constructor(data) {
    super();
    this._data = data;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeFormButtonClickHandler = this._closeFormButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createRouteFormEdit(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _closeFormButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFormButtonClickHandler();
  }

  setCloseFormButtonClickHandler(callback) {
    this._callback.closeFormButtonClickHandler = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click',  this._closeFormButtonClickHandler);
  }
}
