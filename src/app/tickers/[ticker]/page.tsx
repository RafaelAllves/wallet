'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stock from '../../../components/charts/stock';
import { Patrimony } from '../../../components/charts/patrimony';

const TickerChart: React.FC<any> = ({ params }) => {
  const { ticker } = params;
  const [dataPatrimony, setDataPatrimony] = useState<any>([]);

  useEffect(()=> {
    axios.get(`http://127.0.0.1:8000/position-history/1`, {params: {ticker}}).then(response => {
      setDataPatrimony(response.data)
    })
  }, [ticker])

  return (
    <main className="flex h-screen flex-col">
      <div  className="flex h-1/2 w-1/2">
        <Patrimony data={dataPatrimony}/>
      </div>
      <Stock ticker={ticker}/>
    </main>
  );
};

export default TickerChart;
