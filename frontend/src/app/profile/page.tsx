'use client'
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import PersonIcon from '@mui/icons-material/Person';
import api from '@/services/api';


const Profile: NextPage = () => {
  const [user, setUser] = useState<any>({});
  useEffect(() => {
    api.get('/user').then(response => {
      setUser(response.data);
    })
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <Head>
        <title>Perfil</title>
      </Head>
      <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col items-center pb-4">
          <PersonIcon className="w-24 h-24 text-gray-400" />
          <h1 className="text-2xl font-semibold">{user?.username}</h1>
          <p className="text-gray-400">{user?.email}</p>
        </div>
        <div className="w-full mt-4">
          <h2 className="text-xl font-semibold">Informações</h2>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Nome:</span>
              <span>{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Data de Nascimento:</span>
              <span>{user?.birthdate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Telefone:</span>
              <span>{user?.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
