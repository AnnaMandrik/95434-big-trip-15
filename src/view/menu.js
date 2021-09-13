import AbstractView from './abstract.js';
import {MenuItem} from '../utils/const.js';

const createMenuTemplate = () => `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn trip-tabs__btn-table trip-tabs__btn--active" data-menu-item="${MenuItem.TABLE}" href="#">Table</a>
  <a class="trip-tabs__btn trip-tabs__btn-stats" data-menu-item="${MenuItem.STATS}" href="#">Stats</a>
  </nav>`;

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);

    this._btnMenuTable = this.getElement().querySelector('.trip-tabs__btn-table');
    this._btnMenuStats = this.getElement().querySelector('.trip-tabs__btn-stats');
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
    this.setMenuItem(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {

    switch(menuItem) {
      case MenuItem.TABLE:
        this._btnMenuTable.disabled = true;
        this._btnMenuTable.classList.add('trip-tabs__btn--active');
        this._btnMenuStats.classList.remove('trip-tabs__btn--active');
        break;

      case MenuItem.STATS:
        this._btnMenuTable.classList.remove('trip-tabs__btn--active');
        this._btnMenuStats.classList.add('trip-tabs__btn--active');
        break;
    }
  }

}
