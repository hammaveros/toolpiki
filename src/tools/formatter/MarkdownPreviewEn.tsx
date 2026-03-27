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
          📝 What is Markdown Preview?
        </h2>
        <p className="text-sm leading-relaxed">
          Markdown is a lightweight text-based markup language that allows creating formatted documents with simple syntax.
          It is widely used in GitHub README files, blog posts, and technical documentation.
          This tool converts markdown syntax to HTML in real-time for preview,
          and the converted HTML can be copied and pasted directly into websites or blogs.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Supported Markdown Syntax
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code># Heading</code>
            <p className="text-gray-500 mt-1">Headers (h1-h3)</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>**bold**</code>
            <p className="text-gray-500 mt-1">Bold text</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>*italic*</code>
            <p className="text-gray-500 mt-1">Italic text</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>- item</code>
            <p className="text-gray-500 mt-1">Lists</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>[text](url)</code>
            <p className="text-gray-500 mt-1">Links</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
            <code>```code```</code>
            <p className="text-gray-500 mt-1">Code blocks</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 Markdown Usage Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li>Structure GitHub README with project description, installation, and usage</li>
          <li>Write tech blog posts with code snippets</li>
          <li>Quick note-taking in apps like Notion, Obsidian</li>
          <li>Convert to HTML for emails or web pages</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Are all markdown syntaxes supported?',
            answer: 'Basic syntax (headings, bold, italic, lists, links, code, blockquotes, tables) is fully supported. Some extended syntax (checkboxes, math) is partially supported.',
          },
          {
            question: 'How do I use the HTML copy feature?',
            answer: 'Click the "Copy HTML" button at the top right of the preview area. The converted HTML is copied to clipboard and can be pasted directly into website source code.',
          },
          {
            question: 'Is it identical to GitHub markdown?',
            answer: 'Core GitHub Flavored Markdown (GFM) syntax is mostly supported, but GitHub-specific features (issue links, mentions) are not supported.',
          },
        ]}
      />
    </div>
  );
}

export function MarkdownPreviewEn() {
  const [input, setInput] = useState(`# Markdown Preview

## Basic Syntax

**Bold** or __bold__

*Italic* or _italic_

~~Strikethrough~~

## Lists

- Item 1
- Item 2
  - Nested item

1. Ordered list
2. Second item

## Links and Images

[Link text](https://example.com)

## Code

Inline \`code\`

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

## Blockquote

> This is a blockquote.
> It can span multiple lines.

## Table

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`);

  const parseMarkdown = (md: string): string => {
    let html = md;

    // Code blocks (process first)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto"><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">$1</code>');

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>');

    // Bold, italic, strikethrough
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400">$1</blockquote>');

    // Tables
    html = html.replace(/^\|(.+)\|$/gm, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(c => c.trim());
      const isHeader = !html.split(match)[0].includes('|');
      if (isHeader) {
        return `<tr>${cells.map(c => `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800">${c.trim()}</th>`).join('')}</tr>`;
      }
      return `<tr>${cells.map(c => `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${c.trim()}</td>`).join('')}</tr>`;
    });

    // Wrap tables
    const tableRegex = /<tr>[\s\S]*?<\/tr>/g;
    if (tableRegex.test(html)) {
      html = html.replace(/<tr>[\s\S]*?<\/tr>/g, (match) => `<table class="border-collapse w-full my-4">${match}</table>`);
    }

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>');
    html = html.replace(/(<li class="ml-4">.*<\/li>\n?)+/g, '<ul class="list-disc my-2">$&</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="my-2">');
    html = '<p class="my-2">' + html + '</p>';

    // Clean up empty tags
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Markdown Input
          </label>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={20}
          className="font-mono text-sm"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <CopyButton text={renderedHtml} label="Copy HTML" />
        </div>
        <div
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-auto prose dark:prose-invert max-w-none"
          style={{ minHeight: '470px' }}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>

      <SeoContent />
    </div>
  );
}
