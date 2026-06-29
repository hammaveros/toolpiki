import Link from 'next/link';

export default function MarkdownPreviewPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Text · June 29, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Writing Markdown Without a Preview Is Guesswork — Here Is a Better Way
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/markdown-preview-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Markdown Preview Tool
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I pushed the README, checked GitHub, and realized my table was completely broken. Happened three times before I stopped guessing.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need This</h2>

      <p className="mb-3">Markdown is everywhere now, and needing a quick preview comes up constantly:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Writing a GitHub README → you want to check the formatting before pushing to the repo</li>
        <li>Documentation sites → Docusaurus, MkDocs, and similar tools all use Markdown</li>
        <li>Notion, Obsidian, or other note apps → pasting Markdown in and wondering if it will render correctly</li>
        <li>Blog posts → many static site generators like Hugo and Jekyll use Markdown for posts</li>
        <li>Issue and PR descriptions → GitHub, GitLab, and Jira all render Markdown in issue bodies</li>
        <li>Writing technical documentation → keeping formatting consistent across headers, code blocks, and tables</li>
        <li>Learning Markdown syntax → seeing what each element looks like without committing it anywhere</li>
        <li>Quick note formatting → you want to draft something in Markdown without opening an editor</li>
      </ul>

      <p className="mb-4">In most of these situations, the only way to verify your formatting is to publish it and then check. That is backwards.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">A Quick Background on Markdown</h2>

      <p className="mb-3">Markdown was created by John Gruber in 2004 as a way to write plain text that converts cleanly to HTML. The idea was that the raw text should be readable on its own, without rendering — using asterisks for bold, hash signs for headings, and hyphens for list items.</p>

      <p className="mb-3">It worked. Markdown became the default writing format for developer documentation, GitHub, Stack Overflow, Reddit, and countless other platforms. There are now multiple variants — GitHub Flavored Markdown (GFM), CommonMark, MultiMarkdown — each with slightly different rules for tables, task lists, and other features.</p>

      <p className="mb-4">The problem is that while Markdown is easy to write, it is not always obvious what the output will look like until you actually render it. Tables in particular are easy to get wrong. Code blocks with language identifiers behave differently across platforms. Nested lists have rules that are not immediately intuitive.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Problem with Existing Options</h2>

      <p className="mb-3">There are ways to preview Markdown, but most of them require more setup than a quick task deserves:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>VS Code with a Markdown preview extension → useful if you are already in VS Code with the file open, but you have to open a file first</li>
        <li>Typora → a dedicated Markdown editor with live preview, but it requires a paid license now</li>
        <li>StackEdit → a full-featured browser editor, good but heavier than you need for a quick check</li>
        <li>GitHub itself → push the file, check the render, fix the error, push again; too slow for iteration</li>
        <li>Obsidian or Notion → great for notes but not for a quick one-off preview of Markdown you have not saved anywhere</li>
        <li>Other online tools → some work fine but have ads or require an account to save your work</li>
      </ul>

      <p className="mb-4">I wanted something I could open in a tab, paste Markdown into, and immediately see the rendered version. No files, no app installation, no account.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What I Built</h2>

      <p className="mb-3">The Markdown Preview tool gives you a split-pane view: write on the left, see the rendered output on the right. It updates as you type.</p>

      <p className="mb-3">Supported Markdown features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>All heading levels (H1 through H6)</li>
        <li>Bold and italic text</li>
        <li>Ordered and unordered lists, including nested lists</li>
        <li>Links and images</li>
        <li>Inline code and fenced code blocks with syntax highlighting</li>
        <li>Tables (GitHub Flavored Markdown style)</li>
        <li>Blockquotes</li>
        <li>Horizontal rules</li>
        <li>Task lists with checkboxes</li>
        <li>Strikethrough text</li>
      </ul>

      <p className="mb-3">Additional features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Copy raw Markdown or copy the HTML output</li>
        <li>Clear button to reset both panels</li>
        <li>Dark mode support in both the editor and the preview</li>
        <li>Works on mobile → smaller screen but still functional</li>
        <li>No data is sent to a server → everything runs in the browser</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Common Markdown Mistakes the Preview Catches</h2>

      <p className="mb-3">Having a live preview catches errors before they become problems:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Tables with misaligned columns</p>
      <p className="mb-4">Markdown tables require a specific pipe-and-dash syntax. If the column separators are off, the table does not render. Seeing the output immediately tells you when you have a formatting error without having to push to GitHub.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Broken links</p>
      <p className="mb-4">If you write a link with the wrong bracket order, it renders as raw text instead of a clickable link. Easy to catch when you can see the output, easy to miss when you cannot.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Nested list indentation</p>
      <p className="mb-4">Markdown nested lists require consistent indentation. Some parsers want two spaces, others four. A preview lets you see immediately whether your nested items are rendering as a hierarchy or as flat list items.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Code blocks without language tags</p>
      <p className="mb-4">A fenced code block with a language identifier gets syntax highlighting. Without one, it renders as plain text. You can see this difference immediately in the preview and add the language tag before publishing.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Real-time preview → no delay, the output updates character by character</li>
        <li>Covers GFM features → tables, task lists, and strikethrough all render correctly</li>
        <li>Syntax highlighting in code blocks → useful for checking code examples in documentation</li>
        <li>Clean output styling → the preview looks similar to how GitHub renders Markdown</li>
        <li>Fast and lightweight → loads quickly, no heavyweight editor framework</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Does not save your work → closing the tab loses the content</li>
        <li>No file import → you have to paste the Markdown manually</li>
        <li>Rendering may differ slightly from specific platforms → GitHub, Notion, and MkDocs each have minor quirks</li>
        <li>Not a full editor → no autocomplete or shortcuts beyond what the browser provides</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Open the tool</li>
        <li>Paste or type your Markdown in the left panel</li>
        <li>The rendered preview appears on the right immediately</li>
        <li>Edit until the output looks right</li>
        <li>Copy the final Markdown and paste it wherever you need it</li>
      </ol>

      <p className="mb-4">No account, no file saving required. Open the tab, paste, fix, done.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/markdown-preview-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Markdown Preview Tool
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Paste your Markdown, see the rendered output instantly. No account required.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#markdown` `#markdown-preview` `#readme` `#documentation` `#developer-tools`
      </p>
    </article>
  );
}
