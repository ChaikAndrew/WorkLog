import React from "react";
import s from "./ShiftStatisticsTable.module.scss";

const ShiftStatisticsTable = ({ shiftName, shiftTotals }) => {
  if (Object.values(shiftTotals).every((value) => value === 0)) {
    return null;
  }

  const totalProduced =
    shiftTotals.totalPOD + shiftTotals.totalPOF + shiftTotals.totalZlecenie;

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
          {Object.entries(shiftTotals.machinesStats).map(
            ([machine, stats]) =>
              Object.values(stats).some((value) => value > 0) && (
                <tr key={machine}>
                  <td>{machine}</td>
                  <td>{stats.operator}</td>
                  <td>
                    {stats.totalPOD + stats.totalPOF + stats.totalZlecenie}
                  </td>
                  <td>{stats.totalPOD > 0 && stats.totalPOD}</td>
                  <td>{stats.totalPOF > 0 && stats.totalPOF}</td>
                  <td>{stats.totalZlecenie > 0 && stats.totalZlecenie}</td>
                  <td>{stats.totalTShirts > 0 && stats.totalTShirts}</td>
                  <td>{stats.totalHoodies > 0 && stats.totalHoodies}</td>
                  <td>{stats.totalBags > 0 && stats.totalBags}</td>
                  <td>{stats.totalSleeves > 0 && stats.totalSleeves}</td>
                  <td>{stats.totalOthers > 0 && stats.totalOthers}</td>
                  <td>{stats.totalTest > 0 && stats.totalTest}</td>
                  <td>
                    {Math.floor(stats.totalWorkingTime / 60)}h{" "}
                    {stats.totalWorkingTime % 60}m
                  </td>
                  <td>
                    {Math.floor(stats.totalDowntime / 60)}h{" "}
                    {stats.totalDowntime % 60}m
                  </td>
                </tr>
              )
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className="totals-cell">
              Total:
            </td>
            <td className={s.totals}>{totalProduced}</td>
            <td className={s.totalPod}>{shiftTotals.totalPOD}</td>
            <td className={s.totalPof}>{shiftTotals.totalPOF}</td>
            <td className={s.totalZlecenie}>{shiftTotals.totalZlecenie}</td>

            <td>{shiftTotals.totalTShirts > 0 && shiftTotals.totalTShirts}</td>
            <td>{shiftTotals.totalHoodies > 0 && shiftTotals.totalHoodies}</td>
            <td>{shiftTotals.totalBags > 0 && shiftTotals.totalBags}</td>
            <td>{shiftTotals.totalSleeves > 0 && shiftTotals.totalSleeves}</td>
            <td>{shiftTotals.totalOthers > 0 && shiftTotals.totalOthers}</td>
            <td>{shiftTotals.totalTest > 0 && shiftTotals.totalTest}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ShiftStatisticsTable;
