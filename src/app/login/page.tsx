'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, UserPlus, LogIn, Trophy } from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nickname },
          },
        });

        if (error) throw error;
        
        if (data.user) {
          // Create initial profile
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              email: data.user.email,
              nickname: nickname || email.split('@')[0],
            },
          ]);
        }

        setMessage({ type: 'success', text: '회원가입이 완료되었습니다! 로그인 해주세요.' });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage({ type: 'success', text: '로그인 성공!' });
        router.push('/profile');
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '인증 처리에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '20px auto' }}>
      <header style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--accent-primary-glow)', borderRadius: '16px', marginBottom: '12px' }}>
          <Trophy size={32} color="#00FF66" />
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          {isSignUp ? '회원가입' : '로그인'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isSignUp
            ? '계정을 생성하고 훈련 일지를 동기화하세요'
            : '배드민턴 마스터에 접속하여 훈련 로그를 기록하세요'}
        </p>
      </header>

      {message && (
        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            background: message.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 255, 102, 0.15)',
            border: `1px solid ${message.type === 'error' ? '#ef4444' : 'var(--accent-primary)'}`,
            color: message.type === 'error' ? '#f87171' : 'var(--accent-primary)',
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleAuth} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {isSignUp && (
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              닉네임
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 셔틀콕마스터"
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
          </div>
        )}

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            이메일
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
            <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            비밀번호
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자리 이상 입력"
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? (
            <span>처리 중...</span>
          ) : isSignUp ? (
            <>
              <UserPlus size={18} />
              <span>회원가입 완료</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>로그인</span>
            </>
          )}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage(null);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isSignUp ? '이미 계정이 있으신가요? 로그인하기' : '새 계정 만들기 (회원가입)'}
        </button>
      </div>
    </div>
  );
}
