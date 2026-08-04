'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { TwoColumnLayout } from '@/components/ui/TwoColumnLayout';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📄 XML 포맷터란?
        </h2>
        <p className="text-sm leading-relaxed">
          <strong className="text-gray-900 dark:text-white">XML을 계층 구조에 맞춰 정렬·압축하고 유효성까지 검사합니다.</strong>{' '}
          <strong>1~8칸 들여쓰기</strong>로 가독성을 높이거나, 공백을 제거해 용량을 줄입니다.
          <strong>API 응답 분석</strong>, 설정 파일(<code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">pom.xml</code>, <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">web.xml</code>) 편집,
          <strong> SOAP 디버깅</strong>, RSS/Atom 피드 확인 등 다양한 작업에 활용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔧 주요 기능
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">포맷팅 (Prettify)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              1~8칸 들여쓰기로 계층 구조를 시각화
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">압축 (Minify)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              공백과 줄바꿈 제거로 용량 최소화
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">유효성 검사</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              well-formed XML 여부 자동 확인
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">복사 기능</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              결과를 클립보드에 바로 복사
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 XML vs JSON 비교
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">항목</th>
                <th className="text-left py-2 px-2">XML</th>
                <th className="text-left py-2 px-2">JSON</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">가독성</td><td>태그로 명확</td><td>간결함</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">용량</td><td>크다</td><td>작다</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2">속성</td><td>지원</td><td>미지원</td></tr>
              <tr><td className="py-2 px-2">주석</td><td>지원</td><td>미지원</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📄 포맷팅 전후 비교
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          API 응답이나 로그에서 가져온 XML은 대개 한 줄로 붙어 있어 구조가 보이지 않습니다.
          들여쓰기만 넣어도 어떤 요소가 어디에 속하는지 즉시 드러납니다.
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">입력 (한 줄)</p>
            <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`<order id="1001"><customer><name>홍길동</name><email>hong@example.com</email></customer><items><item sku="A-01"><qty>2</qty><price>15000</price></item></items></order>`}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">출력 (2칸 들여쓰기)</p>
            <pre className="p-3 rounded bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto">
{`<order id="1001">
  <customer>
    <name>홍길동</name>
    <email>hong@example.com</email>
  </customer>
  <items>
    <item sku="A-01">
      <qty>2</qty>
      <price>15000</price>
    </item>
  </items>
</order>`}
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🔤 XML 이스케이프 문자
        </h2>
        <p className="text-sm leading-relaxed mb-3">
          아래 5개 문자는 XML 문법에서 특별한 의미를 가지므로, 값으로 쓰려면 반드시 치환해야 합니다.
          파싱 오류의 상당수가 여기서 발생합니다.
        </p>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">문자</th>
                <th className="text-left py-2 px-2">이스케이프</th>
                <th className="text-left py-2 px-2">이름</th>
                <th className="text-left py-2 px-2">필수 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">&lt;</td><td className="font-mono">&amp;lt;</td><td>less than</td><td>항상 필수</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">&amp;</td><td className="font-mono">&amp;amp;</td><td>ampersand</td><td>항상 필수</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">&gt;</td><td className="font-mono">&amp;gt;</td><td>greater than</td><td>권장</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">&quot;</td><td className="font-mono">&amp;quot;</td><td>quote</td><td>속성값 안에서 필수</td></tr>
              <tr><td className="py-2 px-2 font-mono">&#39;</td><td className="font-mono">&amp;apos;</td><td>apostrophe</td><td>속성값 안에서 필수</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed mt-3">
          이스케이프할 문자가 너무 많다면 <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">{`<![CDATA[ ... ]]>`}</code>로 감싸는 편이 깔끔합니다.
          HTML 조각이나 스크립트를 XML 안에 넣을 때 주로 씁니다.
        </p>
      </section>

      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 p-4 text-sm">
        <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">⚠️ 자주 하는 실수</p>
        <p className="text-amber-800 dark:text-amber-300">
          XML은 <strong>대소문자를 구분</strong>합니다. <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-xs font-mono">{`<Item>`}</code>과 <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-xs font-mono">{`</item>`}</code>은 <strong>다른 태그</strong>로 인식되어 파싱이 실패합니다.
          또한 <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-xs font-mono">{`<`}</code>, <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-xs font-mono">{`&`}</code>는 반드시 <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-xs font-mono">&amp;lt;</code>, <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-xs font-mono">&amp;amp;</code>로 이스케이프해야 합니다.
        </p>
      </div>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'well-formed XML과 valid XML의 차이는?',
            answer: 'well-formed는 문법적으로 올바른 XML(태그 열고 닫기, 대소문자 일치 등)이고, valid는 DTD나 XSD 스키마를 만족하는 XML입니다. 이 도구는 well-formed 여부를 검사합니다.',
          },
          {
            question: 'XML 선언(<?xml ...?>)은 꼭 필요한가요?',
            answer: '필수는 아니지만 권장됩니다. 인코딩을 명시하지 않으면 기본값(UTF-8)이 적용되며, 다른 인코딩 사용 시 반드시 선언해야 합니다.',
          },
          {
            question: 'CDATA 섹션은 언제 사용하나요?',
            answer: 'HTML이나 특수문자(<, >, &)가 포함된 텍스트를 이스케이프 없이 그대로 넣고 싶을 때 <![CDATA[ ... ]]>로 감쌉니다.',
          },
          {
            question: '입력한 XML이 서버로 전송되나요?',
            answer: '아니요. 파싱과 포맷팅 모두 브라우저 안에서 처리되며 내용이 서버로 전송되거나 저장되지 않습니다. 사내 설정 파일이나 API 응답도 안전하게 붙여넣을 수 있습니다.',
          },
          {
            question: '"엔티티를 찾을 수 없다"는 오류가 나요.',
            answer: '값 안에 &가 그대로 들어간 경우가 대부분입니다. XML에서 &는 엔티티 시작 문자라 반드시 &amp;로 써야 합니다. URL의 쿼리스트링을 그대로 넣을 때 자주 발생합니다.',
          },
          {
            question: '압축(Minify)하면 XML 의미가 바뀌지 않나요?',
            answer: '태그 사이의 들여쓰기용 공백만 제거하므로 구조는 그대로입니다. 다만 요소 내부 텍스트의 공백이 의미를 갖는 문서라면 결과를 한 번 확인하는 것이 좋습니다.',
          },
        ]}
      />
    </div>
  );
}

