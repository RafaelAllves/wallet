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
  elements: {
    point: {
      radius: 0,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: 'white',
      }
    },
    x: {
      display: false,
      ticks: {
        color: 'white',
      }
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'white',
      },
    },
    title: {
      display: true,
      text: 'Evolução do Património',
      color: 'white',
    },
    tooltip: {
      intersect: false
    }
  },
};

interface PatrimonyProps {
  data: {
    labels: string[],
    values: number[],
    invested: number[]
  };
}

export const Patrimony: React.FC<PatrimonyProps> = ({ data }) => {

  return <Line options={options} data={{
    labels: data.labels,
    datasets: [
      {
        fill: true,
        label: 'Investido',
        data: data.invested,
        borderColor: 'rgb(2, 48, 71)',
        backgroundColor: 'rgba(2, 48, 71, 0.9)',
      },
      {
        fill: true,
        label: 'Atual',
        data: data.values,
        borderColor: 'rgb(255, 183, 3)',
        backgroundColor: 'rgba(255, 183, 3, 1)',
      },
    ],
  }} />;
}
