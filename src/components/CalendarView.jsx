// components/CalendarView.jsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css'; // 自訂樣式

function CalendarView({ markedDates = [], selectedDate, onDateClick }) {
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const today = new Date();

  return (
    <Calendar
      onClickDay={onDateClick}
      value={selectedDate}
      tileClassName={({ date, view }) => {
        if (view !== 'month') return null;

        const classes = [];

        if (isSameDay(date, today)) {
          classes.push('today');
        }

        if (isSameDay(date, selectedDate)) {
          classes.push('selected-day');
        }

        if (markedDates.some((d) => isSameDay(date, d))) {
          classes.push('marked');
        }

        return classes.join(' ');
      }}
    />
  );
}

export default CalendarView;
