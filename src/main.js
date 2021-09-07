import SiteMenuView from './view/menu.js';
import RouteInfoView from './view/route-info.js';
import TripRoutePresenter from './presenter/trip-route.js';
import FilterPresenter from './presenter/filter.js';
import {generateData} from './mock/data.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {RenderPosition, render} from './utils/render.js';
import {sortStartDateUp} from './utils/task.js';


const POINT_COUNT = 15;

const data = new Array(POINT_COUNT).fill().map(generateData);

const pointsModel = new PointsModel();
pointsModel.setPoints(data);

const filterModel = new FilterModel();

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNaElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const tripPointsSortedByStart = data.sort(sortStartDateUp);
render(tripMainElement, new RouteInfoView(tripPointsSortedByStart), RenderPosition.AFTERBEGIN); //Инфо о путешествии
render(tripControlsNaElement, new SiteMenuView(), RenderPosition.BEFOREEND); // Меню

const tripRoutePresenter = new TripRoutePresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);

tripRoutePresenter.init();
filterPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripRoutePresenter.createPoint();
});
