// Функція для обчислення загальних підсумків для даних одного оператора
export const calculateTotalsForData = (
  data, // Дані для обробки
  selectedDate, // Обрана дата
  adjustDateForShift // Функція для коригування дати у нічних змінах
) => {
  // Ініціалізація змінних для підрахунків
  let totalPOD = 0,
    totalPOF = 0,
    totalZlecenie = 0;
  let totalTShirts = 0,
    totalHoodies = 0,
    totalBags = 0,
    totalSleeves = 0,
    totalOthers = 0,
    totalTest = 0;
  let totalWhite = 0,
    totalColor = 0;
  let totalWorkingTime = 0,
    totalDowntime = 0;

  // Перебір кожного рядка даних
  data.forEach((row) => {
    // Перевіряємо, чи рядок належить обраній даті або нічній зміні
    const isInSelectedDate =
      row.date === selectedDate ||
      (row.shift === "3rd Shift (22:00-6:00)" &&
        adjustDateForShift(row.date, row.startTime) === selectedDate);

    if (!isInSelectedDate) return;

    // Підсумовуємо кількість на основі типу завдання та продукту
    const quantity = parseInt(row.quantity) || 0;

    if (row.task === "POD") totalPOD += quantity;
    if (row.task === "POF") totalPOF += quantity;
    if (row.task === "ZLECENIE") totalZlecenie += quantity;

    if (row.product === "T-shirts") totalTShirts += quantity;
    if (row.product === "Hoodie") totalHoodies += quantity;
    if (row.product === "Bags") totalBags += quantity;
    if (row.product === "Sleeves") totalSleeves += quantity;
    if (row.product === "Others") totalOthers += quantity;
    if (row.product === "Test") totalTest += quantity;

    if (row.color === "White") totalWhite += quantity;
    if (row.color === "Color") totalColor += quantity;

    // Обчислення загального робочого часу
    const [workingHours, workingMinutes] = row.workingTime
      ? row.workingTime.split("h ").map((s) => parseInt(s) || 0)
      : [0, 0];
    totalWorkingTime += workingHours * 60 + workingMinutes;

    // Обчислення загального часу простою (downtime)
    const [downtimeHours, downtimeMinutes] = row.downtime
      ? row.downtime.split("h ").map((s) => parseInt(s) || 0)
      : [0, 0];
    totalDowntime += downtimeHours * 60 + downtimeMinutes;
  });

  // Повернення загальних результатів
  return {
    totalPOD,
    totalPOF,
    totalZlecenie,
    totalTShirts,
    totalHoodies,
    totalBags,
    totalSleeves,
    totalOthers,
    totalTest,
    totalWhite,
    totalColor,
    totalWorkingTime: `${Math.floor(totalWorkingTime / 60)}h ${
      totalWorkingTime % 60
    }m`,
    totalDowntime: `${Math.floor(totalDowntime / 60)}h ${totalDowntime % 60}m`,
  };
};

// Функція для обчислення підсумків зміни
export const calculateShiftTotals = (
  shift,
  selectedDate,
  tables,
  operators,
  adjustDateForShift
) => {
  let shiftTotals = {
    totalPOD: 0,
    totalPOF: 0,
    totalZlecenie: 0,
    totalTShirts: 0,
    totalHoodies: 0,
    totalBags: 0,
    totalSleeves: 0,
    totalOthers: 0,
    totalTest: 0,
    totalWhite: 0,
    totalColor: 0,
    machinesStats: {},
  };

  operators.forEach((op) => {
    const filteredData = (tables[op] || []).filter(
      (row) =>
        (row.date === selectedDate ||
          (row.shift === "3rd Shift (22:00-6:00)" &&
            adjustDateForShift(row.date, row.startTime) === selectedDate)) &&
        row.shift === shift
    );

    filteredData.forEach((row) => {
      const machine = row.machine;

      // Ініціалізуємо машину, якщо її немає в статистиці
      if (!shiftTotals.machinesStats[machine]) {
        shiftTotals.machinesStats[machine] = {
          totalPOD: 0,
          totalPOF: 0,
          totalZlecenie: 0,
          totalTShirts: 0,
          totalHoodies: 0,
          totalBags: 0,
          totalSleeves: 0,
          totalOthers: 0,
          totalTest: 0,
          totalWorkingTime: 0,
          totalDowntime: 0,
          operators: [], // Масив операторів для машини
        };
      }

      // Перевіряємо, чи вже є цей оператор у масиві операторів
      const existingOperator = shiftTotals.machinesStats[
        machine
      ].operators.find((o) => o.name === op);

      if (!existingOperator) {
        shiftTotals.machinesStats[machine].operators.push({
          name: op,
          totalPOD: 0,
          totalPOF: 0,
          totalZlecenie: 0,
          totalTShirts: 0,
          totalHoodies: 0,
          totalBags: 0,
          totalSleeves: 0,
          totalOthers: 0,
          totalTest: 0,
          totalWorkingTime: 0,
          totalDowntime: 0,
        });
      }

      const operatorStats = shiftTotals.machinesStats[machine].operators.find(
        (o) => o.name === op
      );

      const quantity = parseInt(row.quantity) || 0;
      if (row.task === "POD") operatorStats.totalPOD += quantity;
      if (row.task === "POF") operatorStats.totalPOF += quantity;
      if (row.task === "ZLECENIE") operatorStats.totalZlecenie += quantity;

      if (row.product === "T-shirts") operatorStats.totalTShirts += quantity;
      if (row.product === "Hoodie") operatorStats.totalHoodies += quantity;
      if (row.product === "Bags") operatorStats.totalBags += quantity;
      if (row.product === "Sleeves") operatorStats.totalSleeves += quantity;
      if (row.product === "Others") operatorStats.totalOthers += quantity;
      if (row.product === "Test") operatorStats.totalTest += quantity;

      // Обчислюємо робочий і downtime
      const [workingHours, workingMinutes] = row.workingTime
        ? row.workingTime.split("h ").map((s) => parseInt(s) || 0)
        : [0, 0];
      operatorStats.totalWorkingTime += workingHours * 60 + workingMinutes;

      const [downtimeHours, downtimeMinutes] = row.downtime
        ? row.downtime.split("h ").map((s) => parseInt(s) || 0)
        : [0, 0];
      operatorStats.totalDowntime += downtimeHours * 60 + downtimeMinutes;
    });
  });

  return shiftTotals;
};
