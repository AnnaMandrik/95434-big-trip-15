import SiteMenuView from './view/menu.js';
import RouteInfoView from './view/route-info.js';
import SiteFiltersView from './view/filters.js';
import TripSortView from './view/route-sorting.js';
import ListPointView from './view/route-point-in-list.js';
import EmptyListView from './view/route-form-create.js';
import FormPointView from './view/route-form-edit.js';
import TripEventsListView from './view/points-list.js';
import {generateData} from './mock/data.js';
import dayjs from 'dayjs';
import {RenderPosition, render,replace} from './utils/render.js';


const POINT_COUNT = 15;

const data = new Array(POINT_COUNT).fill().map(generateData);


const tripMainElement = document.querySelector('.trip-main');
const tripControlsNaElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const renderPoint = (tripEventsListElement, task) => {     //смена точки на форму
  const pointComponent = new FormPointView(task);
  const pointInListComponent = new ListPointView(task);

  const replaceCardToForm = () => {
    replace(pointComponent, pointInListComponent);
  };

  const replaceFormToCard = () => {
    replace(pointInListComponent, pointComponent);
  };

  pointInListComponent.setEditClickHandler(() => {
    replaceCardToForm();
  });

  pointComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
  });

  render(tripEventsListElement, pointComponent, RenderPosition.BEFOREEND);
};

const sortTripPointsByStart = () => data.slice().sort((pointA, pointB) => dayjs(pointA.timeFrom).diff(pointB.timeFrom));
const tripPointsSortedByStart = sortTripPointsByStart(data);
render(tripMainElement, new RouteInfoView(tripPointsSortedByStart), RenderPosition.AFTERBEGIN); //Инфо о путешествии
render(tripControlsNaElement, new SiteMenuView(), RenderPosition.BEFOREEND); // Меню
render(tripControlsFiltersElement, new SiteFiltersView(), RenderPosition.BEFOREEND); //Фильтры


render(tripEventsElement, new TripSortView(), RenderPosition.AFTERBEGIN); //Заголовки сортировки
render(tripEventsElement, new EmptyListView(), RenderPosition.AFTERBEGIN); //Пустая форма создания

const tripEventsListComponent = new TripEventsListView();   //Список точек ul
render(tripEventsElement, tripEventsListComponent, RenderPosition.BEFOREEND);


data.forEach((task) => {
  renderPoint(tripEventsListComponent, task);
});

