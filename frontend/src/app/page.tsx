'use client'
import React, { useEffect, useState } from 'react';
import { Patrimony } from "../components/charts/patrimony";
import { AssetClasses } from "../components/charts/assetClasses";
import PositionTable from "../components/positionsTable";
import axios from 'axios';


export default function Home() {
  const [dataAssets, setDataAssets] = useState<any>([]);
  const [dataPatrimony, setDataPatrimony] = useState<any>([]);
  const [selectedClass, setSelectedClass] = useState<string>('All');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/position`).then(response => {
      setDataAssets(response.data)
    })

  }, [])

  useEffect(() => {
    // Função para fazer a solicitação HTTP com base na classe selecionada
    const fetchData = async () => {
      try {
        let url = 'http://127.0.0.1:8000/position-history';
        if (selectedClass !== 'All') {
          url += `?class=${selectedClass}`;
        }

        const response = await axios.get(url);
        setDataPatrimony(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData(); // Chama a função ao montar o componente e sempre que selectedClass mudar
  }, [selectedClass]);

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value); // Atualiza o estado com a nova opção selecionada
  };

  return (
    <main className="flex h-screen flex-col">
      <div className="flex justify-end mt-4 mr-16 text-black">
        <label htmlFor="classSelector" className="mr-2">
          Selecione a classe:
        </label>
        <select
          id="classSelector"
          value={selectedClass}
          onChange={handleClassChange}
          className="px-4 py-2 w-32 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="All">Tudo</option>
          <option value="AC">Ações</option>
          <option value="FII">FIIs</option>
          <option value="RF">Renda Fixa</option>
        </select>
      </div>
      <div className="flex justify-around">
        <div className="flex w-1/5 items-center justify-center">
          <AssetClasses asset_classes={dataAssets.asset_classes} />
        </div>
        <div className="flex w-3/5 flex-col gap-4">
          <div className="flex flex-grow items-center justify-center">
            <Patrimony data={dataPatrimony} />
          </div>
        </div>
      </div>
      <div className="flex justify-center py-20">

        <PositionTable assets={dataAssets.assets} />
      </div>
    </main>
  )
}
