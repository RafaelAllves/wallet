'use client'
import React, { useEffect, useState } from 'react';
import { Patrimony } from "../components/charts/patrimony";
import { AssetClasses } from "../components/charts/assetClasses";
import PositionTable from "../components/positionsTable";
import axios from 'axios';


export default function Home() {
  const [dataAssets, setDataAssets] = useState<any>([]);
  const [dataPatrimony, setDataPatrimony] = useState<any>([]);

  useEffect(()=> {
    axios.get(`http://127.0.0.1:8000/position/1`).then(response => {
      setDataAssets(response.data)
    })

    axios.get(`http://127.0.0.1:8000/position-history/1`).then(response => {
      setDataPatrimony(response.data)
    })

  }, [])


  return (
    <main className="flex h-screen flex-col">
      <div className="flex justify-around">
        <div className="flex w-1/5 items-center justify-center">
          <AssetClasses asset_classes={dataAssets.asset_classes}/>
        </div>
        <div className="flex w-3/5 flex-col gap-4">
          <div className="flex flex-grow items-center justify-center">
            <Patrimony data={dataPatrimony}/>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-20">
        
        <PositionTable assets={dataAssets.assets}/>
      </div>
    </main>
  )
}
