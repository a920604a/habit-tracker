import React from 'react';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function HeatmapChart({ habits }) {
  if (!habits.length) return <div>無資料顯示</div>;

  // 取出所有日期 (排序)
  const allDatesSet = new Set();
  habits.forEach(h => h.records?.forEach(date => allDatesSet.add(date)));
  const allDates = Array.from(allDatesSet).sort((a, b) => new Date(a) - new Date(b));

  // 產生一個物件快速查詢是否有打卡 habit.records 用 Set
  const habitsRecordsSet = habits.map(habit => new Set(habit.records));

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>多習慣每日打卡熱力圖</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `120px repeat(${allDates.length}, 24px)`,
          gap: '4px',
          overflowX: 'auto',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          userSelect: 'none',
        }}
      >
        {/* 第一列: 空格 + 日期標題 */}
        <div style={{ fontWeight: 'bold', padding: '4px 8px' }}>習慣 / 日期</div>
        {allDates.map(date => (
          <div
            key={date}
            style={{ fontSize: '12px', textAlign: 'center', padding: '4px 0' }}
            title={date}
          >
            {formatDate(date)}
          </div>
        ))}

        {/* 習慣列 */}
        {habits.map((habit, habitIndex) => (
          <React.Fragment key={habit.name}>
            {/* 習慣名稱 */}
            <div
              style={{
                fontWeight: 'bold',
                padding: '4px 8px',
                backgroundColor: habit.color || '#ddd',
                color: '#222',
                borderRadius: '4px',
              }}
              title={habit.name}
            >
              {habit.name}
            </div>

            {/* 打卡格子 */}
            {allDates.map(date => {
              const hasRecord = habitsRecordsSet[habitIndex].has(date);
              return (
                <div
                  key={`${habit.name}-${date}`}
                  title={hasRecord ? `${habit.name} 有打卡` : ''}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: hasRecord ? habit.color || '#4caf50' : '#eee',
                    border: '1px solid #ccc',
                    transition: 'background-color 0.3s',
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
