'use client'

import React, { useEffect, useState } from 'react';
import AssetTable from '../../components/assetTable';
import axios from 'axios';

const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<any>([]);
  
  useEffect(()=> {
    axios.get('http://127.0.0.1:8000/assets').then(response => {
      setAssets(response.data)
    })
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tabela de Ativos</h1>
      <AssetTable assets={assets} />
    </div>
  );
};

export default AssetsPage;
