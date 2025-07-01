"use client"

import "../styles/configure-panel.scss"

const ConfigurePanel = ({ days, selectedDate, onDateSelect, onClose }) => {
  return (
    <div className="configure-panel">
      <div className="configure-header">
        <h3>Select Date</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="date-list">
        {days.map((day) => (
          <button
            key={day.date}
            className={`date-item ${selectedDate === day.date ? "selected" : ""} ${day.isToday ? "today" : ""}`}
            onClick={() => onDateSelect(day.date)}
          >
            <span className="day-label">{day.label}</span>
            {day.isToday && <span className="today-badge">Today</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ConfigurePanel

