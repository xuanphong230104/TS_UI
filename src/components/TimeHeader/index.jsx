import React from 'react';

const TimeHeader = ({ weekday, date }) => {
  return (
    <div className="time-card">
      <div className="date-text">{weekday}</div>
      <div className="time-text">{date}</div>
    </div>
  );
};

export default TimeHeader;