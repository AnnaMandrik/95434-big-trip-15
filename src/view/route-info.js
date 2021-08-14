import dayjs from 'dayjs';
import AbstractView from './abstract.js';


const createRouteInfoTemplate = (data) => {
  const MAX_PATH_DISPLAY_LENGTH = 3;
  let totalCost = 0;

  const getRouteInfo = () => {
    const tripStartDate = dayjs(data[0].timeFrom).format('MMM D');
    const tripEndDate = dayjs(data[data.length - 1].timeFrom).format('MMM D');

    return `${tripStartDate}&nbsp;&mdash;&nbsp;${tripEndDate}`;
  };

  const routePath = data.reduce((path, point, index) => {
    const {name, offers, price } = point;
    totalCost += price;
    if (offers) {
      offers.forEach(() => totalCost += price);  // считает сумму
    }
    if (index === 0 || path[path.length - 1] !== name) {
      path.push(name);                                       // собирает названия
    }
    return path;
  }, []);

  const routePathString = () => {
    if (routePath.length > MAX_PATH_DISPLAY_LENGTH) {
      return `${routePath[0]} ... ${routePath[routePath.length - 1]}`;
    } else if (routePath.length <= MAX_PATH_DISPLAY_LENGTH) {
      return routePath.join(' &mdash; ');
    }
  };

  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${routePathString()}</h1>
        <p class="trip-info__dates">${data.length ? getRouteInfo() : ''}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`;
};

export default class RouteInfo extends AbstractView{
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createRouteInfoTemplate(this._data);
  }
}
