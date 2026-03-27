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
          Fake Data Generator는 개발 및 테스트용 더미 데이터를 빠르게 생성하는 도구입니다.
          이름, 이메일, 전화번호, 주소, 회사명, 직업, 날짜, 숫자, UUID, 텍스트 등 다양한 필드를 조합하여 현실적인 테스트 데이터를 만듭니다.
          JSON/CSV 형식으로 내보내기 가능하며, 한 번에 최대 100개의 레코드를 생성할 수 있습니다.
          실제 개인정보 없이 안전하게 개발/테스트 환경을 구축할 수 있습니다.
        </p>
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
        ]}
      />
    </div>
  );
}
