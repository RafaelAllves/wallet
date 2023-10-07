'use client'
import React, { useState } from 'react';

interface Asset {
  ticker: string;
  asset_class: string;
  trading_name: string;
  company_name: string;
  category?: string;
  sub_category?: string;
}

interface AssetTableProps {
  assets: Asset[];
}

const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAssets = assets.filter((asset) =>
    asset.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar ativos por ticker"
        className="mb-4 p-2 border rounded-md text-black"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Ticker</th>
            <th className="px-4 py-2">Classe</th>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Categoria</th>
            <th className="px-4 py-2">Subcategoria</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => (
            <tr key={asset.ticker}>
              <td className="px-4 py-2 text-center">{asset.ticker}</td>
              <td className="px-4 py-2 text-center">{asset.asset_class || '-'}</td>
              <td className="px-4 py-2 text-center">{asset.trading_name || '-'}</td>
              <td className="px-4 py-2 text-center">{asset.category || '-'}</td>
              <td className="px-4 py-2 text-center">{asset.sub_category || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
