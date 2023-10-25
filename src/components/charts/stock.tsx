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
}

const Stock: React.FC<StockProps> = ({ data, startDate }) => {

  const stockOptions = {
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
      min: startDate,
    },
    series: [{
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
          [1, Highcharts?.color(Highcharts?.getOptions()?.colors?.[0]).setOpacity(0).get('rgba')]
        ]
      }
    }]
  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={stockOptions} />
    </div>
  );
};

export default Stock;
