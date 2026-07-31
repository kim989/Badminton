import React from 'react';
import Link from 'next/link';
import { BookOpen, Timer, Zap, ShieldAlert, Award, ChevronRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome Banner */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(0,255,102,0.15) 0%, rgba(22,27,34,1) 100%)',
          borderColor: 'var(--accent-primary)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
          <Zap size={18} />
          <span>입문자를 위한 스마트 가이드</span>
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '8px' }}>
          배드민턴 기초부터 <br />
          <span style={{ color: 'var(--accent-primary)' }}>4주 완성 훈련</span>까지!
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          장비 선택법부터 풋워크, 스트로크, 실전 훈련 루틴을 오프라인에서도 확인해보세요.
        </p>
        <Link href="/routine" className="btn-primary">
          <Timer size={18} />
          <span>오늘의 훈련 시작하기</span>
        </Link>
      </div>

      {/* Quick Action Grid */}
      <section>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={18} color="#00FF66" />
          <span>기초 매뉴얼 Quick List</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Link href="/manuals/01-equipment" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem' }}>🏸</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>장비 & 그립</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>라켓, 거트, 이스턴 그립</span>
          </Link>

          <Link href="/manuals/02-footwork" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem' }}>👟</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>풋워크 & 스텝</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>스플릿 스텝, 6방향</span>
          </Link>

          <Link href="/manuals/03-stroke" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem' }}>💥</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>기본 스트로크</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>클리어, 드라이브, 스매시</span>
          </Link>

          <Link href="/manuals/04-serve" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem' }}>🎯</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>서브 & 리시브</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>숏서브, 롱서브 폼</span>
          </Link>
        </div>
      </section>

      {/* Routine Banner */}
      <Link href="/manuals" className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--bg-card-hover)', padding: '10px', borderRadius: '12px' }}>
            <Award size={24} color="#00E5FF" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>전체 매뉴얼 6종 살펴보기</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>경기 규칙 & 4주 훈련 포함</div>
          </div>
        </div>
        <ChevronRight size={20} color="var(--text-muted)" />
      </Link>
    </div>
  );
}
