import SiteMenuView from './view/menu.js';
import RouteInfoView from './view/route-info.js';
import StatsView from './view/stats.js';
import TripRoutePresenter from './presenter/trip-route.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationModel from './model/destination.js';
import OffersModel from './model/offers.js';
import {RenderPosition, render, remove} from './utils/render.js';
// import {sortStartDateUp} from './utils/task.js';
import {MenuItem, UpdateType, FilterType} from './utils/const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic nuihljlojnu9876b';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNavElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const pageBodyContainer = document.querySelectorAll('.page-body__container');

const api = new Api(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();
const siteMenuComponent = new SiteMenuView();
const tripRoutePresenter = new TripRoutePresenter(tripEventsElement, pointsModel, filterModel, destinationsModel, offersModel, api);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);

// const tripPointsSortedByStart = data.sort(sortStartDateUp);
const buttonNewEvent = document.querySelector('.trip-main__event-add-btn');
buttonNewEvent.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripRoutePresenter.createPoint();
  buttonNewEvent.disabled = true;
});

const activateCreateTripPointButton = (updateType) => {
  if (updateType === UpdateType.INIT) {
    buttonNewEvent.disabled = false;
  }
};

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
      pageBodyContainer.forEach((item) => item.classList.remove('page-body__container-line'));
      break;

    case MenuItem.STATS:
      tripRoutePresenter.destroy();
      statsComponent = new StatsView(pointsModel.getPoints());
      render(tripEventsElement, statsComponent, RenderPosition.BEFOREEND);
      statsComponent.renderCharts();
      buttonNewEvent.disabled = true;
      inputFilters.forEach((input) => {
        input.disabled = true;
        pageBodyContainer.forEach((item) => item.classList.add('page-body__container-line'));
      });
      break;
  }
};
render(tripMainElement, new RouteInfoView(), RenderPosition.AFTERBEGIN);
//render(tripControlsNavElement, siteMenuComponent, RenderPosition.BEFOREEND);


pointsModel.addObserver(activateCreateTripPointButton);
tripRoutePresenter.init();
// filterPresenter.init();
buttonNewEvent.disabled = true;


// api.getData()
//   .then(([points, offers, destinations]) => {
//     console.log(points);
//     offersModel.setOffers(offers);
//     destinationsModel.setDestinations(destinations);
//     console.log();
//     pointsModel.setPoints(UpdateType.INIT, points);
//     console.log(points);
//   })
//   .then(() => {
//     filterPresenter.init();
//     render(tripControlsNavElement, siteMenuComponent, RenderPosition.BEFOREEND);
//     siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
//   })
//   .catch(() => {
//     pointsModel.setPoints(UpdateType.INIT, []);
//     filterPresenter.init();
//     render(tripControlsNavElement, siteMenuComponent, RenderPosition.BEFOREEND);
//     siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
//   });

api.getOffers()
.then((offers) => {
  offersModel.setOffers(offers);

  api.getDestinations()
.then((destinations) => {
  destinationsModel.setDestinations(destinations);
});


api.getPoints()
.then((points) => {
  pointsModel.setPoints(UpdateType.INIT, points);
});

});

// api.getDestinations()
// .then((destinations) => {
//   destinationsModel.setDestinations(destinations);
// });


// api.getPoints()
// .then((points) => {
//   pointsModel.setPoints(UpdateType.INIT, points);
// });



