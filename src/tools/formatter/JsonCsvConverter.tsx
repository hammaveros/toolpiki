'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { TwoColumnLayout } from '@/components/ui/TwoColumnLayout';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📊 JSON ↔ CSV 변환기란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">JSON과 CSV를 양방향으로 즉시 변환하는 도구입니다.</strong>{' '}
          <strong>JSON</strong>(JavaScript Object Notation)은 <strong>API 통신</strong>에,{' '}
          <strong>CSV</strong>(Comma-Separated Values)는 <strong>스프레드시트 작업</strong>에 주로 사용됩니다.
          API 데이터를 엑셀에서 열거나, 엑셀 데이터를 웹 애플리케이션에서 사용할 때 활용하세요.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 JSON vs CSV 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">항목</th>
                <th className="text-left py-2 px-2">JSON</th>
                <th className="text-left py-2 px-2">CSV</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">구조</td><td>계층적 (중첩 가능)</td><td>평면적 (표 형태)</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">타입 지원</td><td>숫자, 문자열, 불린, null, 배열, 객체</td><td>모두 문자열</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">가독성</td><td>개발자 친화적</td><td>엑셀 친화적</td></tr>
              <tr><td className="py-2 px-2">주요 용도</td><td>API, 설정파일</td><td>데이터 내보내기, 대량 업로드</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔄 변환 예시
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          같은 데이터가 두 포맷에서 어떻게 표현되는지 보면, 어느 쪽이 어떤 작업에 맞는지 바로 감이 옵니다.
          JSON 배열의 각 객체가 CSV 한 행이 되고, 객체의 키가 헤더 행이 됩니다.
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">JSON</p>
            <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`[
  { "id": 1, "name": "김철수", "dept": "개발", "active": true },
  { "id": 2, "name": "이영희", "dept": "디자인", "active": false }
]`}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">CSV</p>
            <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`id,name,dept,active
1,김철수,개발,true
2,이영희,디자인,false`}
            </pre>
          </div>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          값에 쉼표나 줄바꿈이 들어 있으면 자동으로 큰따옴표로 감싸집니다.
          예를 들어 주소 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">서울시 강남구, 101동</code>은
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">&quot;서울시 강남구, 101동&quot;</code>으로 출력됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          ⚠️ 변환에서 데이터가 깨지는 경우
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          두 포맷은 표현력이 다르기 때문에 변환 과정에서 정보가 손실될 수 있습니다. 자주 문제가 되는 것들입니다.
        </p>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>중첩 구조는 평면화되지 않음</strong> — 객체 안의 객체는 한 셀에 JSON 문자열로 들어갑니다. 표로 다루려면 미리 구조를 펼쳐야 합니다.</li>
          <li><strong>엑셀이 앞자리 0을 지움</strong> — 우편번호 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">06234</code>가 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">6234</code>가 됩니다. 엑셀에서 해당 열을 텍스트 서식으로 지정한 뒤 가져오세요.</li>
          <li><strong>긴 숫자가 지수 표기로 바뀜</strong> — 카드번호나 큰 ID가 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">1.23E+15</code>처럼 변합니다. 같은 이유로 텍스트 서식이 필요합니다.</li>
          <li><strong>한글이 깨짐</strong> — 엑셀에서 CSV를 그냥 열면 인코딩이 어긋날 수 있습니다. &quot;데이터 → 텍스트 가져오기&quot;에서 UTF-8을 지정하면 해결됩니다.</li>
          <li><strong>null과 빈 문자열 구분이 사라짐</strong> — CSV에서는 둘 다 빈 칸으로 보이므로, 되돌릴 때 의도와 달라질 수 있습니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 사례
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>REST API 응답</strong>을 CSV로 변환하여 엑셀에서 분석</li>
          <li><strong>엑셀 데이터</strong>를 JSON으로 변환하여 웹앱에 업로드</li>
          <li><strong>데이터베이스 덤프</strong>를 스프레드시트로 열기</li>
          <li><strong>테스트 데이터</strong> 생성 및 포맷 변환</li>
        </ul>
      </section>

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-4 text-sm">
        <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">💡 실무 팁</p>
        <p className="text-blue-800 dark:text-blue-300">
          중첩 구조 JSON은 CSV 변환 전에 <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-xs font-mono">flatten</code>으로 평면화하면 한 셀당 한 값으로 깔끔하게 떨어집니다.
          반대로 CSV → JSON 변환 시 <strong>true/false</strong>와 <strong>숫자</strong>는 자동 타입 추론됩니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '중첩된 JSON도 CSV로 변환되나요?',
            answer: '중첩된 객체/배열은 JSON 문자열로 직렬화되어 하나의 셀에 들어갑니다. 완전히 평면화하려면 사전에 JSON 구조를 단순화하세요.',
          },
          {
            question: 'CSV의 특수문자(쉼표, 따옴표)는 어떻게 처리되나요?',
            answer: '쉼표, 따옴표, 줄바꿈이 포함된 값은 자동으로 큰따옴표로 감싸지고, 내부 따옴표는 이중 따옴표("")로 이스케이프됩니다.',
          },
          {
            question: 'CSV를 JSON으로 변환할 때 타입은 어떻게 결정되나요?',
            answer: 'true/false는 불린, 숫자 형태는 Number로 자동 변환됩니다. 그 외는 문자열로 유지됩니다.',
          },
          {
            question: '엑셀에서 열었더니 한글이 깨져요.',
            answer: 'CSV를 더블클릭으로 열면 인코딩이 어긋날 수 있습니다. 엑셀의 "데이터 → 텍스트/CSV 가져오기"를 사용하고 원본 파일 형식을 UTF-8로 지정하면 정상적으로 표시됩니다.',
          },
          {
            question: '우편번호 앞의 0이 사라집니다.',
            answer: '엑셀이 숫자로 인식해 앞자리 0을 없애기 때문입니다. 가져오기 마법사에서 해당 열을 "텍스트" 서식으로 지정하면 그대로 유지됩니다. 카드번호처럼 긴 숫자가 지수 표기로 바뀌는 것도 같은 이유입니다.',
          },
          {
            question: '데이터가 서버로 전송되나요?',
            answer: '아니요. 변환은 브라우저 안에서만 처리되며 입력한 데이터가 서버로 전송되거나 저장되지 않습니다. 고객 데이터나 사내 자료도 안전하게 변환할 수 있습니다.',
          },
        ]}
      />
    </div>
  );
}

