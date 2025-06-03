import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Heading,
  Text,
  Select,
  VStack
} from '@chakra-ui/react';

import { getCurrentUserId, getHabits } from '../utils/firebaseDb';

import HabitBarChart from '../components/Statistics/HabitBarChart';
import PopularHabitsChart from '../components/Statistics/PopularHabitsChart';
import TrendLineChart from '../components/Statistics/TrendLineChart';
import HeatmapChart from '../components/Statistics/HeatmapChart';

export default function StatisticsPage() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [dateRange, setDateRange] = useState('30'); // 預設最近 30 天

  useEffect(() => {
    async function fetchHabits() {
      const userId = getCurrentUserId();
      if (!userId) {
        navigate('/');
        return;
      }

      try {
        const data = await getHabits(userId);
        setHabits(data);
      } catch (error) {
        console.error('抓取習慣資料失敗', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, [navigate]);

  const now = new Date();
  const filteredHabits = habits.map(h => ({
    ...h,
    records: h.records?.filter(dateStr => {
      if (dateRange === 'all') return true;
      const d = new Date(dateStr);
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      return diffDays <= parseInt(dateRange, 10);
    }) || [],
  }));

  if (loading) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>載入中...</Text>
      </Container>
    );
  }

  if (habits.length === 0) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>尚無習慣資料，請先新增並打卡。</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Button colorScheme="blue" mb={4} onClick={() => navigate('/dashboard')}>
        返回儀表板
      </Button>

      <Heading mb={4}>習慣打卡統計</Heading>

      <VStack align="stretch" spacing={4}>
        {/* 日期篩選器 */}
        <Select value={dateRange} onChange={e => setDateRange(e.target.value)}>
          <option value="7">最近 7 天</option>
          <option value="30">最近 30 天</option>
          <option value="90">最近 90 天</option>
          <option value="all">全部資料</option>
        </Select>

        {/* 圖表選擇器 */}
        <Select value={chartType} onChange={e => setChartType(e.target.value)}>
          <option value="bar">打卡次數長條圖</option>
          <option value="popular">熱門習慣統計</option>
          <option value="trend">累積打卡趨勢圖</option>
          <option value="heatmap">打卡熱力圖</option>
        </Select>
      </VStack>

      {/* 圖表顯示 */}
      <div style={{ marginTop: '1rem' }}>
        {chartType === 'bar' && <HabitBarChart habits={filteredHabits} />}
        {chartType === 'popular' && <PopularHabitsChart habits={filteredHabits} />}
        {chartType === 'trend' && <TrendLineChart habits={filteredHabits} />}
        {chartType === 'heatmap' && <HeatmapChart habits={filteredHabits} />}
      </div>
    </Container>
  );
}
