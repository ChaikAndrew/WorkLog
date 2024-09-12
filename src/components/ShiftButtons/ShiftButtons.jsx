import React from "react";

const ShiftButtons = ({
  shiftsData,
  selectedShiftIndex,
  handleShiftSelect,
}) => {
  return (
    <div className="shift-buttons">
      {shiftsData.map((shiftData, index) => (
        <button
          key={index}
          className={selectedShiftIndex === index ? "active" : ""}
          onClick={() => handleShiftSelect(index)}
        >
          {shiftData.name}
        </button>
      ))}
    </div>
  );
};

export default ShiftButtons;
