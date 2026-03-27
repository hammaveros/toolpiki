'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';

export function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [format, setFormat] = useState<'default' | 'uppercase' | 'nodash'>('default');

  const generateUuid = useCallback((): string => {
    // crypto.randomUUID() 사용 (UUID v4)
    let uuid = crypto.randomUUID();

    switch (format) {
      case 'uppercase':
        uuid = uuid.toUpperCase();
        break;
      case 'nodash':
        uuid = uuid.replace(/-/g, '');
        break;
    }

    return uuid;
  }, [format]);

  const handleGenerate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUuid());
    }
    setUuids(newUuids);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  return (
    <div className="space-y-2">
      {/* 설정 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="생성 개수"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            형식
          </label>
          <div className="flex flex-wrap gap-2">
            <FormatButton
              active={format === 'default'}
              onClick={() => setFormat('default')}
            >
              기본
            </FormatButton>
            <FormatButton
              active={format === 'uppercase'}
              onClick={() => setFormat('uppercase')}
            >
              대문자
            </FormatButton>
            <FormatButton
              active={format === 'nodash'}
              onClick={() => setFormat('nodash')}
            >
              하이픈 제거
            </FormatButton>
          </div>
        </div>
      </div>

      {/* 생성 버튼 */}
      <Button variant="primary" onClick={handleGenerate} className="w-full sm:w-auto">
        UUID 생성
      </Button>

      {/* 결과 */}
      {uuids.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              생성된 UUID ({uuids.length}개)
            </p>
            {uuids.length > 1 && (
              <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                전체 복사
              </Button>
            )}
          </div>
          {uuids.map((uuid, index) => (
            <Card key={index} variant="bordered" className="p-3">
              <div className="flex items-center justify-between gap-3">
                <code className="text-sm font-mono text-gray-900 dark:text-white flex-1">
                  {uuid}
                </code>
                <CopyButton text={uuid} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 도움말 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>• UUID v4 (랜덤 UUID)를 생성합니다.</p>
        <p>• 브라우저의 crypto.randomUUID() API를 사용합니다.</p>
        <p>• 생성된 UUID는 전역적으로 고유합니다.</p>
      </div>

      <SeoContent />
    </div>
  );
}

function FormatButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors min-h-[36px] ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔑 UUID 생성기란?
        </h2>
        <p className="text-sm leading-relaxed">
          UUID(Universally Unique Identifier)는 전 세계적으로 고유한 128비트 식별자입니다.
          이 도구는 UUID 버전 4(랜덤)를 생성하며, 충돌 확률이 천문학적으로 낮아 실질적으로 고유합니다.
          데이터베이스 기본키, API 토큰, 세션 ID, 파일명 등 중복이 허용되지 않는 곳에 사용합니다.
          Web Crypto API를 사용해 암호학적으로 안전한 난수를 기반으로 생성합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 UUID 버전 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">버전</th>
                <th className="text-left py-2 px-2">생성 방식</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">v1</td><td>시간 + MAC 주소</td><td>생성 시간 추적 가능, 보안 우려</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">v4 ✓</td><td>랜덤 (이 도구)</td><td>가장 널리 사용, 추적 불가</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">v5</td><td>네임스페이스 + SHA-1</td><td>동일 입력 시 동일 UUID</td></tr>
              <tr><td className="py-2 px-2 font-medium">v7</td><td>시간 + 랜덤</td><td>정렬 가능, 최신 표준</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 UUID 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>DB 기본키</strong>: 자동 증가 ID 대신 UUID로 분산 시스템 지원</li>
          <li><strong>대문자/소문자</strong>: 스펙상 대소문자 구분 없음, 일관성 유지 권장</li>
          <li><strong>하이픈 제거</strong>: 32자 연속 문자열이 필요할 때 사용</li>
          <li><strong>URL 안전</strong>: UUID는 URL에 안전하게 포함 가능</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'UUID가 중복될 가능성이 있나요?',
            answer: 'UUID v4의 충돌 확률은 2^122분의 1로, 1초에 10억 개씩 85년간 생성해야 50% 확률입니다. 실질적으로 중복은 발생하지 않습니다.',
          },
          {
            question: 'GUID와 UUID의 차이는 뭔가요?',
            answer: 'GUID(Globally Unique Identifier)는 Microsoft의 용어로, UUID와 동일한 개념입니다. 형식과 생성 방식이 같습니다.',
          },
          {
            question: 'UUID 형식은 어떻게 되나요?',
            answer: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx 형식입니다. 4는 버전(v4)을 나타내고, y는 8, 9, a, b 중 하나입니다.',
          },
        ]}
      />
    </div>
  );
}
