'use client';

import { useState, useMemo, useEffect } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Button } from '@/components/ui/Button';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { encodeShareData, decodeShareData } from '@/lib/utils/share-encoding';

interface ShareData {
  text: string;
}

type ViewMode = 'basic' | 'seo' | 'platform';

interface PlatformLimit {
  name: string;
  limit: number;
  type: 'char' | 'byte';
  description: string;
}

const PLATFORM_LIMITS: PlatformLimit[] = [
  { name: '트위터/X', limit: 280, type: 'char', description: '트윗 최대 길이' },
  { name: '인스타그램 캡션', limit: 2200, type: 'char', description: '게시물 캡션' },
  { name: '인스타그램 바이오', limit: 150, type: 'char', description: '프로필 소개' },
  { name: '페이스북 게시물', limit: 63206, type: 'char', description: '게시물 최대 길이' },
  { name: '유튜브 제목', limit: 100, type: 'char', description: '영상 제목' },
  { name: '유튜브 설명', limit: 5000, type: 'char', description: '영상 설명' },
  { name: '메타 제목', limit: 60, type: 'char', description: 'SEO 타이틀 태그' },
  { name: '메타 설명', limit: 160, type: 'char', description: 'SEO 메타 설명' },
  { name: 'SMS', limit: 90, type: 'byte', description: '한글 기준 문자메시지' },
  { name: '카카오톡 프로필', limit: 60, type: 'char', description: '상태 메시지' },
];

