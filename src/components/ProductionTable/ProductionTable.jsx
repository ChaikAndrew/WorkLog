import React from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  return end.diff(start, "second"); // Повертає тривалість у секундах
};

const formatDuration = (seconds) => {
  const durationObj = dayjs.duration(seconds, "seconds");
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();
  const secs = durationObj.seconds();
  return `${hours} год ${minutes} хв ${secs} с`;
};

const ProductionTable = ({ data }) => {
  return (
    <div className="production-table-container">
      <h3>Таблиця виробництва</h3>
      <table>
        <thead>
          <tr>
            <th>Зміна</th>
            <th>Машина</th>
            <th>Продукт</th>
            <th>Завдання</th>
            <th>Колір</th>
            <th>Оператор</th>
            <th>Час початку</th>
            <th>Час закінчення</th>
            <th>Кількість</th>
            <th>Причина зупинки</th>
            <th>Час роботи</th>
            <th>Час простою</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => {
            // Обчислюємо тривалість роботи
            const workDuration = calculateDuration(
              entry.startTime,
              entry.endTime
            );

            // Обчислюємо тривалість простою
            const downtimeDuration = entry.stopReason
              ? calculateDuration(entry.endTime, new Date())
              : 0;

            return (
              <tr key={index}>
                <td>{entry.shift}</td>
                <td>{entry.machine}</td>
                <td>{entry.product}</td>
                <td>{entry.task}</td>
                <td>{entry.color}</td>
                <td>{entry.operator}</td>
                <td>{dayjs(entry.startTime).format("HH:mm:ss")}</td>
                <td>{dayjs(entry.endTime).format("HH:mm:ss")}</td>
                <td>{entry.quantity}</td>
                <td>{entry.stopReason || "Немає"}</td>
                <td>{formatDuration(workDuration)}</td>
                <td>{formatDuration(downtimeDuration)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionTable;
