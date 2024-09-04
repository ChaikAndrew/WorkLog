import React, { useState, useEffect } from "react";

import "./App.css";

import shifts from "./data/shifts";
import machines from "./data/machines";
import operators from "./data/operators";
import products from "./data/products";
import colors from "./data/colors";
import tasks from "./data/tasks";
import stopReasons from "./data/stopReasons";
import ShiftStatisticsTable from "./components/ShiftStatisticsTable";

const App = () => {
  const [operator, setOperator] = useState("");
  const [shift, setShift] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);
  const [tables, setTables] = useState(() => {
    const savedTables = localStorage.getItem("tables");
    if (savedTables) {
      return JSON.parse(savedTables);
    } else {
      return operators.reduce((acc, curr) => {
        acc[curr] = [];
        return acc;
      }, {});
    }
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [showShiftStats, setShowShiftStats] = useState(false);

  // Shift start times
  const shiftStartTimes = {
    "1st Shift (6:00-14:00)": "06:00",
    "2nd Shift (14:00-22:00)": "14:00",
    "3rd Shift (22:00-6:00)": "22:00",
  };

  // Зберігаємо дані в Local Storage кожного разу, коли `tables` змінюється
  useEffect(() => {
    localStorage.setItem("tables", JSON.stringify(tables));
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Функція для обробки змін введення
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTable = [...tables[operator]];
    updatedTable[index][name] = value;

    // Перевірка на запізнення початку зміни
    if (name === "startTime") {
      const shiftStartTime = shiftStartTimes[shift]; // Час початку зміни

      if (value && shiftStartTime && value > shiftStartTime) {
        // Якщо час початку більше, ніж запланований час зміни
        const downtime = calculateDowntime(shiftStartTime, value);
        updatedTable[index].downtime = downtime; // Записуємо час простою
        updatedTable[index].stopReason = "Затримка початку зміни"; // Причина простою
      } else {
        // Якщо час в порядку, обнуляємо downtime та stopReason
        updatedTable[index].downtime = "0h 0m";
        updatedTable[index].stopReason = "";
      }
    }

    if (name === "startTime" || name === "endTime") {
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

  // Функція для обчислення робочого часу
  const calculateWorkingTime = (startTime, endTime) => {
    let start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diff = (end - start) / 1000 / 60;

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}h ${minutes}m`;
  };

  // Функція для обчислення простою (downtime)
  const calculateDowntime = (startTime, endTime) => {
    let start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diff = (end - start) / 1000 / 60;

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}h ${minutes}m`;
  };

  // Додаємо функцію adjustDateForShift
  const adjustDateForShift = (date, startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const [year, month, day] = date.split("-").map(Number);

    let dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes));

    const newYear = dateObj.getUTCFullYear();
    const newMonth = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const newDay = String(dateObj.getUTCDate()).padStart(2, "0");

    return `${newYear}-${newMonth}-${newDay}`;
  };

  const addRow = () => {
    if (!selectedDate) {
      alert("Please select a date before adding a row.");
      return;
    }

    let formattedDate = selectedDate;

    const operatorTable = tables[operator] || [];

    const updatedTable = [
      ...operatorTable,
      {
        date: formattedDate,
        shift: shift,
        machine: selectedMachine,
        operator: operator,
        product: "",
        color: "",
        task: "",
        quantity: 0,
        stopReason: "",
        startTime: "",
        endTime: "",
        workingTime: "",
        downtime: "0h 0m",
        isSaved: false,
      },
    ];
    setTables({ ...tables, [operator]: updatedTable });
  };

  const deleteRow = (index) => {
    const updatedTable = tables[operator].filter((_, i) => i !== index);
    setTables({ ...tables, [operator]: updatedTable });
  };

  const editRow = (index) => {
    const updatedTable = [...tables[operator]];
    updatedTable[index].isSaved = false;
    setTables({ ...tables, [operator]: updatedTable });
  };

  const saveRow = (index) => {
    const updatedTable = [...tables[operator]];
    updatedTable[index].isSaved = true;
    setTables({ ...tables, [operator]: updatedTable });
  };

  const calculateTotalsForData = (data, selectedDate) => {
    let totalPOD = 0,
      totalPOF = 0,
      totalZlecenie = 0;
    let totalTShirts = 0,
      totalHoodies = 0,
      totalBags = 0,
      totalSleeves = 0,
      totalOthers = 0,
      totalTest = 0;
    let totalWhite = 0,
      totalColor = 0;
    let totalWorkingTime = 0,
      totalDowntime = 0;

    data.forEach((row) => {
      // Перевіряємо дату і зміну
      const isInSelectedDate =
        row.date === selectedDate ||
        (row.shift === "3rd Shift (22:00-6:00)" &&
          adjustDateForShift(row.date, row.startTime) === selectedDate);

      if (!isInSelectedDate) return;

      const quantity = parseInt(row.quantity) || 0;

      if (row.task === "POD") totalPOD += quantity;
      if (row.task === "POF") totalPOF += quantity;
      if (row.task === "ZLECENIE") totalZlecenie += quantity;

      if (row.product === "T-shirts") totalTShirts += quantity;
      if (row.product === "Hoodie") totalHoodies += quantity;
      if (row.product === "Bags") totalBags += quantity;
      if (row.product === "Sleeves") totalSleeves += quantity;
      if (row.product === "Others") totalOthers += quantity;
      if (row.product === "Test") totalTest += quantity;

      if (row.color === "White") totalWhite += quantity;
      if (row.color === "Color") totalColor += quantity;

      // Обчислюємо загальний робочий час
      const [workingHours, workingMinutes] = row.workingTime
        ? row.workingTime.split("h ").map((s) => parseInt(s) || 0)
        : [0, 0];
      totalWorkingTime += workingHours * 60 + workingMinutes;

      // Обчислюємо загальний час простою
      const [downtimeHours, downtimeMinutes] = row.downtime
        ? row.downtime.split("h ").map((s) => parseInt(s) || 0)
        : [0, 0];
      totalDowntime += downtimeHours * 60 + downtimeMinutes;
    });

    return {
      totalPOD,
      totalPOF,
      totalZlecenie,
      totalTShirts,
      totalHoodies,
      totalBags,
      totalSleeves,
      totalOthers,
      totalTest,
      totalWhite,
      totalColor,
      totalWorkingTime: `${Math.floor(totalWorkingTime / 60)}h ${
        totalWorkingTime % 60
      }m`,
      totalDowntime: `${Math.floor(totalDowntime / 60)}h ${
        totalDowntime % 60
      }m`,
    };
  };

  const calculateShiftTotals = (shift, selectedDate) => {
    let shiftTotals = {
      totalPOD: 0,
      totalPOF: 0,
      totalZlecenie: 0,
      totalTShirts: 0,
      totalHoodies: 0,
      totalBags: 0,
      totalSleeves: 0,
      totalOthers: 0,
      totalTest: 0,
      totalWhite: 0,
      totalColor: 0,
      machinesStats: {},
    };

    operators.forEach((op) => {
      const filteredData = (tables[op] || []).filter(
        (row) =>
          (row.date === selectedDate ||
            (row.shift === "3rd Shift (22:00-6:00)" &&
              adjustDateForShift(row.date, row.startTime) === selectedDate)) &&
          row.shift === shift
      );
      filteredData.forEach((row) => {
        const machine = row.machine;
        if (!shiftTotals.machinesStats[machine]) {
          shiftTotals.machinesStats[machine] = {
            totalPOD: 0,
            totalPOF: 0,
            totalZlecenie: 0,
            totalTShirts: 0,
            totalHoodies: 0,
            totalBags: 0,
            totalSleeves: 0,
            totalOthers: 0,
            totalTest: 0,
            totalWorkingTime: 0,
            totalDowntime: 0,
            operator: op, // Зберігаємо оператора, що працював на цій машині
          };
        }

        const machineStats = shiftTotals.machinesStats[machine];
        const quantity = parseInt(row.quantity) || 0;

        if (row.task === "POD") machineStats.totalPOD += quantity;
        if (row.task === "POF") machineStats.totalPOF += quantity;
        if (row.task === "ZLECENIE") machineStats.totalZlecenie += quantity;

        if (row.product === "T-shirts") machineStats.totalTShirts += quantity;
        if (row.product === "Hoodie") machineStats.totalHoodies += quantity;
        if (row.product === "Bags") machineStats.totalBags += quantity;
        if (row.product === "Sleeves") machineStats.totalSleeves += quantity;
        if (row.product === "Others") machineStats.totalOthers += quantity;
        if (row.product === "Test") machineStats.totalTest += quantity;

        const [workingHours, workingMinutes] = row.workingTime
          ? row.workingTime.split("h ").map((s) => parseInt(s) || 0)
          : [0, 0];
        machineStats.totalWorkingTime += workingHours * 60 + workingMinutes;

        const [downtimeHours, downtimeMinutes] = row.downtime
          ? row.downtime.split("h ").map((s) => parseInt(s) || 0)
          : [0, 0];
        machineStats.totalDowntime += downtimeHours * 60 + downtimeMinutes;
      });

      const opTotals = calculateTotalsForData(filteredData, selectedDate);
      shiftTotals.totalPOD += opTotals.totalPOD;
      shiftTotals.totalPOF += opTotals.totalPOF;
      shiftTotals.totalZlecenie += opTotals.totalZlecenie;
      shiftTotals.totalTShirts += opTotals.totalTShirts;
      shiftTotals.totalHoodies += opTotals.totalHoodies;
      shiftTotals.totalBags += opTotals.totalBags;
      shiftTotals.totalSleeves += opTotals.totalSleeves;
      shiftTotals.totalOthers += opTotals.totalOthers;
      shiftTotals.totalTest += opTotals.totalTest;
      shiftTotals.totalWhite += opTotals.totalWhite;
      shiftTotals.totalColor += opTotals.totalColor;
    });

    return shiftTotals;
  };

  const filteredTable = (tables[operator] || []).filter((row) => {
    return (
      row.date === selectedDate ||
      (row.shift === "3rd Shift (22:00-6:00)" &&
        adjustDateForShift(row.date, row.startTime) === selectedDate)
    );
  });

  const operatorTotals = calculateTotalsForData(filteredTable, selectedDate);

  const firstShiftTotals = calculateShiftTotals(
    "1st Shift (6:00-14:00)",
    selectedDate
  );
  const secondShiftTotals = calculateShiftTotals(
    "2nd Shift (14:00-22:00)",
    selectedDate
  );
  const thirdShiftTotals = calculateShiftTotals(
    "3rd Shift (22:00-6:00)",
    selectedDate
  );

  const shiftsData = [
    { name: "1st Shift (6:00-14:00)", totals: firstShiftTotals },
    { name: "2nd Shift (14:00-22:00)", totals: secondShiftTotals },
    { name: "3rd Shift (22:00-06:00)", totals: thirdShiftTotals },
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
      <h1>Work Log</h1>

      <div className="date-container">
        <label>Select Date: </label>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      <button onClick={toggleShiftStatsVisibility}>
        {showShiftStats ? "Hide" : "Show"} Shift Statistics Info by Date
      </button>

      {showShiftStats && (
        <div className="date-shift-info">
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
          <div className="shift-all_totals">
            <ShiftStatisticsTable
              shiftName={shiftsData[selectedShiftIndex].name}
              shiftTotals={shiftsData[selectedShiftIndex].totals}
            />
          </div>
        </div>
      )}
      <li className="top-selectors_list">
        <ul>
          <label>Select Shift: </label>
          <select value={shift} onChange={handleShiftChange}>
            <option value="">Select </option>
            {shifts.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>
        </ul>
        <ul>
          <label>Select DTG: </label>
          <select value={selectedMachine} onChange={handleMachineChange}>
            <option value="">Select</option>
            {machines.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>
        </ul>
        <ul>
          <label>Select Operator: </label>
          <select value={operator} onChange={handleOperatorChange}>
            <option value="">Select </option>
            {operators.map((op, idx) => (
              <option key={idx} value={op}>
                {op}
              </option>
            ))}
          </select>
        </ul>
      </li>

      {operator && shift && selectedMachine && (
        <div className="table">
          <h2>
            Work Log for {operator} - {shift} - {selectedMachine}
          </h2>
          <table>
            <thead>
              <tr>
                <th className="table-data">Date</th>
                <th className="table-shift">Shift</th>
                <th className="table-machine">Machine</th>
                <th className="table-operator">Operator</th>
                <th className="table-product">Product</th>
                <th className="table-color">Color</th>
                <th className="table-task">Task</th>
                <th className="table-quantity">Quantity</th>
                <th className="table-stop_reason">Stop Reason</th>
                <th className="table-start_time">Start Time</th>
                <th className="table-end_time">End Time</th>
                <th className="table-working_time">Working Time</th>
                <th className="table-downtime">Downtime</th>

                <th className="table-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTable.map((row, index) => (
                <tr key={index}>
                  {row.isSaved ? (
                    <>
                      <td>{formatDate(row.date)}</td>
                      <td>{row.shift.split(" ")[0]}</td>
                      <td>{row.machine}</td>
                      <td>{row.operator}</td>
                      <td>{row.product}</td>
                      <td>{row.color}</td>
                      <td>
                        <span className={`status ${row.task.toLowerCase()}`}>
                          {row.task}
                        </span>
                      </td>
                      <td>{row.quantity}</td>
                      <td>{row.stopReason}</td>
                      <td>{row.startTime}</td>
                      <td>{row.endTime}</td>
                      <td>{row.workingTime}</td>
                      <td>{row.downtime}</td>
                      <td>
                        <div className="edit-btns">
                          <button
                            className="edit"
                            onClick={() => editRow(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Ви впевнені, що хочете видалити цей рядок?"
                                )
                              ) {
                                deleteRow(index);
                              }
                            }}
                          >
                            Delete
                          </button>
                          {!row.isSaved && (
                            <button
                              className="save"
                              onClick={() => saveRow(index)}
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{row.date}</td>
                      <td>{row.shift.split(" ")[0]}</td>
                      <td>{row.machine}</td>
                      <td>{row.operator}</td>
                      <td>
                        <select
                          name="product"
                          value={row.product}
                          onChange={(event) => handleInputChange(index, event)}
                        >
                          <option value="">Select</option>
                          {products.map((product, idx) => (
                            <option key={idx} value={product}>
                              {product}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          name="color"
                          value={row.color}
                          onChange={(event) => handleInputChange(index, event)}
                        >
                          <option value="">Select</option>
                          {colors.map((color, idx) => (
                            <option key={idx} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          name="task"
                          value={row.task}
                          onChange={(event) => handleInputChange(index, event)}
                        >
                          <option value="">Select</option>
                          {tasks.map((task, idx) => (
                            <option key={idx} value={task}>
                              {task}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          name="quantity"
                          value={row.quantity}
                          onChange={(event) => handleInputChange(index, event)}
                        />
                      </td>
                      <td>
                        <select
                          name="stopReason"
                          value={row.stopReason}
                          onChange={(event) => handleInputChange(index, event)}
                        >
                          <option value="">Select</option>
                          {stopReasons.map((reason) => (
                            <option key={reason.id} value={reason.description}>
                              {reason.description}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="time"
                          name="startTime"
                          value={row.startTime}
                          onChange={(event) => handleInputChange(index, event)}
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          name="endTime"
                          value={row.endTime}
                          onChange={(event) => handleInputChange(index, event)}
                        />
                      </td>
                      <td>{row.workingTime}</td>
                      <td>{row.downtime}</td>
                      <td>
                        <div className="edit-btns">
                          <button onClick={() => saveRow(index)}>Save</button>
                          <button onClick={() => deleteRow(index)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              <tr>
                <td colSpan="7">Totals:</td>
                <td>
                  <span className="totals">
                    {operatorTotals.totalTShirts +
                      operatorTotals.totalHoodies +
                      operatorTotals.totalBags +
                      operatorTotals.totalSleeves +
                      operatorTotals.totalOthers +
                      operatorTotals.totalTest}
                  </span>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td>{operatorTotals.totalWorkingTime}</td>
                <td>{operatorTotals.totalDowntime}</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="5">
                  <span className="total-pod">
                    POD: {operatorTotals.totalPOD}
                  </span>
                  <span className="total-pof">
                    POF: {operatorTotals.totalPOF}
                  </span>
                  <span className="total-zlecenie">
                    ZLECENIE: {operatorTotals.totalZlecenie}
                  </span>
                </td>
                <td colSpan="6">
                  T-shirts: {operatorTotals.totalTShirts}, Hoodie:{" "}
                  {operatorTotals.totalHoodies}, Bags:{" "}
                  {operatorTotals.totalBags}, Sleeves:{" "}
                  {operatorTotals.totalSleeves}, Others:{" "}
                  {operatorTotals.totalOthers}, Test: {operatorTotals.totalTest}
                </td>
                <td colSpan="3">
                  White: {operatorTotals.totalWhite}, Color:{" "}
                  {operatorTotals.totalColor}
                </td>
              </tr>
            </tbody>
          </table>
          <button className="add-row" onClick={addRow}>
            Add Row
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
