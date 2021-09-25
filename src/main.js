import SiteMenuView from './view/site-menu.js';
import StatsView from './view/stats.js';
import TripRoutePresenter from './presenter/trip-route.js';
import FilterPresenter from './presenter/filter.js';
import InfoPresenter from './presenter/info.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationModel from './model/destination.js';
import OffersModel from './model/offers.js';
import {RenderPosition, render, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from './utils/const.js';
import { isOnline } from './utils/common.js';
import { toast } from './utils/toast.js';
import {showMsgError} from './utils/msg-error.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic nuihljlojnu9876b';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-cache';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNavElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const pageBodyContainerElement = document.querySelectorAll('.page-body__container');
const buttonNewEventElement = document.querySelector('.trip-main__event-add-btn');


const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();
const siteMenuComponent = new SiteMenuView();
const tripRoutePresenter = new TripRoutePresenter(tripEventsElement, pointsModel,
  filterModel, apiWithProvider, offersModel, destinationsModel);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const infoPresenter = new InfoPresenter(tripMainElement, pointsModel);


buttonNewEventElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripRoutePresenter.createPoint();
  buttonNewEventElement.disabled = true;
});


const activateCreateTripPointButton = (updateType) => {
  if (updateType === UpdateType.INIT) {
    buttonNewEventElement.disabled = false;
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
      document.querySelector('.trip-tabs__btn-stats').style.pointerEvents = 'AUTO';
      remove(statsComponent);
      buttonNewEventElement.disabled = false;
      pageBodyContainerElement.forEach((item) => item.classList.remove('page-body__container-line'));
      if (!isOnline()) {
        toast('You can\'t create new point offline');
        siteMenuComponent.setMenuItem(MenuItem.TASKS);
        break;
      }
      break;

    case MenuItem.STATS:
      document.querySelector('.trip-tabs__btn-stats').style.pointerEvents = 'NONE';
      tripRoutePresenter.destroy();
      statsComponent = new StatsView(pointsModel.getPoints());
      render(tripEventsElement, statsComponent, RenderPosition.BEFOREEND);
      statsComponent.renderCharts();
      buttonNewEventElement.disabled = true;
      inputFilters.forEach((input) => {
        input.disabled = true;
        pageBodyContainerElement.forEach((item) => item.classList.add('page-body__container-line'));
      });
      break;
  }
};

pointsModel.addObserver(activateCreateTripPointButton);
tripRoutePresenter.init();
buttonNewEventElement.disabled = true;


apiWithProvider.getOffers()
  .then((offers) => {
    offersModel.setOffers(offers);
  })
  .then(() => {
    apiWithProvider.getDestinations()
      .then((destinations) => {
        destinationsModel.setDestinations(destinations);
      });
  })
  .then(() => {
    apiWithProvider.getPoints()
      .then((points) => {
        pointsModel.setPoints(UpdateType.INIT, points);
        infoPresenter.init();
        filterPresenter.init();
        render(tripControlsNavElement, siteMenuComponent, RenderPosition.BEFOREEND);
        siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
      })
      .catch((error) => {
        showMsgError();
        throw new Error(error);
      });
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});


