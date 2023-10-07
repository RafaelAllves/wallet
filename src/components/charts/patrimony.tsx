'use client'

import React from 'react';
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
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'applied',
      data: [6, 12, 16, 18, 20, 24, 37],
      borderColor: 'rgb(2, 48, 71)',
      backgroundColor: 'rgba(2, 48, 71, 1)',
    },
    {
      fill: true,
      label: 'gross',
      data: [6, 13, 18, 22, 27, 31, 42],
      borderColor: 'rgb(255, 183, 3)',
      backgroundColor: 'rgba(255, 183, 3, 1)',
    },
  ],
};

export function Patrimony() {
  return <Line options={options} data={data} />;
}
