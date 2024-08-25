import React from "react";

const ProductionTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="production-table">Немає даних для відображення</div>;
  }

  return (
    <div className="production-table">
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
            <th>Причина простою</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.shift}</td>
              <td>{entry.machine}</td>
              <td>{entry.product}</td>
              <td>{entry.task}</td>
              <td>{entry.color}</td>
              <td>{entry.operator}</td>
              <td>{entry.startTime.toLocaleString()}</td>
              <td>{entry.endTime.toLocaleString()}</td>
              <td>{entry.quantity}</td>
              <td>{entry.stopReason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionTable;
