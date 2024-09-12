// components/OperatorSelector.js
import React from "react";
import operators from "../../data/operators";

const OperatorSelector = ({ operator, handleOperatorChange }) => {
  return (
    <div>
      <label>Select Operator: </label>
      <select value={operator} onChange={handleOperatorChange}>
        <option value="">Select </option>
        {operators.map((op, idx) => (
          <option key={idx} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OperatorSelector;
