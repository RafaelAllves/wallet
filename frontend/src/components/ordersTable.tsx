import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import OrderModal from './modals/order'
interface OrdersTableProps {
  data: (string | number | null)[][];
  getData: (ticker: string | null) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ data, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSelected, setOrderSelected] = useState<(string | number | null)[]>([]);

  if (!data) return;


  const openModal = (order: (string | number | null)[]) => {
    setOrderSelected(order)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateOrder = (data: any) => {
    axios.patch(`http://127.0.0.1:8000/order/${data?.id}`, data)
      .then(response => {
        getData(null)
        alert('Boleta atualizada com sucesso')
      })
      .catch(error => {
        alert('Erro ao atualizar boleta')
      })
  };

  const handleDelete = (id: string | number | null) => {
    axios.delete(`http://127.0.0.1:8000/order/${id}`)
      .then(response => {
        getData(null)
        alert('Boleta deletada com sucesso')
      })
      .catch(error => {
        alert('Erro ao deletar boleta')
      })
  };

  return (
    <div>
      {isModalOpen && (
        <OrderModal onClose={closeModal} onSave={updateOrder} order={orderSelected} />
      )}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Ticker</th>
            <th className="px-4 py-2">Volume</th>
            <th className="px-4 py-2">Preço Médio</th>
            <th className="px-4 py-2">Valor da Boleta</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => {
            const [id, name, broker, asset_type, order_type, date, price, volume, description, interest_rate, maturity_date, index, user, timestamp] = order

            return (
              <tr key={name}>
                <td className="px-4 py-2 text-center">{date || '-'}</td>
                <td className="px-4 py-2 text-center">{order_type == 1 ? 'Compra' : 'venda'}</td>
                <td className="px-4 py-2 text-center">{name}</td>
                <td className="px-4 py-2 text-center">{volume || '-'}</td>
                <td className="px-4 py-2 text-center">{price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
                <td className="px-4 py-2 text-center">{(Number(price) * Number(volume)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}</td>
                <td className="px-4 py-2 flex justify-around">
                  <div>
                    <EditIcon
                      onClick={() => openModal(order)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <DeleteIcon
                      onClick={() => handleDelete(id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
