import React from "react";
import ShiftSelector from "../ShiftSelector/ShiftSelector";
import OperatorSelector from "../OperatorSelector/OperatorSelector";
import MachineSelector from "../MachineSelector/MachineSelector";

const TopSelectors = ({
  shift,
  operator,
  selectedMachine,
  handleShiftChange,
  handleOperatorChange,
  handleMachineChange,
}) => {
  return (
    <div className="top-selectors">
      <ul className="top-selectors_list">
        <li>
          <ShiftSelector shift={shift} handleShiftChange={handleShiftChange} />
        </li>
        <li>
          <OperatorSelector
            operator={operator}
            handleOperatorChange={handleOperatorChange}
          />
        </li>
        <li>
          <MachineSelector
            selectedMachine={selectedMachine}
            handleMachineChange={handleMachineChange}
          />
        </li>
      </ul>
    </div>
  );
};

export default TopSelectors;
