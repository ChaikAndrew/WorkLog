import React from "react";

const ColorSelector = ({ onSelectColor }) => {
  const colors = ["White", "Color"];

  return (
    <div className="selector">
      <h3>Color</h3>
      <select onChange={(e) => onSelectColor(e.target.value)}>
        <option value="">Select</option>
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
