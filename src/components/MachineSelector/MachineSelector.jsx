// components/MachineSelector.js
import React from "react";
import machines from "../../data/machines";

const MachineSelector = ({ selectedMachine, handleMachineChange }) => {
  return (
    <div>
      <label>Select DTG: </label>
      <select value={selectedMachine} onChange={handleMachineChange}>
        <option value="">Select</option>
        {machines.map((s, idx) => (
          <option key={idx} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MachineSelector;
