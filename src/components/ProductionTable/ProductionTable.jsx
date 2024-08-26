import React from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

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
      <h3 className="production-table-title">Production Table</h3>
      <table>
        <thead>
          <tr>
            <th>Shift</th>
            <th>Machine</th>
            <th>Operator</th>
            <th>Product</th>
            <th>Color</th>
            <th>Task</th>
            <th>Quantity</th>
            <th>Stop Reason</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Working Time</th>
            <th>Downtime</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.shift}</td>
              <td>{entry.machine}</td>
              <td>{entry.operator}</td>
              <td>{entry.product}</td>
              <td>{entry.color}</td>
              <td>{entry.task}</td>
              <td>{entry.quantity}</td>
              <td>{entry.stopReason || ""}</td>
              <td>{dayjs(entry.startTime).format("HH:mm:ss")}</td>
              <td>{dayjs(entry.endTime).format("HH:mm:ss")}</td>
              <td>{formatDuration(entry.workDuration)}</td>
              <td>{formatDuration(entry.downtimeDuration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionTable;
