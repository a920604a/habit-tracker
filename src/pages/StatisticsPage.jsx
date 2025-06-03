import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';  // 假設你用 Chakra UI

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const STORAGE_KEY = 'habitTrackerData';

function StatisticsPage() {

  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };



  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setHabits(data);
  }, []);

  // 準備 Chart.js 的資料與選項
  const chartData = {
    labels: habits.map(habit => habit.name),
    datasets: [
      {
        label: '打卡次數',
        data: habits.map(habit => habit.records.length),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '各習慣打卡次數統計' },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      }
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <Button
        colorScheme="blue"
        onClick={goToDashboard}
        mt={4} // 上方間距
      >
        查看儀表板
      </Button>
      <h2>習慣打卡統計</h2>
      
      {habits.length === 0 ? (
        <p>尚無習慣資料，請先新增並打卡。</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}

export default StatisticsPage;
