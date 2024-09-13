import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({ selectedDate, handleDateChange }) => {
  return (
    <DatePicker
      className="custom-datepicker"
      selected={selectedDate ? new Date(selectedDate) : null}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select a date"
    />
  );
};

export default DateSelector;
