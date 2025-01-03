'use client'

import React, { useEffect, useState } from 'react';
import OrdersTable from '../../components/ordersTable';
import OrderModal from '../../components/modals/order'
import api from '../../services/api';

const OrdersPage: React.FC<any> = ({ params }) => {
  const { ticker } = params;
  const [dataOrders, setDataOrders] = useState<(number | string | null)[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getData = (ticker: string | null) => {
    api.get(`/orders`, { params: { ticker } })
      .then(response => {
        setDataOrders(response.data)
      }).catch(error => {
        console.error('Erro ao buscar dados:', error);
      })
  }

  const saveData = (data: any) => {
    api.post(`/order`, data)
      .then(response => {
        getData(null)
        alert('Boleta criada com sucesso')
      })
      .catch(error => {
        alert('Erro ao criar boleta')
      })
  };

  useEffect(() => {
    getData(ticker)
  }, [ticker])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tabela de Boletas</h1>
      <button onClick={openModal}>Nova Boleta</button>
      {isModalOpen && (
        <OrderModal onClose={closeModal} onSave={saveData} />
      )}
      <OrdersTable data={dataOrders} getData={getData} />
    </div>
  );
};

export default OrdersPage;
