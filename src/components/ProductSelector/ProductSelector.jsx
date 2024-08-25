import React from "react";

const ProductSelector = ({ onSelectProduct }) => {
  const products = ["Футболки", "Блузи", "Сумки"];

  return (
    <div className="selector">
      <h3>Що друкуємо:</h3>
      <select onChange={(e) => onSelectProduct(e.target.value)}>
        <option value="">Оберіть продукт</option>
        {products.map((product, index) => (
          <option key={index} value={product}>
            {product}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSelector;
