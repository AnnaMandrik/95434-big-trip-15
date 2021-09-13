import dayjs from 'dayjs';

const SECONDS_IN_DAY = 86400000;
const SECONDS_IN_HOURS = 3600000;

const getTimeFormat = (diff) => {
  if (diff === 0) {
    return '';
  } if (diff > SECONDS_IN_DAY) {
    return `${dayjs(diff).format('DD')  }D ${  dayjs(diff).format('hh')  }H ${  dayjs(diff).format('mm')  }M`;
  } if (diff <= SECONDS_IN_HOURS) {
    return `${dayjs(diff).format('mm')  }M`;
  } if (diff <= SECONDS_IN_DAY) {
    return `${dayjs(diff).format('hh')  }H ${  dayjs(diff).format('mm')  }M`;
  }
};

const getSumPriceFromType = (data) => {
  const dataSortByPrice = data.slice().sort((a, b) => b.price - a.price);

  let result = null;
  result = Object.fromEntries(dataSortByPrice.map((item) => [item.type, 0]));
  dataSortByPrice.forEach((item) => {
    result[item.type] += item.price;
  });
  return result;
};

const getSumTimeFromType = (data) => {
  const dataSortByTime = data.slice()
    .sort((elem1, elem2) => dayjs(elem2.timeTo).
      diff(dayjs(elem2.timeFrom)) - dayjs(elem1.timeTo).diff(dayjs(elem1.timeFrom)));

  let result = null;
  result = Object.fromEntries(dataSortByTime.map((item) => [item.type, 0]));
  dataSortByTime.forEach((item) => {
    result[item.type] += (item.timeTo - item.timeFrom);
  });
  return result;
};

const getQuantityType = (data) => {
  let result = null;
  result = Object.fromEntries(data.map((item) => [item.type, 0]));
  data.forEach((item) => {
    result[item.type] += 1;
  });
  return result;
};

const getSortType = ((val) => Object.keys(val).sort((a, b) => val[b] - val[a]));

export {getTimeFormat, getSumPriceFromType, getSumTimeFromType, getQuantityType, getSortType};


