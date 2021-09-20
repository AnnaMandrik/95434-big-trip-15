import RouteInfoView from '../view/route-info.js';
import {sortTripPoints} from '../utils/task.js';
import {SORT_TYPE} from '../utils/const.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

export default class Info {
  constructor(container, tripPointModel) {
    this._container = container;
    this._tripPointModel = tripPointModel;
    this._infoComponent = null;


    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._tripPointModel.addObserver(this._handleModelEvent);
  }

  init() {
    const sortedTripPoints = sortTripPoints(SORT_TYPE.DEFAULT, this._tripPointModel.getPoints());
    const prevInfoComponent = this._infoComponent;

    this._infoComponent = new RouteInfoView(sortedTripPoints);

    if (prevInfoComponent === null) {
      render(this._container, this._infoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
