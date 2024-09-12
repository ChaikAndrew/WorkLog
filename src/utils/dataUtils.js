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
  shift, // Обрана зміна
  selectedDate, // Обрана дата
  tables, // Таблиці з даними операторів
  operators, // Список операторів
  adjustDateForShift // Функція для коригування дати у нічних змінах
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
    machinesStats: {}, // Статистика по кожній машині
  };

  // Перебір кожного оператора
  operators.forEach((op) => {
    // Фільтруємо дані для оператора, щоб вибрати лише ті, що належать обраній даті та зміні
    const filteredData = (tables[op] || []).filter(
      (row) =>
        (row.date === selectedDate ||
          (row.shift === "3rd Shift (22:00-6:00)" &&
            adjustDateForShift(row.date, row.startTime) === selectedDate)) &&
        row.shift === shift
    );

    // Перебір кожного рядка з відфільтрованих даних
    filteredData.forEach((row) => {
      const machine = row.machine;

      // Ініціалізація даних для кожної машини
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
          operator: op, // Запам'ятовуємо оператора, що працює на цій машині
        };
      }

      // Підсумовуємо дані для машини
      const machineStats = shiftTotals.machinesStats[machine];
      const quantity = parseInt(row.quantity) || 0;

      if (row.task === "POD") machineStats.totalPOD += quantity;
      if (row.task === "POF") machineStats.totalPOF += quantity;
      if (row.task === "ZLECENIE") machineStats.totalZlecenie += quantity;

      if (row.product === "T-shirts") machineStats.totalTShirts += quantity;
      if (row.product === "Hoodie") machineStats.totalHoodies += quantity;
      if (row.product === "Bags") machineStats.totalBags += quantity;
      if (row.product === "Sleeves") machineStats.totalSleeves += quantity;
      if (row.product === "Others") machineStats.totalOthers += quantity;
      if (row.product === "Test") machineStats.totalTest += quantity;

      // Обчислення робочого часу
      const [workingHours, workingMinutes] = row.workingTime
        ? row.workingTime.split("h ").map((s) => parseInt(s) || 0)
        : [0, 0];
      machineStats.totalWorkingTime += workingHours * 60 + workingMinutes;

      // Обчислення часу простою (downtime)
      const [downtimeHours, downtimeMinutes] = row.downtime
        ? row.downtime.split("h ").map((s) => parseInt(s) || 0)
        : [0, 0];
      machineStats.totalDowntime += downtimeHours * 60 + downtimeMinutes;
    });

    // Обчислюємо підсумки для оператора
    const opTotals = calculateTotalsForData(filteredData, selectedDate);
    shiftTotals.totalPOD += opTotals.totalPOD;
    shiftTotals.totalPOF += opTotals.totalPOF;
    shiftTotals.totalZlecenie += opTotals.totalZlecenie;
    shiftTotals.totalTShirts += opTotals.totalTShirts;
    shiftTotals.totalHoodies += opTotals.totalHoodies;
    shiftTotals.totalBags += opTotals.totalBags;
    shiftTotals.totalSleeves += opTotals.totalSleeves;
    shiftTotals.totalOthers += opTotals.totalOthers;
    shiftTotals.totalTest += opTotals.totalTest;
    shiftTotals.totalWhite += opTotals.totalWhite;
    shiftTotals.totalColor += opTotals.totalColor;
  });

  return shiftTotals; // Повертаємо підсумки для зміни
};
