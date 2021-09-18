import {getDateFormat} from '../utils/task.js';
import {SET_FLATPICKR, TRIP_TYPES} from '../utils/const.js';
import {getOffersByType, getDestination, getIsDescription, getIsPictures, getIsOffers} from '../utils/common.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from 'he';


const BLANK_DATA = {
  type: TRIP_TYPES.TAXI.toLowerCase(),
  destination: {
    name: '',
    description: '',
    pictures: [],
  },
  timeFrom: new Date(),
  timeTo:  new Date(),
  price: 0,
  offers: [],
  id: 0,
  isFavorite: false,
};

const getStateValue = (state) => state ? 'Deleting' : 'Delete';

const createNameDataList = (city) => city.map((name) =>
  `<option value="${name}"></option>`);

const generateTripTypeListTemplate = (type, types, isDisabled) => {
  Object.values(types).map((eventType, index) => {
    const currentType = eventType.toLowerCase();
    const isChecked = currentType === type;
    return `<div class="event__type-item">
    <input
    id="event-type-${currentType}-${index}"
    class="event__type-input  visually-hidden"
    type="radio" name="event-type"
    value="${currentType}"
    ${isChecked ? 'checked' : ''}
    ${isDisabled ? 'disabled' : ''}
  >
  <label class="event__type-label  event__type-label--${currentType}" for="event-type-${currentType}-${index}">
    ${eventType}
  </label>
        </div>`;
  }).join('');
};

const createOffersMarkup = (type, offers, OFFERS, isDisabled) => {
  const allOffers = getOffersByType(type, OFFERS);
  return allOffers.map((offer, index) => {
    const isOfferSelected = offers.some((userOffer) => offer.title === userOffer.title);
    return `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${index}"
        type="checkbox"
        name="event-offer-${index}"
        ${isOfferSelected ? 'checked' : ''}
        data-title = "${offer.title}"
        data-price = "${offer.price}"
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');
};


const createPictureMarkup = ({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`;
const createPictureMarkupTemplate = ({pictures}) => (
  `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map(createPictureMarkup).join('')}
    </div>
  </div>`
);


const createRouteFormEdit = (OFFERS, DESTINATIONS, data, isEditing) => {

  const {type, offers, destination, timeFrom, timeTo, price, isOffers, isDescription, isPictures, isDisabled, isSaving, isDeleting} = data;


  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input
            class="event__type-toggle
            visually-hidden"
            id="event-type-toggle-1"
            type="checkbox"
            ${isDisabled ? 'disabled' : ''}
          >
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
           ${generateTripTypeListTemplate(type, TRIP_TYPES)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input
            class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${he.encode(destination.name)}"
            list="destination-list-1"
            ${isDisabled ? 'disabled' : ''}
          >
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
        <input class="event__input  event__input--price" id="event-price-1" required type="number" name="event-price" value=${price ? he. encode(price.toString()) : ''} ${isDisabled ? 'disabled' : ''}>
      </div>
     <button
          class="event__save-btn  btn  btn--blue"
          type="submit"
          ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          class="event__reset-btn" type="reset"
          ${isDisabled ? 'disabled' : ''}>${isEditing ? getStateValue(isDeleting) : 'Cancel'}
        </button>
        ${isEditing ? `<button
          class="event__rollup-btn"
          type="button"
          ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span>
        </button>` : ''}
    </header>
    <section class="event__details">
     <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers ${isOffers ? '' : 'visually-hidden'}">Offers</h3>' : ''}
     <div class="event__available-offers">${createOffersMarkup(type, offers, OFFERS)}
     </div>
      </section>

      <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination ${isDescription || isPictures ? '' : 'visually-hidden'}">Destination</h3>
      <p class="event__destination-description">${isDescription ? destination.description : ''}</p>
      ${isPictures ? createPictureMarkupTemplate(destination) : ''}
    </section>
  </section>
</form>
</li>`;
};

export default class FormPoint extends SmartView{
  constructor(data = BLANK_DATA, OFFERS, DESTINATIONS, isEditing = false) {
    super();
    this._offers = OFFERS;
    this._destinations = DESTINATIONS;
    this._state = FormPoint.parseDataToState(data);
    this._isEditing = isEditing;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._setDate = null;

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

  reset(data) {
    this.updateData(FormPoint.parseDataToState(data));
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

    if (this._setDate <= userDate) {
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

  // _getCheckedOffers() {
  //   const checkedOffers = [];
  //   const checkedCheckboxes = this.getElement().querySelectorAll('.event__offer-checkbox:checked');
  //   const allOffers = this._state.data.offers[this._state.data.type];

  //   if (allOffers) {
  //     checkedCheckboxes.forEach((checkboxElement) => {
  //       const title = checkboxElement.parentElement.querySelector('.event__offer-title').textContent;
  //       const price = checkboxElement.parentElement.querySelector('.event__offer-price').textContent;

  //       checkedOffers.push({title, price: parseInt(price, 10) });
  //     });
  // //   }

  //   return checkedOffers.length ? checkedOffers : null;
  // }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._offersSelectionHandler);
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(FormPoint.parseStateToData(this._state));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: getDestination(evt.target.value, this._destinations),
      isDescription: getIsDescription(evt.target.value, this._destinations),
      isPictures: getIsPictures(evt.target.value, this._destinations),
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
        price: evt.target.value,
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

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _closeFormButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeFormButtonClickHandler();
    this._unlockButton();
  }

  _unlockButton() {
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  }

  setCloseFormButtonClickHandler(callback) {
    this._callback.closeFormButtonClickHandler = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click',  this._closeFormButtonClickHandler);
  }

  static parseDataToState(data) {
    return {
      ...data,
      isDescription: Boolean(data.destination.description),
      isPictures: Boolean(data.destination.pictures.length),
      isOffers: Boolean(getOffersByType(data.type, this._offers).length),
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
