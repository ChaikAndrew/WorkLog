import React from "react";
import s from "./ShiftStatisticsTable.module.scss";

const ShiftStatisticsTable = ({ shiftName, shiftTotals }) => {
  if (Object.values(shiftTotals).every((value) => value === 0)) {
    return null;
  }

  // Ініціалізуємо загальні підсумки
  let totalPOD = 0;
  let totalPOF = 0;
  let totalZlecenie = 0;
  let totalTShirts = 0;
  let totalHoodies = 0;
  let totalBags = 0;
  let totalSleeves = 0;
  let totalOthers = 0;
  let totalTest = 0;

  // Проходимо по кожній машині і операторах
  Object.entries(shiftTotals.machinesStats).forEach(([machine, stats]) => {
    stats.operators.forEach((operator) => {
      totalPOD += operator.totalPOD || 0;
      totalPOF += operator.totalPOF || 0;
      totalZlecenie += operator.totalZlecenie || 0;
      totalTShirts += operator.totalTShirts || 0;
      totalHoodies += operator.totalHoodies || 0;
      totalBags += operator.totalBags || 0;
      totalSleeves += operator.totalSleeves || 0;
      totalOthers += operator.totalOthers || 0;
      totalTest += operator.totalTest || 0;
    });
  });

  // Оновимо totalProduced, щоб правильно підсумувати всі значення
  const totalProduced = totalPOD + totalPOF + totalZlecenie;

  // Сортуємо машини по їхньому номеру (наприклад, DTG1, DTG2 і т.д.)
  const sortedMachines = Object.entries(shiftTotals.machinesStats).sort(
    ([a], [b]) => {
      // Витягуємо номер машини (DTG1 -> 1, DTG2 -> 2)
      const numberA = parseInt(a.replace(/\D/g, ""), 10);
      const numberB = parseInt(b.replace(/\D/g, ""), 10);
      return numberA - numberB; // Сортуємо по зростанню
    }
  );

  return (
    <div className={s.shiftTotals}>
      <h2>Statistics for {shiftName}</h2>

      <table className={s.shiftTable}>
        <thead>
          <tr>
            <th>Machine</th>
            <th>Operator</th>
            <th>Total</th>
            <th>POD</th>
            <th>POF</th>
            <th>Zlecenie</th>
            <th>T-shirts</th>
            <th>Hoodies</th>
            <th>Bags</th>
            <th>Sleeves</th>
            <th>Others</th>
            <th>Test</th>
            <th>Working Time</th>
            <th>Downtime</th>
          </tr>
        </thead>
        <tbody>
          {sortedMachines.map(([machine, stats]) => (
            <>
              {stats.operators.map((operator, index) => (
                <tr key={`${machine}-${operator.name}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={stats.operators.length}>{machine}</td>
                  )}
                  <td>{operator.name}</td>
                  <td>
                    {operator.totalPOD +
                      operator.totalPOF +
                      operator.totalZlecenie}
                  </td>
                  <td>{operator.totalPOD > 0 && operator.totalPOD}</td>
                  <td>{operator.totalPOF > 0 && operator.totalPOF}</td>
                  <td>
                    {operator.totalZlecenie > 0 && operator.totalZlecenie}
                  </td>
                  <td>{operator.totalTShirts > 0 && operator.totalTShirts}</td>
                  <td>{operator.totalHoodies > 0 && operator.totalHoodies}</td>
                  <td>{operator.totalBags > 0 && operator.totalBags}</td>
                  <td>{operator.totalSleeves > 0 && operator.totalSleeves}</td>
                  <td>{operator.totalOthers > 0 && operator.totalOthers}</td>
                  <td>{operator.totalTest > 0 && operator.totalTest}</td>
                  <td>
                    {Math.floor(operator.totalWorkingTime / 60)}h{" "}
                    {operator.totalWorkingTime % 60}m
                  </td>
                  <td>
                    {Math.floor(operator.totalDowntime / 60)}h{" "}
                    {operator.totalDowntime % 60}m
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className="totals-cell">
              Total:
            </td>
            <td className={s.totals}>{totalProduced}</td>
            <td className={s.totalPod}>{totalPOD}</td>
            <td className={s.totalPof}>{totalPOF}</td>
            <td className={s.totalZlecenie}>{totalZlecenie}</td>
            <td>{totalTShirts > 0 && totalTShirts}</td>
            <td>{totalHoodies > 0 && totalHoodies}</td>
            <td>{totalBags > 0 && totalBags}</td>
            <td>{totalSleeves > 0 && totalSleeves}</td>
            <td>{totalOthers > 0 && totalOthers}</td>
            <td>{totalTest > 0 && totalTest}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ShiftStatisticsTable;
