// components/HabitList.jsx
import React from 'react';
import { Box, Button, Text, VStack, HStack } from '@chakra-ui/react';

const formatDateLocal = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const isToday = (dateStr) => {
  const today = new Date();
  return dateStr === formatDateLocal(today);
};

function HabitList({
  habits,
  selectedHabitId,
  setSelectedHabitId,
  selectedDate,
  isCheckedIn,
  onCheckIn,
  loading,
}) {
  return (
    <Box>
      <Text fontSize="xl" mb={2}>選擇習慣：</Text>
      <VStack spacing={3} align="stretch">
        {habits.map((habit) => (
          <Box
            key={habit.id}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            bg={habit.id === selectedHabitId ? 'blue.100' : 'gray.50'}
          >
            <HStack justify="space-between">
              <Text>{habit.name}</Text>
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => onCheckIn(habit.id)}
                isDisabled={loading || isCheckedIn(habit)}
              >
                {isCheckedIn(habit)
                  ? '已打卡'
                  : (() => {
                      const today = new Date();
                      const selected = new Date(selectedDate);
                      today.setHours(0, 0, 0, 0);
                      selected.setHours(0, 0, 0, 0);

                      if (selected.getTime() > today.getTime()) return '無法打卡';
                      if (selected.getTime() === today.getTime()) return '打卡';
                      return '補打卡';
                  })()}

              </Button>
            </HStack>
            <Button
              size="xs"
              mt={2}
              onClick={() => setSelectedHabitId(habit.id)}
              colorScheme="blue"
              variant="outline"
            >
              查看日曆
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default HabitList;
