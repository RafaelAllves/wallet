'use client'
import api from '../services/api';
import React, { useEffect, useState } from 'react';
import { Patrimony } from "../components/charts/patrimony";
import { DynamicDoughnut } from "../components/charts/dynamicDoughnut";
import PositionTable from "../components/positionsTable";


export default function Home() {
  const [dataAssets, setDataAssets] = useState<any>([]);
  const [dataPatrimony, setDataPatrimony] = useState<any>([]);
  const [selectedClass, setSelectedClass] = useState<string>('All');

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedClass !== 'All') params.append('class', selectedClass);

    const url = `/position?${params.toString()}`;

    api.get(url).then(response => {
      setDataAssets(response.data)
    })

  }, [selectedClass])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedClass !== 'All') params.append('class', selectedClass);

        const url = `/position-history?${params.toString()}`;
        const response = await api.get(url);
        setDataPatrimony(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [selectedClass]);

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value);
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
          <DynamicDoughnut data={[
            ...((dataAssets.asset_classes && Object.keys(dataAssets.asset_classes).length > 0) ? [dataAssets.asset_classes] : []),
            ...((dataAssets.categories && Object.keys(dataAssets.categories).length > 0) ? [dataAssets.categories] : [])
          ]} />
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
