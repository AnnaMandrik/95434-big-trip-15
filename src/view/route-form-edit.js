import {getDateFormat, getMarkupIsElemHave} from '../utils/task.js';
import {SET_FLATPICKR, TYPES} from '../utils/const.js';
//import {offerExampleStatic, POINTS_CITIES, TYPES, getPhotoOfDestination, getInfoDescription} from '../mock/data.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
// import dayjs from 'dayjs';
import he from 'he';

const BLANK_DATA = {
  type: TYPES[0],
  name: '',
  timeFrom: new Date(),
  timeTo:  new Date(),
  price: null,
  offers: [],
  info: '',
  photo: [],
  id: null,
  isFavorite: false,
};

const getFlagValue = (trueFalse) => trueFalse ? 'Deleting' : 'Delete';

const createNameDataList = (city = []) => city.map((name) =>
  `<option value="${name}"></option>`).join('');

// const createNameDataList = () => `<datalist id="destination-list-1">
// ${POINTS_CITIES.reduce((template, name) => `${template  }<option value="${name}"></option>`, '')}
// </datalist>`;

const createTripTypeItem = (type, isChecked = false, isDisabled) => `<div class="event__type-item">
  <input id="event-type-${type.toLowerCase()}-1" class="event__type-input
  visually-hidden" type="radio" name="event-type"
  value="${type.toLowerCase()}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
  <label class="event__type-label  event__type-label--${type.toLowerCase()}"
  for="event-type-${type.toLowerCase()}-1">${type}</label>
</div>`;
const generateTripTypeListTemplate = (type) =>
  TYPES.reduce((template, tripType) => template + createTripTypeItem(tripType, tripType === type), '');


// const createOfferMarkup = (offer, isDisabled) => offer
//   ? offer.map((item) => {
//     const isSelected = offer.some((userOffer) => offer.title === userOffer.title);
//     return `<div class="event__offer-selector">
//     <input class="event__offer-checkbox  visually-hidden"
//     id="${item.type}-${item.id}" " type="checkbox"
//     name="event-offer-${item.type}"  ${isSelected ? 'checked' : ''}
//     ${isDisabled ? 'disabled' : ''}>
//     <label class="event__offer-label" for="${item.type}-${item.id}">
//       <span class="event__offer-title">${item.offers.title}</span>
//       &plus;&euro;&nbsp;
//       <span class="even__offer-price">${item.offers.price}</span>
//     </label>
//   </div>`;}) : '';

const isCheckedOffer = (availableOffer, checkedOffers) => {
  if (availableOffer && checkedOffers) {
    return checkedOffers.some((item) => [item.title].indexOf(availableOffer.title) !== -1);
  }
};

const createOfferMarkup = (availableOffers, checkedOffers, type) => {
  let id = 1;
  if (availableOffers) {
    return availableOffers
      .filter((item) => item.type === type)[0]
      .offers.map((item) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox"
         name="event-offer-${item.title}" data-title="${item.title}"
        ${isCheckedOffer(item, checkedOffers) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${id++}">
          <span class="event__offer-title">${item.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${item.price}</span>
        </label>
      </div>
      `).join(' ');
  }
};

const createOfferMarkupArr = (OFFERS, type) =>
  OFFERS.filter((i) => i.type === type)[0].offers.length;

const createPictureMarkup = (photo) => photo
  ? photo.map((item) => `<img class="event__photo" src="${item.src}" alt="${item.description}">`).join(' ')
  : '';

const createRouteFormEdit = (data, OFFERS, DESTINATIONS) => {
  const {type, name, timeFrom, timeTo, price, offers, info,
    photo, id, isEditing, isDisabled, isSaving, isDeleting} = data;


  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>
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
        <input class="event__input  event__input--destination" id="event-destination-1" required type="text" name="event-destination" value="${name ? he.encode(name.toString()) : ''}"
        list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
            ${createNameDataList(DESTINATIONS)}
            </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" readonly type="text" name="event-start-time" required value=${getDateFormat(timeFrom)} ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" readonly type="text" name="event-end-time" required value=${getDateFormat(timeTo)} ${isDisabled ? 'disabled' : ''}>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" required type="number" name="event-price" value=${price ? he. encode(price.toString()) : ''} ${isDisabled ? 'disabled' : ''}>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit"
      ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset"
      ${isDisabled ? 'disabled' : ''}>${isEditing ? getFlagValue(isDeleting) : 'Cancel'}
    </button>
    <button class="event__rollup-btn" type="button">
     <span class="visually-hidden">Open event</span>
    </button>

    </header>
    <section class="event__details">
     <section class="event__section  event__section--offers">
        ${createOfferMarkupArr(OFFERS, type) ? '<h3 class="event__section-title  event__section-title--offers">Offers</h3>' : ''}
          <div class="event__available-offers">
      ${createOfferMarkup(OFFERS, offers, type)}
      </div>
      </section>
      <section class="event__section  event__section--destination">
      ${getMarkupIsElemHave(info, '<h3 class="event__section-title  event__section-title--destination">Destination</h3>')}
      <p class="event__destination-description">${getMarkupIsElemHave(info, info)}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${createPictureMarkup(photo)}
        </div>
      </div>
    </section>
    </section>
  </form>
</li>`;
};

export default class FormPoint extends SmartView{
  constructor(data = BLANK_DATA, OFFERS, DESTINATIONS, isEditing = false) {
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

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__details').addEventListener('change', this._offersSelectionHandler);
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
    document.querySelectorAll('#destination-list-1 option')
      .forEach((city) => {
        if (city.value !== evt.target.value) {
          evt.target.setCustomValidity('Select a destination from the list');
          evt.target.reportValidity();
        } else {
          this.updateData({
            name: evt.target.value,
            info:  evt.target.value,
            photo: evt.target.value,
          });
        }
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
        price: Number(evt.target.value),
      }, true);
    }
  }

  _offersSelectionHandler(evt) {
    evt.preventDefault();

    const offerCopy = this._offers;

    const getFilterOffersForType = () =>  offerCopy.filter((elem) =>
      this._state.type === elem.type.toLowerCase());

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
    return Object.assign(
      {},
      data,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseStateToData(state) {
    state = Object.assign({}, state);
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return state;
  }

}
