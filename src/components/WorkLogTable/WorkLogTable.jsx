import React from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { IoMdCheckboxOutline } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import stopReasons from "../../data/stopReasons";
import tasks from "../../data/tasks";
import products from "../../data/products";
import colors from "../../data/colors";

const WorkLogTable = ({
  filteredTable,
  formatDate,
  handleInputChange,
  saveRow,
  editRow,
  handleDelete,
  lastRowRef,
  operatorTotals,
  addRow,
}) => {
  return (
    <div className="table">
      <h2>Work Log</h2>
      <table>
        <thead>
          <tr>
            <th className="table-data">Date</th>
            <th className="table-shift">Shift</th>
            <th className="table-machine">Machine</th>
            <th className="table-operator">Operator</th>
            <th className="table-task">Task</th>
            <th className="table-product">Product</th>
            <th className="table-color">Color</th>
            <th className="table-quantity">Quantity</th>
            <th className="table-start_time">Start Time</th>
            <th className="table-end_time">End Time</th>
            <th className="table-stop_reason">Stop Reason</th>
            <th className="table-working_time">Working Time</th>
            <th className="table-downtime">Downtime</th>
            <th className="table-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTable.map((row, index) => (
            <tr
              key={index}
              ref={index === filteredTable.length - 1 ? lastRowRef : null}
            >
              {row.isSaved ? (
                <>
                  <td>{formatDate(row.date)}</td>
                  <td>{row.shift.split(" ")[0]}</td>
                  <td>{row.machine}</td>
                  <td>{row.operator}</td>
                  <td>
                    <span className={`status ${row.task.toLowerCase()}`}>
                      {row.task === "ZLECENIE"
                        ? row.zlecenieName || "ZLECENIE"
                        : row.task}
                    </span>
                  </td>
                  <td>{row.product}</td>
                  <td>{row.color}</td>
                  <td>{row.quantity}</td>
                  <td>{row.startTime}</td>
                  <td>{row.endTime}</td>
                  <td>
                    {
                      stopReasons.find(
                        (reason) => reason.description === row.stopReason
                      )?.id
                    }
                  </td>
                  <td>{row.workingTime}</td>
                  <td>{row.downtime}</td>
                  <td>
                    <div className="edit-btns">
                      <button className="edit" onClick={() => editRow(index)}>
                        <FiEdit className="edit-icon" size="23" />
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(index)}
                      >
                        <RiDeleteBin2Line className="delete-icon" size="26" />
                      </button>
                      {!row.isSaved && (
                        <button className="save" onClick={() => saveRow(index)}>
                          Save
                        </button>
                      )}
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>{row.date}</td>
                  <td>{row.shift.split(" ")[0]}</td>
                  <td>{row.machine}</td>
                  <td>{row.operator}</td>
                  <td>
                    <select
                      name="task"
                      value={row.task}
                      onChange={(event) => handleInputChange(index, event)}
                    >
                      <option value="">Select</option>
                      {tasks.map((task, idx) => (
                        <option key={idx} value={task}>
                          {task}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      name="product"
                      value={row.product}
                      onChange={(event) => handleInputChange(index, event)}
                    >
                      <option value="">Select</option>
                      {products.map((product, idx) => (
                        <option key={idx} value={product}>
                          {product}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      name="color"
                      value={row.color}
                      onChange={(event) => handleInputChange(index, event)}
                    >
                      <option value="">Select</option>
                      {colors.map((color, idx) => (
                        <option key={idx} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      value={row.quantity}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="startTime"
                      value={row.startTime}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="endTime"
                      value={row.endTime}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </td>
                  <td>
                    <select
                      name="stopReason"
                      value={row.stopReason}
                      onChange={(event) => handleInputChange(index, event)}
                    >
                      <option value="">Select</option>
                      {stopReasons.map((reason) => (
                        <option key={reason.id} value={reason.description}>
                          {reason.description}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{row.workingTime}</td>
                  <td>{row.downtime}</td>
                  <td>
                    <div className="edit-btns">
                      <button
                        className="edit-btn-save"
                        onClick={() => saveRow(index)}
                      >
                        <IoMdCheckboxOutline size="25" />
                      </button>
                      <button
                        className="edit-btn-delete"
                        onClick={() => handleDelete(index)}
                      >
                        <RiDeleteBin2Line className="delete-icon" size="26" />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}

          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colSpan="1" className="totals-cell">
              Total:
            </td>
            <td>
              <span className="totals">
                {operatorTotals.totalTShirts +
                  operatorTotals.totalHoodies +
                  operatorTotals.totalBags +
                  operatorTotals.totalSleeves +
                  operatorTotals.totalOthers +
                  operatorTotals.totalTest}
              </span>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td>{operatorTotals.totalWorkingTime}</td>
            <td>{operatorTotals.totalDowntime}</td>
            <td></td>
          </tr>
          <tr className="total-statistics">
            <td colSpan="1" className="totals-cell">
              Total:
            </td>
            <td colSpan="5">
              <span className="total-pod">POD: {operatorTotals.totalPOD}</span>
              <span className="total-pof">POF: {operatorTotals.totalPOF}</span>
              <span className="total-zlecenie">
                ZLECENIE: {operatorTotals.totalZlecenie}
              </span>
            </td>
            <td colSpan="5">
              {operatorTotals.totalTShirts > 0 && (
                <span className="total-operator-statistic">
                  T-shirts: {operatorTotals.totalTShirts}
                </span>
              )}
              {operatorTotals.totalHoodies > 0 && (
                <span className="total-operator-statistic">
                  Hoodie: {operatorTotals.totalHoodies}
                </span>
              )}
              {operatorTotals.totalBags > 0 && (
                <span className="total-operator-statistic">
                  Bags: {operatorTotals.totalBags}
                </span>
              )}
              {operatorTotals.totalSleeves > 0 && (
                <span className="total-operator-statistic">
                  Sleeves: {operatorTotals.totalSleeves}
                </span>
              )}
              {operatorTotals.totalOthers > 0 && (
                <span className="total-operator-statistic">
                  Others: {operatorTotals.totalOthers}
                </span>
              )}
              {operatorTotals.totalTest > 0 && (
                <span className="total-operator-statistic">
                  Test: {operatorTotals.totalTest}
                </span>
              )}
            </td>
            <td colSpan="3">
              {operatorTotals.totalWhite > 0 && (
                <span className="total-operator-statistic">
                  White: {operatorTotals.totalWhite}
                </span>
              )}
              {operatorTotals.totalColor > 0 && (
                <span className="total-operator-statistic">
                  Color: {operatorTotals.totalColor}
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <button className="add-row" onClick={addRow}>
        <IoMdAddCircle size={50} />
      </button>
    </div>
  );
};

export default WorkLogTable;
