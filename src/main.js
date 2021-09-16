import SiteMenuView from './view/menu.js';
import RouteInfoView from './view/route-info.js';
import StatsView from './view/stats.js';
import TripRoutePresenter from './presenter/trip-route.js';
import FilterPresenter from './presenter/filter.js';
// import {data} from './mock/data.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import Destination from './data-destination.js';
import Offers from './data-offers.js';
import {RenderPosition, render, remove} from './utils/render.js';
// import {sortStartDateUp} from './utils/task.js';
import {MenuItem, UpdateType, FilterType} from './utils/const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 64fhi7954kg896jjo';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNavElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');


const api = new Api(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationData = new Destination();
const offersData = new Offers();
const siteMenuComponent = new SiteMenuView();
const tripRoutePresenter = new TripRoutePresenter(tripEventsElement, pointsModel, filterModel, destinationData, offersData, api);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);

// const tripPointsSortedByStart = data.sort(sortStartDateUp);
const buttonNewEvent = document.querySelector('.trip-main__event-add-btn');
buttonNewEvent.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripRoutePresenter.createPoint();
  buttonNewEvent.disabled = true;
});

let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  const inputFilters = tripControlsFiltersElement.querySelectorAll('.trip-filters__filter-input');
  switch (menuItem) {
    case MenuItem.TABLE:

      tripRoutePresenter.destroy();
      tripRoutePresenter.init();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      remove(statsComponent);
      buttonNewEvent.disabled = false;
      break;

    case MenuItem.STATS:

      tripRoutePresenter.destroy();
      statsComponent = new StatsView(pointsModel.getPoints());
      render(tripEventsElement, statsComponent, RenderPosition.BEFOREEND);
      statsComponent.renderCharts();
      buttonNewEvent.disabled = true;
      inputFilters.forEach((input) => {
        input.disabled = true;
      });
      break;
  }
};
render(tripMainElement, new RouteInfoView(), RenderPosition.AFTERBEGIN);
// render(tripControlsNavElement, siteMenuComponent, RenderPosition.BEFOREEND);
// siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

tripRoutePresenter.init();
filterPresenter.init();
buttonNewEvent.disabled = true;

api.getPoints().then((data) => {

  const [points, offers, destinations] = data;
  offersData.setOffers(offers);
  destinationData.setDestinations(destinations);
  pointsModel.setPoints(UpdateType.INIT, points);

  render(tripControlsNavElement, siteMenuComponent, RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  buttonNewEvent.disabled = false;

}).catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
  render(tripControlsNavElement, siteMenuComponent, RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  buttonNewEvent.disabled = false;
});

export {offersData, destinationData};
