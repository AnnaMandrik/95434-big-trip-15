import {getDateFormat} from '../utils/task.js';
import {SET_FLATPICKR, TYPES} from '../utils/const.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from 'he';
import {getOffersByType, getDestination, getIsDescription, getIsPictures, getIsOffers} from '../utils/common.js';
import {getActualDate} from '../utils/task.js';

const BLANK_DATA = {
  type: TYPES[0],
  name: '',
  timeFrom: getActualDate(),
  timeTo:  getActualDate(),
  price: null,
  offers: [],
  info: '',
  photo: [],
  id: null,
  isFavorite: false,
};

const getFlagValue = (bool) => bool ? 'Deleting' : 'Delete';

const createOptionTemplate = (city) => `<option value="${city}"></option>`;
const createNameDataList = (dest = []) => dest.map((item) => item.name).map(createOptionTemplate).join('');


const createIconList = (type, isDisabled) =>
  TYPES.map((eventType, index) => {
    const currentType = eventType.toLowerCase();
    const isTypeChecked = currentType === type;

    return `<div class="event__type-item">
        <input
          id="event-type-${currentType}-${index}"
          class="event__type-input  visually-hidden"
          type="radio" name="event-type"
          value="${currentType}"
          ${isTypeChecked ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}
        >
        <label class="event__type-label  event__type-label--${currentType}" for="event-type-${currentType}-${index}">
          ${eventType}
        </label>
      </div>`;
  }).join('');


const createOfferTemplate = (type, offers, OFFERS, isDisabled) => {
  const allOffers = getOffersByType(type, OFFERS);

  return allOffers.map((offer, idx) => {
    const isOfferSelected = offers.some((userOffer) => offer.title === userOffer.title);
    return `
<div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${idx}"
        type="checkbox"
        name="event-offer-${idx}"
        ${isOfferSelected ? 'checked' : ''}
        data-title = "${offer.title}"
        data-price = "${offer.price}"
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-${idx}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');
};

const createPhotoTemplate = ({src, description}) =>
  `<img class="event__photo" src="${src}" alt="${description}">`;

const createPhotoContainerTemplate = (photo = []) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${photo.map(createPhotoTemplate).join('')}
    </div>
  </div>`
);

const createRouteFormEdit = (data, OFFERS, DESTINATIONS, isEditing) => {
  const {type, name, timeFrom, timeTo, price, offers, info,
    photo, isDisabled, isSaving, isDeleting, isOffers} = data;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
           ${createIconList(TYPES)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" required name="event-destination" value="${name ? he.encode(name.toString()) : ''}"
        list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
            ${createNameDataList(DESTINATIONS)}
            </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" readonly type="text" name="event-start-time" value=${getDateFormat(timeFrom)} ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" readonly type="text" name="event-end-time" value=${getDateFormat(timeTo)} ${isDisabled ? 'disabled' : ''}>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" required name="event-price" value=${price ? he. encode(price.toString()) : ''} ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit"
      ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset"
      ${isDisabled ? 'disabled' : ''}>${isEditing ? getFlagValue(isDeleting) : 'Cancel'}
    </button>
     <button
          class="event__rollup-btn"
          type="button">
          <span class="visually-hidden">Open event</span>
        </button>

    </header>
    <section class="event__details">
        <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers ${isOffers ? '' : 'visually-hidden'}">Offers</h3>
          <div class="event__available-offers">
            ${createOfferTemplate(type, offers, OFFERS)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination ${info || photo ? '' : 'visually-hidden'}">Destination</h3>
        <p class="event__destination-description">${info ? info : ''}</p>
        ${createPhotoContainerTemplate(photo)}
      </section>
    </section>
  </form>
</li>`;
};

export default class FormPoint extends SmartView{
  constructor(OFFERS = [], DESTINATIONS = [], data = BLANK_DATA, isEditing = false) {
    super();
    this._state = FormPoint.parseDataToState(data);
    this._offers = OFFERS;
    this._destinations = DESTINATIONS;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._setDate = null;
    this._isEditing = isEditing;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeFormButtonClickHandler = this._closeFormButtonClickHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._typeChangeHandler =  this._typeChangeHandler.bind(this);
    this._destinationChangeHandler =this._destinationChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersSelectionHandler = this._offersSelectionHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  getTemplate() {
    return createRouteFormEdit(this._state, this._offers, this._destinations, this._isEditing);
  }

  reset(data) {
    this.updateData(FormPoint.parseDataToState(data));
  }


  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseFormButtonClickHandler(this._callback.closeFormButtonClickHandler);
    this._setStartDatepicker();
    this._setEndDatepicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }


  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__details').addEventListener('change', this._offersSelectionHandler);
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }
    this._setDate = this._state.timeTo;

    this._startDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      Object.assign(
        {},
        SET_FLATPICKR,
        {
          dafaultDate: this._state.timeFrom,
          onChange: this._startDateChangeHandler,
        },
      ),
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      Object.assign(
        {},
        SET_FLATPICKR,
        {
          minDate: this._state.timeFrom,
          onChange: this._endDateChangeHandler,
        },
      ),
    );
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      timeFrom: userDate,
    }, true);

    this._endDatepicker.set('minDate', userDate);
    this._endDatepicker.set('minTime', userDate);

    if(this._setDate <= userDate) {
      this._endDatepicker.setDate(userDate);
      this._setDate = userDate;
      this._state.timeTo = this._setDate;
    }
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      timeTo: userDate,
    }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    document.querySelectorAll('#destination-list-1 option')
      .forEach((city) => {
        if (city.value !== evt.target.value) {
          evt.target.setCustomValidity('Select a destination from the list');
          evt.target.reportValidity();
        } else {
          this.updateData({
            name: getDestination(evt.target.value, this._destinations).name,
            info:  getIsDescription(evt.target.value, this._destinations).description,
            photo: getIsPictures(evt.target.value, this._destinations)[0].pictures,
          });
          this._state.info === getIsDescription(evt.target.value, this._destinations);
        }
      });
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: [],
      isOffers: getIsOffers(evt.target.value, this._offers),
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    if (evt.target.value < 0) {
      evt.target.setCustomValidity('Must be a positive integer');
      evt.target.reportValidity();

    } else {
      this.updateData({
        price: Number(evt.target.value),
      }, true);
    }
  }

  _offersSelectionHandler(evt) {
    evt.preventDefault();
    const { price, title } = evt.target.dataset;

    this.updateData({
      offers: evt.target.checked
        ? [...this._state.offers, {title, price: Number(price)}]
        : [...this._state.offers.filter((offer) => offer.title !== title)],
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(FormPoint.parseStateToData(this._state));
  }


  _closeFormButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFormButtonClickHandler();
    this._unlockButton();
  }

  setCloseFormButtonClickHandler(callback) {
    this._callback.closeFormButtonClickHandler = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeFormButtonClickHandler);

  }

  _unlockButton() {
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(FormPoint.parseStateToData(this._state));
  }

  static parseDataToState(data) {
    return {
      ...data,
      isDescription: Boolean(data.info),
      isPictures: Boolean(data.photo),
      isOffers: Boolean(data.offers),
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToData(state) {
    state = {...state};
    delete state.isDescription;
    delete state.isPictures;
    delete state.isOffers;
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return state;
  }

}
