import React from "react";

const MachineSelector = ({ onSelectMachine }) => {
  const machines = ["dtg1", "dtg2", "dtg3", "dtg4", "dtg5", "dtg6"];

  return (
    <div className="selector">
      <h3>Оберіть машину:</h3>
      <select onChange={(e) => onSelectMachine(e.target.value)}>
        <option value="">Оберіть машину</option>
        {machines.map((machine, index) => (
          <option key={index} value={machine}>
            {machine}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MachineSelector;
