import React from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import ReminderSettings from '../components/ReminderSettings';
import HabitForm from '../components/HabitForm';
import HabitList from '../components/HabitList';
import CalendarView from '../components/CalendarView';
import DailyCheckinList from '../components/DailyCheckinList';
import AchievementBadge from '../components/AchievementBadge';

function Dashboard() {
  const navigate = useNavigate();
  const {
    loading,
    loadingUser,
    userId,
    newHabit,
    setNewHabit,
    selectedColor,
    setSelectedColor,
    addNewHabit,
    habits,
    setHabits,
    selectedHabitId,
    setSelectedHabitId,
    selectedDate,
    setSelectedDate,
    formatDateLocal,
    isFutureDate,
    checkIn,
    removeCheckIn,
    showBadge,
    setShowBadge,
    achievement
  } = useDashboard();

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
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
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
        onHabitDeleted={(deletedId) => {
          const newHabits = habits.filter(h => h.id !== deletedId);
          setHabits(newHabits); // << 加這行，更新習慣列表狀態
          setSelectedHabitId(newHabits.length > 0 ? newHabits[0].id : null);
        }}
      />

      <AchievementBadge
        isOpen={showBadge}
        onClose={() => setShowBadge(false)}
        achievement={achievement}
      />

      <CalendarView
        habits={habits}
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
