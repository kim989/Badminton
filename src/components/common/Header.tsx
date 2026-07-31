'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <Link href="/" className="brand-title">
        <Trophy size={22} color="#00FF66" />
        <span>배드민턴 마스터</span>
        <span className="brand-badge">PWA</span>
      </Link>
      
      <Link href="/profile" aria-label="프로필" style={{ color: 'var(--text-muted)' }}>
        <User size={22} />
      </Link>
    </header>
  );
}
