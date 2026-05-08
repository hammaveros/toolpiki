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

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔍 UUID 버전별 차이 자세히 보기
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          가장 자주 쓰이는 v1, v4, v7의 특성을 정리하면 선택 기준이 잡힙니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>v1 (시간 + MAC)</strong>: 생성 시간이 안에 들어가 있어 타임스탬프 추출이 가능합니다. 다만 기기 MAC 주소 일부가 노출돼 보안에 민감한 환경에서는 권장되지 않습니다.</li>
          <li><strong>v4 (랜덤)</strong>: 122비트 난수 기반으로 가장 보편적입니다. 추적 불가능하고 구현이 단순해서 대부분의 언어와 라이브러리가 기본값으로 채택했습니다. 이 도구도 v4를 사용합니다.</li>
          <li><strong>v7 (시간 + 랜덤)</strong>: 2024년 RFC 9562로 공식화된 최신 버전입니다. 앞부분에 밀리초 단위 유닉스 타임스탬프가 들어가 정렬 가능하고, 데이터베이스 인덱스 효율이 v4보다 좋습니다. 분산 시스템의 기본키로 점점 채택이 늘고 있습니다.</li>
          <li><strong>v5 (네임스페이스 해시)</strong>: 같은 네임스페이스+이름 조합에서 항상 같은 UUID가 나옵니다. URL이나 DNS 같은 입력값에서 결정론적 ID가 필요할 때 씁니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🆚 UUID vs GUID vs ULID 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">식별자</th>
                <th className="text-left py-2 px-2">길이</th>
                <th className="text-left py-2 px-2">정렬</th>
                <th className="text-left py-2 px-2">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">UUID</td><td>36자(하이픈 포함)</td><td>v7만 정렬 가능</td><td>RFC 표준, 가장 폭넓게 사용</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">GUID</td><td>36자</td><td>UUID와 동일</td><td>Microsoft 생태계 용어, 기술적으로는 UUID</td></tr>
              <tr><td className="py-2 px-2 font-medium">ULID</td><td>26자(Crockford Base32)</td><td>시간순 정렬 가능</td><td>UUID v7 등장 전 인기, 짧고 URL 친화적</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🛡️ 보안 고려사항
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          UUID는 "고유"하지만 "비밀스럽다"는 뜻은 아닙니다. 사용 위치에 따라 주의할 점이 다릅니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>비밀 토큰으로 부적합</strong>: 인증 토큰, 비밀번호 재설정 링크 등은 UUID 대신 충분한 엔트로피의 무작위 문자열(예: 32바이트 랜덤)을 사용하세요. UUID v4의 무작위 비트는 122비트라 충분해 보이지만, 의미상 "ID"이지 "시크릿"이 아닙니다.</li>
          <li><strong>예측 가능성</strong>: v1은 타임스탬프와 MAC을 노출하므로 공개 API 응답에 그대로 쓰지 않는 편이 좋습니다. v4와 v7의 랜덤 부분은 예측 불가능합니다.</li>
          <li><strong>열거 공격 방지</strong>: 자동 증가 ID 대신 UUID를 쓰면 /users/1, /users/2 같이 순차 추측이 불가능해 IDOR 같은 취약점에서 한 단계 보호막이 됩니다. 다만 이것만으로 권한 검증을 대체하면 안 됩니다.</li>
          <li><strong>로그/URL 노출</strong>: UUID는 검색엔진과 로그에 그대로 남을 수 있으니, 민감한 리소스에 대한 접근 권한은 별도 검증해야 합니다.</li>
          <li><strong>난수 출처</strong>: 이 도구는 브라우저의 <code>crypto.randomUUID()</code>를 사용해 OS 수준의 암호학적 난수 생성기를 활용합니다.</li>
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
          {
            question: 'DB 기본키로 UUID를 쓰면 성능이 나빠지지 않나요?',
            answer: 'v4처럼 무작위 UUID는 인덱스 페이지가 분산되어 쓰기 성능이 떨어질 수 있습니다. 대규모 테이블이 걱정된다면 시간순 정렬이 가능한 UUID v7이나 ULID를 검토해보세요. 인덱스 지역성이 자동 증가 ID에 가깝게 유지됩니다.',
          },
          {
            question: 'UUID를 인증 토큰으로 써도 되나요?',
            answer: '권장하지 않습니다. UUID v4의 122비트 난수는 무작위로 충분해 보이지만, "식별자"로 설계된 것이지 "비밀"로 설계된 것이 아닙니다. 세션 토큰이나 비밀번호 재설정 링크는 32바이트 이상의 별도 무작위 문자열을 만들어 쓰는 편이 안전합니다.',
          },
        ]}
      />
    </div>
  );
}
