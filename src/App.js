import React, { useState } from "react";
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

function App() {
  const [shift, setShift] = useState("");
  const [machine, setMachine] = useState("");
  const [product, setProduct] = useState("");
  const [task, setTask] = useState("");
  const [color, setColor] = useState("");
  const [operator, setOperator] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [productionData, setProductionData] = useState([]);
  const [stopReason, setStopReason] = useState("");
  const [startTime, setStartTime] = useState(null); // Додаємо стан для початкового часу

  const handleStart = () => {
    setStartTime(new Date()); // Записуємо початковий час
    setIsRunning(true);
  };

  const handleStop = (quantity) => {
    setIsRunning(false);
    const endTime = new Date();
    setProductionData([
      ...productionData,
      {
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
      },
    ]);
  };

  return (
    <>
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
          />
          {!isRunning && <StopReasonSelector onSelectReason={setStopReason} />}
        </div>
        <div className="production-table-container">
          <ProductionTable data={productionData} />
        </div>
      </div>
    </>
  );
}

export default App;
