import React, { useState, useEffect } from 'react';
import { Button, Input, Box, Text } from '@chakra-ui/react';

function ReminderSettings() {
  const [reminderTime, setReminderTime] = useState('');
  const [permission, setPermission] = useState(Notification.permission);
  const [message, setMessage] = useState('');

  // 請求通知權限
  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setPermission(permission);
        if (permission === 'granted') {
          setMessage('通知權限已授權');
        } else {
          setMessage('通知權限被拒絕');
        }
      });
    } else {
      setMessage('此瀏覽器不支援通知功能');
    }
  };

  // 設定提醒
  const setReminder = () => {
    if (!reminderTime) {
      setMessage('請選擇提醒時間');
      return;
    }

    const now = new Date();
    const [hour, minute] = reminderTime.split(':').map(Number);
    const targetTime = new Date();
    targetTime.setHours(hour);
    targetTime.setMinutes(minute);
    targetTime.setSeconds(0);

    // 如果時間已過，則設定為隔天同時間
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeout = targetTime.getTime() - now.getTime();

    setTimeout(() => {
      if (permission === 'granted') {
        new Notification('習慣提醒', {
          body: '該打卡你的習慣囉！',
          icon: '/icon.png', // 可自行換圖示
        });
      }
    }, timeout);

    setMessage(`已設定提醒於 ${reminderTime}`);
  };

  return (
    <Box p={4} maxW="sm" borderWidth="1px" borderRadius="md" bg="gray.50">
      <Text mb={2}>提醒通知設定</Text>

      {permission !== 'granted' && (
        <Button onClick={requestPermission} mb={4} colorScheme="teal">
          啟用通知權限
        </Button>
      )}

      <Input
        type="time"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
        mb={2}
        disabled={permission !== 'granted'}
      />

      <Button onClick={setReminder} colorScheme="blue" isDisabled={permission !== 'granted'}>
        設定提醒
      </Button>

      {message && <Text mt={2} color="gray.600">{message}</Text>}
    </Box>
  );
}

export default ReminderSettings;
