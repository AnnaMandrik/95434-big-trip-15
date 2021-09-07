import AbstractView from './abstract.js';
import {FilterType} from '../utils/const.js';


const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};


const createNoPointsTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];

  return (`<p class="trip-events__msg">
  ${noPointTextValue}
  </p>`);
};

export default class EmptyList extends AbstractView{
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoPointsTemplate(this._data);
  }
}
