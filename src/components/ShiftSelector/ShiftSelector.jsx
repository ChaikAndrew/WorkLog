import React from "react";

const ShiftSelector = ({ onSelectShift }) => {
  const shifts = [
    "1st Shift (6:00-14:00)",
    "2nd Shift (14:00-22:00)",
    "3rd Shift (22:00-6:00)",
  ];

  return (
    <div className="selector">
      <h3>Shift</h3>
      <select onChange={(e) => onSelectShift(e.target.value)}>
        <option value="">Select</option>
        {shifts.map((shift, index) => (
          <option key={index} value={shift}>
            {shift}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ShiftSelector;
