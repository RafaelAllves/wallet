
import React, { useState } from 'react';

type AssetArray = Array<string | number>;

interface PositionTableProps {
  assets: AssetArray[];
}


const PositionTable: React.FC<PositionTableProps> = ({ assets }) => {

  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!assets) return;

  const filteredAssets = assets.filter((asset) =>
    asset[0].toString().toLowerCase().includes(searchQuery.toLowerCase())
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
            <th className="px-4 py-2">Categoria</th>
            <th className="px-4 py-2">Subcategoria</th>
            <th className="px-4 py-2">Quantidade</th>
            <th className="px-4 py-2">Preço Médio</th>
            <th className="px-4 py-2">Preço Atual</th>
            <th className="px-4 py-2">Posição</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => {
            const [name, asset_class, category, sub_category, volume, cost, price] = asset
            return (
              <tr key={name}>
                <td className="px-4 py-2 text-center">{name}</td>
                <td className="px-4 py-2 text-center">{asset_class || '-'}</td>
                <td className="px-4 py-2 text-center">{category || '-'}</td>
                <td className="px-4 py-2 text-center">{sub_category || '-'}</td>
                <td className="px-4 py-2 text-center">{volume || '-'}</td>
                <td className="px-4 py-2 text-center">{(parseFloat(cost.toString()) / Number(volume)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
                <td className="px-4 py-2 text-center">{Number(price)?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
                <td className="px-4 py-2 text-center">{(Number(price) * Number(volume)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PositionTable;
