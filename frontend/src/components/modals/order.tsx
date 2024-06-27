import React, { useState } from "react";

const OrderModal: React.FC<{
  onClose: () => void;
  onSave: (data: any) => void;
  order?: (string | number | null)[];
}> = ({ onClose, onSave, order }) => {

  const [formData, setFormData] = useState<any>({
    id: order?.[0] || null,
    name: order?.[1] || "",
    broker: order?.[2] || "Nu Invest",
    assetType: order?.[3] || "AC",
    orderType: order?.[4] || 1,
    date: order?.[5] || null,
    price: order?.[6] || null,
    volume: order?.[7] || null,
    description: order?.[8] || "",
    interestRate: order?.[9] || "0",
    maturity: order?.[10] || null,
    index: order?.[11] || "P",
    fixedIncomeType: order?.[12] || "CDB",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else if (name === "price") {
      setFormData({ ...formData, [name]: value ? Number(value) : null });
    } else if (name === "volume") {
      setFormData({ ...formData, [name]: value ? Number(value) : null });
    } else if (name === "interestRate") {
      setFormData({ ...formData, [name]: value ? Number(value) : null });
    } else if (name === "orderType") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
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
            <label htmlFor="broker" className="block text-sm font-semibold mb-2">Corretora:</label>
            <select id="broker" name="broker" required value={formData.broker} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
              <option value="Nu Invest">Nu Invest</option>
              <option value="Rico">Rico</option>
              <option value="XP">XP</option>
            </select>
          </div>

          <div className="mb-4 lg:w-1/2 p-4">
            <label htmlFor="assetType" className="block text-sm font-semibold mb-2">Classe:</label>
            <select id="assetType" name="assetType" required value={formData.assetType} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
              <option value="AC">Ações BR</option>
              <option value="INT">Ativos Internacionais</option>
              <option value="FII">Fundos de Investimento Imobiliário</option>
              <option value="RF">Renda Fixa</option>
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

          <div className="mb-4 lg:w-1/6 p-4">
            <label htmlFor="orderType" className="block text-sm font-semibold mb-2">Operação:</label>
            <div>
              <input
                type="radio"
                id="buy"
                name="orderType"
                value={1}
                checked={formData.orderType === 1}
                onChange={handleChange}
              />
              <label htmlFor="buy"> Compra</label>
            </div>
            <div>
              <input
                type="radio"
                id="sell"
                name="orderType"
                value={-1}
                checked={formData.orderType === -1}
                onChange={handleChange}
              />
              <label htmlFor="sell"> Venda</label>
            </div>
          </div>

          {
            formData?.assetType === 'RF' && (
              <div className="mb-4 lg:w-2/6 p-4">
                <label htmlFor="fixedIncomeType" className="block text-sm font-semibold mb-2">Tipo:</label>
                <select id="fixedIncomeType" name="fixedIncomeType" required value={formData.fixedIncomeType} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
                  <option value="CDB">CDB</option>
                  <option value="LCA">LCA</option>
                  <option value="LCI">LCI</option>
                  <option value="TD">Tesouro Direto</option>
                </select>
              </div>
            )
          }

          <div className="mb-4 lg:w-5/12 p-4">
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
          <div className="mb-4 lg:w-4/12 p-4">
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

          <div className="mb-4 lg:w-3/12 p-4">
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

          {
            formData?.assetType === 'RF' && (
              <>
                <div className="mb-4 lg:w-5/12 p-4">
                  <label htmlFor="maturity" className="block text-sm font-semibold mb-2">
                    Vencimento:
                  </label>
                  <input
                    type="date"
                    name="maturity"
                    id="maturity"
                    value={formData.maturity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-4 lg:w-4/12 p-4">
                  <label htmlFor="index" className="block text-sm font-semibold mb-2">Index:</label>
                  <select id="index" name="index" required value={formData.index} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
                    <option value="P">Pré-fixado</option>
                    <option value="S">Selic</option>
                    <option value="I">IPCA</option>
                  </select>
                </div>

                <div className="mb-4 lg:w-3/12 p-4">
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Taxa:
                  </label>
                  <input
                    type="number"
                    name="interestRate"
                    id="interestRate"
                    value={formData.interestRate}
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </>
            )
          }


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
