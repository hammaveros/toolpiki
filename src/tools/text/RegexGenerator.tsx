'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/Textarea';

const presetPatterns = [
  { name: '이메일', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', example: 'test@example.com' },
  { name: '한국 전화번호', pattern: '^(010|011|016|017|018|019)-?\\d{3,4}-?\\d{4}$', example: '010-1234-5678' },
  { name: '한국 유선전화', pattern: '^(02|0[3-6][1-5])-?\\d{3,4}-?\\d{4}$', example: '02-123-4567' },
  { name: 'URL', pattern: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$', example: 'https://example.com' },
  { name: 'IPv4', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', example: '192.168.0.1' },
  { name: 'IPv6', pattern: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
  { name: '주민등록번호', pattern: '^\\d{6}-?[1-4]\\d{6}$', example: '900101-1234567' },
  { name: '사업자등록번호', pattern: '^\\d{3}-?\\d{2}-?\\d{5}$', example: '123-45-67890' },
  { name: '신용카드', pattern: '^\\d{4}-?\\d{4}-?\\d{4}-?\\d{4}$', example: '1234-5678-9012-3456' },
  { name: '우편번호 (5자리)', pattern: '^\\d{5}$', example: '12345' },
  { name: '날짜 (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', example: '2024-01-15' },
  { name: '시간 (HH:MM)', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$', example: '14:30' },
  { name: '한글만', pattern: '^[가-힣]+$', example: '홍길동' },
  { name: '영문만', pattern: '^[a-zA-Z]+$', example: 'Hello' },
  { name: '숫자만', pattern: '^\\d+$', example: '12345' },
  { name: '영문+숫자', pattern: '^[a-zA-Z0-9]+$', example: 'abc123' },
  { name: '비밀번호 (영문+숫자+특수 8자이상)', pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$', example: 'Pass123!' },
  { name: 'UUID', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', example: '550e8400-e29b-41d4-a716-446655440000' },
  { name: 'Hex 색상코드', pattern: '^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$', example: '#FF5733' },
  { name: 'HTML 태그', pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>', example: '<div>content</div>' },
];

export function RegexGenerator() {
  const [selectedPattern, setSelectedPattern] = useState(presetPatterns[0]);
  const [testInput, setTestInput] = useState('');
  const [customPattern, setCustomPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });

  const currentPattern = customPattern || selectedPattern.pattern;
  const flagString = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');

  const testResults = (() => {
    if (!testInput.trim()) return [];
    try {
      const regex = new RegExp(currentPattern, flagString);
      const lines = testInput.split('\n');
      return lines.map((line) => ({
        text: line,
        match: regex.test(line),
      }));
    } catch {
      return [];
    }
  })();

  const matchCount = testResults.filter((r) => r.match).length;

  return (
    <div className="space-y-4">
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          자주 사용하는 패턴
        </h3>
        <div className="flex flex-wrap gap-2">
          {presetPatterns.map((preset) => (
            <Button
              key={preset.name}
              variant={selectedPattern.name === preset.name && !customPattern ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setSelectedPattern(preset);
                setCustomPattern('');
              }}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </Card>

      <Card variant="bordered" className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              정규표현식 패턴
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPattern || selectedPattern.pattern}
                onChange={(e) => setCustomPattern(e.target.value)}
                className="flex-1 px-3 py-2 font-mono text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="정규표현식 입력..."
              />
              <CopyButton text={currentPattern} />
            </div>
            {!customPattern && (
              <p className="mt-1 text-xs text-gray-500">예시: {selectedPattern.example}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              플래그
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.g}
                  onChange={(e) => setFlags({ ...flags, g: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">g (전역)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.i}
                  onChange={(e) => setFlags({ ...flags, i: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">i (대소문자 무시)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.m}
                  onChange={(e) => setFlags({ ...flags, m: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">m (멀티라인)</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
            <span className="text-gray-500">/</span>
            <span className="text-blue-600 dark:text-blue-400">{currentPattern}</span>
            <span className="text-gray-500">/</span>
            <span className="text-green-600 dark:text-green-400">{flagString}</span>
          </div>
        </div>
      </Card>

      <Textarea
        label="테스트할 텍스트 (줄 단위로 검사)"
        value={testInput}
        onChange={(e) => setTestInput(e.target.value)}
        placeholder="테스트할 문자열을 입력하세요..."
        rows={6}
      />

      {testResults.length > 0 && (
        <Card variant="bordered" className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              테스트 결과
            </h3>
            <span className="text-sm text-gray-500">
              {matchCount}/{testResults.length} 매칭
            </span>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded font-mono text-sm ${
                  result.match
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
              >
                <span className="mr-2">{result.match ? '✓' : '✗'}</span>
                {result.text || '(빈 줄)'}
              </div>
            ))}
          </div>
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">🔍 정규표현식 생성기란?</h2>
        <p className="text-sm leading-relaxed">
          정규표현식(Regular Expression, Regex)은 문자열에서 특정 패턴을 찾거나 검증하기 위한 강력한 도구입니다.
          이메일 주소, 전화번호, URL, IP 주소 등 다양한 형식의 데이터를 검증할 때 필수적으로 사용됩니다.
          하지만 정규식 문법은 직관적이지 않아 매번 작성하기가 번거롭습니다.
          이 정규표현식 생성기는 20가지 이상의 자주 사용하는 프리셋 패턴을 제공하고, 직접 입력한 텍스트로 실시간 테스트까지 할 수 있어 개발 생산성을 크게 높여줍니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📋 자주 쓰는 정규식 패턴</h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">이메일 검증</h3>
            <p>
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{'}2,{'}'}$</code>
              {' '}— 영문, 숫자, 특수문자를 포함한 이메일 형식을 검증합니다. 회원가입 폼이나 데이터 정제에 가장 많이 사용되는 패턴 중 하나입니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">전화번호 검증</h3>
            <p>
              한국 휴대폰 번호(010-XXXX-XXXX)와 유선전화(02-XXX-XXXX) 패턴을 각각 지원합니다.
              하이픈(-) 유무에 관계없이 매칭되도록 설계되어 있어 사용자 입력값을 유연하게 검증할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">URL 및 IP 주소</h3>
            <p>
              HTTP/HTTPS 프로토콜을 포함한 URL 패턴과 IPv4(0.0.0.0 ~ 255.255.255.255), IPv6 주소 형식을 검증합니다.
              웹 크롤링이나 로그 분석 시 유용합니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">비밀번호 강도 검증</h3>
            <p>
              영문, 숫자, 특수문자를 각각 최소 1개 이상 포함하고 8자 이상인 비밀번호를 검증합니다.
              Lookahead(?=...)를 활용한 대표적인 정규식 활용 사례입니다.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">📖 정규식 기본 문법</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-800 dark:text-gray-200">문법</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-800 dark:text-gray-200">설명</th>
                <th className="text-left py-2 font-semibold text-gray-800 dark:text-gray-200">예시</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">.</td>
                <td className="py-2 pr-4">임의의 한 문자</td>
                <td className="py-2 font-mono">a.c → abc, a1c</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">*</td>
                <td className="py-2 pr-4">0회 이상 반복</td>
                <td className="py-2 font-mono">ab*c → ac, abc, abbc</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">+</td>
                <td className="py-2 pr-4">1회 이상 반복</td>
                <td className="py-2 font-mono">ab+c → abc, abbc</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">?</td>
                <td className="py-2 pr-4">0회 또는 1회</td>
                <td className="py-2 font-mono">colou?r → color, colour</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">\d</td>
                <td className="py-2 pr-4">숫자 (0-9)</td>
                <td className="py-2 font-mono">\d+ → 123, 456</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">\w</td>
                <td className="py-2 pr-4">영문, 숫자, 밑줄</td>
                <td className="py-2 font-mono">\w+ → hello_123</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4 font-mono">[abc]</td>
                <td className="py-2 pr-4">문자 클래스 (a 또는 b 또는 c)</td>
                <td className="py-2 font-mono">[aeiou] → 모음 매칭</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">^, $</td>
                <td className="py-2 pr-4">문자열 시작, 끝</td>
                <td className="py-2 font-mono">^abc$ → 정확히 abc</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">⚙️ 플래그(Flag) 설명</h2>
        <ul className="text-sm leading-relaxed space-y-2">
          <li><strong className="text-gray-800 dark:text-gray-200">g (global)</strong> — 첫 번째 매칭만이 아니라 문자열 전체에서 모든 매칭을 찾습니다.</li>
          <li><strong className="text-gray-800 dark:text-gray-200">i (case insensitive)</strong> — 대소문자를 구분하지 않고 매칭합니다. ABC와 abc를 동일하게 처리합니다.</li>
          <li><strong className="text-gray-800 dark:text-gray-200">m (multiline)</strong> — ^와 $가 전체 문자열이 아닌 각 줄의 시작과 끝에 매칭됩니다.</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '정규표현식이 뭔가요?', answer: '정규표현식(Regular Expression)은 문자열에서 특정 패턴을 검색, 매칭, 치환하기 위한 문법입니다. 프로그래밍 언어 대부분에서 지원하며, 데이터 검증이나 텍스트 처리에 널리 사용됩니다.' },
          { question: '프리셋 패턴은 수정할 수 있나요?', answer: '네, 프리셋 패턴을 선택한 후 패턴 입력창에서 직접 수정할 수 있습니다. 수정된 패턴은 즉시 테스트 결과에 반영됩니다.' },
          { question: '정규식 테스트는 어떻게 하나요?', answer: '패턴을 선택하거나 직접 입력한 뒤, 아래 테스트 영역에 검증할 문자열을 줄 단위로 입력하면 실시간으로 매칭 여부가 표시됩니다. 초록색은 매칭 성공, 빨간색은 매칭 실패입니다.' },
        ]}
      />
    </div>
  );
}
