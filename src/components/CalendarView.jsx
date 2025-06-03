// components/CalendarView.jsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box } from '@chakra-ui/react';

const CalendarView = ({ markedDates, onDateClick, selectedDate }) => {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isMarked = markedDates.find(d => d.toDateString() === date.toDateString());
      if (isMarked) return 'highlight';
      if (selectedDate && selectedDate.toDateString() === date.toDateString()) {
        return 'selected';
      }
    }
    return null;
  };

  const onClickDay = (date) => {
    if (onDateClick) onDateClick(date);
  };

  return (
    <Box border="1px solid #ccc" borderRadius="md" overflow="hidden" boxShadow="sm">
      <Calendar tileClassName={tileClassName} onClickDay={onClickDay} />
      <style>{`
        .highlight {
          background: #38a169 !important;
          color: white !important;
          border-radius: 50% !important;
        }
        .selected {
          border: 2px solid #3182ce !important;
          border-radius: 50% !important;
        }
      `}</style>
    </Box>
  );
};

export default CalendarView;