export function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState('');

  const formatXml = (xml: string, indent: number): string => {
    const PADDING = ' '.repeat(indent);
    let formatted = '';
    let pad = 0;

    const nodes = xml
      .replace(/>\s*</g, '><')
      .replace(/</g, '~<')
      .replace(/>/g, '>~')
      .split('~')
      .filter((n) => n.trim());

    nodes.forEach((node) => {
      if (node.match(/^<\?/)) {
        formatted += node + '\n';
      } else if (node.match(/^<\//)) {
        pad--;
        formatted += PADDING.repeat(pad) + node + '\n';
      } else if (node.match(/\/>$/)) {
        formatted += PADDING.repeat(pad) + node + '\n';
      } else if (node.match(/^</)) {
        formatted += PADDING.repeat(pad) + node + '\n';
        pad++;
      } else {
        formatted += PADDING.repeat(pad) + node + '\n';
      }
    });

    return formatted.trim();
  };

  const minifyXml = (xml: string): string => {
    return xml
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleFormat = () => {
    setError('');
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('유효하지 않은 XML입니다.');
      }
      setOutput(formatXml(input, indentSize));
    } catch (e) {
      setError(e instanceof Error ? e.message : '포맷팅 중 오류가 발생했습니다.');
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      setOutput(minifyXml(input));
    } catch {
      setError('압축 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-2">
      {/* 옵션 및 버튼 */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">들여쓰기:</label>
          <Input
            type="number"
            min={1}
            max={8}
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="w-16"
          />
          <span className="text-sm text-gray-500">칸</span>
        </div>
        <Button onClick={handleFormat}>포맷팅</Button>
        <Button variant="secondary" onClick={handleMinify}>
          압축 (Minify)
        </Button>
        <Button variant="secondary" onClick={() => { setInput(''); setOutput(''); setError(''); }}>
          초기화
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* 2단 레이아웃 */}
      <TwoColumnLayout
        leftLabel="XML 입력"
        rightLabel="결과"
        rightHeader={output ? <CopyButton text={output} /> : undefined}
        left={
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='<root><item id="1"><name>테스트</name></item></root>'
            rows={16}
            className="font-mono text-sm h-[400px]"
          />
        }
        right={
          <Textarea
            value={output}
            readOnly
            placeholder="포맷팅된 XML이 여기에 표시됩니다."
            rows={16}
            className="font-mono text-sm h-[400px] bg-gray-50 dark:bg-gray-800/50"
          />
        }
      />

      <SeoContent />
    </div>
  );
}
