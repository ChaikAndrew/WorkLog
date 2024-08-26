import React from "react";

const TaskSelector = ({ onSelectTask }) => {
  const tasks = ["POD", "POF", "ZLECENIE"];

  return (
    <div className="selector">
      <h3>Order №</h3>
      <select onChange={(e) => onSelectTask(e.target.value)}>
        <option value="">Select</option>
        {tasks.map((task, index) => (
          <option key={index} value={task}>
            {task}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskSelector;
