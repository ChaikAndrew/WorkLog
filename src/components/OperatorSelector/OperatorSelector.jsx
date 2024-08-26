import React from "react";

const OperatorSelector = ({ onSelectOperator }) => {
  const operators = ["Andrii", "Operator 2", "Operator 3"];

  return (
    <div className="selector">
      <h3>Operator</h3>
      <select onChange={(e) => onSelectOperator(e.target.value)}>
        <option value="">Select</option>
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
