import RouteInfoView from '../view/route-info.js';
import {sortStartDateUp} from '../utils/task.js';
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
    const points = this._getSortedPoints();

    if (points.length === 0) {
      return '';
    }

    const prevInfoComponent = this._infoComponent;

    this._infoComponent = new RouteInfoView(points);

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

  _getSortedPoints() {
    return this._tripPointModel.getPoints().slice().sort(sortStartDateUp);
  }
}
