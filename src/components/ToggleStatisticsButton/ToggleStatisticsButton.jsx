import React from "react";

const ToggleStatisticsButton = ({
  showShiftStats,
  toggleShiftStatsVisibility,
}) => {
  return (
    <button onClick={toggleShiftStatsVisibility}>
      {showShiftStats ? "Hide" : "Show"} Statistics
    </button>
  );
};

export default ToggleStatisticsButton;
