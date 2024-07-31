// src/components/Dropdown.js
import React from 'react';

const Dropdown = ({ selectedMonth, onChange }) => (
  <select value={selectedMonth} onChange={e => onChange(e.target.value)}>
    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
      <option value={index + 1} key={month}>{month}</option>
    ))}
  </select>
);

export default Dropdown;