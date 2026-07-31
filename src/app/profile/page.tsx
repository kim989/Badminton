'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User, Shield, LogOut, Save, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState('');
  const [racketWeight, setRacketWeight] = useState('4U');
  const [tension, setTension] = useState('22 lbs');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          setLoading(false);
          return;
        }

        setUser(currentUser);

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profile) {
          setNickname(profile.nickname || '');
          setRacketWeight(profile.preferred_racket_weight || '4U');
          setTension(profile.preferred_tension || '22 lbs');
        } else {
          setNickname(currentUser.email?.split('@')[0] || '');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        nickname,
        preferred_racket_weight: racketWeight,
        preferred_tension: tension,
      });

      if (error) throw error;
      setMessage('프로필 및 장비 설정이 저장되었습니다!');
    } catch (err: any) {
      setMessage(`저장 실패: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        프로필 정보를 불러오는 중...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center', padding: '20px 0' }}>
        <div className="card" style={{ padding: '30px 20px' }}>
          <User size={48} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>로그인이 필요합니다</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            로그인하면 4주 훈련 루틴 기록을 Supabase cloud에 자동 동기화할 수 있습니다.
          </p>
          <Link href="/login" className="btn-primary" style={{ width: '100%' }}>
            로그인 / 회원가입 하러가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>마이페이지</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#f87171',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
          }}
        >
          <LogOut size={14} />
          <span>로그아웃</span>
        </button>
      </header>

      {message && (
        <div
          style={{
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            background: message.includes('실패') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 255, 102, 0.15)',
            border: `1px solid ${message.includes('실패') ? '#ef4444' : 'var(--accent-primary)'}`,
            color: message.includes('실패') ? '#f87171' : 'var(--accent-primary)',
          }}
        >
          {message}
        </div>
      )}

      {/* Racket & Equipment Settings */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={18} color="#00FF66" />
          <span>마이 장비 설정</span>
        </h2>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            선호 라켓 무게 (Weight)
          </label>
          <select
            value={racketWeight}
            onChange={(e) => setRacketWeight(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#fff',
            }}
          >
            <option value="3U">3U (85~89g - 상급자/파워형)</option>
            <option value="4U">4U (80~84g - 입문자 올라운드 추천)</option>
            <option value="5U">5U (75~79g - 민첩 수비형)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            선호 거트 장력 (String Tension)
          </label>
          <select
            value={tension}
            onChange={(e) => setTension(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#fff',
            }}
          >
            <option value="20 lbs">20 lbs (초급자 탄성 우수)</option>
            <option value="22 lbs">22 lbs (입문 권장 장력)</option>
            <option value="24 lbs">24 lbs (중급 컨트롤)</option>
            <option value="26 lbs">26 lbs 이상 (상급 파워 타구)</option>
          </select>
        </div>

        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          <Save size={18} />
          <span>{saving ? '저장 중...' : '프로필 설정 저장'}</span>
        </button>
      </section>
    </div>
  );
}
