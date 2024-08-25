import React from "react";

const ShiftSelector = ({ onSelectShift }) => {
  const shifts = [
    "1 зміна (6:00 - 14:00)",
    "2 зміна (14:00-22:00)",
    "3 зміна (22:00-6:00)",
  ];

  return (
    <div className="selector">
      <h3>Виберіть зміну:</h3>
      <select onChange={(e) => onSelectShift(e.target.value)}>
        <option value="">Оберіть зміну</option>
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
