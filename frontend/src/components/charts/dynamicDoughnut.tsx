'use client'

import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Data {
  [key: string]: {
    value: number
  }
}


interface DynamicDoughnutProps {
  data: Data[]
}

const colors = [
  // Grupo Original
  'rgba(255, 99, 132, 1)', // Vermelho
  'rgba(54, 162, 235, 1)', // Azul
  'rgba(255, 206, 86, 1)', // Amarelo
  'rgba(75, 192, 192, 1)', // Ciano
  'rgba(153, 102, 255, 1)', // Violeta
  'rgba(255, 159, 64, 1)', // Laranja

  // Grupo Mais Escuro
  'rgba(230, 69, 102, 1)', // Vermelho
  'rgba(24, 132, 205, 1)', // Azul
  'rgba(225, 176, 46, 1)', // Amarelo
  'rgba(45, 162, 162, 1)', // Ciano
  'rgba(123, 72, 225, 1)', // Violeta
  'rgba(225, 129, 34, 1)', // Laranja

  // Grupo Mais Claro
  'rgba(255, 129, 162, 1)', // Vermelho
  'rgba(84, 192, 265, 1)', // Azul
  'rgba(255, 236, 116, 1)', // Amarelo
  'rgba(105, 222, 222, 1)', // Ciano
  'rgba(183, 132, 275, 1)', // Violeta
  'rgba(255, 189, 94, 1)', // Laranja

  // Grupo Saturado
  'rgba(255, 89, 122, 1)', // Vermelho
  'rgba(54, 142, 225, 1)', // Azul
  'rgba(255, 196, 76, 1)', // Amarelo
  'rgba(75, 172, 172, 1)', // Ciano
  'rgba(153, 92, 245, 1)', // Violeta
  'rgba(255, 139, 54, 1)', // Laranja

  // Grupo Menos Saturado
  'rgba(255, 149, 182, 1)', // Vermelho
  'rgba(104, 202, 255, 1)', // Azul
  'rgba(255, 246, 146, 1)', // Amarelo
  'rgba(125, 232, 232, 1)', // Ciano
  'rgba(203, 152, 255, 1)', // Violeta
  'rgba(255, 209, 124, 1)', // Laranja
]

export const DynamicDoughnut: React.FC<DynamicDoughnutProps> = ({ data }) => {
  const [dataSelected, setDataSelected] = useState<number>(0);

  function handleDataChange() {
    if (dataSelected === data.length - 1) return setDataSelected(0);
    setDataSelected(dataSelected + 1);
  }

  if (!data || !data[0]) return;

  return (
    <div className="w-full" style={{ position: 'relative' }}>
      <Doughnut
        data={{
          labels: Object.keys(data[dataSelected]),
          datasets: [
            {
              label: 'Valor Acumulado',
              data: Object.values(data[dataSelected]).map(e => e.value),

              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1,
            },
          ],
        }}

        options={{
          plugins: {
            legend: {
              display: false,
              labels: {
                color: 'white',
              },
            },
          },
        }}
      />

      {
        data?.length > 1 && (
          <button
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleDataChange}
          >
            <SwapHorizIcon style={{ color: 'white', fontSize: '48px' }} />
          </button>

        )
      }
    </div>
  )
}
