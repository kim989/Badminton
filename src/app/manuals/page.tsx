import React from 'react';
import Link from 'next/link';
import { getAllManuals } from '@/lib/markdown';
import { BookOpen, ChevronRight } from 'lucide-react';

export const metadata = {
  title: '기초 매뉴얼 목록 - 배드민턴 마스터 PWA',
  description: '장비, 풋워크, 스트로크, 서브, 규칙, 훈련루틴 등 6대 배드민턴 입문 매뉴얼',
};

export default function ManualsPage() {
  const manuals = getAllManuals();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '4px' }}>
          <BookOpen size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>BADMINTON MANUALS</span>
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>배드민턴 기초 매뉴얼 6종</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          필수 이론부터 실전 노하우까지 다크 모드로 편안하게 학습해보세요.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {manuals.map((manual) => (
          <Link
            key={manual.slug}
            href={`/manuals/${manual.slug}`}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  fontSize: '1.8rem',
                  background: 'var(--bg-primary)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                {manual.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>
                  {manual.title}
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {manual.description}
                </p>
              </div>
            </div>
            <ChevronRight size={20} color="var(--text-muted)" />
          </Link>
        ))}
      </div>
    </div>
  );
}
