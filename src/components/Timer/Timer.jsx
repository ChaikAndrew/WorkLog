import React, { useState, useEffect } from "react";

const formatTime = (seconds) => {
  if (seconds <= 0) return "0 с";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let timeString = "";
  if (hours > 0) timeString += `${hours} год`;
  if (minutes > 0 || hours > 0) timeString += `${minutes} хв`;
  timeString += `${secs} с`;

  return timeString;
};

const Timer = ({ isRunning, onStart, onStop }) => {
  const [time, setTime] = useState(0);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000); // оновлення кожну секунду
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStopClick = () => {
    if (quantity !== "") {
      onStop(quantity);
      setTime(0);
      setQuantity("");
    }
  };

  return (
    <div className="timer">
      <h3>Час роботи: {formatTime(time)}</h3>
      <button onClick={onStart} disabled={isRunning}>
        СТАРТ
      </button>
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Кількість"
      />
      <button onClick={handleStopClick} disabled={!isRunning}>
        СТОП
      </button>
    </div>
  );
};

export default Timer;
