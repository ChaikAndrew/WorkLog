import React from "react";

const StopReasonSelector = ({ onSelectReason }) => {
  const reasons = [
    "Зміна продукту",
    "Обслуговування машини",
    "Завершення сировини",
    "Зміна оператора",
    "Інші причини",
  ];

  return (
    <div className="selector">
      <h3>Причина простою:</h3>
      <select onChange={(e) => onSelectReason(e.target.value)}>
        <option value="">Оберіть причину</option>
        {reasons.map((reason, index) => (
          <option key={index} value={reason}>
            {reason}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StopReasonSelector;
