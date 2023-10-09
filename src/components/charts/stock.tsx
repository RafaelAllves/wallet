import React, { useEffect, useState } from 'react';
// import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting'
import axios from 'axios';

// import pivotPoints from 'highcharts/modules/pivotpoints';
// import pivotPoints from 'highcharts/modules/pivotpoints';
// pivotPoints(Highcharts);


if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}
const Stock = ({ticker}:any) => {
  const [data, setData] = useState<any>([]);

  useEffect(()=> {
    axios.get(`http://127.0.0.1:8000/asset/${ticker}`).then(response => {
      setData(response.data)
    })
  }, [ticker])


  const stockOptions = {
    yAxis: [{
      labels: {
        align: 'left',
      },
      title: {
        text: 'R$'
      }
    }],
    series: [{
      data: data,
      // type: 'ohlc',
      name: 'Preço',
      id: ticker
    }]
  }

  return (
    <div>
      <h2>{ticker}</h2>
      <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={stockOptions} />
    </div>
  );
};

export default Stock;
