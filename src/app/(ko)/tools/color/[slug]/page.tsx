import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/data/site';
import { curatedColors, getCuratedColor } from '@/data/colors';
import { CopyButton } from '@/components/ui/CopyButton';
import {
  hexToRgb,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  bestTextColor,
  wcag,
  harmony,
  lightnessScale,
} from '@/lib/color';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return curatedColors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const color = getCuratedColor(slug);
  if (!color) return { title: '색상을 찾을 수 없습니다' };

  const title = `${color.ko} 색상 ${color.hex} - RGB·HSL 변환과 대비색`;
  const rgb = hexToRgb(color.hex)!;
  const description = `${color.ko}(${color.en}) ${color.hex} 색상 정보: rgb(${rgb.r}, ${rgb.g}, ${rgb.b}), HSL·HSV·CMYK 변환값과 대비색(WCAG), 보색·유사색, 명도 스케일을 한눈에.`;
  const url = `${siteConfig.url}/tools/color/${color.slug}`;
  const ogImage = `${siteConfig.url}/og/color/${color.slug}.png`;

  return {
    title: { absolute: `${title} | ToolPiki` },
    description,
    keywords: [`${color.ko} 색상`, `${color.ko} 색상코드`, `${color.en} color`, `${color.hex}`, `${color.ko} rgb`, `${color.ko} hex`],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${color.ko} 색상 ${color.hex}`,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${color.ko} ${color.hex} 색상 미리보기` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${color.ko} 색상 ${color.hex}`,
      description,
      images: [ogImage],
    },
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
      <div className="min-w-0">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <p className="font-mono text-sm text-gray-900 dark:text-white truncate">{value}</p>
      </div>
      <CopyButton text={value} size="sm" />
    </div>
  );
}

function Badge({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
        ok
          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
          : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
      }`}
    >
      {ok ? '✓' : '✕'} {children}
    </span>
  );
}

export default async function ColorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const color = getCuratedColor(slug);
  if (!color) notFound();

  const rgb = hexToRgb(color.hex)!;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const textColor = bestTextColor(rgb);
  const whiteWcag = wcag({ r: 255, g: 255, b: 255 }, rgb);
  const blackWcag = wcag({ r: 0, g: 0, b: 0 }, rgb);
  const harm = harmony(rgb);
  const scale = lightnessScale(rgb, 10);
  const bare = color.hex.replace('#', '');

  const conversions = [
    { label: 'HEX', value: color.hex },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'HSV', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    { label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
  ];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: '색상 코드 변환', item: `${siteConfig.url}/tools/color-converter` },
      { '@type': 'ListItem', position: 3, name: `${color.ko} 색상 ${color.hex}` },
    ],
  };

  return (
    <article className="max-w-4xl mx-auto px-3 md:px-4 py-3 md:py-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <Link
        href="/tools/color-converter"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[var(--bg-elevated)] rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mb-3"
      >
        ← 색상 코드 변환기
      </Link>

      {/* 히어로: 스와치 이미지(구글 이미지 검색용 <img>) + 이름·HEX */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/og/color/${color.slug}.png`}
            alt={`${color.ko} ${color.hex} 색상 미리보기 (${color.en})`}
            width={1200}
            height={630}
            className="w-full h-40 md:h-56 object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: textColor }}>
            <h1 className="text-2xl md:text-4xl font-bold drop-shadow-sm">{color.ko} 색상</h1>
            <p className="mt-1 font-mono text-lg md:text-2xl drop-shadow-sm">{color.hex}</p>
            <p className="text-sm opacity-80">{color.en}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <strong className="text-gray-900 dark:text-white">{color.ko}({color.en})</strong>의 색상 코드는{' '}
        <strong className="font-mono">{color.hex}</strong>이며, RGB로는{' '}
        <strong className="font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</strong>입니다. 아래에서 HSL·HSV·CMYK 변환값과
        대비색(WCAG 명암비), 보색·유사색, 명도 스케일을 확인하고 값을 복사해 바로 사용하세요.
      </p>

      {/* 변환값 */}
      <h2 className="mt-6 mb-2 text-base font-bold text-gray-900 dark:text-white">색상 코드 변환값</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {conversions.map((c) => (
          <Row key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      {/* 대비색 + WCAG */}
      <h2 className="mt-6 mb-2 text-base font-bold text-gray-900 dark:text-white">대비색 · 명암비 (WCAG)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { fg: '#FFFFFF', label: '흰색 글자', w: whiteWcag },
          { fg: '#000000', label: '검은색 글자', w: blackWcag },
        ].map((row) => (
          <div key={row.fg} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="h-14 flex items-center justify-center text-sm font-medium" style={{ backgroundColor: color.hex, color: row.fg }}>
              {row.label} 샘플
            </div>
            <div className="p-2 flex items-center justify-between text-xs">
              <span className="font-mono text-gray-700 dark:text-gray-300">{row.w.ratio}:1</span>
              <span className="flex gap-1">
                <Badge ok={row.w.aaLarge}>AA Large</Badge>
                <Badge ok={row.w.aaNormal}>AA</Badge>
                <Badge ok={row.w.aaaNormal}>AAA</Badge>
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        이 배경에는 <strong>{textColor === '#FFFFFF' ? '흰색' : '검은색'}</strong> 글자가 더 잘 읽힙니다.
      </p>

      {/* 배색 */}
      <h2 className="mt-6 mb-2 text-base font-bold text-gray-900 dark:text-white">어울리는 배색</h2>
      <div className="space-y-2 text-sm">
        <HarmonyRow label="보색" hexes={[harm.complementary]} />
        <HarmonyRow label="유사색" hexes={harm.analogous} />
        <HarmonyRow label="삼각배색" hexes={harm.triadic} />
      </div>

      {/* 명도 스케일 */}
      <h2 className="mt-6 mb-2 text-base font-bold text-gray-900 dark:text-white">명도 스케일</h2>
      <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {scale.map((s) => (
          <div key={s.l} className="flex-1 h-12" style={{ backgroundColor: s.hex }} title={`${s.hex} (L ${s.l}%)`} />
        ))}
      </div>

      {/* 도구에서 열기 */}
      <div className="mt-6">
        <Link
          href={`/tools/color-converter?c=${bare}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          이 색을 변환기에서 열기 →
        </Link>
      </div>

      {/* 다른 색상 (내부 링크) */}
      <h2 className="mt-8 mb-3 text-base font-bold text-gray-900 dark:text-white">다른 색상 보기</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
        {curatedColors
          .filter((c) => c.slug !== color.slug)
          .map((c) => (
            <Link key={c.slug} href={`/tools/color/${c.slug}`} className="group" title={`${c.ko} ${c.hex}`}>
              <span className="block w-full aspect-square rounded-lg border border-gray-200 dark:border-gray-700" style={{ backgroundColor: c.hex }} />
              <span className="block mt-1 text-[10px] text-center text-gray-500 dark:text-gray-400 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                {c.ko}
              </span>
            </Link>
          ))}
      </div>
    </article>
  );
}

function HarmonyRow({ label, hexes }: { label: string; hexes: string[] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {hexes.map((h) => (
          <Link
            key={h}
            href={`/tools/color-converter?c=${h.replace('#', '')}`}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-gray-700 pr-2 hover:shadow-sm transition"
            title={`${h} 변환기에서 열기`}
          >
            <span className="w-7 h-7 rounded-l-md" style={{ backgroundColor: h }} />
            <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{h}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
