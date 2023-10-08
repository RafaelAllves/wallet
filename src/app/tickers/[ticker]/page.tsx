'use client'

import React, { useEffect } from 'react';
import Stock from '../../../components/charts/stock';


const TickerChart: React.FC<any> = ({ params }) => {

  const { ticker } = params;

  useEffect(()=> {
    console.log(ticker)
  }, [ticker])
  
  return (
    <Stock/>
  );
};

export default TickerChart;
