import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting'
import darkUnica from 'highcharts/themes/dark-unica';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

darkUnica(Highcharts);

interface StockProps {
  data: number[][];
  startDate: number;
  dataOrders: (string | number)[][]
}

const Stock: React.FC<StockProps> = ({ data, startDate, dataOrders }) => {

  const stockOptions = {
    legend: {
      enabled: true,
    },
    yAxis: [{
      labels: {
        align: 'left',
      },
      title: {
        text: 'R$'
      }
    }],
    xAxis: {
      type: 'datetime',
      min: 949363200000, // 01/01/2000
    },
    series: [
      {
        data: data,
        // type: 'ohlc',
        type: 'areaspline',
        name: 'Preço',
        // id: ticker,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts?.getOptions()?.colors?.[0]],
            [1, Highcharts?.color(Highcharts?.getOptions()?.colors?.[0] || "#FFF").setOpacity(0).get('rgba')]
          ]
        }
      },
      {
        data: dataOrders?.filter(e => e[4] == 1)?.map(e => [e[13], e[6]]),
        name: 'Compra',
        type: 'scatter',
        color: 'red',
      },
      {
        data: dataOrders?.filter(e => e[4] == -1)?.map(e => [e[13], e[6]]),
        name: 'Venda',
        type: 'scatter',
        color: 'green',
      }
    ]
  }
  if (startDate) stockOptions.xAxis.min = startDate;


  return (
    <div>
      <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={stockOptions} />
    </div>
  );
};

export default Stock;
