'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../services/api';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isClient) return;

    try {

      const response = await api.post(`/login`, { username, password });

      if (response.status === 200) {
        window.location.href = 'http://localhost:3000';
      } else {
        throw new Error('Falha no login');
      }
    } catch (error) {

      if (axios.isAxiosError(error)) {
        alert(error?.response?.data);
      }

      console.error('Erro ao realizar login:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <form onSubmit={handleLogin} className="p-10 bg-gray-700 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center text-white mb-8">Login</h2>
        <div className="mb-6">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          />
        </div>
        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;