export function JsonCsvConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const [error, setError] = useState('');

  const jsonToCsv = (jsonStr: string): string => {
    const data = JSON.parse(jsonStr);
    const array = Array.isArray(data) ? data : [data];

    if (array.length === 0) return '';

    const keys = new Set<string>();
    array.forEach((obj) => {
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach((key) => keys.add(key));
      }
    });

    const headers = Array.from(keys);
    const csvRows = [headers.join(',')];

    array.forEach((obj) => {
      const values = headers.map((header) => {
        const val = obj[header];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') {
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }
        return JSON.stringify(val);
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const csvToJson = (csvStr: string): string => {
    const lines = csvStr.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV는 최소 헤더와 1개의 데이터 행이 필요합니다.');

    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
          if (char === '"') {
            if (line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            current += char;
          }
        } else {
          if (char === '"') {
            inQuotes = true;
          } else if (char === ',') {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
      }
      result.push(current);
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    const result = lines.slice(1).map((line) => {
      const values = parseCSVLine(line);
      const obj: Record<string, string | number | boolean> = {};
      headers.forEach((header, idx) => {
        const val = values[idx] || '';
        if (val === 'true') obj[header] = true;
        else if (val === 'false') obj[header] = false;
        else if (!isNaN(Number(val)) && val !== '') obj[header] = Number(val);
        else obj[header] = val;
      });
      return obj;
    });

    return JSON.stringify(result, null, 2);
  };

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'json-to-csv') {
        setOutput(jsonToCsv(input));
      } else {
        setOutput(csvToJson(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '변환 중 오류가 발생했습니다.');
      setOutput('');
    }
  };

  const handleSwap = () => {
    setMode(mode === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv');
    setInput(output);
    setOutput('');
    setError('');
  };

  const handleSample = () => {
    setError('');
    setOutput('');
    if (mode === 'json-to-csv') {
      const sample = [
        { id: 1, name: '홍길동', age: 30, city: '서울', active: true },
        { id: 2, name: '김철수', age: 25, city: '부산', active: false },
        { id: 3, name: '이영희', age: 28, city: '대구, 경북', active: true },
        { id: 4, name: '박민수', age: 35, city: '인천', active: true },
      ];
      setInput(JSON.stringify(sample, null, 2));
    } else {
      const sample = `id,name,age,city,active
1,홍길동,30,서울,true
2,김철수,25,부산,false
3,이영희,28,"대구, 경북",true
4,박민수,35,인천,true`;
      setInput(sample);
    }
  };

  return (
    <div className="space-y-2">
      {/* 모드 선택 탭 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
        <button
          onClick={() => setMode('json-to-csv')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'json-to-csv' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          JSON → CSV
        </button>
        <button
          onClick={() => setMode('csv-to-json')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'csv-to-json' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          CSV → JSON
        </button>
      </div>
      {/* 액션 버튼 */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleConvert}>변환</Button>
        <Button variant="secondary" onClick={handleSwap}>↔ 모드 전환</Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>초기화</Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* 2단 레이아웃 */}
      <TwoColumnLayout
        leftLabel={mode === 'json-to-csv' ? 'JSON' : 'CSV'}
        rightLabel={mode === 'json-to-csv' ? 'CSV' : 'JSON'}
        leftHeader={
          <Button variant="secondary" size="sm" onClick={handleSample}>
            예시 데이터
          </Button>
        }
        rightHeader={output ? <CopyButton text={output} /> : undefined}
        left={
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'json-to-csv'
                ? '[{"name": "홍길동", "age": 30}, {"name": "김철수", "age": 25}]'
                : 'name,age\n홍길동,30\n김철수,25'
            }
            rows={16}
            className="font-mono text-sm h-[400px]"
          />
        }
        right={
          <Textarea
            value={output}
            readOnly
            placeholder="변환 결과가 여기에 표시됩니다."
            rows={16}
            className="font-mono text-sm h-[400px] bg-gray-50 dark:bg-gray-800/50"
          />
        }
      />

      <SeoContent />
    </div>
  );
}
