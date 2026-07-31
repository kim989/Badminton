import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllManuals, getManualBySlug } from '@/lib/markdown';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const manuals = getAllManuals();
  return manuals.map((manual) => ({
    slug: manual.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const manual = await getManualBySlug(params.slug);
  if (!manual) return { title: '매뉴얼을 찾을 수 없습니다' };

  return {
    title: `${manual.title} - 배드민턴 마스터 PWA`,
    description: manual.description,
  };
}

export default async function ManualDetailPage({ params }: Props) {
  const manual = await getManualBySlug(params.slug);

  if (!manual) {
    notFound();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          href="/manuals"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={18} />
          <span>매뉴얼 목록으로</span>
        </Link>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {manual.icon} {manual.order} / 6
        </span>
      </div>

      {/* Manual Content Card */}
      <article className="card" style={{ padding: '24px 18px' }}>
        <header style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.8rem' }}>{manual.icon}</span>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {manual.title}
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {manual.description}
          </p>
        </header>

        {/* HTML Rendered Content */}
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: manual.contentHtml || '' }}
        />
      </article>

      {/* CSS for Markdown Rendered HTML */}
      <style>{`
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          color: var(--text-primary);
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .markdown-content h2 {
          font-size: 1.15rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 6px;
          color: var(--accent-primary);
        }
        .markdown-content h3 {
          font-size: 1.02rem;
          color: var(--accent-secondary);
        }
        .markdown-content p {
          font-size: 0.9rem;
          color: #d1d5db;
          margin-bottom: 14px;
          line-height: 1.65;
        }
        .markdown-content ul, .markdown-content ol {
          margin-left: 20px;
          margin-bottom: 14px;
          font-size: 0.9rem;
          color: #d1d5db;
        }
        .markdown-content li {
          margin-bottom: 6px;
        }
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 0.82rem;
        }
        .markdown-content th, .markdown-content td {
          border: 1px solid var(--border-color);
          padding: 8px 10px;
          text-align: left;
        }
        .markdown-content th {
          background-color: var(--bg-card-hover);
          color: var(--accent-primary);
          font-weight: 700;
        }
        .markdown-content blockquote {
          border-left: 4px solid var(--accent-primary);
          padding: 10px 14px;
          background: rgba(0, 255, 102, 0.05);
          border-radius: 0 8px 8px 0;
          margin: 16px 0;
          font-size: 0.85rem;
          color: #e5e7eb;
        }
        .markdown-content code {
          background: var(--bg-primary);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          color: var(--accent-secondary);
          font-size: 0.85rem;
        }
        .markdown-content pre {
          background: var(--bg-primary);
          padding: 14px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
          border: 1px solid var(--border-color);
        }
        .markdown-content .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          height: 0;
          margin: 18px 0 8px 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }
        .markdown-content .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
        .markdown-content .video-link-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }
        .markdown-content .video-direct-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 0, 0, 0.15);
          color: #ff4d4d;
          border: 1px solid rgba(255, 0, 0, 0.4);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .markdown-content .video-direct-btn:hover {
          background: #ff4d4d;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
