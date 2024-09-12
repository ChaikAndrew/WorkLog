// components/ShiftSelector.js
import React from "react";
import shifts from "../../data/shifts";

const ShiftSelector = ({ shift, handleShiftChange }) => {
  return (
    <div>
      <label>Select Shift: </label>
      <select value={shift} onChange={handleShiftChange}>
        <option value="">Select </option>
        {shifts.map((s, idx) => (
          <option key={idx} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ShiftSelector;
