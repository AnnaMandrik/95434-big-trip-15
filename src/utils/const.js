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

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

const BAR_HEIGHT = 55;
const SCALE = 5;
const ChartTitle = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME-SPEND',
};

const SHAKE_ANIMATION_TIMEOUT = 600;

const MAX_PATH_DISPLAY_LENGTH = 3;


export {MAX_PATH_DISPLAY_LENGTH, SHAKE_ANIMATION_TIMEOUT, BAR_HEIGHT, SCALE, ChartTitle, TYPES, State, SORT_TYPE, SET_FLATPICKR, UserAction, UpdateType, FilterType, Mode, MenuItem};
