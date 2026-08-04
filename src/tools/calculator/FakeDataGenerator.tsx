'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface DataField {
  key: string;
  type: FieldType;
  enabled: boolean;
}

type FieldType = 'name' | 'email' | 'phone' | 'address' | 'company' | 'job' | 'date' | 'number' | 'uuid' | 'lorem';

const fieldTypes: { type: FieldType; label: string; labelEn: string }[] = [
  { type: 'name', label: '이름', labelEn: 'Name' },
  { type: 'email', label: '이메일', labelEn: 'Email' },
  { type: 'phone', label: '전화번호', labelEn: 'Phone' },
  { type: 'address', label: '주소', labelEn: 'Address' },
  { type: 'company', label: '회사명', labelEn: 'Company' },
  { type: 'job', label: '직업', labelEn: 'Job' },
  { type: 'date', label: '날짜', labelEn: 'Date' },
  { type: 'number', label: '숫자', labelEn: 'Number' },
  { type: 'uuid', label: 'UUID', labelEn: 'UUID' },
  { type: 'lorem', label: '텍스트', labelEn: 'Lorem' },
];

const firstNames = ['김민준', '이서연', '박지호', '최수아', '정예준', '강하은', '조민서', '윤서준', '임지아', '한준우'];
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '임', '한'];
const domains = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net', 'outlook.com'];
const companies = ['삼성전자', '현대자동차', '네이버', '카카오', 'LG전자', 'SK하이닉스', 'KT', '포스코', '한화', 'CJ'];
const jobs = ['개발자', '디자이너', '마케터', '기획자', 'PM', '영업사원', '회계사', '변호사', '의사', '교사'];
const cities = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '수원', '성남', '고양'];
const loremWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor'];

