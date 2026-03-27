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
          XML(eXtensible Markup Language)은 데이터를 구조화하여 저장하고 전송하는 마크업 언어입니다.
          XML 포맷터는 압축된 XML을 계층 구조에 맞게 들여쓰기하여 가독성을 높이거나,
          반대로 공백을 제거하여 파일 크기를 줄입니다. API 응답 분석, 설정 파일(pom.xml, web.xml) 편집,
          SOAP 메시지 디버깅, RSS/Atom 피드 확인 등 다양한 개발 작업에 활용됩니다.
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
