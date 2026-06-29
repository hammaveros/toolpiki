import Link from 'next/link';

export default function LineNumberPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Text · July 1, 2026 · 3 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Adding Line Numbers to Text Shouldn't Require a Code Editor
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/line-number-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Line Number Tool
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I needed to share a code snippet in an email with line numbers so people could reference specific lines during a code review. Opening my editor, copying it out, and stripping the editor chrome was more steps than the actual review.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need Line Numbers</h2>

      <p className="mb-3">More situations than just programming:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Code review discussions → "look at line 47" is clearer than "the third function"</li>
        <li>Technical documentation → numbered steps that reference specific lines</li>
        <li>Log file analysis → sharing a log excerpt with line numbers for context</li>
        <li>Academic or legal text → referencing specific lines in a submission or contract</li>
        <li>Script or screenplay → sharing a draft where notes reference line numbers</li>
        <li>Configuration files → explaining which line controls which setting</li>
      </ul>

      <p className="mb-4">In all these cases, you want line numbers in the pasted output, not just in your editor's gutter.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Editor Screenshots Don't Cut It</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Screenshots are not searchable → the recipient can't Ctrl+F the text</li>
        <li>Editor themes vary → your dark theme might be unreadable in bright environments</li>
        <li>Screenshots break in email clients → images get stripped, blocked, or resized</li>
        <li>Plain text in chat apps is searchable and quotable → images are not</li>
      </ul>

      <p className="mb-4">Plain text with line numbers is just more useful in most contexts.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Paste any text and line numbers get added to each line:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Numbered prefix on every line → 1: line text, 2: line text</li>
        <li>Custom starting number → useful when sharing a partial extract from a larger file</li>
        <li>Padding options → left-pad line numbers to keep columns aligned (e.g., 001, 002)</li>
        <li>Separator choice → colon, period, tab, or space between number and line</li>
        <li>One-click copy of the numbered output</li>
      </ul>

      <p className="mb-3">Also useful:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Total line count shown immediately</li>
        <li>Works for any text — code, plain prose, data, logs</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Handles large pastes without slowing down</li>
        <li>Custom start number → paste lines 200–250 from a file and start numbering at 200</li>
        <li>Aligned padding makes the output clean and readable</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No syntax highlighting → this is plain text output</li>
        <li>No remove-numbers mode → there is no reverse operation built in</li>
        <li>Blank lines are numbered too → if you want to skip blank lines, you would need to pre-process</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste your text or code</li>
        <li>Adjust starting number and separator if needed</li>
        <li>Copy the numbered output</li>
        <li>Paste it wherever you need it</li>
      </ol>

      <p className="mb-4">Done in under ten seconds.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/line-number-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Line Number Tool
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up required. Works in your browser.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#line-numbers` `#code-review` `#text-tools` `#developer-tools` `#plain-text`
      </p>
    </article>
  );
}
