import React from "react";

const ProductSelector = ({ onSelectProduct }) => {
  const products = ["T-shirts", "Hoodie", "Bags", "Sleeves", "Others", "Test"];

  return (
    <div className="selector">
      <h3>Products</h3>
      <select onChange={(e) => onSelectProduct(e.target.value)}>
        <option value="">Select</option>
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
