import SiteMenuView from './view/menu.js';
import RouteInfoView from './view/route-info.js';
import StatsView from './view/stats.js';
import TripRoutePresenter from './presenter/trip-route.js';
import FilterPresenter from './presenter/filter.js';
import {data} from './mock/data.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {RenderPosition, render, remove} from './utils/render.js';
import {sortStartDateUp} from './utils/task.js';
import {MenuItem, UpdateType, FilterType} from './utils/const.js';


const pointsModel = new PointsModel();
pointsModel.setPoints(data);

const filterModel = new FilterModel();

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNaElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const tripPointsSortedByStart = data.sort(sortStartDateUp);
render(tripMainElement, new RouteInfoView(tripPointsSortedByStart), RenderPosition.AFTERBEGIN); //Инфо о путешествии

const siteMenuComponent = new SiteMenuView();
render(tripControlsNaElement, siteMenuComponent, RenderPosition.BEFOREEND); // Меню

const tripRoutePresenter = new TripRoutePresenter(tripEventsElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);

const buttonNewEvent = document.querySelector('.trip-main__event-add-btn');
buttonNewEvent.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripRoutePresenter.createPoint();
  buttonNewEvent.disabled = true;
});

let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  const inputFilters = document.querySelectorAll('.trip-filters__filter-input');
  switch (menuItem) {
    case MenuItem.TABLE:
      tripRoutePresenter.init();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      remove(statsComponent);
      buttonNewEvent.disabled = false;
      break;

    case MenuItem.STATS:
      tripRoutePresenter.destroy();
      statsComponent = new StatsView(pointsModel.getPoints());
      render(tripEventsElement, statsComponent, RenderPosition.BEFOREEND);
      buttonNewEvent.disabled = true;
      inputFilters.forEach((input) => {
        input.disabled = true;
      });
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);


filterPresenter.init();
tripRoutePresenter.init();


