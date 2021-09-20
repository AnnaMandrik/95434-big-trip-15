import {FilterType} from '../utils/const.js';

// const filter = {
//   [FilterType.FUTURE]: (point) => {
//     const currentDate = Date.now();
//     const isInFuture = point.startDate.getTime() >= currentDate;
//     const isContinuing = point.startDate.getTime() < currentDate && point.endDate.getTime() > currentDate;

//     return isInFuture || isContinuing;
//   },
//   [FilterType.PAST]: (point) => {
//     const currentDate = Date.now();

//     return point.endDate.getTime() < currentDate;
//   },

// };

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point)=> point.timeFrom >= Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => point.timeTo < Date.now()),
};

export {filter};
