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
          JSON(JavaScript Object Notation)과 CSV(Comma-Separated Values)는 모두 데이터 저장/전송에 사용되는 포맷입니다.
          JSON은 API 통신에, CSV는 스프레드시트 작업에 주로 사용됩니다.
          이 도구는 두 형식을 양방향으로 변환하여 API 데이터를 엑셀에서 열거나,
          스프레드시트 데이터를 JSON으로 변환하여 웹 애플리케이션에서 사용할 수 있게 합니다.
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
          💡 활용 사례
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>REST API 응답을 CSV로 변환하여 엑셀에서 분석</li>
          <li>엑셀 데이터를 JSON으로 변환하여 웹앱에 업로드</li>
          <li>데이터베이스 덤프를 스프레드시트로 열기</li>
          <li>테스트 데이터 생성 및 포맷 변환</li>
        </ul>
      </section>

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
