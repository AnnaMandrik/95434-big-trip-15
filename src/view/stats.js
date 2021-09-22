import AbstractView from './abstract.js';
import {getChartData, renderChart} from '../utils/statistics.js';
import {MILLISECONDS_IN_MINUTE, getDiffDate} from '../utils/task.js';
import {BAR_HEIGHT, SCALE, ChartTitle} from '../utils/const.js';

const renderMoneyChart = (ctx, chartData = [], title) => {
  const options = {
    ctx,
    labels: [],
    data: [],
    formatter: (val) => `€ ${val}`,
    title,
  };
  chartData.forEach((data) => {
    options.labels.push(data.tripType);
    options.data.push(data.data.money);
  });
  renderChart(options);
};
const renderTypeChart = (ctx, chartData, title) => {
  const options = {
    ctx,
    labels: [],
    data: [],
    formatter: (val) => `${val}x`,
    title,
  };
  chartData.forEach((data) => {
    options.labels.push(data.tripType);
    options.data.push(data.data.type);
  });
  renderChart(options);
};
const renderTimeSpendChart = (ctx, chartData, title) => {
  const options = {
    ctx,
    labels: [],
    data: [],
    formatter: (val) => getDiffDate(Math.round(val/MILLISECONDS_IN_MINUTE)),
    title,
  };
  chartData.forEach((data) => {
    options.labels.push(data.tripType);
    options.data.push(data.data.time);
  });
  renderChart(options);
};


const createTemplateStatistic = () => `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>
          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>
          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>
          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
export default class Stats extends AbstractView {
  constructor(data = []) {
    super();
    this._data = data;
    this._moneyCtx = null;
    this._typeCtx = null;
    this._timeCtx = null;
  }

  getTemplate() {
    return createTemplateStatistic(this._data);
  }

  removeElement() {
    super.removeElement();
    this._moneyCtx = null;
    this._typeCtx = null;
    this._timeCtx = null;
  }

  updateDate(data = []) {
    this._data = data;
  }

  renderCharts() {
    if (this._moneyCtx && this._typeCtx && this._timeCtx) {
      return;
    }
    const chartData = getChartData(this._data);
    this._moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    this._typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    this._timeCtx = this.getElement().querySelector('.statistics__chart--time');
    this._moneyCtx.height = BAR_HEIGHT * SCALE;
    this._typeCtx.height = BAR_HEIGHT * SCALE;
    this._timeCtx.height = BAR_HEIGHT * SCALE;

    renderMoneyChart(this._moneyCtx, chartData.slice().sort((dataA, dataB) => dataB.data.money - dataA.data.money), ChartTitle.MONEY);
    renderTypeChart(this._typeCtx, chartData.slice().sort((dataA, dataB) => dataB.data.type - dataA.data.type), ChartTitle.TYPE);
    renderTimeSpendChart(this._timeCtx, chartData.slice().sort((dataA, dataB) => dataB.data.time - dataA.data.time), ChartTitle.TIME);
  }
}
