import SiteMenuView from './view/menu.js';
import RouteInfoView from './view/route-info.js';
import SiteFiltersView from './view/filters.js';
import TripRoutePresenter from './presenter/trip-route.js';
import {generateData} from './mock/data.js';
import dayjs from 'dayjs';
import {RenderPosition, render} from './utils/render.js';


const POINT_COUNT = 15;

const data = new Array(POINT_COUNT).fill().map(generateData);


const tripMainElement = document.querySelector('.trip-main');
const tripControlsNaElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const sortTripPointsByStart = () => data.slice().sort((pointA, pointB) => dayjs(pointA.timeFrom).diff(pointB.timeFrom));
const tripPointsSortedByStart = sortTripPointsByStart(data);
render(tripMainElement, new RouteInfoView(tripPointsSortedByStart), RenderPosition.AFTERBEGIN); //Инфо о путешествии
render(tripControlsNaElement, new SiteMenuView(), RenderPosition.BEFOREEND); // Меню
render(tripControlsFiltersElement, new SiteFiltersView(), RenderPosition.BEFOREEND); //Фильтры


const tripRoutePresenter = new TripRoutePresenter(tripEventsElement);
tripRoutePresenter.init(data);
