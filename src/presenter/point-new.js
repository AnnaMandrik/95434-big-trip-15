import FormPointView from '../view/route-form-edit.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';


export default class NewPoint {
  constructor(formPointContainer, changeData, offersModel, destinationsModel) {
    this._formPointContainer = formPointContainer;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._pointComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._onEventEscKeyDown = this._onEventEscKeyDown.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {

    if (this._pointComponent !== null) {
      return;
    }

    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();

    this._pointComponent = new FormPointView(offers, destinations);
    this._pointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointComponent.setCloseFormButtonClickHandler(this._handleDeleteClick);
    this._pointComponent.setDeleteClickHandler( this._handleDeleteClick);

    render(this._formPointContainer, this._pointComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this._onEventEscKeyDown);
  }

  destroy() {
    if (this._pointComponent === null) {
      return;
    }

    remove(this._pointComponent);
    this._pointComponent = null;
    document.removeEventListener('keydown', this._onEventEscKeyDown);
  }

  _onEventEscKeyDown(evt) {
    if( evt.key === 'Escape' ||  evt.key === 'Esc') {
      evt.preventDefault();
      this._pointComponent._unlockButton();
      this.destroy();
    }
  }

  setSaving() {
    this._pointComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._pointComponent._unlockButton();
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );

  }

  _handleDeleteClick() {
    this._pointComponent._unlockButton();
    this.destroy();
  }
}

