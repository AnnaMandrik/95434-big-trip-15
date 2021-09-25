import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const getChartData = (someData = []) => {
  const anotherChartData = someData.reduce((chartData, {type, price, timeFrom, timeTo}) => {
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

  return Object.entries(anotherChartData).map(([type, data]) => ({
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