function generateValue(type: FieldType): string {
  switch (type) {
    case 'name':
      return firstNames[Math.floor(Math.random() * firstNames.length)];
    case 'email': {
      const name = lastNames[Math.floor(Math.random() * lastNames.length)] + Math.floor(Math.random() * 1000);
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return `${name}@${domain}`;
    }
    case 'phone':
      return `010-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    case 'address':
      return `${cities[Math.floor(Math.random() * cities.length)]}시 ${Math.floor(Math.random() * 100) + 1}번길 ${Math.floor(Math.random() * 100) + 1}`;
    case 'company':
      return companies[Math.floor(Math.random() * companies.length)];
    case 'job':
      return jobs[Math.floor(Math.random() * jobs.length)];
    case 'date': {
      const year = 1980 + Math.floor(Math.random() * 44);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    case 'number':
      return String(Math.floor(Math.random() * 10000));
    case 'uuid':
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    case 'lorem': {
      const words = Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () =>
        loremWords[Math.floor(Math.random() * loremWords.length)]
      );
      return words.join(' ') + '.';
    }
    default:
      return '';
  }
}

export function FakeDataGenerator() {
  const [fields, setFields] = useState<DataField[]>([
    { key: 'name', type: 'name', enabled: true },
    { key: 'email', type: 'email', enabled: true },
    { key: 'phone', type: 'phone', enabled: true },
    { key: 'address', type: 'address', enabled: false },
    { key: 'company', type: 'company', enabled: false },
  ]);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [data, setData] = useState<Record<string, string>[]>([]);

  const generate = useCallback(() => {
    const enabledFields = fields.filter(f => f.enabled);
    const result: Record<string, string>[] = [];

    for (let i = 0; i < count; i++) {
      const row: Record<string, string> = {};
      for (const field of enabledFields) {
        row[field.key] = generateValue(field.type);
      }
      result.push(row);
    }

    setData(result);
  }, [fields, count]);

  const toggleField = (key: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  const addField = (type: FieldType) => {
    const existing = fields.filter(f => f.type === type).length;
    const key = existing > 0 ? `${type}${existing + 1}` : type;
    setFields(prev => [...prev, { key, type, enabled: true }]);
  };

  const removeField = (key: string) => {
    setFields(prev => prev.filter(f => f.key !== key));
  };

  const output = format === 'json'
    ? JSON.stringify(data, null, 2)
    : data.length > 0
      ? [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n')
      : '';

  const downloadData = () => {
    const blob = new Blob([output], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fake-data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 필드 선택 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">데이터 필드</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {fields.map(field => (
            <div
              key={field.key}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                field.enabled
                  ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
                  : 'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
              }`}
              onClick={() => toggleField(field.key)}
            >
              <span className="text-sm">{fieldTypes.find(f => f.type === field.type)?.label} ({field.key})</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeField(field.key); }}
                className="text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">필드 추가:</span>
          {fieldTypes.map(ft => (
            <Button
              key={ft.type}
              variant="secondary"
              size="sm"
              onClick={() => addField(ft.type)}
            >
              + {ft.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* 설정 */}
      <Card variant="bordered" className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">개수</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-24 px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">출력 형식</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
              className="px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div className="flex-1" />
          <Button variant="primary" onClick={generate}>
            생성하기
          </Button>
        </div>
      </Card>

      {/* 결과 */}
      {data.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              결과 ({data.length}개)
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={downloadData}>
                다운로드
              </Button>
              <CopyButton text={output} />
            </div>
          </div>
          <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto max-h-96">
            {output}
          </pre>
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
          🎲 Fake Data Generator란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">Fake Data Generator는 개발 및 테스트용 더미 데이터를 빠르게 생성하는 도구입니다.</strong>{' '}
          <strong>이름, 이메일, 전화번호, 주소, 회사명, 직업, 날짜, 숫자, UUID, 텍스트</strong> 등 다양한 필드를 조합해 현실적인 테스트 데이터를 만듭니다.
          <strong>JSON/CSV 형식</strong>으로 내보내기 가능하며, 한 번에 <strong>최대 100개의 레코드</strong>를 생성할 수 있습니다.
          <strong>실제 개인정보 없이</strong> 안전하게 개발/테스트 환경을 구축할 수 있습니다.
        </p>

        <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
          <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 핵심 포인트</p>
          <p className="text-blue-800 dark:text-blue-300">실제 사용자 데이터 없이 <strong>현실적인 더미 데이터</strong>를 만들어 GDPR·개인정보보호법 위반 위험을 피하세요.</p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 지원 필드 유형
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">필드</th>
                <th className="text-left py-2 px-2">생성 형식</th>
                <th className="text-left py-2 px-2">활용 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">이름</td><td>한글 성+이름</td><td>사용자 목록</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">이메일</td><td>랜덤@도메인</td><td>회원가입 테스트</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">전화번호</td><td>010-XXXX-XXXX</td><td>연락처 DB</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">주소</td><td>도시+번길+번지</td><td>배송 테스트</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-medium">UUID</td><td>v4 UUID</td><td>고유 식별자</td></tr>
              <tr><td className="py-2 px-2 font-medium">Lorem</td><td>랜덤 문장</td><td>콘텐츠 더미</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🧪 좋은 테스트 데이터의 조건
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          &quot;홍길동, 010-1234-5678&quot; 같은 반듯한 데이터만 넣고 테스트하면 실제 서비스에서 터집니다.
          <strong>경계값과 예외 케이스</strong>가 섞여 있어야 의미 있는 검증이 됩니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>아주 긴 이름·주소</strong> — 레이아웃이 깨지거나 말줄임 처리가 필요한 지점을 찾을 수 있습니다.</li>
          <li><strong>한 글자 이름</strong> — 최소 길이 검증이 지나치게 엄격하지 않은지 확인합니다.</li>
          <li><strong>정렬 확인용 데이터</strong> — 가나다순, 숫자순 정렬이 의도대로 되는지 봅니다. 숫자를 문자열로 정렬하면 10이 2보다 앞에 옵니다.</li>
          <li><strong>날짜 경계</strong> — 월말, 연말, 윤년 2월 29일이 포함되면 날짜 계산 버그가 드러납니다.</li>
          <li><strong>빈 값과 null</strong> — 선택 입력 항목이 비어 있을 때 화면이 깨지지 않는지 확인합니다.</li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          데이터 양도 중요합니다. 10건으로는 멀쩡하던 목록 화면이 <strong>1,000건에서 느려지는</strong> 경우가 흔합니다.
          페이지네이션과 검색 성능은 충분한 양으로 확인해야 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔒 실제 데이터를 쓰면 안 되는 이유
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          개발·테스트 환경에 운영 DB를 복사해 쓰는 관행은 여전히 흔하지만, 위험이 큽니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>개인정보 유출 경로</strong> — 개발 서버는 보안 수준이 낮은 경우가 많고, 접근 권한도 넓게 열려 있습니다.</li>
          <li><strong>실수로 발송되는 알림</strong> — 테스트 중 실제 고객에게 문자나 메일이 나가는 사고가 대표적입니다.</li>
          <li><strong>법적 문제</strong> — 개인정보는 수집 목적 범위에서만 사용해야 하며, 테스트 용도 전용은 여기에 해당하지 않을 수 있습니다.</li>
          <li><strong>화면 캡처·시연</strong> — 데모나 문서에 실명·연락처가 그대로 노출되는 일이 생깁니다.</li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          형식만 현실적이면 테스트 목적은 충분히 달성됩니다.
          운영 데이터를 꼭 써야 한다면 이름·연락처를 치환한 <strong>비식별 처리</strong>를 거치는 것이 원칙입니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>API 테스트</strong>: 대량의 회원 데이터로 성능 테스트</li>
          <li><strong>UI 개발</strong>: 다양한 길이의 이름/주소로 레이아웃 확인</li>
          <li><strong>데모 환경</strong>: 고객에게 보여줄 샘플 데이터 준비</li>
          <li><strong>DB 초기화</strong>: 개발 환경 시드 데이터 생성</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '생성된 데이터는 실제 정보인가요?',
            answer: '아닙니다. 모든 데이터는 무작위로 조합된 가짜 데이터입니다. 이메일 도메인, 전화번호 형식만 실제와 유사할 뿐 실존 인물/기업과 무관합니다.',
          },
          {
            question: 'JSON과 CSV 중 어떤 형식을 선택해야 하나요?',
            answer: 'API 개발이나 프로그래밍에는 JSON이, 엑셀이나 데이터베이스 임포트에는 CSV가 적합합니다. 두 형식 모두 대부분의 환경에서 지원됩니다.',
          },
          {
            question: '같은 필드를 여러 개 추가할 수 있나요?',
            answer: '네, 동일한 타입의 필드를 여러 개 추가할 수 있습니다. 예를 들어 이메일 필드를 2개 추가하면 email, email2 키로 각각 다른 값이 생성됩니다.',
          },
          {
            question: '테스트에 실제 운영 데이터를 쓰면 안 되나요?',
            answer: '권장하지 않습니다. 개발 환경은 보안 수준이 낮고, 테스트 중 실제 고객에게 알림이 발송되는 사고도 흔합니다. 개인정보를 목적 외로 사용하는 문제도 있어 가짜 데이터를 쓰는 편이 안전합니다.',
          },
          {
            question: '생성한 데이터가 서버에 저장되나요?',
            answer: '아니요. 데이터 생성과 내보내기 모두 브라우저 안에서 처리되며 서버로 전송되거나 저장되지 않습니다.',
          },
          {
            question: '100개보다 더 많이 필요하면 어떻게 하나요?',
            answer: '여러 번 생성해 합치거나, 내보낸 JSON/CSV를 스크립트로 반복 처리하는 방법이 있습니다. 성능 테스트처럼 수만 건이 필요한 경우에는 별도의 생성 스크립트를 작성하는 편이 효율적입니다.',
          },
        ]}
      />
    </div>
  );
}
