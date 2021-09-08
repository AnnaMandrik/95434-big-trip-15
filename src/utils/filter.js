import {FilterType} from '../utils/const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point)=> point.timeFrom > Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => point.timeFrom < Date.now()),
};

export {filter};
