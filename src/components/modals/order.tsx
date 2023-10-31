import React, { useState } from "react";

const OrderModal: React.FC<{
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    broker: "Nu Invest",
    assetType: "AC",
    orderType: "buy",
    date: null,
    price: null,
    volume: null,
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else if (name === "price") {
      setFormData({ ...formData, [name]: value? Number(value) : null });
    } else if (name === "volume") {
      setFormData({ ...formData, [name]: value? Number(value) : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black z-50 text-black">
      <div className="bg-white p-4 rounded-md shadow-md lg:w-2/5 lg:space-x-4">
        <h2 className="text-2xl font-bold mb-4">Boleta</h2>
        <form className="lg:flex lg:flex-wrap" onSubmit={handleSave}>

          <div className="mb-4 lg:w-1/2 p-4">
            <label htmlFor="broker" className="block text-sm font-semibold mb-2">Selecione a corretora:</label>
            <select id="broker" name="broker" required value={formData.broker} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
              <option value="Nu Invest">Nu Invest</option>
              <option value="Rico">Rico</option>
              <option value="XP">XP</option>
            </select>
          </div>

          <div className="mb-4 lg:w-1/2 p-4">
            <label htmlFor="assetType" className="block text-sm font-semibold mb-2">Tipo:</label>
            <select id="assetType" name="assetType" required value={formData.assetType} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
              <option value="AC">Ações BR</option>
              <option value="INT">Ativos Internacionais</option>
              <option value="FII">Fundos de Investimento Imobiliário</option>
            </select>
          </div>

          <div className="mb-4 lg:w-1/2 p-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Nome:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4 lg:w-1/3 p-4">
            <label htmlFor="orderType">Operação:</label>
            <div>
              <input
                type="radio"
                id="buy"
                name="orderType"
                value="buy"
                checked={formData.orderType === "buy"}
                onChange={handleChange}
              />
              <label htmlFor="buy"> Compra</label>
            </div>
            <div>
              <input
                type="radio"
                id="sell"
                name="orderType"
                value="sell"
                checked={formData.orderType === "sell"}
                onChange={handleChange}
              />
              <label htmlFor="sell"> Venda</label>
            </div>
          </div>

          <div className="mb-4 lg:w-1/3 p-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Data:
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          <div className="mb-4 lg:w-1/3 p-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Preço:
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4 lg:w-1/3 p-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Volume:
            </label>
            <input
              type="number"
              name="volume"
              id="volume"
              value={formData.volume}
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4 w-full p-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Descrição:
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Fechar
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
