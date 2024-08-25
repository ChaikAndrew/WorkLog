import React from "react";

const OperatorSelector = ({ onSelectOperator }) => {
  const operators = ["Оператор 1", "Оператор 2", "Оператор 3"];

  return (
    <div className="selector">
      <h3>Оберіть оператора:</h3>
      <select onChange={(e) => onSelectOperator(e.target.value)}>
        <option value="">Оберіть оператора</option>
        {operators.map((operator, index) => (
          <option key={index} value={operator}>
            {operator}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OperatorSelector;
