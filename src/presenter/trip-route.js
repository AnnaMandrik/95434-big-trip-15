import RouteSortView from '../view/route-sort.js';
import EmptyListView from '../view/empty-list.js';
import LoadingView from '../view/loading.js';
import PointsListView from '../view/points-list.js';
import TripPointPresenter from '../presenter/trip-point.js';
import NewPointPresenter from '../presenter/new-point.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {sortTripPoints} from '../utils/task.js';
import {SORT_TYPE, UserAction, UpdateType, FilterType, State as PointPresenterViewState} from '../utils/const.js';
import {filter} from '../utils/filter.js';


export default class TripRoute {
  constructor(tripRouteContainer, pointsModel, filterModel, api, offersModel, destinationsModel) {
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripRouteContainer = tripRouteContainer;
    this._tripEventListComponent = new PointsListView();
    this._tripPointPresenter = {};
    this._filterType = FilterType.EVERYTHING;
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._tripSortComponent = null;
    this._noPointComponent = null;
    this._loadingComponent = new LoadingView();
    this._isLoading = true;
    this._api = api;


    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);


    this._pointNewPresenter = new NewPointPresenter(this._tripRouteContainer, this._handleViewAction,
      this._offersModel, this._destinationsModel);
  }


  init() {
    render(this._tripRouteContainer, this._tripEventListComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderContainer();
  }

  destroy() {
    this._clearPointList({resetSortType: true});
    remove(this._tripEventListComponent);
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
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

    return sortTripPoints(this._currentSortType, filteredPoints);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._tripPointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._tripPointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._tripPointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._tripPointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    this._tripSortComponent = new RouteSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripRouteContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEmptyList() {
    this._noPointComponent = new EmptyListView(this._filterType);
    render(this._tripRouteContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(data) {
    const pointPresenter = new TripPointPresenter(this._tripEventListComponent, this._handleViewAction,
      this._handleModeChange, this._offersModel, this._destinationsModel);
    pointPresenter.init(data);
    this._tripPointPresenter[data.id] = pointPresenter;
  }

  _renderPoints(points) {
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderLoading() {
    render(this._tripRouteContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _clearPointList({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
      .values(this._tripPointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPointPresenter = {};

    remove(this._tripSortComponent);
    remove(this._noPointComponent);
    remove(this._loadingComponent);


    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.DEFAULT;
    }
  }


  _renderContainer() {
    if(this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();
    if(!points.length) {
      this._renderEmptyList();
      return;
    }
    this._renderSort();
    this._renderPoints(points);
  }
}
