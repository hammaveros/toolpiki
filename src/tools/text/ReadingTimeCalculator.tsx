'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FaqSection } from '@/components/ui/FaqItem';
import { Button } from '@/components/ui/Button';

type CalcMode = 'text' | 'slides' | 'target';
type SpeedLevel = 'slow' | 'normal' | 'fast';

interface SpeedConfig {
  koreanRead: number;   // 분당 글자수 (읽기)
  englishRead: number;  // 분당 단어수 (읽기)
  koreanSpeak: number;  // 분당 글자수 (발표)
  englishSpeak: number; // 분당 단어수 (발표)
  label: string;
}

const speeds: Record<SpeedLevel, SpeedConfig> = {
  slow: { koreanRead: 300, englishRead: 150, koreanSpeak: 200, englishSpeak: 100, label: '천천히' },
  normal: { koreanRead: 500, englishRead: 250, koreanSpeak: 330, englishSpeak: 160, label: '보통' },
  fast: { koreanRead: 700, englishRead: 350, koreanSpeak: 470, englishSpeak: 230, label: '빠르게' },
};

function formatTime(minutes: number): string {
  if (minutes < 1) {
    return `${Math.round(minutes * 60)}초`;
  } else if (minutes < 60) {
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    return s > 0 ? `${m}분 ${s}초` : `${m}분`;
  } else {
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
  }
}

