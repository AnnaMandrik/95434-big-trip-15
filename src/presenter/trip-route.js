import TripSortView from '../view/route-sorting.js';
import EmptyListView from '../view/route-form-create.js';
import TripEventsListView from '../view/points-list.js';
import TripPointPresenter from '../presenter/trip-point.js';
import {RenderPosition, render} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {SORT_TYPE, sortStartDateUp, sortPrice, sortTime} from '../utils/task.js';


export default class TripRoute {
  constructor(tripRouteContainer) {
    this._tripRouteContainer = tripRouteContainer;
    this._emptyListComponent = new EmptyListView();
    this._tripSortComponent = new TripSortView();
    this._tripEventListComponent = new TripEventsListView();
    this._tripPointPresenter = {};
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }


  init(data) {
    this._data = data.slice().sort(sortStartDateUp);
    this._sourcedData = data.slice();

    render(this._tripRouteContainer, this._tripEventListComponent, RenderPosition.BEFOREEND);

    this._renderContainer();
  }

  _handlePointChange(updatedPoint) {
    this._data = updateItem(this._data, updatedPoint);
    this._sourcedData = updateItem(this._sourcedData, updatedPoint);
    this._tripPointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _sortPoints(sortType) {
    switch(sortType) {
      case SORT_TYPE.PRICE:
        this._data.sort(sortPrice);
        break;
      case SORT_TYPE.TIME:
        this._data.sort(sortTime);
        break;
      default:
        this._data = this._sourcedData.slice().sort(sortStartDateUp);
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointList();
    this._renderTripEventsList();
  }

  _renderSort() {
    render(this._tripRouteContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEmptyList() {
    render(this._tripRouteContainer, this._emptyListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(data) {
    const pointPresenter = new TripPointPresenter(this._tripEventListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(data);
    this._tripPointPresenter[data.id] = pointPresenter;
  }

  _renderPoints() {
    this._data.forEach((data) => {
      this._renderPoint(data);
    });
  }

  _clearPointList() {
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPointPresenter = {};
  }

  _renderTripEventsList() {
    this._renderPoints();
  }

  _renderContainer() {
    this._renderSort();
    if(this._data.length === 0) {
      this._renderEmptyList();
      return;
    }
    this._renderTripEventsList();
  }
}
