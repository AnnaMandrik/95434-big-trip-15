import {createMenuTemplate} from './view/menu.js';
import {createRouteInfoTemplate} from './view/route-info.js';
import {createRoutePriceTemplate} from './view/route-price.js';
import {createFiltersTemplate} from './view/filters.js';
import {createTripSortingTemplate} from './view/route-sorting.js';
import {createRoutePointInList} from './view/route-point-in-list.js';
import {createRouteFormCreateTemplate} from './view/route-form-create.js';
import {createRouteFormEdit} from './view/route-form-edit.js';

const POINT_COUNT = 3;

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNaElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainElement, createRouteInfoTemplate(), 'afterbegin');
render(tripControlsNaElement, createMenuTemplate(), 'beforeend');
render(tripControlsFiltersElement, createFiltersTemplate(), 'beforeend');

const tripInfoElement = tripMainElement.querySelector('.trip-info');
render(tripInfoElement, createRoutePriceTemplate(), 'beforeend');

render(tripEventsElement, createTripSortingTemplate(), 'afterbegin');
render(tripEventsElement, createRouteFormCreateTemplate(), 'afterbegin');

for (let i = 0; i < POINT_COUNT; i++) {
  render(tripEventsElement, createRoutePointInList(), 'beforeend');
}


const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');
render(tripEventsListElement, createRouteFormEdit(), 'afterbegin');


