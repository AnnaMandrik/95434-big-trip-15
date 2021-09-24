import AbstractView from './abstract.js';

const createTripEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointsList extends AbstractView{
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
