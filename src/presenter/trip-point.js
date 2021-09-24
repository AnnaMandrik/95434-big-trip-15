import FormPointView from '../view/form-point.js';
import ListPointView from '../view/list-point.js';
import {RenderPosition, render,replace, remove} from '../utils/render.js';
import {UserAction, UpdateType, Mode, State} from '../utils/const.js';
import {isDatesEqual} from '../utils/task.js';
import {isEscEvent} from '../utils/common.js';


export default class TripPoint {
  constructor(formPointContainer, changeData, changeMode, offersModel, destinationsModel) {
    this._formPointContainer = formPointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._pointComponent = null;
    this._pointInListComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onEventEscKeyDown = this._onEventEscKeyDown.bind(this);
    this._handleEditFormClose = this._handleEditFormClose.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(data) {
    this._data = data;

    const prevPointComponent =  this._pointComponent;
    const prevPointInListComponent = this._pointInListComponent;

    const offers = this._offersModel.getOffers();
    const destinations = this._destinationsModel.getDestinations();

    this._pointComponent = new FormPointView(offers, destinations, data, true);
    this._pointInListComponent = new ListPointView(data, offers, destinations);

    this._pointInListComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointInListComponent.setEditFavoriteClickHandler(this._handleFavoriteClick);
    this._pointComponent.setCloseFormButtonClickHandler(this._handleEditFormClose);
    this._pointComponent.setDeleteClickHandler( this._handleDeleteClick);

    if (prevPointComponent === null || prevPointInListComponent === null) {
      render(this._formPointContainer, this._pointInListComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointInListComponent, prevPointInListComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointInListComponent, prevPointComponent);
      this._mode === Mode.DEFAULT;
    }

    remove(prevPointInListComponent);
    remove(prevPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointInListComponent);
  }

  resetView() {
    if(this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._pointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointInListComponent.shake(resetFormState);
        break;
    }
  }

  _replaceCardToForm() {
    replace(this._pointComponent, this._pointInListComponent);
    document.addEventListener('keydown', this._onEventEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._pointInListComponent, this._pointComponent);
    document.removeEventListener('keydown', this._onEventEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEventEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._pointComponent.reset(this._data);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._pointComponent._unlockButton();
    this._replaceCardToForm();
  }

  _handleFormSubmit(update) {
    const isMinorUpdate = !isDatesEqual(this._data.timeFrom, update.timeFrom) || !isDatesEqual(this._data.timeTo, update.timeTo);
    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }

  _handleDeleteClick(point = undefined) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleEditFormClose() {
    this._pointComponent.reset(this._data);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._onEventEscKeyDown);
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._data,
        {
          isFavorite: !this._data.isFavorite,
        },
      ),
    );
  }
}
