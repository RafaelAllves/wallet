'use client'

import { FormEvent } from 'react'
import { useAuth } from '@/services/authContext';

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';

    const response = await login(username, password);

    if (response) window.location.href = '/';

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
            name='username'
            required
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Senha:</label>
          <input
            type="password"
            id="password"
            name='password'
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