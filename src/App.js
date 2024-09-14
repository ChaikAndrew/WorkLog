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
import { calculateDowntimeBetweenOperators } from "./utils/timeUtils";
import {
  formatTimeTo24Hour,
  calculateWorkingTime,
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

  // Функція для пошуку prevEndTime з іншої таблиці
  const findPreviousEndTime = (machine, currentTable, currentIndex) => {
    let prevEndTime = null;

    // Перебираємо всі таблиці
    Object.keys(tables).forEach((operatorName) => {
      const operatorTable = tables[operatorName];

      // Шукаємо попередні записи у цій таблиці для цієї машини
      operatorTable.forEach((row, index) => {
        if (
          row.machine === machine && // Та сама машина
          row.endTime && // Має endTime
          (currentTable !== operatorTable || index < currentIndex) // Не в тій же таблиці або попередній рядок
        ) {
          prevEndTime = row.endTime;
        }
      });
    });

    return prevEndTime;
  };

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
  //1
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    console.log(
      `Handling input change for index: ${index}, field: ${name}, value: ${value}`
    );

    const updatedTable = [...tables[operator]];
    console.log("Initial updatedTable:", updatedTable);

    updatedTable[index][name] = value;

    if (name === "task" && value === "ZLECENIE") {
      setShowZlecenieModal(true);
      setZlecenieIndex(index);
      console.log("Opening Zlecenie Modal for index:", index);
    } else {
      updatedTable[index][name] = value;
      setTables({ ...tables, [operator]: updatedTable });
      console.log("Updated tables after setting value:", updatedTable);
    }

    if (name === "startTime") {
      const shiftStartTime = shiftStartTimes[shift];
      let prevEndTime = index > 0 ? updatedTable[index - 1].endTime : null;

      if (!prevEndTime) {
        // Якщо попереднього endTime немає в тій же таблиці, шукаємо в інших
        prevEndTime = findPreviousEndTime(
          updatedTable[index].machine,
          updatedTable,
          index
        );
      }

      if (prevEndTime) {
        console.log(`Prev End Time found: ${prevEndTime}`);
      } else {
        console.log("No previous endTime available, setting to null.");
      }

      console.log("Prev End Time:", prevEndTime);
      console.log("Current Start Time:", value);
      console.log("Shift Start Time:", shiftStartTime);

      if (value && shiftStartTime) {
        const downtime = calculateDowntimeBetweenOperators(
          prevEndTime,
          value,
          shiftStartTime
        );
        console.log("Downtime calculated:", downtime);
        updatedTable[index].downtime = downtime;
        updatedTable[index].stopReason = "";
      } else {
        updatedTable[index].downtime = "0h 0m";
        updatedTable[index].stopReason = "";
      }
    }

    if (name === "startTime" || name === "endTime") {
      const formattedTime = formatTimeTo24Hour(value);
      console.log("Formatted time:", formattedTime);

      updatedTable[index][name] = formattedTime;

      const startTime = updatedTable[index].startTime;
      const endTime = updatedTable[index].endTime;

      console.log("Updated startTime:", startTime);
      console.log("Updated endTime:", endTime);

      // Перевіряємо на наявність обох полів перед обчисленням робочого часу
      if (!startTime || !endTime) {
        console.log(
          "Start time or end time is missing, cannot calculate working time"
        );
        return;
      }

      const workingTime = calculateWorkingTime(startTime, endTime);
      console.log("Working time calculated:", workingTime);
      updatedTable[index].workingTime = workingTime;
    }

    const updatedTables = { ...tables, [operator]: updatedTable };
    console.log("Final updatedTables:", updatedTables);
    setTables(updatedTables);
  };

  // 2;
  // const handleInputChange = (index, event) => {
  //   const { name, value } = event.target;
  //   console.log(
  //     `Handling input change for index: ${index}, field: ${name}, value: ${value}`
  //   );

  //   const updatedTable = [...tables[operator]];
  //   console.log("Initial updatedTable:", updatedTable);

  //   updatedTable[index][name] = value;

  //   if (name === "task" && value === "ZLECENIE") {
  //     setShowZlecenieModal(true);
  //     setZlecenieIndex(index);
  //     console.log("Opening Zlecenie Modal for index:", index);
  //   } else {
  //     updatedTable[index][name] = value;
  //     setTables({ ...tables, [operator]: updatedTable });
  //     console.log("Updated tables after setting value:", updatedTable);
  //   }

  //   // Логіка для пошуку попереднього `endTime` в межах тієї ж зміни
  //   if (name === "startTime") {
  //     const shiftStartTime = shiftStartTimes[shift];

  //     // Обчислюємо кінець зміни для нічної зміни або наступної
  //     const shiftEndTime =
  //       shift === "3 Shift (22:00-6:00)"
  //         ? "06:00"
  //         : shiftStartTimes[
  //             Object.keys(shiftStartTimes)[
  //               (Object.keys(shiftStartTimes).indexOf(shift) + 1) % 3
  //             ]
  //           ];

  //     let prevEndTime = index > 0 ? updatedTable[index - 1].endTime : null;

  //     if (!prevEndTime) {
  //       // Якщо попереднього `endTime` немає в поточній таблиці, шукаємо в інших таблицях в межах тієї ж зміни
  //       prevEndTime = findPreviousEndTime(
  //         updatedTable[index].machine,
  //         updatedTable,
  //         index,
  //         shiftStartTime,
  //         shiftEndTime
  //       );
  //     }

  //     // Перевіряємо, чи попередній `endTime` знаходиться в межах поточної зміни
  //     if (
  //       prevEndTime &&
  //       (prevEndTime < shiftStartTime || prevEndTime > shiftEndTime)
  //     ) {
  //       console.log(
  //         `Prev End Time (${prevEndTime}) is outside the current shift, resetting to null.`
  //       );
  //       prevEndTime = null; // Якщо поза зміною, скидаємо
  //     }

  //     if (!prevEndTime) {
  //       prevEndTime = shiftStartTime; // Якщо немає попереднього оператора, використовуємо початок зміни
  //       console.log("Using shift start time as previous endTime.");
  //     }

  //     console.log("Prev End Time:", prevEndTime);
  //     console.log("Current Start Time:", value);
  //     console.log("Shift Start Time:", shiftStartTime);

  //     if (value && shiftStartTime) {
  //       const downtime = calculateDowntimeBetweenOperators(
  //         prevEndTime,
  //         value,
  //         shiftStartTime
  //       );
  //       console.log("Downtime calculated:", downtime);
  //       updatedTable[index].downtime = downtime;
  //       updatedTable[index].stopReason = "";
  //     } else {
  //       updatedTable[index].downtime = "0h 0m";
  //       updatedTable[index].stopReason = "";
  //     }
  //   }

  //   if (name === "startTime" || name === "endTime") {
  //     const formattedTime = formatTimeTo24Hour(value);
  //     console.log("Formatted time:", formattedTime);

  //     updatedTable[index][name] = formattedTime;

  //     const startTime = updatedTable[index].startTime;
  //     const endTime = updatedTable[index].endTime;

  //     console.log("Updated startTime:", startTime);
  //     console.log("Updated endTime:", endTime);

  //     // Перевіряємо на наявність обох полів перед обчисленням робочого часу
  //     if (!startTime || !endTime) {
  //       console.log(
  //         "Start time or end time is missing, cannot calculate working time"
  //       );
  //       return;
  //     }

  //     const workingTime = calculateWorkingTime(startTime, endTime);
  //     console.log("Working time calculated:", workingTime);
  //     updatedTable[index].workingTime = workingTime;
  //   }

  //   const updatedTables = { ...tables, [operator]: updatedTable };
  //   console.log("Final updatedTables:", updatedTables);
  //   setTables(updatedTables);
  // };
  // const handleInputChange = (index, event) => {
  //   const { name, value } = event.target;
  //   console.log(
  //     `Handling input change for index: ${index}, field: ${name}, value: ${value}`
  //   );

  //   const updatedTable = [...tables[operator]];
  //   console.log("Initial updatedTable:", updatedTable);

  //   updatedTable[index][name] = value;

  //   if (name === "task" && value === "ZLECENIE") {
  //     setShowZlecenieModal(true);
  //     setZlecenieIndex(index);
  //     console.log("Opening Zlecenie Modal for index:", index);
  //   } else {
  //     updatedTable[index][name] = value;
  //     setTables({ ...tables, [operator]: updatedTable });
  //     console.log("Updated tables after setting value:", updatedTable);
  //   }

  //   // Логіка для пошуку попереднього `endTime` в межах тієї ж зміни
  //   if (name === "startTime") {
  //     const shiftStartTime = shiftStartTimes[shift];

  //     // Обчислюємо кінець зміни для нічної зміни або наступної
  //     const shiftEndTime =
  //       shift === "3 Shift (22:00-6:00)"
  //         ? "06:00"
  //         : shiftStartTimes[
  //             Object.keys(shiftStartTimes)[
  //               (Object.keys(shiftStartTimes).indexOf(shift) + 1) % 3
  //             ]
  //           ];

  //     let prevEndTime = index > 0 ? updatedTable[index - 1].endTime : null;

  //     if (!prevEndTime) {
  //       // Якщо попереднього `endTime` немає в поточній таблиці, шукаємо в інших таблицях в межах тієї ж зміни
  //       prevEndTime = findPreviousEndTime(
  //         updatedTable[index].machine,
  //         updatedTable,
  //         index,
  //         shiftStartTime,
  //         shiftEndTime
  //       );
  //     }

  //     // Перевіряємо, чи попередній `endTime` знаходиться в межах поточної зміни
  //     if (
  //       prevEndTime &&
  //       (prevEndTime < shiftStartTime || prevEndTime > shiftEndTime)
  //     ) {
  //       console.log(
  //         `Prev End Time (${prevEndTime}) is outside the current shift, resetting to null.`
  //       );
  //       prevEndTime = null; // Якщо поза зміною, скидаємо
  //     }

  //     if (!prevEndTime) {
  //       prevEndTime = shiftStartTime; // Якщо немає попереднього оператора, використовуємо початок зміни
  //       console.log("Using shift start time as previous endTime.");
  //     }

  //     console.log("Prev End Time:", prevEndTime);
  //     console.log("Current Start Time:", value);
  //     console.log("Shift Start Time:", shiftStartTime);

  //     if (value && shiftStartTime) {
  //       const downtime = calculateDowntimeBetweenOperators(
  //         prevEndTime,
  //         value,
  //         shiftStartTime
  //       );
  //       console.log("Downtime calculated:", downtime);
  //       updatedTable[index].downtime = downtime;
  //       updatedTable[index].stopReason = "";
  //     } else {
  //       updatedTable[index].downtime = "0h 0m";
  //       updatedTable[index].stopReason = "";
  //     }
  //   }

  //   if (name === "startTime" || name === "endTime") {
  //     const formattedTime = formatTimeTo24Hour(value);
  //     console.log("Formatted time:", formattedTime);

  //     updatedTable[index][name] = formattedTime;

  //     const startTime = updatedTable[index].startTime;
  //     const endTime = updatedTable[index].endTime;

  //     console.log("Updated startTime:", startTime);
  //     console.log("Updated endTime:", endTime);

  //     // Перевіряємо на наявність обох полів перед обчисленням робочого часу
  //     if (!startTime || !endTime) {
  //       console.log(
  //         "Start time or end time is missing, cannot calculate working time"
  //       );
  //       return;
  //     }

  //     const workingTime = calculateWorkingTime(startTime, endTime);
  //     console.log("Working time calculated:", workingTime);
  //     updatedTable[index].workingTime = workingTime;
  //   }

  //   const updatedTables = { ...tables, [operator]: updatedTable };
  //   console.log("Final updatedTables:", updatedTables);
  //   setTables(updatedTables);
  // };

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

  const recalculateTimesForTable = (updatedTable) => {
    updatedTable.forEach((row, index) => {
      // Оновлюємо попередній час закінчення для кожного ряду
      let prevEndTime = index > 0 ? updatedTable[index - 1].endTime : null;

      if (!prevEndTime) {
        prevEndTime = shiftStartTimes[shift]; // Якщо це перший рядок, беремо початок зміни
      }

      // Якщо це час початку роботи, обчислюємо простій
      if (row.startTime) {
        const downtime = calculateDowntimeBetweenOperators(
          prevEndTime,
          row.startTime,
          shiftStartTimes[shift]
        );
        row.downtime = downtime;
      }

      // Якщо це час початку та кінця роботи, обчислюємо робочий час
      if (row.startTime && row.endTime) {
        const workingTime = calculateWorkingTime(row.startTime, row.endTime);
        row.workingTime = workingTime;
      }
    });

    // Після перерахунку оновлюємо таблиці
    setTables((prevTables) => ({
      ...prevTables,
      [operator]: updatedTable,
    }));
  };

  const handleDeleteRow = (index) => {
    showDeleteConfirmation(operator).then((result) => {
      if (result.isConfirmed) {
        const updatedTables = deleteRow(tables, operator, index);
        setTables(updatedTables);
        console.log("Row deleted, recalculating times...");

        // Перераховуємо час для всіх рядків після видалення
        recalculateTimesForTable(updatedTables[operator]);

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
