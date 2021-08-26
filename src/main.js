import SiteMenuView from './view/menu.js';
import RouteInfoView from './view/route-info.js';
import SiteFiltersView from './view/filters.js';
import TripRoutePresenter from './presenter/trip-route.js';
import {generateData} from './mock/data.js';
import {RenderPosition, render} from './utils/render.js';
import {sortStartDateUp} from './utils/task.js';


const POINT_COUNT = 15;

const data = new Array(POINT_COUNT).fill().map(generateData);


const tripMainElement = document.querySelector('.trip-main');
const tripControlsNaElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const tripPointsSortedByStart = data.sort(sortStartDateUp);
render(tripMainElement, new RouteInfoView(tripPointsSortedByStart), RenderPosition.AFTERBEGIN); //Инфо о путешествии
render(tripControlsNaElement, new SiteMenuView(), RenderPosition.BEFOREEND); // Меню
render(tripControlsFiltersElement, new SiteFiltersView(), RenderPosition.BEFOREEND); //Фильтры


const tripRoutePresenter = new TripRoutePresenter(tripEventsElement);
tripRoutePresenter.init(data);
