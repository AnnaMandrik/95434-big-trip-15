import FormPointView from '../view/route-form-edit.js';
import ListPointView from '../view/route-point-in-list.js';
import {RenderPosition, render,replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {isDatesEqual} from '../utils/task.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPoint {
  constructor(formPointContainer, changeData, changeMode) {
    this._formPointContainer = formPointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

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

    this._pointComponent = new FormPointView(data);
    this._pointInListComponent = new ListPointView(data);

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
      replace(this._pointComponent, prevPointComponent);
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
    if( evt.key === 'Escape' ||  evt.key === 'Esc') {
      evt.preventDefault();
      this._pointComponent.reset(this._data);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit(update) {
    const isMinorUpdate = !isDatesEqual(this._data.timeFrom, update.timeFrom) || !isDatesEqual(this._data.timeTo, update.timeTo);
    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this._replaceFormToCard();
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
