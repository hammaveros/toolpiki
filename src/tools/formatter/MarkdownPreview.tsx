'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📝 마크다운 미리보기란?
        </h2>
        <p className="text-sm leading-relaxed">
          마크다운(Markdown)은 텍스트 기반의 경량 마크업 언어로, 간단한 문법으로 서식이 있는 문서를 작성할 수 있습니다.
          GitHub README, 블로그 포스트, 기술 문서 등에서 널리 사용됩니다.
          이 도구는 마크다운 문법을 실시간으로 HTML로 변환하여 미리보기를 제공하며,
          변환된 HTML 코드를 복사하여 웹사이트나 블로그에 바로 붙여넣을 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 지원하는 마크다운 문법
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code># 제목</code>
            <p className="text-gray-500 mt-1">헤더 (h1~h3)</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>**굵게**</code>
            <p className="text-gray-500 mt-1">볼드</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>*기울임*</code>
            <p className="text-gray-500 mt-1">이탤릭</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>- 항목</code>
            <p className="text-gray-500 mt-1">목록</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>[텍스트](url)</code>
            <p className="text-gray-500 mt-1">링크</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>```코드```</code>
            <p className="text-gray-500 mt-1">코드 블록</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 마크다운 활용 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>GitHub README 작성 시 프로젝트 설명, 설치 방법, 사용법을 구조화</li>
          <li>기술 블로그에서 코드 스니펫과 함께 문서 작성</li>
          <li>Notion, Obsidian 등 노트 앱에서 빠른 문서 작성</li>
          <li>HTML로 변환 후 이메일이나 웹페이지에 활용</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: '모든 마크다운 문법이 지원되나요?',
            answer: '기본 문법(제목, 굵게, 기울임, 목록, 링크, 코드, 인용, 표)은 모두 지원됩니다. 일부 확장 문법(체크박스, 수식 등)은 부분적으로 지원됩니다.',
          },
          {
            question: 'HTML 복사 기능은 어떻게 사용하나요?',
            answer: '미리보기 영역 우측 상단의 "HTML 복사" 버튼을 클릭하면 변환된 HTML 코드가 클립보드에 복사됩니다. 이를 웹사이트 소스에 바로 붙여넣을 수 있습니다.',
          },
          {
            question: 'GitHub 마크다운과 완전히 동일한가요?',
            answer: 'GitHub Flavored Markdown(GFM)의 핵심 문법은 대부분 지원하지만, GitHub 전용 기능(이슈 링크, 멘션 등)은 지원하지 않습니다.',
          },
        ]}
      />
    </div>
  );
}

export function MarkdownPreview() {
  const [input, setInput] = useState(`# 마크다운 미리보기

## 기본 문법

**굵게** 또는 __굵게__

*기울임* 또는 _기울임_

~~취소선~~

## 목록

- 항목 1
- 항목 2
  - 중첩 항목

1. 순서 목록
2. 두 번째

## 링크와 이미지

[링크 텍스트](https://example.com)

## 코드

인라인 \`코드\`

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

## 인용

> 인용문입니다.
> 여러 줄도 가능합니다.

## 표

| 헤더 1 | 헤더 2 |
|--------|--------|
| 셀 1   | 셀 2   |
| 셀 3   | 셀 4   |
`);

  // 간단한 마크다운 파서
  const parseMarkdown = (md: string): string => {
    let html = md;

    // 코드 블록 (먼저 처리)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto"><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // 인라인 코드
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">$1</code>');

    // 헤더
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>');

    // 굵게, 기울임, 취소선
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // 링크
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // 인용
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400">$1</blockquote>');

    // 표
    html = html.replace(/^\|(.+)\|$/gm, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(c => c.trim());
      const isHeader = !html.split(match)[0].includes('|');
      if (isHeader) {
        return `<tr>${cells.map(c => `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800">${c.trim()}</th>`).join('')}</tr>`;
      }
      return `<tr>${cells.map(c => `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${c.trim()}</td>`).join('')}</tr>`;
    });

    // 표 감싸기
    const tableRegex = /<tr>[\s\S]*?<\/tr>/g;
    if (tableRegex.test(html)) {
      html = html.replace(/<tr>[\s\S]*?<\/tr>/g, (match) => `<table class="border-collapse w-full my-4">${match}</table>`);
    }

    // 순서 없는 목록
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>');
    html = html.replace(/(<li class="ml-4">.*<\/li>\n?)+/g, '<ul class="list-disc my-2">$&</ul>');

    // 순서 있는 목록
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>');

    // 줄바꿈
    html = html.replace(/\n\n/g, '</p><p class="my-2">');
    html = '<p class="my-2">' + html + '</p>';

    // 빈 태그 정리
    html = html.replace(/<p class="my-2"><\/p>/g, '');
    html = html.replace(/<p class="my-2">(<h[1-6])/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p class="my-2">(<ul|<ol|<blockquote|<pre|<table)/g, '$1');
    html = html.replace(/(<\/ul>|<\/ol>|<\/blockquote>|<\/pre>|<\/table>)<\/p>/g, '$1');

    return html;
  };

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const renderedHtml = useMemo(() => parseMarkdown(input), [input]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            마크다운 입력
          </label>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={20}
          className="font-mono text-sm flex-1"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            미리보기
          </label>
          <CopyButton text={renderedHtml} label="HTML 복사" />
        </div>
        <div
          className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-auto prose dark:prose-invert max-w-none"
          style={{ minHeight: '470px' }}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>

      <SeoContent />
    </div>
  );
}
