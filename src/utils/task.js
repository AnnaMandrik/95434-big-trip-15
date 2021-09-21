import dayjs from 'dayjs';
import {SORT_TYPE} from './const.js';

// const SECONDS_IN_DAY = 86400000;
// const SECONDS_IN_HOURS = 3600000;

const MINUTES_IN_A_DAY = 60 * 24;
const MINUTES_IN_A_HOUR = 60;
const MILLISECONDS_IN_MINUTE = 60 * 100;


const getDateFormat = ((date) => dayjs(date).format('DD/MM/YYHH:mm'));
const getDateISO = ((date) => dayjs(date).format('YYYY-MM-DDTHH:mm'));
const getDateHoursMinutes = ((date) => dayjs(date).format('HH:mm'));
const getDateMonthDay = ((date) => dayjs(date).format('MMM DD'));

const padNumberWithZeros = (number, padCount = 2) =>
  Number(number).toString(10).padStart(padCount, '0');


const getDiffDate = (diffInMinutes) => {
  let formattedDiff = '';
  const daysNumber = Math.floor(diffInMinutes / MINUTES_IN_A_DAY);
  const hoursNumber = Math.floor(diffInMinutes / MINUTES_IN_A_HOUR);
  let leftMinutes = 0;

  if (daysNumber) {
    const leftHours = Math.floor((diffInMinutes - daysNumber * MINUTES_IN_A_DAY) / MINUTES_IN_A_HOUR);
    leftMinutes = diffInMinutes - daysNumber * MINUTES_IN_A_DAY - leftHours * MINUTES_IN_A_HOUR;
    formattedDiff = `${padNumberWithZeros(daysNumber)}D ${padNumberWithZeros(leftHours)}H ${padNumberWithZeros(leftMinutes)}M`;
  } else if (hoursNumber) {
    leftMinutes = diffInMinutes - hoursNumber * MINUTES_IN_A_HOUR;
    formattedDiff = `${padNumberWithZeros(hoursNumber)}H ${padNumberWithZeros(leftMinutes)}M`;
  } else {
    formattedDiff = `${padNumberWithZeros(diffInMinutes)}M`;
  }

  return formattedDiff;
};
// const getDiffDate = (dateTo, dateFrom) => {
//   const diff = dayjs(dateTo).diff(dayjs(dateFrom));
//   if (diff === 0) {
//     return '';
//   } if (diff > SECONDS_IN_DAY) {
//     return `${dayjs(diff).format('DD')  }D ${  dayjs(diff).format('hh')  }H ${  dayjs(diff).format('mm')  }M`;
//   } if (diff <= SECONDS_IN_HOURS) {
//     return `${dayjs(diff).format('mm')  }M`;
//   } if (diff <= SECONDS_IN_DAY) {
//     return `${dayjs(diff).format('hh')  }H ${  dayjs(diff).format('mm')  }M`;
//   }
// };

const sortStartDateUp = (pointA, pointB) =>
  dayjs(pointA.timeFrom).diff(pointB.timeFrom);


const sortPrice = (pointA, pointB) => pointB.price - pointA.price;

const sortTime = (pointA, pointB) =>
  dayjs(pointB.timeTo).diff(dayjs(pointB.timeFrom)) - dayjs(pointA.timeTo).diff(dayjs(pointA.timeFrom));

// const getMarkupIsElemHave = (elem, markup) => elem ? markup : '';

const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');


const sortTripPoints = (sortType, tripPoints) => {
  switch (sortType) {
    case SORT_TYPE.PRICE:
      return tripPoints.slice().sort(sortPrice);
    case SORT_TYPE.TIME:
      return tripPoints.slice().sort(sortTime);
    default:
      return tripPoints.slice().sort(sortStartDateUp);
  }
};


export {sortTripPoints,  getDiffDate, sortStartDateUp, sortTime, sortPrice, getDateFormat, getDateISO, getDateHoursMinutes, getDateMonthDay, isDatesEqual, MILLISECONDS_IN_MINUTE};

