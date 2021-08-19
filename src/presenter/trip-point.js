import FormPointView from '../view/route-form-edit.js';
import ListPointView from '../view/route-point-in-list.js';
import {RenderPosition, render,replace, remove} from '../utils/render.js';

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
    this._pointComponent.setCloseFormButtonClickHandler(this._handleFormSubmit);

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
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
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
