// // Функция из интернета по генерации случайного числа из диапазона
// // Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
// const getRandomInteger = (a = 0, b = 1) => {
//   const lower = Math.ceil(Math.min(a, b));
//   const upper = Math.floor(Math.max(a, b));

//   return Math.floor(lower + Math.random() * (upper - lower + 1));
// };


// const getRandomArray = (arr) => {
//   const results = [];
//   results.push(arr.slice(0, Math.ceil(Math.random() * arr.length)));
//   return results;
// };


const getOffersByType = (type, offers) => {
  const currentOffers = offers.find((offer) => offer.type === type);
  return currentOffers.offers ? currentOffers.offers : [];
};


const getDestination = (city, destination) => destination.find((item) => item.name === city);


const getIsDescription = (city, destination) => {
  const cityDescription = destination.find((item) => item.name === city);
  if (destination.description) {
    return Boolean(cityDescription.description);
  }
  return '';
};


const getIsPictures = (city, destination) => {
  const cityDescription = destination.find((item) => item.name === city);
  if (destination.pictures) {
    return Boolean(cityDescription.pictures);
  }
  return '';
};

const getIsOffers = (type, offers) => Boolean(getOffersByType(type, offers).length);


export {getOffersByType, getDestination, getIsDescription, getIsPictures, getIsOffers};