export function CharacterCounter() {
  const [text, setText] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('basic');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFromShare, setIsFromShare] = useState(false);

  // URL hash에서 공유 데이터 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const encoded = hash.slice(7);
        const parsed = decodeShareData<ShareData>(encoded);
        if (parsed.text) {
          setText(parsed.text);
          setIsFromShare(true);
        }
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, []);

  // 공유 URL 생성
  const getShareUrl = () => {
    if (typeof window === 'undefined' || !text.trim()) return '';
    try {
      const data: ShareData = { text };
      const encoded = encodeShareData(data);
      const baseUrl = window.location.href.split('#')[0];
      return `${baseUrl}#share=${encoded}`;
    } catch {
      return '';
    }
  };

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?。！？]+/).filter((s) => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim()).length;
    const lines = text ? text.split('\n').length : 0;
    const bytes = new Blob([text]).size;

    // SEO 관련 통계
    const avgSentenceLength = sentences > 0 ? Math.round(words / sentences) : 0;
    const readingTimeMin = Math.ceil(words / 200); // 200 WPM 기준
    const koreanRatio = text.length > 0
      ? Math.round((text.match(/[\uAC00-\uD7AF]/g)?.length || 0) / text.length * 100)
      : 0;

    return {
      chars, charsNoSpace, words, sentences, paragraphs, lines, bytes,
      avgSentenceLength, readingTimeMin, koreanRatio
    };
  }, [text]);

  const handleClear = () => setText('');

  const handleExample = () => {
    setText(`안녕하세요! ToolPiki 글자수 세기 도구입니다.

이 도구는 텍스트의 글자수, 단어수, 문장수를 실시간으로 계산합니다. 블로그 글, 자기소개서, SNS 게시물 작성 시 글자수 제한 확인에 유용합니다.

English text is also supported! The byte count differs between Korean (3 bytes) and English (1 byte).`);
  };

  const modeLabels: Record<ViewMode, string> = {
    basic: '기본 통계',
    seo: 'SEO 분석',
    platform: '플랫폼별',
  };

  return (
    <div className="space-y-4">
      {/* 입력 영역 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            텍스트 입력
          </label>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExample}>
              예시 입력
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              지우기
            </Button>
          </div>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="글자수를 세고 싶은 텍스트를 입력하세요..."
          rows={8}
        />
      </div>

      {/* 모드 선택 탭 */}
      <Card variant="bordered" className="p-2">
        <div className="flex gap-1">
          {(['basic', 'seo', 'platform'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                viewMode === m
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </Card>

      {/* 기본 통계 */}
      {viewMode === 'basic' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="글자수" value={stats.chars} highlight />
          <StatCard label="공백 제외" value={stats.charsNoSpace} />
          <StatCard label="단어수" value={stats.words} />
          <StatCard label="문장수" value={stats.sentences} />
          <StatCard label="문단수" value={stats.paragraphs} />
          <StatCard label="줄 수" value={stats.lines} />
          <StatCard label="바이트" value={stats.bytes} unit="B" />
          <StatCard label="읽기 시간" value={stats.readingTimeMin} unit="분" />
        </div>
      )}

      {/* SEO 분석 */}
      {viewMode === 'seo' && (
        <div className="space-y-4">
          {/* 메타 태그 분석 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-semibold mb-3">메타 태그 분석</h3>
            <div className="space-y-3">
              <SeoMeter
                label="제목 태그 (50~60자 권장)"
                current={stats.chars}
                min={50}
                max={60}
                limit={70}
              />
              <SeoMeter
                label="메타 설명 (150~160자 권장)"
                current={stats.chars}
                min={150}
                max={160}
                limit={170}
              />
            </div>
          </Card>

          {/* 가독성 분석 */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-semibold mb-3">가독성 분석</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.avgSentenceLength}
                </div>
                <div className="text-sm text-gray-500">평균 문장 길이</div>
                <div className={`text-xs mt-1 ${
                  stats.avgSentenceLength <= 20
                    ? 'text-green-600'
                    : stats.avgSentenceLength <= 30
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}>
                  {stats.avgSentenceLength <= 20 ? '적절함' : stats.avgSentenceLength <= 30 ? '조금 긺' : '너무 긺'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.readingTimeMin}분
                </div>
                <div className="text-sm text-gray-500">예상 읽기 시간</div>
                <div className="text-xs text-gray-400 mt-1">200 WPM 기준</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.koreanRatio}%
                </div>
                <div className="text-sm text-gray-500">한글 비율</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.paragraphs}
                </div>
                <div className="text-sm text-gray-500">문단 수</div>
              </div>
            </div>
          </Card>

          {/* SEO 팁 */}
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">SEO 작성 팁</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>제목 태그는 50~60자로 핵심 키워드 포함</li>
              <li>메타 설명은 150~160자로 클릭 유도 문구 작성</li>
              <li>평균 문장 길이는 20단어 이하가 가독성 좋음</li>
              <li>문단은 3~4문장으로 적절히 나누기</li>
            </ul>
          </div>
        </div>
      )}

      {/* 플랫폼별 */}
      {viewMode === 'platform' && (
        <div className="space-y-2">
          {PLATFORM_LIMITS.map((platform) => {
            const current = platform.type === 'byte' ? stats.bytes : stats.chars;
            const percent = Math.min(100, (current / platform.limit) * 100);
            const isOver = current > platform.limit;

            return (
              <Card key={platform.name} variant="bordered" className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-medium text-sm">{platform.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {platform.description}
                    </span>
                  </div>
                  <div className={`text-sm font-mono ${isOver ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    {current.toLocaleString()} / {platform.limit.toLocaleString()}
                    {platform.type === 'byte' ? 'B' : '자'}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOver
                        ? 'bg-red-500'
                        : percent > 90
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
                {isOver && (
                  <p className="text-xs text-red-600 mt-1">
                    {current - platform.limit}{platform.type === 'byte' ? 'B' : '자'} 초과
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* 결과 공유 */}
      <ResultShareButtons
        url={getShareUrl()}
        title={`글자수: ${stats.chars}자`}
        description={`단어 ${stats.words}개, 문장 ${stats.sentences}개`}
        visible={text.trim().length > 0}
      />

      {/* 도움말 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• 글자수: 공백을 포함한 전체 문자 수</p>
        <p>• 바이트: UTF-8 기준 (한글 3B, 영어 1B)</p>
        <p>• 읽기 시간: 분당 200단어 기준 추정</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoMeter({
  label,
  current,
  min,
  max,
  limit
}: {
  label: string;
  current: number;
  min: number;
  max: number;
  limit: number;
}) {
  const getStatus = () => {
    if (current === 0) return { color: 'gray', text: '입력 대기' };
    if (current < min) return { color: 'yellow', text: '너무 짧음' };
    if (current >= min && current <= max) return { color: 'green', text: '적절함' };
    if (current > max && current <= limit) return { color: 'yellow', text: '조금 긺' };
    return { color: 'red', text: '너무 긺' };
  };

  const status = getStatus();
  const percent = Math.min(100, (current / limit) * 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className={`font-medium text-${status.color}-600`}>
          {current}자 - {status.text}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
        {/* 권장 범위 표시 */}
        <div
          className="absolute h-full bg-green-200 dark:bg-green-900"
          style={{
            left: `${(min / limit) * 100}%`,
            width: `${((max - min) / limit) * 100}%`
          }}
        />
        {/* 현재 위치 */}
        <div
          className={`h-full transition-all duration-300 ${
            status.color === 'green'
              ? 'bg-green-500'
              : status.color === 'yellow'
                ? 'bg-yellow-500'
                : status.color === 'red'
                  ? 'bg-red-500'
                  : 'bg-gray-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📝 글자수 세기란?
        </h2>
        <p className="text-sm leading-relaxed">
          글자수 세기는 입력한 텍스트의 글자수, 단어수, 문장수, 문단수, 바이트 수를 실시간으로 계산하는 도구입니다.
          트위터(280자), 인스타그램(2,200자), 네이버 블로그 제목(100자) 등 플랫폼별 글자수 제한을 확인하거나,
          SEO 메타 태그(title 60자, description 160자)를 최적화할 때 유용합니다.
          공백 포함/미포함 글자수를 동시에 확인할 수 있어, 원고 작성이나 과제 제출에도 활용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 주요 플랫폼 글자수 제한
        </h2>
        <div className="text-sm leading-relaxed space-y-1">
          <p><strong>트위터(X):</strong> 280자 (한글 기준 140자 상당)</p>
          <p><strong>인스타그램 캡션:</strong> 2,200자</p>
          <p><strong>유튜브 제목:</strong> 100자 (권장 60자)</p>
          <p><strong>네이버 블로그 제목:</strong> 100자</p>
          <p><strong>카카오톡 프로필:</strong> 60자</p>
          <p><strong>SEO Title:</strong> 60자 내외</p>
          <p><strong>SEO Description:</strong> 155~160자</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 바이트 계산 기준
        </h2>
        <p className="text-sm leading-relaxed">
          한글은 UTF-8 기준 3바이트, 영어/숫자는 1바이트로 계산됩니다.
          SMS 발송 시 한글 70자(EUC-KR 기준), 영문 160자가 1건에 해당하며,
          이를 초과하면 LMS(2,000바이트)로 전환됩니다.
          데이터베이스 필드 크기나 API 요청 제한을 확인할 때도 바이트 수 확인이 필요합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 자기소개서/입사지원서 글자수 기준
        </h2>
        <div className="text-sm leading-relaxed space-y-1">
          <p><strong>삼성그룹:</strong> 항목당 300~700자 (공백 포함)</p>
          <p><strong>현대자동차:</strong> 항목당 500~1,000자</p>
          <p><strong>LG그룹:</strong> 항목당 500자 내외</p>
          <p><strong>SK그룹:</strong> 항목당 400~800자</p>
          <p><strong>대학 입시 자소서:</strong> 항목당 1,000~1,500자</p>
          <p><strong>공무원 자소서:</strong> 항목당 200~500자</p>
          <p className="text-xs text-gray-500 mt-2">※ 기업/학교마다 다르므로 반드시 공고를 확인하세요.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎯 글자수 세기가 필요한 순간
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>자기소개서 작성</strong>: 채용 공고의 글자수 제한에 맞춰야 할 때</li>
          <li><strong>SNS 게시글</strong>: 인스타그램 캡션(2,200자), 트위터(280자) 등 제한 확인</li>
          <li><strong>블로그 글</strong>: SEO에 유리한 본문 길이(1,500~3,000자) 확인</li>
          <li><strong>문자 발송</strong>: SMS(70자)/LMS(2,000바이트) 구분 확인</li>
          <li><strong>유튜브 제목</strong>: 검색 노출에 최적인 60자 이내 확인</li>
          <li><strong>논문/보고서</strong>: 초록(Abstract) 글자수 제한 확인</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '공백도 글자수에 포함되나요?',
            answer: '기본적으로 공백이 포함됩니다. 공백을 제외한 글자수도 함께 표시되므로 필요에 따라 확인할 수 있습니다.',
          },
          {
            question: '한글과 영어 글자수가 다르게 계산되나요?',
            answer: '글자수는 동일하게 1자로 계산됩니다. 다만 바이트 수는 다릅니다. 한글은 3바이트(UTF-8), 영어는 1바이트입니다.',
          },
          {
            question: '자소서에서 공백 포함/미포함 어떤 걸 봐야 하나요?',
            answer: '대부분의 채용 공고는 "공백 포함" 기준입니다. 특별한 명시가 없으면 공백 포함 글자수로 작성하세요.',
          },
          {
            question: '줄바꿈도 글자수에 포함되나요?',
            answer: '줄바꿈 문자는 글자수에 포함되지 않지만, 바이트 수에는 포함될 수 있습니다. 문단수는 빈 줄을 기준으로 계산됩니다.',
          },
        ]}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  unit = '',
  highlight = false,
}: {
  label: string;
  value: number;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <Card
      variant="bordered"
      className={`p-4 text-center ${
        highlight ? 'border-blue-500 dark:border-blue-400' : ''
      }`}
    >
      <div
        className={`text-2xl md:text-3xl font-bold ${
          highlight
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-900 dark:text-white'
        }`}
      >
        {value.toLocaleString()}
        {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </div>
    </Card>
  );
}
