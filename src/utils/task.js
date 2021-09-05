import dayjs from 'dayjs';

// const SECONDS_IN_DAY = 86400000;
// const SECONDS_IN_HOURS = 3600000;

const getDateFormat = ((date) => dayjs(date).format('DD/MM/YYHH:mm'));
const getDateISO = ((date) => dayjs(date).format('YYYY-MM-DDTHH:mm'));
const getDateHoursMinutes = ((date) => dayjs(date).format('HH:mm'));
const getDateMonthDay = ((date) => dayjs(date).format('MMM DD'));

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

const getMarkupIsElemHave = (elem, markup) => elem ? markup : '';

export {getMarkupIsElemHave, sortStartDateUp, sortTime, sortPrice, getDateFormat, getDateISO, getDateHoursMinutes, getDateMonthDay};

