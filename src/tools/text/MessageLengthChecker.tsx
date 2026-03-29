'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Button } from '@/components/ui/Button';

type MessageType = 'email' | 'slack' | 'sms' | 'kakaotalk';

interface LengthGuide {
  optimal: number;
  max: number;
  label: string;
}

const guides: Record<MessageType, LengthGuide> = {
  email: { optimal: 150, max: 500, label: '이메일' },
  slack: { optimal: 100, max: 300, label: '슬랙/팀즈' },
  sms: { optimal: 50, max: 70, label: 'SMS' },
  kakaotalk: { optimal: 100, max: 200, label: '카카오톡' },
};

export function MessageLengthChecker() {
  const [text, setText] = useState('');
  const [type, setType] = useState<MessageType>('email');

  const analysis = useMemo(() => {
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lineCount = text ? text.split('\n').length : 0;
    const guide = guides[type];

    // 적정성 판단
    let status: 'short' | 'optimal' | 'long' | 'too-long';
    let statusText: string;
    let statusColor: string;

    if (charCount === 0) {
      status = 'short';
      statusText = '입력해주세요';
      statusColor = 'text-gray-400';
    } else if (charCount < guide.optimal * 0.3) {
      status = 'short';
      statusText = '짧음';
      statusColor = 'text-yellow-600 dark:text-yellow-400';
    } else if (charCount <= guide.optimal) {
      status = 'optimal';
      statusText = '적정';
      statusColor = 'text-green-600 dark:text-green-400';
    } else if (charCount <= guide.max) {
      status = 'long';
      statusText = '약간 김';
      statusColor = 'text-orange-600 dark:text-orange-400';
    } else {
      status = 'too-long';
      statusText = '너무 김';
      statusColor = 'text-red-600 dark:text-red-400';
    }

    // 진행률 (max 기준)
    const progress = Math.min((charCount / guide.max) * 100, 100);
    const optimalProgress = (guide.optimal / guide.max) * 100;

    return {
      charCount,
      wordCount,
      lineCount,
      status,
      statusText,
      statusColor,
      progress,
      optimalProgress,
      guide,
    };
  }, [text, type]);

  const typeOptions: { value: MessageType; label: string }[] = [
    { value: 'email', label: '이메일' },
    { value: 'slack', label: '슬랙/팀즈' },
    { value: 'sms', label: 'SMS' },
    { value: 'kakaotalk', label: '카카오톡' },
  ];

  return (
    <div className="space-y-2">
      {/* 메시지 타입 선택 */}
      <div className="flex gap-2">
        {typeOptions.map((option) => (
          <Button
            key={option.value}
            variant={type === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setType(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* 텍스트 입력 */}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="메시지를 입력하세요..."
        rows={6}
      />

      {/* 결과 */}
      <Card variant="bordered" className="p-4">
        {/* 상태 표시 */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-2xl font-bold ${analysis.statusColor}`}>
            {analysis.statusText}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {analysis.charCount}자 / {analysis.guide.max}자
          </span>
        </div>

        {/* 프로그레스 바 */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {/* 적정 구간 표시 */}
          <div
            className="absolute top-0 h-full bg-green-200 dark:bg-green-900"
            style={{ width: `${analysis.optimalProgress}%` }}
          />
          {/* 현재 진행률 */}
          <div
            className={`absolute top-0 h-full transition-all duration-200 ${
              analysis.status === 'too-long'
                ? 'bg-red-500'
                : analysis.status === 'long'
                ? 'bg-orange-500'
                : analysis.status === 'optimal'
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${analysis.progress}%` }}
          />
        </div>

        {/* 기준 설명 */}
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>0</span>
          <span>적정 {analysis.guide.optimal}자</span>
          <span>최대 {analysis.guide.max}자</span>
        </div>

        {/* 상세 정보 */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">글자</p>
            <p className="font-medium">{analysis.charCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">단어</p>
            <p className="font-medium">{analysis.wordCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">줄</p>
            <p className="font-medium">{analysis.lineCount}</p>
          </div>
        </div>
      </Card>

      {/* 팁 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>• 이메일: 150자 이내 요약 → 본문 상세</p>
        <p>• 슬랙/팀즈: 스크롤 없이 읽히는 길이 권장</p>
        <p>• SMS: 70자 초과 시 장문 문자(LMS)로 전환</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">메시지 길이 체커란?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          메시지 길이 체커는 이메일, 슬랙/팀즈, SMS, 카카오톡 등 플랫폼별 권장 메시지 길이를 실시간으로 확인할 수 있는 도구입니다.
          각 플랫폼마다 효과적인 메시지 길이가 다릅니다. 이메일은 제목과 첫 문단 150자 이내로 핵심을 전달하는 것이 열람률을 높이고, 슬랙/팀즈는 스크롤 없이 읽을 수 있는 100자 내외가 이상적입니다.
          SMS의 경우 한글 기준 70자(영문 160자)를 초과하면 장문 문자(LMS)로 전환되어 요금이 달라질 수 있으므로 글자수를 정확히 파악하는 것이 중요합니다.
          카카오톡 메시지는 200자 이내가 가독성이 좋으며, 이를 초과하면 수신자가 메시지를 끝까지 읽지 않을 확률이 높아집니다.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">바이트와 글자수의 차이</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          SMS 발송 시 특히 중요한 것이 바이트(byte) 개념입니다. 한글 1자는 2바이트, 영문/숫자 1자는 1바이트로 계산됩니다.
          국내 SMS 기준 한글 70자(80바이트)까지가 단문 문자이며, 이를 초과하면 장문(LMS, 2,000바이트)으로 자동 전환됩니다.
          비즈니스 문자 발송, 마케팅 메시지, 알림톡 등을 작성할 때 글자수를 미리 체크하면 불필요한 비용 증가를 방지할 수 있습니다.
          본 도구는 글자수, 단어수, 줄 수를 동시에 분석하고, 적정/약간 김/너무 김 상태를 시각적으로 표시하여 직관적인 메시지 길이 관리를 돕습니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: 'SMS 단문과 장문의 기준은 무엇인가요?', answer: '국내 SMS 기준 한글 약 70자(80바이트)까지가 단문(SMS)이며, 이를 초과하면 장문(LMS)으로 전환됩니다. LMS는 최대 2,000바이트(한글 약 1,000자)까지 발송 가능합니다.' },
          { question: '이메일 제목의 적정 길이는 어느 정도인가요?', answer: '이메일 제목은 30~50자가 이상적입니다. 모바일에서는 약 30자까지만 표시되므로 핵심 키워드를 앞부분에 배치하는 것이 좋습니다.' },
          { question: '카카오톡 메시지 최대 글자수는 얼마인가요?', answer: '카카오톡 일반 메시지는 최대 10,000자까지 입력 가능하지만, 가독성을 위해 200자 이내로 작성하는 것을 권장합니다.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/" className="text-blue-600 hover:underline">← 홈으로</a>
        <a href="/tools/character-counter" className="text-blue-600 hover:underline">글자수 세기 →</a>
      </div>
    </section>
  );
}
