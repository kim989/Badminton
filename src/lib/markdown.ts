import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { ManualItem } from '@/types/manual';

// Root directory for markdown manuals (current directory or src/content)
const manualsDirectory = path.join(process.cwd(), 'src/content');

const MANUAL_METADATA: Record<string, { id: string; title: string; icon: string; description: string; order: number; slug: string }> = {
  '01_장비및그립.md': {
    id: '01-equipment',
    slug: '01-equipment',
    title: '01. 장비 선택 및 그립법',
    icon: '🏸',
    description: '라켓 무게(U), 밸런스, 거트 장력 및 포핸드/백핸드 그립 가이드',
    order: 1,
  },
  '02_풋워크및스텝.md': {
    id: '02-footwork',
    slug: '02-footwork',
    title: '02. 풋워크 및 스텝',
    icon: '👟',
    description: '기본 스탠스, 6방향 스텝, 스플릿 스텝 & 섀도 풋워크',
    order: 2,
  },
  '03_기본스트로크.md': {
    id: '03-stroke',
    slug: '03-stroke',
    title: '03. 기본 스트로크',
    icon: '💥',
    description: '하이클리어, 드라이브, 드롭샷, 스매시, 헤어핀 매뉴얼',
    order: 3,
  },
  '04_서브및리시브.md': {
    id: '04-serve',
    slug: '04-serve',
    title: '04. 서브 및 리시브',
    icon: '🎯',
    description: '숏서브, 롱서브 폼, 리시브 스탠스 및 카운터 전략',
    order: 4,
  },
  '05_경기규칙및매너.md': {
    id: '05-rules',
    slug: '05-rules',
    title: '05. 경기 규칙 및 코트 매너',
    icon: '⚖️',
    description: '21점 3판 2선승제, 서비스 코트 위치 및 5대 매너 수칙',
    order: 5,
  },
  '06_훈련루틴.md': {
    id: '06-routine',
    slug: '06-routine',
    title: '06. 초보자 4주 완성 훈련 루틴',
    icon: '📅',
    description: '1주차부터 4주차까지 단계별 일일 훈련 세트 프로그램',
    order: 6,
  },
};

/**
 * Copy existing markdown files from root to src/content if not present
 */
function ensureContentFilesExist() {
  if (!fs.existsSync(manualsDirectory)) {
    fs.mkdirSync(manualsDirectory, { recursive: true });
  }

  const filesToCopy = [
    '01_장비및그립.md',
    '02_풋워크및스텝.md',
    '03_기본스트로크.md',
    '04_서브및리시브.md',
    '05_경기규칙및매너.md',
    '06_훈련루틴.md',
  ];

  filesToCopy.forEach((filename) => {
    const srcPath = path.join(process.cwd(), filename);
    const destPath = path.join(manualsDirectory, filename);
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

export function getAllManuals(): ManualItem[] {
  ensureContentFilesExist();

  const fileNames = fs.readdirSync(manualsDirectory);
  const manuals: ManualItem[] = [];

  fileNames.forEach((fileName) => {
    if (!fileName.endsWith('.md')) return;
    const meta = MANUAL_METADATA[fileName];
    if (!meta) return;

    const fullPath = path.join(manualsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    manuals.push({
      id: meta.id,
      slug: meta.slug,
      title: meta.title,
      icon: meta.icon,
      description: meta.description,
      order: meta.order,
      fileName: fileName,
      rawContent: matterResult.content,
    });
  });

  return manuals.sort((a, b) => a.order - b.order);
}

export async function getManualBySlug(slug: string): Promise<ManualItem | null> {
  ensureContentFilesExist();

  const allManuals = getAllManuals();
  const target = allManuals.find((item) => item.slug === slug);

  if (!target) return null;

  const fullPath = path.join(manualsDirectory, target.fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // Convert markdown to HTML string using remark
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    ...target,
    contentHtml,
  };
}
