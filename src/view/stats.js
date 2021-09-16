import AbstractView from './abstract.js';
// import Chart from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import {getTimeFormat, getSumPriceFromType, getSumTimeFromType, getQuantityType, getSortType} from '../utils/statistics.js';
// import {data} from '../mock/data.js';
import {getChartData, renderChart} from '../utils/statistics.js';
import {MILLISECONDS_IN_MINUTE, getDiffDate} from '../utils/task.js';

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
const BAR_HEIGHT = 55;
const SCALE = 5;
const ChartTitle = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME-SPEND',
};

// const typesPrice = Object.keys(getSumPriceFromType(data));
// const typesTime = Object.keys(getSumTimeFromType(data));
// const sortType = getSortType(getQuantityType(data));

// const sumPriceFromType = Object.values(getSumPriceFromType(data));
// const sumTimeFromType = Object.values(getSumTimeFromType(data));
// const quantityType = Object.values(getQuantityType(data)).sort((a, b) => b - a);

// const generateMoneyChart = (moneyCtx) => (new Chart(moneyCtx, {
//   plugins: [ChartDataLabels],
//   type: 'horizontalBar',
//   data: {
//     labels: typesPrice,
//     datasets: [{
//       data: sumPriceFromType,
//       backgroundColor: '#ffffff',
//       hoverBackgroundColor: '#ffffff',
//       anchor: 'start',
//       minBarLength: 100,
//       barThickness: 30,
//     }],
//   },
//   options: {
//     plugins: {
//       datalabels: {
//         font: {
//           size: 13,
//         },
//         color: '#000000',
//         anchor: 'end',
//         align: 'start',
//         formatter: (val) => `€ ${val}`,
//       },
//     },
//     title: {
//       display: true,
//       text: 'MONEY',
//       fontColor: '#000000',
//       fontSize: 23,
//       position: 'left',
//     },
//     scales: {
//       yAxes: [{
//         ticks: {
//           fontColor: '#000000',
//           padding: 5,
//           fontSize: 13,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false,
//         },
//       }],
//       xAxes: [{
//         ticks: {
//           display: false,
//           beginAtZero: true,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false,
//         },
//       }],
//     },
//     legend: {
//       display: false,
//     },
//     tooltips: {
//       enabled: false,
//     },
//   },
// }));

// const generateTimeSpendChart = (timeCtx) => (new Chart(timeCtx, {
//   plugins: [ChartDataLabels],
//   type: 'horizontalBar',
//   data: {
//     labels: typesTime,
//     datasets: [{
//       data: sumTimeFromType,
//       backgroundColor: '#ffffff',
//       hoverBackgroundColor: '#ffffff',
//       anchor: 'start',
//       minBarLength: 100,
//       barThickness: 30,
//     }],
//   },
//   options: {
//     plugins: {
//       datalabels: {
//         font: {
//           size: 13,
//         },
//         color: '#000000',
//         anchor: 'end',
//         align: 'start',
//         formatter: (val) => `${getTimeFormat(val)}`,
//       },
//     },
//     title: {
//       display: true,
//       text: 'TIME-SPEND',
//       fontColor: '#000000',
//       fontSize: 23,
//       position: 'left',
//     },
//     scales: {
//       yAxes: [{
//         ticks: {
//           fontColor: '#000000',
//           padding: 5,
//           fontSize: 13,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false,
//         },
//       }],
//       xAxes: [{
//         ticks: {
//           display: false,
//           beginAtZero: true,
//         },
//         gridLines: {
//           display: false,
//           drawBorder: false,
//         },
//       }],
//     },
//     legend: {
//       display: false,
//     },
//     tooltips: {
//       enabled: false,
//     },
//   },
// }));

// const generateTypeChart = (typeCtx) => (
//   new Chart(typeCtx, {
//     plugins: [ChartDataLabels],
//     type: 'horizontalBar',
//     data: {
//       labels: sortType,
//       datasets: [{
//         data: quantityType,
//         backgroundColor: '#ffffff',
//         hoverBackgroundColor: '#ffffff',
//         anchor: 'start',
//         minBarLength: 100,
//         barThickness: 30,
//       }],
//     },
//     options: {
//       plugins: {
//         datalabels: {
//           font: {
//             size: 13,
//           },
//           color: '#000000',
//           anchor: 'end',
//           align: 'start',
//           formatter: (val) => `${val}x`,
//         },
//       },
//       title: {
//         display: true,
//         text: 'TYPE',
//         fontColor: '#000000',
//         fontSize: 23,
//         position: 'left',
//       },
//       scales: {
//         yAxes: [{
//           ticks: {
//             fontColor: '#000000',
//             padding: 5,
//             fontSize: 13,
//           },
//           gridLines: {
//             display: false,
//             drawBorder: false,
//           },
//         }],
//         xAxes: [{
//           ticks: {
//             display: false,
//             beginAtZero: true,
//           },
//           gridLines: {
//             display: false,
//             drawBorder: false,
//           },
//         }],
//       },
//       legend: {
//         display: false,
//       },
//       tooltips: {
//         enabled: false,
//       },
//     },
//   }));
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

    // this._setCharts();
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

    // this._moneyChart = generateMoneyChart(moneyCtx, this._data);
    // this._timeChart = generateTypeChart(typeCtx, this._data);
    // this._typeChart = generateTimeSpendChart(timeCtx, this._data);
    renderMoneyChart(this._moneyCtx, chartData.slice().sort((dataA, dataB) => dataB.data.money - dataA.data.money), ChartTitle.MONEY);
    renderTypeChart(this._typeCtx, chartData.slice().sort((dataA, dataB) => dataB.data.type - dataA.data.type), ChartTitle.TYPE);
    renderTimeSpendChart(this._timeCtx, chartData.slice().sort((dataA, dataB) => dataB.data.time - dataA.data.time), ChartTitle.TIME);
  }
}


