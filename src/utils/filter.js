import {FilterType} from '../utils/const.js';
import {getActualDate} from '../utils/task.js';


const getAdditionalPoints = (points) => points.filter((point) => point.timeFrom < getActualDate() && point.timeTo > getActualDate());
const getPastPoints = (points) => points.filter((point) => point.dateTo < getActualDate());


const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point)=> point.timeFrom >= getActualDate()),
  [FilterType.PAST]: (points) => [...getPastPoints(points), ...getAdditionalPoints(points)],
};

export {filter};
