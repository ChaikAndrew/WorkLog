import React, { useState, useEffect } from "react";

const Timer = ({ isRunning, onStart, onStop }) => {
  const [time, setTime] = useState(0);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 60000); // Оновлення кожну хвилину
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
      <h3>
        Час роботи: {Math.floor(time / 60)} год {time % 60} хв
      </h3>
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
