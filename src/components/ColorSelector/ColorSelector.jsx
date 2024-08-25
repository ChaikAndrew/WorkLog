import React from "react";

const ColorSelector = ({ onSelectColor }) => {
  const colors = ["Білий", "Кольоровий"];

  return (
    <div className="selector">
      <h3>Оберіть колір:</h3>
      <select onChange={(e) => onSelectColor(e.target.value)}>
        <option value="">Оберіть колір</option>
        {colors.map((color, index) => (
          <option key={index} value={color}>
            {color}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColorSelector;