export function ReadingTimeCalculator() {
  const [mode, setMode] = useState<CalcMode>('text');
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState<SpeedLevel>('normal');

  // 슬라이드 모드
  const [slideCount, setSlideCount] = useState('');
  const [secsPerSlide, setSecsPerSlide] = useState('60');

  // 목표 시간 모드
  const [targetMinutes, setTargetMinutes] = useState('');

  const modeOptions: { value: CalcMode; label: string; icon: string }[] = [
    { value: 'text', label: '텍스트 입력', icon: '📝' },
    { value: 'slides', label: '슬라이드 계산', icon: '📊' },
    { value: 'target', label: '목표 시간 역산', icon: '🎯' },
  ];

  const speedOptions: { value: SpeedLevel; label: string; readDesc: string; speakDesc: string }[] = [
    { value: 'slow', label: '천천히', readDesc: '300자/분', speakDesc: '200자/분' },
    { value: 'normal', label: '보통', readDesc: '500자/분', speakDesc: '330자/분' },
    { value: 'fast', label: '빠르게', readDesc: '700자/분', speakDesc: '470자/분' },
  ];

  // 텍스트 모드 분석
  const textAnalysis = useMemo(() => {
    if (mode !== 'text' || !text.trim()) return null;

    const koreanChars = (text.match(/[가-힣]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const totalChars = text.length;
    const totalWords = text.trim().split(/\s+/).length;

    const config = speeds[speed];

    const readMinutes = koreanChars / config.koreanRead + englishWords / config.englishRead;
    const speakMinutes = koreanChars / config.koreanSpeak + englishWords / config.englishSpeak;

    return {
      totalChars,
      totalWords,
      koreanChars,
      englishWords,
      readingTime: formatTime(readMinutes),
      readingMinutes: readMinutes,
      speakingTime: formatTime(speakMinutes),
      speakingMinutes: speakMinutes,
    };
  }, [text, speed, mode]);

  // 슬라이드 모드 계산
  const slideAnalysis = useMemo(() => {
    if (mode !== 'slides') return null;
    const slides = parseInt(slideCount) || 0;
    const secs = parseInt(secsPerSlide) || 60;
    if (slides <= 0) return null;

    const totalSecs = slides * secs;
    const totalMin = totalSecs / 60;

    return {
      slides,
      secsPerSlide: secs,
      totalTime: formatTime(totalMin),
      totalMinutes: totalMin,
      suggestedChars: Math.round(totalMin * speeds[speed].koreanSpeak),
      suggestedWords: Math.round(totalMin * speeds[speed].englishSpeak),
    };
  }, [slideCount, secsPerSlide, speed, mode]);

  // 목표 시간 역산
  const targetAnalysis = useMemo(() => {
    if (mode !== 'target') return null;
    const mins = parseFloat(targetMinutes) || 0;
    if (mins <= 0) return null;

    const config = speeds[speed];

    return {
      targetMinutes: mins,
      targetTime: formatTime(mins),
      readKoreanChars: Math.round(mins * config.koreanRead),
      readEnglishWords: Math.round(mins * config.englishRead),
      speakKoreanChars: Math.round(mins * config.koreanSpeak),
      speakEnglishWords: Math.round(mins * config.englishSpeak),
      suggestedSlides: Math.round(mins * 60 / 60), // 1분/슬라이드 기준
    };
  }, [targetMinutes, speed, mode]);

  return (
    <div className="space-y-2">
      {/* 모드 선택 */}
      <div className="flex gap-2">
        {modeOptions.map((option) => (
          <Button
            key={option.value}
            variant={mode === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setMode(option.value)}
            className="flex-1"
          >
            <span className="mr-1">{option.icon}</span>
            {option.label}
          </Button>
        ))}
      </div>

      {/* 속도 선택 */}
      <div className="flex gap-2">
        {speedOptions.map((option) => (
          <Button
            key={option.value}
            variant={speed === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSpeed(option.value)}
            className="flex-1"
          >
            <div>
              <div>{option.label}</div>
              <div className="text-xs opacity-70">
                {mode === 'text' ? option.readDesc : option.speakDesc}
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* 텍스트 입력 모드 */}
      {mode === 'text' && (
        <>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="읽기/발표 시간을 측정할 텍스트를 입력하세요..."
            rows={8}
          />

          {textAnalysis && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card variant="bordered" className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">읽기 시간</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {textAnalysis.readingTime}
                  </p>
                </Card>
                <Card variant="bordered" className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">발표 시간</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {textAnalysis.speakingTime}
                  </p>
                </Card>
              </div>

              <Card variant="bordered" className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">전체 글자</p>
                    <p className="font-medium">{textAnalysis.totalChars.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">전체 단어</p>
                    <p className="font-medium">{textAnalysis.totalWords.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">한글</p>
                    <p className="font-medium">{textAnalysis.koreanChars.toLocaleString()}자</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">영어</p>
                    <p className="font-medium">{textAnalysis.englishWords.toLocaleString()}단어</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      {/* 슬라이드 모드 */}
      {mode === 'slides' && (
        <>
          <Card variant="bordered" className="p-4 space-y-4">
            <Input
              label="슬라이드 수"
              type="number"
              min="1"
              value={slideCount}
              onChange={(e) => setSlideCount(e.target.value)}
              placeholder="예: 20"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                슬라이드당 시간
              </label>
              <div className="flex gap-2">
                {[
                  { value: '30', label: '30초' },
                  { value: '60', label: '1분' },
                  { value: '90', label: '1분 30초' },
                  { value: '120', label: '2분' },
                  { value: '180', label: '3분' },
                ].map((opt) => (
                  <Button
                    key={opt.value}
                    variant={secsPerSlide === opt.value ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSecsPerSlide(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {slideAnalysis && (
            <>
              <Card variant="bordered" className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">예상 발표 시간</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {slideAnalysis.totalTime}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {slideAnalysis.slides}장 × {slideAnalysis.secsPerSlide}초
                </p>
              </Card>

              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  권장 원고 분량
                </p>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">한글 기준</p>
                    <p className="font-medium text-lg">{slideAnalysis.suggestedChars.toLocaleString()}자</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">영어 기준</p>
                    <p className="font-medium text-lg">{slideAnalysis.suggestedWords.toLocaleString()} words</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      {/* 목표 시간 역산 모드 */}
      {mode === 'target' && (
        <>
          <Card variant="bordered" className="p-4 space-y-4">
            <Input
              label="목표 발표 시간 (분)"
              type="number"
              min="1"
              step="0.5"
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(e.target.value)}
              placeholder="예: 15"
            />
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 30].map((m) => (
                <Button
                  key={m}
                  variant={targetMinutes === String(m) ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTargetMinutes(String(m))}
                >
                  {m}분
                </Button>
              ))}
            </div>
          </Card>

          {targetAnalysis && (
            <>
              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  📖 읽기 {targetAnalysis.targetTime}에 필요한 분량
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">한글</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {targetAnalysis.readKoreanChars.toLocaleString()}자
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">영어</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {targetAnalysis.readEnglishWords.toLocaleString()} words
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="bordered" className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎤 발표 {targetAnalysis.targetTime}에 필요한 분량
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">한글</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {targetAnalysis.speakKoreanChars.toLocaleString()}자
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">영어</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {targetAnalysis.speakEnglishWords.toLocaleString()} words
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                  권장 슬라이드 수: 약 {targetAnalysis.suggestedSlides}장 (1분/장 기준)
                </p>
              </Card>
            </>
          )}
        </>
      )}

      {/* 참고 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 읽기 속도: 한글 성인 평균 분당 400~600자</p>
        <p>• 발표 속도: 한글 분당 약 250~400자 (읽기보다 느림)</p>
        <p>• 발표 시 강조, 쉼, 청중 반응 등으로 읽기보다 시간이 더 소요됩니다</p>
        <p>• 블로그 최적 길이: 5~10분 (2,500~5,000자)</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">읽기 시간 & 발표 시간 계산기란?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">읽기 시간 계산기는 텍스트를 읽는 시간과 발표(스피치) 시간을 자동 계산해 주는 도구</strong>입니다.
          <strong>한글과 영어를 구분</strong>하여 각각의 읽기·발표 속도를 적용하므로 혼합 텍스트도 정확하게 측정할 수 있습니다.
          <strong>텍스트 입력 / 슬라이드 기반 / 목표 시간 역산</strong> 세 가지 모드를 지원합니다.
          성인 기준 한글 평균 읽기 속도는 <strong>분당 약 400~600자</strong>이며, 발표 시에는 <strong>분당 약 250~400자</strong>로 더 느립니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">활용 사례</h2>
        <ul className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
          <li><strong>블로그 글 작성</strong> — 일반적으로 최적 길이는 <strong>5~10분(2,500~5,000자)</strong></li>
          <li><strong>발표·스피치 원고</strong> — 슬라이드 수 × 장당 시간으로 전체 발표 시간 사전 계산</li>
          <li><strong>목표 시간 역산</strong> — &quot;15분 발표에 필요한 원고 분량&quot;을 즉시 확인</li>
          <li><strong>회의 자료·보고서·유튜브 대본·뉴스레터</strong>의 분량을 사전에 가늠</li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">발표 시간별 원고 분량 기준</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-3">
          발표 준비에서 가장 자주 나오는 질문이 &quot;몇 분이면 몇 자를 써야 하나&quot;입니다.
          한국어 발표 속도를 분당 약 300자로 잡았을 때의 대략적인 기준입니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">발표 시간</th>
                <th className="text-left py-2 px-2">원고 분량</th>
                <th className="text-left py-2 px-2">A4 기준</th>
                <th className="text-left py-2 px-2">슬라이드</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">3분</td><td>약 900자</td><td>약 0.5장</td><td>3~4장</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">5분</td><td>약 1,500자</td><td>약 1장</td><td>5~7장</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">10분</td><td>약 3,000자</td><td>약 2장</td><td>10~12장</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-1.5 px-2">15분</td><td>약 4,500자</td><td>약 3장</td><td>15~18장</td></tr>
              <tr><td className="py-1.5 px-2">30분</td><td>약 9,000자</td><td>약 6장</td><td>25~35장</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mt-3">
          질의응답이 포함된 발표라면 <strong>배정 시간의 70~80%</strong>만 원고로 채우는 것이 안전합니다.
          15분을 받았다면 원고는 11~12분 분량으로 준비하는 식입니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">읽기 속도는 왜 사람마다 다를까</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          같은 글이라도 읽는 속도는 상황에 따라 크게 달라집니다. 계산 결과를 <strong>절대적인 값이 아니라 기준점</strong>으로 봐야 하는 이유입니다.
        </p>
        <ul className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside mt-3">
          <li><strong>글의 난이도</strong> — 익숙한 주제의 에세이는 빠르게 읽히지만, 낯선 전문 용어가 많은 기술 문서는 절반 이하로 느려집니다.</li>
          <li><strong>읽는 목적</strong> — 훑어보기(스캐닝)는 훨씬 빠르고, 이해하며 정독하는 경우는 느려집니다.</li>
          <li><strong>매체</strong> — 모바일 화면은 한 줄이 짧아 시선 이동이 잦고, 인쇄물보다 다소 느린 경향이 있습니다.</li>
          <li><strong>표와 그림</strong> — 본문 글자수에는 안 잡히지만 실제로는 이해하는 데 시간이 걸립니다.</li>
        </ul>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mt-3">
          블로그의 &quot;읽는 데 5분&quot; 표시는 정확한 예측이라기보다 <strong>글의 분량을 가늠하게 해주는 신호</strong>에 가깝습니다.
          그 자체로도 이탈률을 낮추는 효과가 있어 널리 쓰입니다.
        </p>
      </div>

      <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm">
        <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">💡 발표 준비 팁</p>
        <p className="text-indigo-800 dark:text-indigo-300">
          실전에서는 강조와 쉼, 청중 반응으로 <strong>읽기보다 1.3~1.6배 느려진다</strong>는 점을 감안해 원고 길이를 짜는 것이 안전합니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '한글과 영어가 섞인 텍스트도 정확하게 측정되나요?', answer: '네, 한글은 글자 수(분당 200~700자), 영어는 단어 수(분당 100~350 WPM) 기준으로 읽기와 발표 속도를 따로 계산한 뒤 합산하므로 혼합 텍스트도 정확하게 측정됩니다.' },
          { question: '발표 시간은 어떻게 계산되나요?', answer: '발표 시간은 읽기 속도와 별개의 발표 전용 속도(분당 200~470자)로 계산됩니다. 실제 발표에서는 강조, 쉼, 청중 반응 등으로 읽기보다 상당히 느려지기 때문입니다.' },
          { question: '슬라이드당 적정 시간은 얼마인가요?', answer: '일반적으로 슬라이드당 1~2분이 권장됩니다. 내용이 많은 슬라이드는 2~3분, 제목이나 전환 슬라이드는 30초 정도가 적당합니다.' },
          { question: '10분 발표에는 원고를 몇 자 써야 하나요?', answer: '한국어 발표 속도를 분당 300자로 잡으면 약 3,000자, A4 2장 정도입니다. 질의응답이 포함된다면 배정 시간의 70~80%만 원고로 채우는 것이 안전합니다.' },
          { question: '계산 결과와 실제 시간이 차이 나요.', answer: '글의 난이도, 읽는 목적, 표와 그림의 양에 따라 실제 시간은 달라집니다. 계산값은 절대적인 예측이 아니라 분량을 가늠하는 기준점으로 활용하세요.' },
          { question: '입력한 원고가 서버로 전송되나요?', answer: '아니요. 계산은 브라우저 안에서만 이루어지며 입력한 원고가 서버로 전송되거나 저장되지 않습니다. 미공개 발표 자료도 안심하고 확인할 수 있습니다.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/" className="text-blue-600 hover:underline">← 홈으로</a>
        <a href="/tools/character-counter" className="text-blue-600 hover:underline">글자수 세기 →</a>
      </div>
    </section>
  );
}
