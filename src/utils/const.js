const SORT_TYPE = {
  DEFAULT: 'Day',
  PRICE: 'Price',
  TIME: 'Time',
};

const SET_FLATPICKR = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  // eslint-disable-next-line camelcase
  time_24hr: true,
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
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export {SORT_TYPE, SET_FLATPICKR, UserAction, UpdateType, FilterType};
