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
            <th>Total Produced</th>
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
                  <td>{stats.totalPOD}</td>
                  <td>{stats.totalPOF}</td>
                  <td>{stats.totalZlecenie}</td>
                  <td>{stats.totalTShirts}</td>
                  <td>{stats.totalHoodies}</td>
                  <td>{stats.totalBags}</td>
                  <td>{stats.totalSleeves}</td>
                  <td>{stats.totalOthers}</td>
                  <td>{stats.totalTest}</td>
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
            <td colSpan="2">
              <strong>Total Produced (Shift)</strong>
            </td>
            <td className={s.totals}>{totalProduced}</td>
            <td className={s.totalPod}>{shiftTotals.totalPOD}</td>
            <td className={s.totalPof}>{shiftTotals.totalPOF}</td>
            <td className={s.totalZlecenie}>{shiftTotals.totalZlecenie}</td>
            <td>{shiftTotals.totalTShirts}</td>
            <td>{shiftTotals.totalHoodies}</td>
            <td>{shiftTotals.totalBags}</td>
            <td>{shiftTotals.totalSleeves}</td>
            <td>{shiftTotals.totalOthers}</td>
            <td>{shiftTotals.totalTest}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ShiftStatisticsTable;
