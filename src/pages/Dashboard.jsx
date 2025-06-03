// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import ReminderSettings from '../components/ReminderSettings';
import HabitForm from '../components/HabitForm';
import HabitList from '../components/HabitList';
import CalendarView from '../components/CalendarView';
import DailyCheckinList from '../components/DailyCheckinList';

import {
  getHabits,
  addHabit,
  updateHabit,
  getCurrentUserId,
} from '../utils/firebaseDb';

function Dashboard() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [markedDates, setMarkedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingUser, setLoadingUser] = useState(true);

  // 日期格式化
  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 判斷是否為未來日期
  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // 取得習慣資料
  useEffect(() => {
    if (!userId) {
      setLoadingUser(false);
      navigate("/");
      return;
    }
    setLoading(true);
    getHabits(userId)
      .then((data) => {
        setHabits(data);
        if (data.length > 0) setSelectedHabitId(data[0].id);
      })
      .finally(() => {
        setLoading(false);
        setLoadingUser(false);
      });
  }, [userId]);

  // 更新打卡日曆標記
  useEffect(() => {
    if (!selectedHabitId) {
      setMarkedDates([]);
      return;
    }
    const habit = habits.find((h) => h.id === selectedHabitId);
    if (habit) {
      const dates = habit.records.map((dateStr) => new Date(dateStr));
      setMarkedDates(dates);
    }
  }, [selectedHabitId, habits]);

  const addNewHabit = async () => {
    if (!newHabit.trim() || !userId) return;
    setLoading(true);
    try {
      const habitData = {
        userId,
        name: newHabit.trim(),
        records: [],
      };
      const id = await addHabit(habitData);
      const updated = [...habits, { id, ...habitData }];
      setHabits(updated);
      setNewHabit('');
      setSelectedHabitId(id);
    } catch (error) {
      console.error('新增習慣失敗:', error);
    }
    setLoading(false);
  };

  const checkIn = async (habitId, dateStr) => {
    if (!userId) return;
    setLoading(true);
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) throw new Error('找不到該習慣');

      let updatedRecords = habit.records ? [...habit.records] : [];

      if (!updatedRecords.includes(dateStr)) {
        updatedRecords.push(dateStr);
      }

      await updateHabit(habitId, { records: updatedRecords });

      const updatedHabits = habits.map(h =>
        h.id === habitId ? { ...h, records: updatedRecords } : h
      );
      setHabits(updatedHabits);
    } catch (error) {
      console.error('打卡失敗:', error);
      alert('打卡失敗，請稍後再試');
    }
    setLoading(false);
  };

  const removeCheckIn = async (habitId, dateStr) => {
    if (!userId) return;
    setLoading(true);
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const updatedRecords = habit.records.filter(r => r !== dateStr);
      await updateHabit(habitId, { records: updatedRecords });

      const updatedHabits = habits.map(h =>
        h.id === habitId ? { ...h, records: updatedRecords } : h
      );
      setHabits(updatedHabits);
    } catch (error) {
      console.error('移除打卡失敗:', error);
    }
    setLoading(false);
  };

  if (loadingUser) return <Text>載入中...</Text>;
  if (!userId) return <Text>請先登入</Text>;

  return (
    <Box maxW="700px" mx="auto" p={5}>
      <Button colorScheme="blue" mb={4} onClick={() => navigate('/statistics')}>
        查看習慣統計
      </Button>

      <Heading mb={4}>我的習慣追蹤</Heading>

      <HabitForm
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        onAdd={addNewHabit}
        loading={loading}
      />

      <ReminderSettings />

      <HabitList
        habits={habits}
        selectedHabitId={selectedHabitId}
        setSelectedHabitId={setSelectedHabitId}
        selectedDate={formatDateLocal(selectedDate)}
        isCheckedIn={(habit) =>
          habit.records.includes(formatDateLocal(selectedDate))
        }
        onCheckIn={(habitId) => {
          if (isFutureDate(selectedDate)) {
            alert('無法對未來日期打卡');
            return;
          }

          const habit = habits.find(h => h.id === habitId);
          const dateStr = formatDateLocal(selectedDate);

          if (habit?.records.includes(dateStr)) {
            alert('該日期已打卡，無法重複打卡');
            return;
          }

          checkIn(habitId, dateStr);
        }}
        loading={loading}
      />

      <CalendarView
        markedDates={markedDates}
        onDateClick={setSelectedDate}
        selectedDate={selectedDate}
      />

      <DailyCheckinList
        habits={habits}
        dateStr={formatDateLocal(selectedDate)}
        onCheckIn={checkIn}
        onRemoveCheckIn={removeCheckIn}
        loading={loading}
      />
    </Box>
  );
}

export default Dashboard;
