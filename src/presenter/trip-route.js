import TripSortView from '../view/route-sorting.js';
import EmptyListView from '../view/route-form-create.js';
import TripEventsListView from '../view/points-list.js';
import TripPointPresenter from '../presenter/trip-point.js';
import NewPointPresenter from '../presenter/point-new.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {sortStartDateUp, sortPrice, sortTime} from '../utils/task.js';
import {SORT_TYPE, UserAction, UpdateType, FilterType} from '../utils/const.js';
import {filter} from '../utils/filter.js';


export default class TripRoute {
  constructor(tripRouteContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripRouteContainer = tripRouteContainer;
    this._tripEventListComponent = new TripEventsListView();
    this._tripPointPresenter = {};
    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._tripSortComponent = null;
    this._noPointComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new NewPointPresenter(this._tripRouteContainer, this._handleViewAction);
  }


  init() {
    render(this._tripRouteContainer, this._tripEventListComponent, RenderPosition.BEFOREEND);

    this._renderContainer();
  }

  createPoint() {
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const points = this._pointsModel.getPoints();
    this._filterType = this._filterModel.getFilter();
    const filteredPoints = filter[this._filterType](points);

    switch(this._currentSortType) {
      case SORT_TYPE.PRICE:
        return filteredPoints.sort(sortPrice);
      case SORT_TYPE.TIME:
        return filteredPoints.sort(sortTime);
      case SORT_TYPE.DEFAULT:
        return filteredPoints.sort(sortStartDateUp);
    }

    return filteredPoints;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripPointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearPointList();
        this._renderContainer();
        break;
      case UpdateType.MAJOR:
        this._clearPointList({resetSortType: true});
        this._renderContainer();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointList();
    this._renderContainer();
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }
    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripRouteContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyList() {
    this._noPointComponent = new EmptyListView(this._filterType);
    render(this._tripRouteContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(data) {
    const pointPresenter = new TripPointPresenter(this._tripEventListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(data);
    this._tripPointPresenter[data.id] = pointPresenter;
  }

  _renderPoints(points) {
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _clearPointList({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPointPresenter = {};

    remove(this._tripSortComponent);

    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.DEFAULT;
    }
  }


  _renderContainer() {
    const points = this._getPoints();
    if(!points.length) {
      this._renderEmptyList();
      return;
    }
    this._renderSort();
    this._renderPoints(points);
  }
}
