import dayjs from 'dayjs';
import {getRandomInteger, getRandomArray} from '../util.js';

const HOURS_GAP = 24;
const MIN_EVENT_DURATION_IN_MINUTES = 60;
const MAX_EVENT_DURATION_IN_MINUTES = 10080; // 7 days

const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-In', 'Sightseeing', 'Restaurant'];
const POINTS_CITIES = ['Budapest', 'Barcelona', 'Hamburg', 'Paris'];
const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const generateOffer = () => {
  const OFFERS_TITLES = ['Order Uber', 'Rent a car', 'Add luggage', 'Switch to comfort', 'Add meal',
    'Choose seats', 'Travel by train', 'Add breakfast', 'Book tickets', 'Lunch in city',
  ];
  const OFFERS_PRICES = [20, 200, 30, 100, 15, 5, 40, 50];

  return {
    title: OFFERS_TITLES[getRandomInteger(0, OFFERS_TITLES.length -1)],
    price: OFFERS_PRICES[getRandomInteger(0, OFFERS_PRICES.length -1)],
  };
};

const getOffers = function() {
  return new Array(getRandomInteger(0, 5)).fill().map(() => generateOffer());
};
const generatePhotoOfDestination = () => {
  const photosNumber = getRandomInteger(1,100);
  return {
    src: `http://picsum.photos/248/152?r=${photosNumber}`,
    description: 'Some beautiful place',
  };
};

const getPhotoOfDestination = function () {
  return  new Array(getRandomInteger(0, 5)).fill().map(() => generatePhotoOfDestination());
};

const generateData = () => {
  const startTime = dayjs().add(getRandomInteger(-HOURS_GAP, HOURS_GAP), 'hour').toDate();
  const endTime = dayjs(startTime).add(getRandomInteger(MIN_EVENT_DURATION_IN_MINUTES, MAX_EVENT_DURATION_IN_MINUTES), 'minute').toDate();
  return {
    type: TYPES[getRandomInteger(0, TYPES.length - 1)],
    name: POINTS_CITIES[getRandomInteger(0, POINTS_CITIES.length - 1)],
    timeFrom: startTime,
    timeTo: endTime,
    price: getRandomInteger(5, 200),
    offers: getOffers(),
    info:getRandomArray(DESCRIPTIONS).slice(0, 5).join(' '),
    photo: getPhotoOfDestination(),
    isFavorite: Boolean(getRandomInteger(0,1)),
  };
};

export {generateData};
