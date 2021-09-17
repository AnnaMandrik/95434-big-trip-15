const SORT_TYPE = {
  DEFAULT: 'Day',
  PRICE: 'Price',
  TIME: 'Time',
};

const SET_FLATPICKR = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  'time_24hr': true,
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

const TRIP_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export {TRIP_TYPES, SORT_TYPE, SET_FLATPICKR, UserAction, UpdateType, FilterType, Mode, MenuItem};
