'use client'

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  elements: {
    point: {
      radius: 0,
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
    tooltip: {
      intersect: false
    }
  },
};

export function Patrimony() {
  const [data, setData] = useState<any>([]);

  useEffect(()=> {
    axios.get(`http://127.0.0.1:8000/position-history/1`).then(response => {
      setData(response.data)
    })
  }, [])


  return <Line options={options} data={{
    labels: data.labels,
    datasets: [
      {
        fill: true,
        label: 'invested',
        data: data.invested,
        borderColor: 'rgb(2, 48, 71)',
        backgroundColor: 'rgba(2, 48, 71, 0.9)',
      },
      {
        fill: true,
        label: 'gross',
        data: data.values,
        borderColor: 'rgb(255, 183, 3)',
        backgroundColor: 'rgba(255, 183, 3, 1)',
      },
    ],
  }} />;
}
