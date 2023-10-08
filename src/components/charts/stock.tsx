import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Stock = () => {
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Meu Gráfico Highcharts',
    },
    series: [
      {
        name: 'Série de Dados',
        data: [1, 2, 3, 4, 5],
      },
    ],
  };

  return (
    <div>
      <h2>Gráfico Temporal</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Stock;
