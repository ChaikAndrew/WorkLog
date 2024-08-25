import React from "react";

const TaskSelector = ({ onSelectTask }) => {
  const tasks = ["POD", "POF", "Zlecenie", "Inne", "Test"];

  return (
    <div className="selector">
      <h3>Оберіть завдання:</h3>
      <select onChange={(e) => onSelectTask(e.target.value)}>
        <option value="">Оберіть завдання</option>
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
