import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHabitById } from '../utils/firebaseDb'; // 你要有取單一習慣的 api
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Button, Text } from '@chakra-ui/react';

function HabitCalendar() {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!habitId) return;
    setLoading(true);
    getHabitById(habitId)
      .then((data) => {
        setHabit(data);
      })
      .finally(() => setLoading(false));
  }, [habitId]);

  // 判斷某日是否已打卡
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && habit?.records.includes(formatDateLocal(date))) {
      return 'checked-in-day'; // 你可以自訂 CSS
    }
    return null;
  };

  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  if (loading) return <Text>載入中...</Text>;
  if (!habit) return <Text>找不到該習慣</Text>;

  return (
    <Box p={4}>
      <Button mb={4} onClick={() => navigate(-1)}>← 返回</Button>
      <Text fontSize="2xl" mb={2}>{habit.name} 的打卡日曆</Text>
      <Calendar tileClassName={tileClassName} />
      <style>{`
        .checked-in-day {
          background: #3182CE;
          color: white;
          border-radius: 50%;
        }
      `}</style>
    </Box>
  );
}

export default HabitCalendar;
