'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Bell } from 'lucide-react';
import { useTrainingStore } from '@/lib/store/useTrainingStore';

interface Props {
  defaultSeconds?: number;
  onComplete?: () => void;
}

export default function IntervalTimer({ defaultSeconds = 60, onComplete }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'rest'>('work');
  const addTrainingTime = useTrainingStore((state) => state.addTrainingTime);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play beep sound using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('Web Audio not supported or blocked');
    }
  };

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
        if (mode === 'work') {
          addTrainingTime(1);
        }
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      playBeep();
      if (mode === 'work') {
        setMode('rest');
        setSecondsLeft(30); // 30 seconds rest default
      } else {
        setMode('work');
        setSecondsLeft(defaultSeconds);
        setIsActive(false);
        if (onComplete) onComplete();
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setSecondsLeft(defaultSeconds);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '24px',
        border: `2px solid ${mode === 'work' ? 'var(--accent-primary)' : 'var(--accent-secondary)'}`,
        background: mode === 'work' ? 'rgba(0, 255, 102, 0.04)' : 'rgba(0, 229, 255, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: mode === 'work' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
        <Bell size={16} />
        <span>{mode === 'work' ? '🔥 훈련 타이머 (WORK)' : '☕ 휴식 세트 (REST)'}</span>
      </div>

      <div
        style={{
          fontSize: '3.2rem',
          fontWeight: 900,
          fontFamily: 'monospace',
          color: 'var(--text-primary)',
          letterSpacing: '2px',
          textShadow: mode === 'work' ? '0 0 20px var(--accent-primary-glow)' : '0 0 20px var(--accent-secondary-glow)',
        }}
      >
        {formatTime(secondsLeft)}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={toggleTimer}
          className="btn-primary"
          style={{
            background: isActive ? '#ffb703' : mode === 'work' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
            color: '#0d1117',
          }}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span>{isActive ? '일시정지' : '시작'}</span>
        </button>

        <button
          onClick={resetTimer}
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={18} />
          <span>리셋</span>
        </button>
      </div>
    </div>
  );
}
