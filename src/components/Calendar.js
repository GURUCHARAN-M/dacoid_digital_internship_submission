import React, { useState } from "react";
import "./Calendar.css";

function Calendar({ events, onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getCalendarDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const renderDay = (day) => {
    if (!day) return <div className="day" />;
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    const hasEvents = events[dateKey];
    return (
      <div
        className={`day ${hasEvents ? "has-events" : ""}`}
        onClick={() => onDateClick(dateKey)}
      >
        {day}
        {hasEvents && <span className="event-indicator">•</span>}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>Previous</button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth}>Next</button>
      </div>
      <div className="calendar-grid">
        {getCalendarDays().map((day, index) => (
          <React.Fragment key={index}>{renderDay(day)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
