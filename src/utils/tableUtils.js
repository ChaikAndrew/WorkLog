// tableUtils.js
export const loadTablesFromLocalStorage = (operators) => {
  const savedTables = localStorage.getItem("tables");
  if (savedTables) {
    return JSON.parse(savedTables);
  } else {
    return operators.reduce((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {});
  }
};

export const saveTablesToLocalStorage = (tables) => {
  localStorage.setItem("tables", JSON.stringify(tables));
};

export const addRow = (
  tables,
  operator,
  selectedDate,
  shift,
  selectedMachine
) => {
  if (!selectedDate) {
    return { error: "Please select a date before adding a row." };
  }

  const formattedDate = selectedDate;
  const operatorTable = tables[operator] || [];

  const updatedTable = [
    ...operatorTable,
    {
      date: formattedDate,
      shift: shift,
      machine: selectedMachine,
      operator: operator,
      product: "",
      color: "",
      task: "",
      quantity: 0,
      stopReason: "",
      startTime: "",
      endTime: "",
      workingTime: "",
      downtime: "0h 0m",
      isSaved: false,
    },
  ];

  return { tables: { ...tables, [operator]: updatedTable }, success: true };
};

export const deleteRow = (tables, operator, index) => {
  const updatedTable = tables[operator].filter((_, i) => i !== index);
  return { ...tables, [operator]: updatedTable };
};

export const editRow = (tables, operator, index) => {
  const updatedTable = [...tables[operator]];
  updatedTable[index].isSaved = false;
  return { ...tables, [operator]: updatedTable };
};

export const saveRow = (tables, operator, index) => {
  const updatedTable = [...tables[operator]];
  updatedTable[index].isSaved = true;
  return { ...tables, [operator]: updatedTable };
};
