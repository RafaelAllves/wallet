'use client'

import React from 'react';
import Stock from '../../../components/charts/stock';

const TickerChart: React.FC<any> = ({ params }) => {
  const { ticker } = params;

  return (
    <Stock ticker={ticker}/>
  );
};

export default TickerChart;
