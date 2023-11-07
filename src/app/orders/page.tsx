'use client'

import React, { useEffect, useState } from 'react';
import OrdersTable from '../../components/ordersTable';
import OrderModal from '../../components/modals/order'
import axios from 'axios';

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
    axios.get(`http://127.0.0.1:8000/orders`, {params: {ticker}}).then(response => {
      setDataOrders(response.data)
    })
  }

  const saveData = (data: any) => {
    axios.post(`http://127.0.0.1:8000/order`, {params: data})
      .then(response => {
        getData(null)
        alert('Boleta criada com sucesso')
      })
      .catch(error => {
        alert('Erro ao criar boleta')
      })
  };

  useEffect(()=> {
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
