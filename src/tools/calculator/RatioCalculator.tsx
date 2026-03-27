'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';
import { FaqSection } from '@/components/ui/FaqItem';

type Mode = 'ratio' | 'screen' | 'golden';

const COMMON_RATIOS = [
  { name: '1:1 (정사각형)', ratio: 1 },
  { name: '4:3 (표준)', ratio: 4 / 3 },
  { name: '3:2 (사진)', ratio: 3 / 2 },
  { name: '16:9 (와이드)', ratio: 16 / 9 },
  { name: '16:10', ratio: 16 / 10 },
  { name: '21:9 (울트라와이드)', ratio: 21 / 9 },
  { name: '9:16 (모바일 세로)', ratio: 9 / 16 },
  { name: '2:3 (포스터)', ratio: 2 / 3 },
];

const GOLDEN_RATIO = 1.618033988749895;

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyRatio(w: number, h: number): [number, number] {
  const d = gcd(w, h);
  return [Math.round(w / d), Math.round(h / d)];
}

export function RatioCalculator() {
  const [mode, setMode] = useState<Mode>('ratio');

  // 비율 계산
  const [width1, setWidth1] = useState('1920');
  const [height1, setHeight1] = useState('1080');
  const [width2, setWidth2] = useState('');
  const [height2, setHeight2] = useState('');

  // 화면 비율
  const [screenWidth, setScreenWidth] = useState('1920');
  const [screenHeight, setScreenHeight] = useState('1080');

  // 황금비
  const [goldenInput, setGoldenInput] = useState('100');

  const ratioResult = useMemo(() => {
    const w = parseFloat(width1) || 0;
    const h = parseFloat(height1) || 0;
    if (w <= 0 || h <= 0) return null;

    const [rw, rh] = simplifyRatio(w, h);
    const ratio = w / h;

    // 두 번째 크기 계산
    let calculatedW2 = '';
    let calculatedH2 = '';

    if (width2 && !height2) {
      calculatedH2 = (parseFloat(width2) / ratio).toFixed(2);
    } else if (height2 && !width2) {
      calculatedW2 = (parseFloat(height2) * ratio).toFixed(2);
    }

    return { rw, rh, ratio, calculatedW2, calculatedH2 };
  }, [width1, height1, width2, height2]);

  const screenResult = useMemo(() => {
    const w = parseFloat(screenWidth) || 0;
    const h = parseFloat(screenHeight) || 0;
    if (w <= 0 || h <= 0) return null;

    const [rw, rh] = simplifyRatio(w, h);
    const ratio = w / h;
    const diagonal = Math.sqrt(w * w + h * h);
    const megapixels = (w * h) / 1000000;

    return { rw, rh, ratio, diagonal, megapixels };
  }, [screenWidth, screenHeight]);

  const goldenResult = useMemo(() => {
    const value = parseFloat(goldenInput) || 0;
    if (value <= 0) return null;

    const larger = value * GOLDEN_RATIO;
    const smaller = value / GOLDEN_RATIO;

    return { value, larger, smaller };
  }, [goldenInput]);

  return (
    <div className="space-y-2">
      {/* 모드 선택 */}
      <div className="flex gap-2">
        {(['ratio', 'screen', 'golden'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm',
              mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {m === 'ratio' && '비율 계산'}
            {m === 'screen' && '화면 비율'}
            {m === 'golden' && '황금비'}
          </button>
        ))}
      </div>

      {/* 비율 계산 */}
      {mode === 'ratio' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                원본 크기
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={width1}
                  onChange={(e) => setWidth1(e.target.value)}
                  placeholder="너비"
                />
                <span className="text-gray-500">×</span>
                <Input
                  type="number"
                  value={height1}
                  onChange={(e) => setHeight1(e.target.value)}
                  placeholder="높이"
                />
              </div>
            </div>

            {ratioResult && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {ratioResult.rw} : {ratioResult.rh}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  비율: {ratioResult.ratio.toFixed(4)}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                같은 비율로 크기 계산 (하나만 입력)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={width2 || ratioResult?.calculatedW2 || ''}
                  onChange={(e) => { setWidth2(e.target.value); setHeight2(''); }}
                  placeholder="너비"
                />
                <span className="text-gray-500">×</span>
                <Input
                  type="number"
                  value={height2 || ratioResult?.calculatedH2 || ''}
                  onChange={(e) => { setHeight2(e.target.value); setWidth2(''); }}
                  placeholder="높이"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                일반적인 비율
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_RATIOS.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (r.ratio >= 1) {
                        setWidth1(String(Math.round(r.ratio * 1000)));
                        setHeight1('1000');
                      } else {
                        setWidth1('1000');
                        setHeight1(String(Math.round(1000 / r.ratio)));
                      }
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 화면 비율 */}
      {mode === 'screen' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                해상도 (픽셀)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={screenWidth}
                  onChange={(e) => setScreenWidth(e.target.value)}
                  placeholder="너비"
                />
                <span className="text-gray-500">×</span>
                <Input
                  type="number"
                  value={screenHeight}
                  onChange={(e) => setScreenHeight(e.target.value)}
                  placeholder="높이"
                />
              </div>
            </div>

            {screenResult && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">비율</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {screenResult.rw}:{screenResult.rh}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">종횡비</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {screenResult.ratio.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">대각선 (px)</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {screenResult.diagonal.toFixed(0)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">메가픽셀</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {screenResult.megapixels.toFixed(2)} MP
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 황금비 */}
      {mode === 'golden' && (
        <Card variant="bordered" className="p-5">
          <div className="space-y-6">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">황금비 (φ)</div>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                1 : {GOLDEN_RATIO.toFixed(6)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                기준 값
              </label>
              <Input
                type="number"
                value={goldenInput}
                onChange={(e) => setGoldenInput(e.target.value)}
                placeholder="숫자 입력"
              />
            </div>

            {goldenResult && (
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">큰 값 (× φ)</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {goldenResult.larger.toFixed(4)}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400">기준 값</span>
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                      {goldenResult.value}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">작은 값 (÷ φ)</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {goldenResult.smaller.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📐 비율 계산기란?
        </h2>
        <p className="text-sm leading-relaxed">
          비율 계산기는 이미지, 영상, 화면의 종횡비(Aspect Ratio)를 계산하고 변환하는 도구입니다.
          원본 크기에서 비율을 자동 추출하고, 같은 비율로 다른 크기를 계산할 수 있습니다.
          16:9, 4:3 등 일반적인 비율 프리셋과 황금비(1:1.618) 계산 기능도 제공합니다.
          디자이너, 개발자, 영상 편집자, 사진가에게 필수적인 도구입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 일반적인 화면/이미지 비율
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">비율</th>
                <th className="text-left py-2 px-2">용도</th>
                <th className="text-left py-2 px-2">예시 해상도</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">16:9</td><td>유튜브, TV, 모니터</td><td className="font-mono">1920×1080, 3840×2160</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">4:3</td><td>옛 TV, 프레젠테이션</td><td className="font-mono">1024×768, 1400×1050</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">21:9</td><td>울트라와이드 모니터, 영화</td><td className="font-mono">2560×1080, 3440×1440</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">9:16</td><td>모바일 세로, 쇼츠/릴스</td><td className="font-mono">1080×1920</td></tr>
              <tr><td className="py-2 px-2 font-medium">1:1</td><td>인스타그램, 프로필 사진</td><td className="font-mono">1080×1080</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 비율 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>썸네일 제작</strong>: 유튜브는 16:9, 인스타그램은 1:1 또는 4:5 비율 사용</li>
          <li><strong>황금비 디자인</strong>: 1:1.618 비율로 시각적으로 안정된 레이아웃 구성</li>
          <li><strong>리사이즈 시</strong>: 원본 비율 유지해야 이미지 왜곡 방지</li>
          <li><strong>크롭 계획</strong>: 목표 비율 먼저 결정 후 촬영/편집 시작</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '종횡비와 해상도의 차이는?',
            answer: '종횡비는 가로:세로의 비율(예: 16:9)이고, 해상도는 실제 픽셀 수(예: 1920×1080)입니다. 같은 종횡비라도 해상도는 다를 수 있습니다.',
          },
          {
            question: '황금비가 왜 중요한가요?',
            answer: '황금비(1:1.618)는 고대부터 가장 아름다운 비율로 여겨졌습니다. 로고, 레이아웃, 사진 구도에서 시각적 균형을 만드는 데 활용됩니다.',
          },
          {
            question: '비율이 맞지 않으면 어떻게 되나요?',
            answer: '이미지가 늘어나거나 찌그러져 보입니다. 크롭(잘라내기)을 하거나 레터박스(검은 여백)를 추가해 비율을 맞추는 것이 일반적입니다.',
          },
        ]}
      />
    </div>
  );
}
