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
          읽기 시간 계산기는 입력한 텍스트를 읽는 데 걸리는 예상 시간과 발표(스피치) 시간을 자동으로 계산해 주는 도구입니다.
          한글과 영어를 구분하여 각각의 읽기·발표 속도를 적용하므로 혼합된 텍스트도 정확하게 측정할 수 있습니다.
          텍스트 입력, 슬라이드 기반 계산, 목표 시간 역산 세 가지 모드를 지원하여 다양한 발표 준비 시나리오에 활용할 수 있습니다.
          성인 기준 한글 평균 읽기 속도는 분당 약 400~600자이며, 발표 시에는 분당 약 250~400자로 읽기보다 느립니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">활용 사례</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          블로그 글을 작성할 때 독자의 독자가 중간에 그만 읽지 않으려면 적정 읽기 시간을 파악하는 것이 중요합니다. 일반적으로 블로그 최적 길이는 5~10분(2,500~5,000자) 정도로 알려져 있습니다.
          발표나 스피치 원고를 준비할 때 슬라이드 수와 장당 시간으로 전체 발표 시간을 미리 계산할 수 있습니다.
          목표 시간 역산 기능을 사용하면 &quot;15분 발표에 필요한 원고 분량&quot;을 즉시 확인할 수 있어 원고 작성이 훨씬 수월합니다.
          회의 자료, 보고서, 유튜브 대본, 뉴스레터 등 다양한 콘텐츠의 분량을 사전에 가늠할 수 있습니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '한글과 영어가 섞인 텍스트도 정확하게 측정되나요?', answer: '네, 한글은 글자 수(분당 200~700자), 영어는 단어 수(분당 100~350 WPM) 기준으로 읽기와 발표 속도를 따로 계산한 뒤 합산하므로 혼합 텍스트도 정확하게 측정됩니다.' },
          { question: '발표 시간은 어떻게 계산되나요?', answer: '발표 시간은 읽기 속도와 별개의 발표 전용 속도(분당 200~470자)로 계산됩니다. 실제 발표에서는 강조, 쉼, 청중 반응 등으로 읽기보다 상당히 느려지기 때문입니다.' },
          { question: '슬라이드당 적정 시간은 얼마인가요?', answer: '일반적으로 슬라이드당 1~2분이 권장됩니다. 내용이 많은 슬라이드는 2~3분, 제목이나 전환 슬라이드는 30초 정도가 적당합니다.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/" className="text-blue-600 hover:underline">← 홈으로</a>
        <a href="/tools/character-counter" className="text-blue-600 hover:underline">글자수 세기 →</a>
      </div>
    </section>
  );
}
