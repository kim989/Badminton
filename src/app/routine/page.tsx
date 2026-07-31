'use client';

import React, { useState } from 'react';
import { useTrainingStore } from '@/lib/store/useTrainingStore';
import IntervalTimer from '@/components/timer/IntervalTimer';
import { CheckCircle2, Circle, Timer as TimerIcon, Calendar, Flame } from 'lucide-react';

const WEEKS_DATA = [
  {
    week: 1,
    title: '1주차: 라켓 적응 & 손목 스냅',
    duration: '30분',
    tasks: [
      { id: 'w1-1', name: '준비 운동 & 손목/발목 스트레칭', target: '5분' },
      { id: 'w1-2', name: '제자리 빈 스윙 (포핸드 하이클리어)', target: '100회 x 3세트' },
      { id: 'w1-3', name: '벽 치기 (Wall Volley) 훈련', target: '50회 x 3세트' },
    ],
  },
  {
    week: 2,
    title: '2주차: 풋워크 & 스텝 몸에 익히기',
    duration: '40분',
    tasks: [
      { id: 'w2-1', name: '스플릿 스텝 (Split Step) 감각 잡기', target: '50회' },
      { id: 'w2-2', name: '코트 6방향 섀도 풋워크', target: '1분 x 5세트' },
      { id: 'w2-3', name: '손목 스냅 빈 스윙 연속 연습', target: '100회 x 2세트' },
    ],
  },
  {
    week: 3,
    title: '3주차: 난타(클리어 & 드라이브) & 서브',
    duration: '50분',
    tasks: [
      { id: 'w3-1', name: '하이클리어 랠리 (거리 감각 확보)', target: '15분' },
      { id: 'w3-2', name: '포핸드 / 백핸드 드라이브 주고받기', target: '10분' },
      { id: 'w3-3', name: '숏서브 정확도 훈련 (타깃 안착)', target: '50구' },
    ],
  },
  {
    week: 4,
    title: '4주차: 실전 패턴 훈련 & 게임 적응',
    duration: '60분',
    tasks: [
      { id: 'w4-1', name: '올코트 섀도 풋워크 + 스트로크 결합', target: '2분 x 5세트' },
      { id: 'w4-2', name: '서브 - 리시브 - 3구 드라이브 패턴', target: '20회' },
      { id: 'w4-3', name: '실전 복식/단식 연습 경기 수행', target: '2게임' },
    ],
  },
];

export default function RoutinePage() {
  const { currentWeek, setCurrentWeek, completedItems, toggleTask, totalSecondsTrained } = useTrainingStore();
  const [timerSeconds, setTimerSeconds] = useState(60);

  const selectedWeekData = WEEKS_DATA.find((w) => w.week === currentWeek) || WEEKS_DATA[0];

  const formatTotalTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    return `${mins}분`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
          <TimerIcon size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>4-WEEK TRAINING</span>
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>4주 완성 훈련 루틴 & 타이머</h1>
      </header>

      {/* Training Stats Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.08) 0%, rgba(22,27,34,1) 100%)',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>누적 훈련 시간</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
            {formatTotalTime(totalSecondsTrained)}
          </div>
        </div>
        <div style={{ borderRight: '1px solid var(--border-color)' }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>현재 훈련 진행</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {currentWeek}주차 프로그램
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {WEEKS_DATA.map((w) => (
          <button
            key={w.week}
            onClick={() => setCurrentWeek(w.week)}
            style={{
              padding: '10px 4px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${currentWeek === w.week ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              background: currentWeek === w.week ? 'var(--accent-primary-glow)' : 'var(--bg-card)',
              color: currentWeek === w.week ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            {w.week}주차
          </button>
        ))}
      </div>

      {/* Interactive Timer Widget */}
      <IntervalTimer defaultSeconds={timerSeconds} />

      {/* Tasks Checklist */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedWeekData.title}</h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={14} color="#ffb703" /> 목표: {selectedWeekData.duration}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedWeekData.tasks.map((task) => {
            const isChecked = !!completedItems[task.id];
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: isChecked ? 'rgba(0, 255, 102, 0.08)' : 'var(--bg-primary)',
                  border: `1px solid ${isChecked ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isChecked ? (
                    <CheckCircle2 size={22} color="var(--accent-primary)" />
                  ) : (
                    <Circle size={22} color="var(--text-muted)" />
                  )}
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: isChecked ? 700 : 500,
                      textDecoration: isChecked ? 'line-through' : 'none',
                      color: isChecked ? 'var(--accent-primary)' : 'var(--text-primary)',
                    }}
                  >
                    {task.name}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    background: 'var(--bg-card-hover)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {task.target}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
