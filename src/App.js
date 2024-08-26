import React, { useState, useEffect } from "react";
import "./styles.scss";

import ShiftSelector from "./components/ShiftSelector/ShiftSelector";
import ProductSelector from "./components/ProductSelector/ProductSelector";
import TaskSelector from "./components/TaskSelector/TaskSelector";
import ColorSelector from "./components/ColorSelector/ColorSelector";
import Timer from "./components/Timer/Timer";
import ProductionTable from "./components/ProductionTable/ProductionTable";
import MachineSelector from "./components/MachineSelector/MachineSelector";
import OperatorSelector from "./components/OperatorSelector/OperatorSelector";
import StopReasonSelector from "./components/StopReasonSelector/StopReasonSelector";

const App = () => {
  const [shift, setShift] = useState("");
  const [machine, setMachine] = useState("");
  const [product, setProduct] = useState("");
  const [task, setTask] = useState("");
  const [color, setColor] = useState("");
  const [operator, setOperator] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [productionData, setProductionData] = useState([]);
  const [stopReason, setStopReason] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [downtimeStart, setDowntimeStart] = useState(null);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("productionData");
    if (savedData) {
      setProductionData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const savedStartTime = localStorage.getItem("startTime");
    if (savedStartTime) {
      setStartTime(new Date(parseInt(savedStartTime, 10)));
      setIsRunning(true);
    }

    const savedDowntimeStart = localStorage.getItem("downtimeStart");
    if (savedDowntimeStart) {
      setDowntimeStart(new Date(parseInt(savedDowntimeStart, 10)));
    }

    const savedCurrentEntryIndex = localStorage.getItem("currentEntryIndex");
    if (savedCurrentEntryIndex) {
      setCurrentEntryIndex(parseInt(savedCurrentEntryIndex, 10));
    }
  }, []);

  const handleStart = () => {
    const currentStartTime = new Date();
    const lastDowntimeEnd = downtimeStart
      ? new Date(downtimeStart)
      : currentStartTime;
    const downtimeDuration = Math.floor(
      (currentStartTime - lastDowntimeEnd) / 1000
    ); // in seconds

    localStorage.setItem("startTime", currentStartTime.getTime());
    localStorage.removeItem("downtimeStart");

    setStartTime(currentStartTime);
    setIsRunning(true);
    setDowntimeStart(null); // Stop downtime timer

    if (downtimeDuration > 0 && currentEntryIndex !== null) {
      // Update downtime duration in the existing entry
      setProductionData((prevData) => {
        const updatedData = prevData.map((entry, index) =>
          index === currentEntryIndex
            ? {
                ...entry,
                downtimeDuration:
                  (entry.downtimeDuration || 0) + downtimeDuration,
              }
            : entry
        );
        localStorage.setItem("productionData", JSON.stringify(updatedData));
        return updatedData;
      });
    }

    // Reset the index as a new entry will be started
    setCurrentEntryIndex(null);
    localStorage.removeItem("currentEntryIndex");
  };

  const handleStop = (quantity) => {
    const endTime = new Date();
    const workDuration = Math.floor((endTime - startTime) / 1000); // in seconds

    const newEntry = {
      shift,
      machine,
      product,
      task,
      color,
      operator,
      startTime,
      endTime,
      quantity,
      stopReason,
      workDuration,
      downtimeDuration: 0, // Downtime is reset here
    };

    setProductionData((prevData) => {
      const updatedData = [...prevData, newEntry];
      localStorage.setItem("productionData", JSON.stringify(updatedData));
      return updatedData;
    });

    setIsRunning(false);
    localStorage.removeItem("startTime");
    localStorage.setItem("downtimeStart", endTime.getTime());
    setDowntimeStart(endTime);

    // Set the index of the newly added entry
    setCurrentEntryIndex(productionData.length);
    localStorage.setItem("currentEntryIndex", productionData.length);
  };

  // Check if all selectors have values
  const isFormComplete =
    shift && machine && product && task && color && operator;

  return (
    <div className="app-container">
      <div className="selectors-container">
        <ShiftSelector onSelectShift={setShift} />
        <MachineSelector onSelectMachine={setMachine} />
        <ProductSelector onSelectProduct={setProduct} />
        <TaskSelector onSelectTask={setTask} />
        <ColorSelector onSelectColor={setColor} />
        <OperatorSelector onSelectOperator={setOperator} />
      </div>
      <div className="timer-container">
        <Timer
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
          isDowntime={!!downtimeStart}
          isFormComplete={isFormComplete}
        />
        {!isRunning && downtimeStart && (
          <div className="downtime-timer">
            <h4>
              Select the reason for the vehicle detention and press start when
              you begin the process.
            </h4>
            <StopReasonSelector onSelectReason={setStopReason} />
          </div>
        )}
      </div>
      <div className="production-table-container">
        <ProductionTable data={productionData} />
      </div>
    </div>
  );
};

export default App;
