import {FilterType} from '../utils/const.js';


// const filter = {
//   // [FilterType.EVERYTHING]: (point) => point,
//   [FilterType.FUTURE]: (point) => {
//     const nowDate =  Date.now();
//     const pointInFuture = point.timeFrom >= nowDate;
//     const pointIsContinuing = point.timeFrom < nowDate && point.timeTo > nowDate;
//     return pointInFuture || pointIsContinuing;
//   },
//   [FilterType.PAST]: (point) => {
//     const nowDate =  Date.now();
//     const pointIsContinuing = point.timeFrom < nowDate && point.timeTo > nowDate;
//     const pointInPast = point.timeTo < nowDate;
//     return pointIsContinuing || pointInPast;
//   },
// };
const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point)=> point.timeFrom >= Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => point.timeTo < Date.now()),
};

export {filter};
