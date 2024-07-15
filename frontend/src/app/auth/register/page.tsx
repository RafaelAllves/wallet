'use client'

import { FormEvent } from 'react'

const Register: React.FC = () => {
  const handleCadastro = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')?.toString() ?? '';
    const email = formData.get('email')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <form onSubmit={handleCadastro} className="p-10 bg-gray-700 rounded-lg shadow-md max-w-lg w-full">
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
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
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
        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Cadastrar</button>
        <div className="mt-4">
          <a href="/auth" className="text-blue-300 hover:text-blue-500">Login</a>
        </div>
      </form>
    </div>
  );
}

export default Register;