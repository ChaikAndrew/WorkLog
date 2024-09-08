import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import shifts from "./data/shifts";
import machines from "./data/machines";
import operators from "./data/operators";
import products from "./data/products";
import colors from "./data/colors";
import tasks from "./data/tasks";
import stopReasons from "./data/stopReasons";
import ShiftStatisticsTable from "./components/ShiftStatisticsTable";

import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoMdCheckboxOutline } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";

import Swal from "sweetalert2";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const App = () => {
  const [operator, setOperator] = useState("");
  const [shift, setShift] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);
  const [showZlecenieModal, setShowZlecenieModal] = useState(false);
  const [zlecenieNameInput, setZlecenieNameInput] = useState("");
  const [zlecenieIndex, setZlecenieIndex] = useState(null);

  const lastRowRef = useRef(null);
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "top",
    },
  });

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

  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRow(index); // Deleting the row
        deleteRow(index); // Видаляємо рядок

        // Показуємо повідомлення через Notyf про успішне видалення
        notyf.open({
          message: "The row has been successfully deleted.",
          duration: 2000,
          className: "custom-gradient-success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        notyf.open({
          message: "The row has been successfully deleted.",
          duration: 2000,
          className: "custom-gradient-success",
        });
      }
    });
  };

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

  const formatTimeTo24Hour = (time) => {
    const [hours, minutes] = time.split(":").map(Number);

    // Форматуємо години та хвилини, щоб завжди були двозначними
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };
  const handleZlecenieSave = () => {
    const updatedTable = [...tables[operator]];
    updatedTable[zlecenieIndex].zlecenieName = zlecenieNameInput; // Зберігаємо введену назву
    setTables({ ...tables, [operator]: updatedTable });
    setShowZlecenieModal(false); // Закриваємо модальне вікно
    setZlecenieNameInput(""); // Очищаємо поле введення
  };
  // Функція для обробки змін введення
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTable = [...tables[operator]];
    updatedTable[index][name] = value;

    if (name === "task" && value === "ZLECENIE") {
      setShowZlecenieModal(true); // Відкриваємо модальне вікно
      setZlecenieIndex(index); // Записуємо індекс для збереження назви
    } else {
      updatedTable[index][name] = value; // Зберігаємо інші зміни
      setTables({ ...tables, [operator]: updatedTable });
    }

    setTables({ ...tables, [operator]: updatedTable });

    setTables({ ...tables, [operator]: updatedTable });

    // Перевірка на запізнення початку зміни
    if (name === "startTime") {
      const shiftStartTime = shiftStartTimes[shift]; // Час початку зміни

      if (value && shiftStartTime && value > shiftStartTime) {
        // Якщо час початку більше, ніж запланований час зміни
        const downtime = calculateDowntime(shiftStartTime, value);
        updatedTable[index].downtime = downtime; // Записуємо час простою
        updatedTable[index].stopReason = ""; // Причина простою
      } else {
        // Якщо час в порядку, обнуляємо downtime та stopReason
        updatedTable[index].downtime = "0h 0m";
        updatedTable[index].stopReason = "";
      }
    }

    if (name === "startTime" || name === "endTime") {
      // Форматуємо час перед збереженням
      const formattedTime = formatTimeTo24Hour(value);
      updatedTable[index][name] = formattedTime;

      const startTime = updatedTable[index].startTime;
      const endTime = updatedTable[index].endTime;

      // Якщо обидва часу встановлені, обчислюємо робочий час
      if (startTime && endTime) {
        const workingTime = calculateWorkingTime(startTime, endTime);
        updatedTable[index].workingTime = workingTime;
      }
    } else {
      updatedTable[index][name] = value;
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
      notyf.open({
        message: "Please select a date before adding a row.",
        duration: 2000, // Тривалість 2 секунди (2000 мс)
        className: "custom-gradient-error",
      });
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

    // Показуємо повідомлення про успішне додавання

    notyf.open({
      message: "Row has been successfully added to the table.",
      duration: 2000,
      className: "custom-gradient-success",
    });

    // Прокручуємо до низу після додавання нового рядка
    setTimeout(() => {
      lastRowRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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

    // Показуємо повідомлення про успішне редагування
    notyf.open({
      message: "Row has been successfully updated.",
      duration: 2000,
      className: "custom-gradient-success",
    });
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
            operator: op,
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
      <h1>Production Report</h1>

      <div className="date-container">
        <label className="select-data-label">Select Date: </label>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      <button onClick={toggleShiftStatsVisibility}>
        {showShiftStats ? "Hide" : "Show"} Statistics
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
      {showZlecenieModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter Zlecenie Name</h2>
            <input
              type="text"
              value={zlecenieNameInput}
              onChange={(e) => setZlecenieNameInput(e.target.value)}
            />
            <button onClick={handleZlecenieSave}>OK</button>
            <button onClick={() => setShowZlecenieModal(false)}>Cancel</button>
          </div>
        </div>
      )}

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
                <tr
                  key={index}
                  ref={index === filteredTable.length - 1 ? lastRowRef : null}
                >
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
                          {row.task === "ZLECENIE"
                            ? row.zlecenieName || "ZLECENIE"
                            : row.task}
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
                            <FiEdit className="edit-icon" size="23" />
                          </button>
                          <button
                            className="delete"
                            onClick={() => handleDelete(index)}
                          >
                            <RiDeleteBin2Line
                              className="delete-icon"
                              size="26"
                            />
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
                          <button
                            className="edit-btn-save"
                            onClick={() => saveRow(index)}
                          >
                            <IoMdCheckboxOutline size="25" />
                          </button>
                          <button
                            className="edit-btn-delete"
                            onClick={() => deleteRow(index)}
                          >
                            <RiDeleteBin2Line
                              className="delete-icon"
                              size="26"
                            />
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
              <tr className="total-statistics">
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
                  {operatorTotals.totalTShirts > 0 && (
                    <span className="total-operator-statistic">
                      T-shirts: {operatorTotals.totalTShirts}
                    </span>
                  )}
                  {operatorTotals.totalHoodies > 0 && (
                    <span className="total-operator-statistic">
                      {" "}
                      Hoodie: {operatorTotals.totalHoodies}
                    </span>
                  )}
                  {operatorTotals.totalBags > 0 && (
                    <span className="total-operator-statistic">
                      Bags: {operatorTotals.totalBags}
                    </span>
                  )}
                  {operatorTotals.totalSleeves > 0 && (
                    <span className="total-operator-statistic">
                      Sleeves: {operatorTotals.totalSleeves}
                    </span>
                  )}
                  {operatorTotals.totalOthers > 0 && (
                    <span className="total-operator-statistic">
                      Others: {operatorTotals.totalOthers}
                    </span>
                  )}
                  {operatorTotals.totalTest > 0 && (
                    <span className="total-operator-statistic">
                      Test: {operatorTotals.totalTest}
                    </span>
                  )}
                </td>
                <td colSpan="3">
                  {operatorTotals.totalWhite > 0 && (
                    <span className="total-operator-statistic">
                      White: {operatorTotals.totalWhite}
                    </span>
                  )}
                  {operatorTotals.totalColor > 0 && (
                    <span className="total-operator-statistic">
                      Color: {operatorTotals.totalColor}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <button className="add-row" onClick={addRow}>
            <IoMdAddCircle size={40} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
