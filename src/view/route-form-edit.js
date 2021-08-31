import {getDateFormat} from '../utils/task.js';
import dayjs from 'dayjs';
import { offerExampleStatic, POINTS_CITIES, TYPES, getPhotoOfDestination, getInfoDescription} from '../mock/data.js';
import SmartView from './smart.js';


const createRouteFormEdit = (data) => {
  const {type,
    name,
    timeFrom = dayjs().toDate(),
    timeTo = dayjs(timeFrom).add(1, 'hour'),
    price = 0,
    offers,
    info,
    photo,
    id,
  } = data;

  const createTripTypeItem = ( isChecked = false) => `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`;

  const generateTripTypeListTemplate = () =>
    TYPES.reduce((template, tripType) => template + createTripTypeItem(tripType, tripType === type), '');


  const createNameDataList = (city) => city.map(() =>
    `<option value="${name}"></option>` ).join('');

  const createOfferMarkup = (item) =>
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${item.type}-${item.id}" " type="checkbox" name="event-offer-${item.type}"}>
    <label class="event__offer-label" for="${item.type}-${item.id}">
      <span class="event__offer-title">${item.offers.title}</span>
      &plus;&euro;&nbsp;
      <span class="even__offer-price">${item.offers.price}</span>
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
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
           ${generateTripTypeListTemplate(id, TYPES)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
        <datalist id="destination-list-1">
            ${createNameDataList(POINTS_CITIES)}
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
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value=${price}>
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

export default class FormPoint extends SmartView{
  constructor(data) {
    super();
    this._state = FormPoint.parseDataToState(data);
    this._offers = offerExampleStatic;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeFormButtonClickHandler = this._closeFormButtonClickHandler.bind(this);

    this._typeChangeHandler =  this._typeChangeHandler.bind(this);
    this._destinationChangeHandler =this._destinationChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersSelectionHandler = this._offersSelectionHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createRouteFormEdit(this._state);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseFormButtonClickHandler(this._callback.closeFormButtonClickHandler);
  }

  reset(data) {
    this.updateData(FormPoint.parseDataToState(data));
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._offersSelectionHandler);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      name: evt.target.value,
      info:getInfoDescription(),
      photo: getPhotoOfDestination(),
    });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      type: evt.target.value,
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    if (evt.target.value < 0) {
      evt.target.setCustomValidity('Must be a positive integer');
      evt.target.reportValidity();

    } else {
      this.updateData({
        price: evt.target.value,
      }, true);
    }
  }

  _offersSelectionHandler(evt) {
    evt.preventDefault();

    const offerCopy = this._offers;

    const getFilterOffersForType = () =>  offerCopy.filter((elem) =>
      this._state.type === elem.type);

    this.updateData({
      offers: getFilterOffersForType(),
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(FormPoint.parseStateToData(this._state));
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

  static parseDataToState(data) {
    return Object.assign(
      {},
      data,
      {},
    );
  }

  static parseStateToData(state) {
    state = Object.assign({}, state);

    return state;
  }

}
