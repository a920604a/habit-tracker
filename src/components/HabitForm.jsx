// components/HabitForm.jsx
import React from 'react';
import { Flex, Input, Button } from '@chakra-ui/react';

const HabitForm = ({ newHabit, setNewHabit, onAdd, loading }) => (
  <Flex mb={6} gap={3}>
    <Input
      placeholder="新增習慣名稱"
      value={newHabit}
      onChange={(e) => setNewHabit(e.target.value)}
      flex="1"
      isDisabled={loading}
    />
    <Button colorScheme="green" onClick={onAdd} isLoading={loading}>
      新增習慣
    </Button>
  </Flex>
);

export default HabitForm;
