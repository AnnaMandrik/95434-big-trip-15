import {createMenuTemplate} from './view/menu.js';
import {createRouteInfoTemplate} from './view/route-info.js';
import {createFiltersTemplate} from './view/filters.js';
import {createTripSortingTemplate} from './view/route-sorting.js';
import {createRoutePointInList} from './view/route-point-in-list.js';
import {createRouteFormCreateTemplate} from './view/route-form-create.js';
import {createRouteFormEdit} from './view/route-form-edit.js';
import {generateData} from './mock/data.js';
import dayjs from 'dayjs';


const POINT_COUNT = 15;

const data = new Array(POINT_COUNT).fill().map(generateData);


const tripMainElement = document.querySelector('.trip-main');
const tripControlsNaElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const sortTripPointsByStart = () => data.slice().sort((pointA, pointB) => dayjs(pointA.timeFrom).diff(pointB.timeFrom));
const tripPointsSortedByStart = sortTripPointsByStart(data);
render(tripMainElement, createRouteInfoTemplate(tripPointsSortedByStart), 'afterbegin'); //Города, даты (старт/конец), стоимость
render(tripControlsNaElement, createMenuTemplate(), 'beforeend'); // Меню
render(tripControlsFiltersElement, createFiltersTemplate(), 'beforeend'); //Фильтры

render(tripEventsElement, createTripSortingTemplate(), 'afterbegin'); //Заголовки сортировки
render(tripEventsElement, createRouteFormCreateTemplate(), 'afterbegin'); //Пустая форма создания

for (let i = 0; i < POINT_COUNT; i++) {
  render(tripEventsElement, createRoutePointInList(data[i]), 'beforeend'); //Заполненный маршрут в виде списка
}


const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list'); //Редактирование точки маршрута
render(tripEventsListElement, createRouteFormEdit(data[0]), 'afterbegin');


