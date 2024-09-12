import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import operators from "./data/operators";
import shiftStartTimes from "./data/shiftStartTimes";
import DateSelector from "./components/DateSelector/DateSelector";
import WorkLogTable from "./components/WorkLogTable/WorkLogTable";
import ZlecenieModal from "./components/ZlecenieModal/ZlecenieModal";
import TopSelectors from "./components/TopSelectors/TopSelectors";
import ToggleStatisticsButton from "./components/ToggleStatisticsButton/ToggleStatisticsButton";
import ShiftStatisticsSection from "./components/ShiftStatisticsSection/ShiftStatisticsSection";

import {
  formatTimeTo24Hour,
  calculateWorkingTime,
  calculateDowntime,
  adjustDateForShift,
} from "./utils/timeUtils";

import {
  calculateTotalsForData,
  calculateShiftTotals,
} from "./utils/dataUtils";

import useNotyf from "./hooks/useNotyf";
import { showDeleteConfirmation } from "./utils/swalUtils";
import Swal from "sweetalert2";

// Імпортуємо функції з tableUtils.js
import {
  loadTablesFromLocalStorage,
  saveTablesToLocalStorage,
  addRow,
  deleteRow,
  editRow,
  saveRow,
} from "./utils/tableUtils";

const App = () => {
  const [operator, setOperator] = useState("");
  const [shift, setShift] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);
  const [showZlecenieModal, setShowZlecenieModal] = useState(false);
  const [zlecenieNameInput, setZlecenieNameInput] = useState("");
  const [zlecenieIndex, setZlecenieIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const lastRowRef = useRef(null);

  const [showShiftStats, setShowShiftStats] = useState(false);
  const { showSuccessNotification, showErrorNotification } = useNotyf();
  const [tables, setTables] = useState(() =>
    loadTablesFromLocalStorage(operators)
  );

  useEffect(() => {
    saveTablesToLocalStorage(tables);
  }, [tables]);

  const handleOperatorChange = (event) => {
    setOperator(event.target.value);
  };

  const handleShiftChange = (event) => {
    setShift(event.target.value);
  };

  const handleMachineChange = (event) => {
    setSelectedMachine(event.target.value);
  };

  const handleDateChange = (date) => {
    if (!date) {
      setSelectedDate(null);
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
  };

  const closeModal = () => {
    setShowZlecenieModal(false);
    setZlecenieNameInput("");
  };

  const handleZlecenieSave = () => {
    const updatedTable = [...tables[operator]];
    updatedTable[zlecenieIndex].zlecenieName = zlecenieNameInput;
    setTables({ ...tables, [operator]: updatedTable });
    setShowZlecenieModal(false);
    setZlecenieNameInput("");
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTable = [...tables[operator]];
    updatedTable[index][name] = value;

    if (name === "task" && value === "ZLECENIE") {
      setShowZlecenieModal(true);
      setZlecenieIndex(index);
    } else {
      updatedTable[index][name] = value;
      setTables({ ...tables, [operator]: updatedTable });
    }

    if (name === "startTime") {
      const shiftStartTime = shiftStartTimes[shift];
      if (value && shiftStartTime && value > shiftStartTime) {
        const downtime = calculateDowntime(shiftStartTime, value);
        updatedTable[index].downtime = downtime;
        updatedTable[index].stopReason = "";
      } else {
        updatedTable[index].downtime = "0h 0m";
        updatedTable[index].stopReason = "";
      }
    }

    if (name === "startTime" || name === "endTime") {
      const formattedTime = formatTimeTo24Hour(value);
      updatedTable[index][name] = formattedTime;

      const startTime = updatedTable[index].startTime;
      const endTime = updatedTable[index].endTime;

      if (startTime && endTime) {
        const workingTime = calculateWorkingTime(startTime, endTime);
        updatedTable[index].workingTime = workingTime;
      }
    }

    if (name === "endTime" && index < updatedTable.length - 1) {
      const nextStartTime = updatedTable[index + 1].startTime;
      if (value && nextStartTime) {
        const downtime = calculateDowntime(value, nextStartTime);
        updatedTable[index + 1].downtime = downtime;
      }
    }

    if (name === "startTime" && index > 0) {
      const prevEndTime = updatedTable[index - 1].endTime;
      if (value && prevEndTime) {
        const downtime = calculateDowntime(prevEndTime, value);
        updatedTable[index].downtime = downtime;
      }
    }

    const updatedTables = { ...tables, [operator]: updatedTable };
    setTables(updatedTables);
  };

  const handleAddRow = () => {
    const result = addRow(
      tables,
      operator,
      selectedDate,
      shift,
      selectedMachine
    );
    if (result.error) {
      showErrorNotification(result.error);
    } else {
      setTables(result.tables);
      showSuccessNotification(
        `${operator}, Row has been successfully added to the table.`
      );
    }

    setTimeout(() => {
      lastRowRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteRow = (index) => {
    showDeleteConfirmation(operator).then((result) => {
      if (result.isConfirmed) {
        const updatedTables = deleteRow(tables, operator, index);
        setTables(updatedTables);
        showErrorNotification("The row has been successfully deleted.");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        showSuccessNotification("The deletion was canceled.");
      }
    });
  };

  const handleEditRow = (index) => {
    const updatedTables = editRow(tables, operator, index);
    setTables(updatedTables);
  };

  const handleSaveRow = (index) => {
    const updatedTables = saveRow(tables, operator, index);
    setTables(updatedTables);
    showSuccessNotification("Row has been successfully updated.");
  };

  const filteredTable = (tables[operator] || []).filter((row) => {
    return (
      row.date === selectedDate ||
      (row.shift === "3 Shift (22:00-6:00)" &&
        adjustDateForShift(row.date, row.startTime) === selectedDate)
    );
  });

  const operatorTotals = calculateTotalsForData(filteredTable, selectedDate);

  const firstShiftTotals = calculateShiftTotals(
    "1 Shift (6:00-14:00)",
    selectedDate,
    tables,
    operators,
    adjustDateForShift
  );
  const secondShiftTotals = calculateShiftTotals(
    "2 Shift (14:00-22:00)",
    selectedDate,
    tables,
    operators,
    adjustDateForShift
  );
  const thirdShiftTotals = calculateShiftTotals(
    "3 Shift (22:00-6:00)",
    selectedDate,
    tables,
    operators,
    adjustDateForShift
  );

  const shiftsData = [
    { name: "1 Shift (6:00-14:00)", totals: firstShiftTotals },
    { name: "2 Shift (14:00-22:00)", totals: secondShiftTotals },
    { name: "3 Shift (22:00-06:00)", totals: thirdShiftTotals },
  ];

  const handleShiftSelect = (index) => {
    setSelectedShiftIndex(index);
  };

  const toggleShiftStatsVisibility = () => {
    setShowShiftStats((prevState) => !prevState);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
  };

  return (
    <div className="table-container">
      <h1>Production Report</h1>

      <DateSelector
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
      />
      <ToggleStatisticsButton
        showShiftStats={showShiftStats}
        toggleShiftStatsVisibility={toggleShiftStatsVisibility}
      />
      <ShiftStatisticsSection
        showShiftStats={showShiftStats}
        shiftsData={shiftsData}
        selectedShiftIndex={selectedShiftIndex}
        handleShiftSelect={handleShiftSelect}
      />
      <TopSelectors
        shift={shift}
        operator={operator}
        selectedMachine={selectedMachine}
        handleShiftChange={handleShiftChange}
        handleOperatorChange={handleOperatorChange}
        handleMachineChange={handleMachineChange}
      />
      {showZlecenieModal && (
        <ZlecenieModal
          zlecenieNameInput={zlecenieNameInput}
          setZlecenieNameInput={setZlecenieNameInput}
          handleZlecenieSave={handleZlecenieSave}
          closeModal={closeModal}
        />
      )}
      {operator && shift && selectedMachine && (
        <WorkLogTable
          filteredTable={filteredTable}
          formatDate={formatDate}
          handleInputChange={handleInputChange}
          saveRow={handleSaveRow}
          editRow={handleEditRow}
          handleDelete={handleDeleteRow}
          lastRowRef={lastRowRef}
          operatorTotals={operatorTotals}
          addRow={handleAddRow}
        />
      )}
    </div>
  );
};

export default App;
