import React, { useState, useEffect } from "react";

const formatTime = (seconds) => {
  if (seconds <= 0) return "";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let timeString = "";
  if (hours > 0) timeString += `${hours} H `;
  if (minutes > 0 || hours > 0) timeString += `${minutes} M `;
  timeString += `${secs} S`;

  return timeString;
};

const Timer = ({ isRunning, onStart, onStop, isDowntime, isFormComplete }) => {
  const [workTime, setWorkTime] = useState(0);
  const [downtime, setDowntime] = useState(0);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const savedStartTime = localStorage.getItem("startTime");
    const startTime = savedStartTime
      ? new Date(parseInt(savedStartTime, 10))
      : null;

    let interval;
    if (isRunning || isDowntime) {
      interval = setInterval(() => {
        const currentTime = new Date();
        if (isRunning && startTime) {
          const elapsedTime = Math.floor((currentTime - startTime) / 1000);
          setWorkTime(elapsedTime);
        }
        if (isDowntime) {
          const savedDowntimeStart = localStorage.getItem("downtimeStart");
          const downtimeStart = savedDowntimeStart
            ? new Date(parseInt(savedDowntimeStart, 10))
            : null;
          if (downtimeStart) {
            const downtimeElapsedTime = Math.floor(
              (currentTime - downtimeStart) / 1000
            );
            setDowntime(downtimeElapsedTime);
          }
        }
      }, 1000); // оновлення кожну секунду
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, isDowntime]);

  const handleStart = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem("startTime", currentTime);
    localStorage.removeItem("downtimeStart");
    onStart();
  };

  const handleStopClick = () => {
    if (quantity !== "") {
      onStop(quantity);
      setQuantity("");
    }
  };

  const isButtonDisabled = !isFormComplete; // Чи всі селектори заповнені?

  return (
    <div className="timer">
      {isDowntime ? (
        <>
          <h3>Downtime: {formatTime(downtime)}</h3>
          {/* Час роботи не відображається під час простою */}
        </>
      ) : (
        <>
          <h3>Work time: {formatTime(workTime)}</h3>
          {/* Час простою не відображається під час роботи */}
        </>
      )}
      <button
        onClick={handleStart}
        disabled={isRunning || isButtonDisabled} // Заборонити натискання, якщо не всі селектори заповнені
      >
        START
      </button>
      {isRunning && ( // Не показувати поле вводу кількості, якщо не працює
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Кількість"
        />
      )}
      <button
        onClick={handleStopClick}
        disabled={!isRunning || isButtonDisabled} // Заборонити натискання, якщо не всі селектори заповнені або таймер не працює
      >
        STOP
      </button>
    </div>
  );
};

export default Timer;
