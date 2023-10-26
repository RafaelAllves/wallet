'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stock from '../../../components/charts/stock';
import { Patrimony } from '../../../components/charts/patrimony';

const TickerChart: React.FC<any> = ({ params }) => {
  const { ticker } = params;
  const [dataPatrimony, setDataPatrimony] = useState<any>([]);
  const [dataStock, setDataStock] = useState<any>([]);
  const [dataOrders, setDataOrders] = useState<any>([]);
  const [startDate, setStartDate] = useState<any>();

  useEffect(()=> {
    axios.get(`http://127.0.0.1:8000/position-history/1`, {params: {ticker}}).then(response => {
      setDataPatrimony(response.data)
      setStartDate(Date.UTC(
        parseInt(response.data?.labels?.[0].split('/')[2], 10), 
        parseInt(response.data?.labels?.[0].split('/')[1], 10)-1, 
        parseInt(response.data?.labels?.[0].split('/')[0], 10),
      ))
    })

    axios.get(`http://127.0.0.1:8000/asset/${ticker}`).then(response => {
      setDataStock(response.data)
    })

    axios.get(`http://127.0.0.1:8000/orders`, {params: {ticker}}).then(response => {
      setDataOrders(response.data)
      console.log(response.data?.map(e => [e[13], e[6]]))
    })
  }, [ticker])

  return (
    <main className="flex h-screen flex-col">
      <div  className="flex h-1/2 w-1/2">
        <Patrimony data={dataPatrimony}/>
      </div>
      <Stock data={dataStock} dataOrders={dataOrders} startDate={startDate}/>
    </main>
  );
};

export default TickerChart;
