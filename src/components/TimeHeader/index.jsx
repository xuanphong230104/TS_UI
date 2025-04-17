import PropTypes from "prop-types";

const TimeHeader = ({ weekday, date }) => {
  return (
    <div className="time-card">
      <div className="date-text">{weekday}</div>
      <div className="time-text">{date}</div>
    </div>
  );
};
TimeHeader.propTypes = {
  weekday: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default TimeHeader;