import React from "react";
import ShiftButtons from "../ShiftButtons/ShiftButtons";
import ShiftStatisticsTable from "../ShiftStatisticsTable/ShiftStatisticsTable";

const ShiftStatisticsSection = ({
  showShiftStats,
  shiftsData,
  selectedShiftIndex,
  handleShiftSelect,
}) => {
  if (!showShiftStats) return null; // Якщо статистика не показується, повертаємо `null`

  return (
    <div className="date-shift-info">
      <ShiftButtons
        shiftsData={shiftsData}
        selectedShiftIndex={selectedShiftIndex}
        handleShiftSelect={handleShiftSelect}
      />
      <div className="shift-all_totals">
        <ShiftStatisticsTable
          shiftName={shiftsData[selectedShiftIndex].name}
          shiftTotals={shiftsData[selectedShiftIndex].totals}
        />
      </div>
    </div>
  );
};

export default ShiftStatisticsSection;
