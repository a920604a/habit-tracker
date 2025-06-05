import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext'; // 假設你有這個 hook

import { auth } from '../utils/firebase'; // 確保你有 export auth
import ReminderSettings from '../components/ReminderSettings';
import HabitForm from '../components/HabitForm';
import HabitList from '../components/HabitList';
import CalendarView from '../components/CalendarView';
import DailyCheckinList from '../components/DailyCheckinList';
import AchievementBadge from '../components/AchievementBadge';
import { checkConsecutiveDays, checkWeeklyCount } from '../utils/achievementUtils'; // 假設你有這些工具函數

import {
  getHabits,
  addHabit,
  updateHabit,
} from '../utils/firebaseDb';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();  // 從 context 拿 user

  const [userId, setUserId] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#3182CE'); // 預設藍色

  const [achievement, setAchievement] = useState(null);
  const [showBadge, setShowBadge] = useState(false);

  
  const evaluateAchievements = (habit) => {
    const count = habit.records.length;

    
    console.log(`打卡次數: ${count}`);

  

    // 🎖️ 連續 X 天打卡徽章
    if (checkConsecutiveDays(habit.records, 14)) {
      setAchievement('連續 14 天打卡！你真的太猛了！🏅');
      setShowBadge(true);
      return;
    } else if (checkConsecutiveDays(habit.records, 7)) {
      setAchievement('連續 7 天打卡達成一週不間斷！🎯');
      setShowBadge(true);
      return;
    } else if (checkConsecutiveDays(habit.records, 5)) {
      setAchievement('連續 5 天打卡成功！連續力就是你的超能力 💪');
      setShowBadge(true);
      return;
    }

    // 🎖️ 一週內打卡 X 次徽章
    if (checkWeeklyCount(habit.records, 14)) {
      setAchievement('一週內打卡 14 次！太強了吧，有在睡覺嗎？😆');
      setShowBadge(true);
      return;
    } else if (checkWeeklyCount(habit.records, 7)) {
      setAchievement('一週內完成 7 次打卡！你是時間管理大師！⏰');
      setShowBadge(true);
      return;
    } else if (checkWeeklyCount(habit.records, 5)) {
      setAchievement('一週內完成 5 次打卡！持續前進中 🚀');
      setShowBadge(true);
      return;
    }

      // 🎖️ 累積打卡次數徽章
    if (count >= 1 && count < 25) {
      setAchievement('你已完成 1 次打卡，持之以恆是成功的開始！');
      setShowBadge(true);
      return;
    } else if (count >= 25 && count < 50) {
      setAchievement('你已完成 25 次打卡！目標近在咫尺，繼續努力！');
      setShowBadge(true);
      return;
    } else if (count >= 50) {
      setAchievement('50 次打卡達成！你是習慣養成大師！🏆');
      setShowBadge(true);
      return;
    }
  };



  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // 🔒 監聽 Firebase 登入狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        navigate("/");
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  // 取得使用者的習慣資料
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getHabits(userId)
      .then((data) => {
        setHabits(data);
        if (data.length > 0) setSelectedHabitId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, [userId]);



  const addNewHabit = async () => {
    if (!newHabit.trim() || !userId) return;
    setLoading(true);
    try {
      const habitData = {
        userId,
        name: newHabit.trim(),
        records: [],
        color: selectedColor, // ✅ 使用使用者選的顏色
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

    // 更新該 habit 物件
    const updatedHabit = { ...habit, records: updatedRecords };

    const updatedHabits = habits.map(h =>
      h.id === habitId ? { ...h, records: updatedRecords } : h
    );
    setHabits(updatedHabits);

    // ✅ 檢查成就
    evaluateAchievements(updatedHabit);

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
          setHabits(habits.filter(h => h.id !== deletedId)); // 更新 UI
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
