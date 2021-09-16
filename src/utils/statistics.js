import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// const SECONDS_IN_DAY = 86400000;
// const SECONDS_IN_HOURS = 3600000;

// const getTimeFormat = (diff) => {
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

// const getSumPriceFromType = (data) => {
//   const dataSortByPrice = data.slice().sort((a, b) => b.price - a.price);

//   let result = null;
//   result = Object.fromEntries(dataSortByPrice.map((item) => [item.type, 0]));
//   dataSortByPrice.forEach((item) => {
//     result[item.type] += item.price;
//   });
//   return result;
// };

// const getSumTimeFromType = (data) => {
//   const dataSortByTime = data.slice()
//     .sort((elem1, elem2) => dayjs(elem2.timeTo).
//       diff(dayjs(elem2.timeFrom)) - dayjs(elem1.timeTo).diff(dayjs(elem1.timeFrom)));

//   let result = null;
//   result = Object.fromEntries(dataSortByTime.map((item) => [item.type, 0]));
//   dataSortByTime.forEach((item) => {
//     result[item.type] += (item.timeTo - item.timeFrom);
//   });
//   return result;
// };

// const getQuantityType = (data) => {
//   let result = null;
//   result = Object.fromEntries(data.map((item) => [item.type, 0]));
//   data.forEach((item) => {
//     result[item.type] += 1;
//   });
//   return result;
// };

// const getSortType = ((val) => Object.keys(val).sort((a, b) => val[b] - val[a]));

// export {getTimeFormat, getSumPriceFromType, getSumTimeFromType, getQuantityType, getSortType};
// let chartData = [];

const getChartData = (data = []) => {
  // eslint-disable-next-line no-shadow
  const chartData = data.reduce((chartData, {type, price, timeFrom, timeTo}) => {
    if (chartData[type]) {
      chartData[type].money += price;
      chartData[type].type += 1;
      chartData[type].time += dayjs(timeTo).diff(dayjs(timeFrom));
    } else {
      chartData[type] = {
        money: price,
        type: 1,
        time: dayjs(timeTo).diff(dayjs(timeFrom)),
      };
    }

    return chartData;
  }, {});

  // eslint-disable-next-line no-shadow
  return Object.entries(chartData).map(([type, data]) => ({
    tripType: type.toUpperCase(),
    data,
  }));
};

const renderChart = ({ctx, labels, data, formatter, title}) => {
  new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 30,
        minBarLength: 90,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        display: true,
        text: title,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export {getChartData, renderChart};

