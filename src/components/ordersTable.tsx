import React from 'react';

interface OrdersTableProps {
  data: (string | number | null)[][];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ data }) => {

  if(!data) return;

  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Ticker</th>
            <th className="px-4 py-2">Volume</th>
            <th className="px-4 py-2">Preço Médio</th>
            <th className="px-4 py-2">Valor da Boleta</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => {
            const [ id, name, broker, asset_type, order_type, date, price, volume, description, interest_rate, maturity_date, index, user, timestamp] = order

            return (
              <tr key={name}>
                <td className="px-4 py-2 text-center">{date || '-'}</td>
                <td className="px-4 py-2 text-center">{order_type == 1? 'Compra': 'venda'}</td>
                <td className="px-4 py-2 text-center">{name}</td>
                <td className="px-4 py-2 text-center">{volume || '-'}</td>
                <td className="px-4 py-2 text-center">{price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
                <td className="px-4 py-2 text-center">{(Number(price) * Number(volume)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
