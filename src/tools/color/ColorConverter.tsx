'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';
import { curatedColors } from '@/data/colors';
import {
  parseColor,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  bestTextColor,
  wcag,
  harmony,
  lightnessScale,
  nearestNamedColor,
} from '@/lib/color';

export function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6');
  const [text, setText] = useState('#3B82F6');

  // 공유 링크(?c=ff5733 / ?hex=...) 로 들어오면 해당 색으로 초기화
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('c') || params.get('hex') || params.get('color');
    if (raw) {
      const rgb = parseColor(raw);
      if (rgb) {
        const h = rgbToHex(rgb.r, rgb.g, rgb.b);
        setHex(h);
        setText(h);
      }
    }
  }, []);

  // 모든 컨트롤(피커·슬라이더·스와치)이 색을 바꿀 때 사용
  const setColor = useCallback((newHex: string) => {
    setHex(newHex);
    setText(newHex);
  }, []);

  // 텍스트 입력은 HEX·rgb()·hsl()·이름색 무엇이든 파싱
  const handleText = (v: string) => {
    setText(v);
    const rgb = parseColor(v);
    if (rgb) setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const invalid = text.trim() !== '' && parseColor(text) === null;

  const data = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const textColor = bestTextColor(rgb);
    return {
      rgb,
      hsl,
      hsv,
      cmyk,
      textColor,
      whiteWcag: wcag({ r: 255, g: 255, b: 255 }, rgb),
      blackWcag: wcag({ r: 0, g: 0, b: 0 }, rgb),
      harmony: harmony(rgb),
      scale: lightnessScale(rgb, 10),
      nearest: nearestNamedColor(rgb),
      hexStr: hex.toUpperCase(),
      rgbStr: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgbaStr: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hslStr: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsvStr: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      cmykStr: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    };
  }, [hex]);

  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    if (!data) return;
    const newRgb = { ...data.rgb, [key]: value };
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div className="space-y-2">
      {/* 색상 미리보기 + 입력 */}
      <Card variant="bordered" className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div
            className="w-32 h-32 rounded-xl shadow-lg border-4 border-white dark:border-gray-700 flex items-center justify-center text-sm font-mono font-semibold flex-shrink-0"
            style={{ backgroundColor: hex, color: data?.textColor }}
          >
            {data?.hexStr}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              색상값 입력 (HEX · RGB · HSL · 이름색)
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={hex}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer flex-shrink-0"
                aria-label="컬러 피커"
              />
              <Input
                value={text}
                onChange={(e) => handleText(e.target.value)}
                placeholder="#3B82F6, rgb(59,130,246), hsl(217,91%,60%), tomato"
                className={`font-mono ${invalid ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
            </div>
            {invalid ? (
              <p className="mt-1 text-xs text-red-500">색상값을 인식하지 못했어요. 예: #3B82F6 · rgb(59,130,246) · hsl(217,91%,60%)</p>
            ) : (
              data && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  가장 가까운 색 이름: <span className="font-medium text-gray-700 dark:text-gray-300">{data.nearest.name}</span>{' '}
                  ({data.nearest.hex})
                </p>
              )
            )}
          </div>
        </div>
      </Card>

      {/* RGB 슬라이더 */}
      {data && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">RGB 조절</p>
          <div className="space-y-4">
            {(['r', 'g', 'b'] as const).map((channel) => (
              <div key={channel} className="flex items-center gap-4">
                <span className="w-8 text-sm font-medium text-gray-500 uppercase">{channel}</span>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={data.rgb[channel]}
                  onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: channel === 'r' ? 'red' : channel === 'g' ? 'green' : 'blue' }}
                />
                <span className="w-10 text-sm text-gray-600 dark:text-gray-400 text-right">{data.rgb[channel]}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 전체 변환 결과 */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ColorValueCard label="HEX" value={data.hexStr} />
          <ColorValueCard label="RGB" value={data.rgbStr} />
          <ColorValueCard label="HSL" value={data.hslStr} />
          <ColorValueCard label="HSV" value={data.hsvStr} />
          <ColorValueCard label="CMYK" value={data.cmykStr} />
          <ColorValueCard label="RGBA" value={data.rgbaStr} />
        </div>
      )}

      {/* 대비색 + WCAG */}
      {data && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">대비색 · 명암비 (WCAG)</p>
            <Link href="/tools/contrast-checker" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              두 색 명암비 자세히 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContrastRow bg={hex} fg="#FFFFFF" label="흰색 글자" w={data.whiteWcag} />
            <ContrastRow bg={hex} fg="#000000" label="검은색 글자" w={data.blackWcag} />
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            이 배경에는 <span className="font-medium">{data.textColor === '#FFFFFF' ? '흰색' : '검은색'}</span> 글자가 더 잘 읽혀요.
          </p>
        </Card>
      )}

      {/* 배색(보색·유사색·삼각배색) */}
      {data && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">어울리는 배색</p>
            <Link href="/tools/palette-generator" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              팔레트 더 만들기 →
            </Link>
          </div>
          <div className="space-y-3">
            <SwatchRow label="보색" hexes={[data.harmony.complementary]} onPick={setColor} />
            <SwatchRow label="유사색" hexes={data.harmony.analogous} onPick={setColor} />
            <SwatchRow label="삼각배색" hexes={data.harmony.triadic} onPick={setColor} />
          </div>
        </Card>
      )}

      {/* 명도 스케일 */}
      {data && (
        <Card variant="bordered" className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">명도 스케일 (밝게 → 어둡게)</p>
          <div className="flex rounded-lg overflow-hidden">
            {data.scale.map((s) => (
              <button
                key={s.l}
                onClick={() => setColor(s.hex)}
                className="flex-1 h-12 relative group"
                style={{ backgroundColor: s.hex }}
                title={`${s.hex} (L ${s.l}%)`}
                aria-label={`${s.hex} 선택`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">색을 클릭하면 그 값으로 바뀝니다.</p>
        </Card>
      )}

      {/* 인기 색상 바로가기 */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">인기 색상 바로 보기</p>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
          {curatedColors.slice(0, 21).map((c) => (
            <Link key={c.slug} href={`/tools/color/${c.slug}`} className="group" title={`${c.ko} ${c.hex}`}>
              <span className="block w-full aspect-square rounded-lg border border-gray-200 dark:border-gray-700" style={{ backgroundColor: c.hex }} />
              <span className="block mt-1 text-[10px] text-center text-gray-500 dark:text-gray-400 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                {c.ko}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      <SeoContent />
    </div>
  );
}

function ColorValueCard({ label, value }: { label: string; value: string }) {
  return (
    <Card variant="bordered" className="p-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
          <p className="font-mono text-sm text-gray-900 dark:text-white">{value}</p>
        </div>
        <CopyButton text={value} size="sm" />
      </div>
    </Card>
  );
}

function ContrastRow({ bg, fg, label, w }: { bg: string; fg: string; label: string; w: { ratio: number; aaNormal: boolean; aaLarge: boolean; aaaNormal: boolean } }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="h-12 flex items-center justify-center text-sm font-medium" style={{ backgroundColor: bg, color: fg }}>
        {label} 샘플
      </div>
      <div className="p-2 flex items-center justify-between text-xs">
        <span className="font-mono text-gray-700 dark:text-gray-300">{w.ratio}:1</span>
        <span className="flex gap-1">
          <Badge ok={w.aaLarge}>AA Large</Badge>
          <Badge ok={w.aaNormal}>AA</Badge>
          <Badge ok={w.aaaNormal}>AAA</Badge>
        </span>
      </div>
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

function SwatchRow({ label, hexes, onPick }: { label: string; hexes: string[]; onPick: (hex: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {hexes.map((h) => (
          <button
            key={h}
            onClick={() => onPick(h)}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-gray-700 pr-2 hover:shadow-sm transition"
            title={`${h} 선택`}
          >
            <span className="w-7 h-7 rounded-l-md" style={{ backgroundColor: h }} />
            <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{h}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🎨 색상 종합 도구란?</h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">HEX·RGB·HSL·HSV·CMYK</strong> 변환은 물론, 입력한 색의{' '}
          <strong>대비색(WCAG 명암비)</strong>, <strong>보색·유사색·삼각배색</strong>, <strong>명도 스케일</strong>,
          가장 가까운 <strong>CSS 이름색</strong>까지 한 화면에서 보여 줍니다. HEX뿐 아니라 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">rgb(59,130,246)</code>,
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono ml-1">hsl(217,91%,60%)</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono ml-1">tomato</code> 같은 이름색을 그대로 붙여넣어도 인식합니다.
        </p>
        <div className="mt-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 p-4 text-sm">
          <p className="font-semibold text-purple-900 dark:text-purple-200 mb-1">🔗 공유 팁</p>
          <p className="text-purple-800 dark:text-purple-300">
            주소 끝에 <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-gray-800 text-xs font-mono">?c=ff5733</code> 처럼 색상값을 붙이면 그 색이 열린 상태로 공유됩니다.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 색상 형식 비교</h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">형식</th>
                <th className="text-left py-2 px-2">예시</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HEX</td><td className="font-mono">#3B82F6</td><td>웹에서 가장 흔함</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">RGB</td><td className="font-mono">rgb(59, 130, 246)</td><td>빨강/초록/파랑 조합</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HSL</td><td className="font-mono">hsl(217, 91%, 60%)</td><td>색조/채도/밝기</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">HSV</td><td className="font-mono">hsv(217, 76%, 96%)</td><td>색조/채도/명도(디자인 툴)</td></tr>
              <tr><td className="py-2 px-2 font-medium">CMYK</td><td className="font-mono">cmyk(76%, 47%, 0%, 4%)</td><td>인쇄용 잉크 모델</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔬 대비색과 명암비는 왜 중요할까</h2>
        <p className="text-sm leading-relaxed">
          글자색과 배경색의 <strong>명암비(contrast ratio)</strong>가 낮으면 저시력 사용자뿐 아니라 일반 사용자도 읽기 어렵습니다.
          웹 접근성 기준 <strong>WCAG</strong>는 본문 텍스트에 <strong>4.5:1(AA)</strong>, 큰 텍스트에 <strong>3:1</strong>, 더 엄격하게는 <strong>7:1(AAA)</strong>를 권장합니다.
          이 도구는 입력한 색을 배경으로 두고 흰색/검은색 글자의 명암비를 계산해 어떤 글자색이 통과하는지 바로 알려 줍니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'rgb()나 hsl() 값을 그대로 넣어도 되나요?', answer: '네. HEX는 물론 rgb(59,130,246), hsl(217,91%,60%), tomato 같은 CSS 이름색까지 입력창에 그대로 붙여넣으면 자동으로 인식해 모든 형식으로 변환합니다.' },
          { question: '대비색은 어떻게 정해지나요?', answer: '입력한 색을 배경으로 두고 흰색·검은색 글자의 WCAG 명암비를 각각 계산해, 더 높은 쪽을 추천 글자색으로 안내합니다. AA(4.5:1)·AAA(7:1) 통과 여부도 함께 표시합니다.' },
          { question: 'CMYK 값이 인쇄물과 다르게 보여요.', answer: 'CMYK는 잉크 기준 모델이라 화면(RGB)과 완벽히 일치하지 않습니다. 실제 인쇄는 용지·프로파일에 따라 달라지므로 변환값은 참고용으로 사용하세요.' },
          { question: '특정 색 링크를 공유할 수 있나요?', answer: '주소 끝에 ?c=ff5733 처럼 색상값을 붙이면 그 색이 선택된 상태로 페이지가 열립니다. 블로그·메신저에 바로 공유하기 좋습니다.' },
        ]}
      />
    </div>
  );
}
