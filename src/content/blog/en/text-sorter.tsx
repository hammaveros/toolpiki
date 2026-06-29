import Link from 'next/link';

export default function TextSorterPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Text · July 2, 2026 · 3 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Sorting a List Manually Is the Kind of Task That Wastes Time Without You Noticing
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/text-sorter-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Text Sorter
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I had a list of 40 country names that needed to be alphabetized for a dropdown menu. I started sorting manually, got about fifteen in, and thought: this is absurd.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need to Sort Text</h2>

      <p className="mb-3">More often than you might expect:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Dropdown menu options → alphabetical order makes them easier to scan</li>
        <li>Glossaries or reference lists → sorted A-Z for quick lookup</li>
        <li>Import statements in code → some style guides require sorted imports</li>
        <li>Configuration keys → sorted order is easier to maintain</li>
        <li>Tag or keyword lists → alphabetical order for review and de-duplication</li>
        <li>To-do lists → sorted by priority, date, or alphabetical</li>
      </ul>

      <p className="mb-4">None of these are complex tasks. They just take longer than they should when done by hand.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Spreadsheets Are Overkill Here</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Your data is not in a spreadsheet → it is in a text file, a code comment, or a chat message</li>
        <li>Opening a spreadsheet adds overhead → import, sort, copy, close</li>
        <li>Spreadsheet sort has options that don't matter here → column headers, sort key selection, etc.</li>
        <li>Command line sort works but requires knowing the flags → <code>sort -f</code> for case-insensitive, <code>sort -r</code> for reverse</li>
      </ul>

      <p className="mb-4">A dedicated tool is faster for a one-time sort.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Paste a list and pick a sort order:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A to Z → standard alphabetical order</li>
        <li>Z to A → reverse alphabetical</li>
        <li>Shortest to longest → sort by line length</li>
        <li>Longest to shortest → reverse by line length</li>
        <li>Random shuffle → useful for randomizing a list without bias</li>
        <li>Reverse order → flip the list top-to-bottom</li>
      </ul>

      <p className="mb-3">Options:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Case-insensitive sorting → Apple and apple treated the same</li>
        <li>Remove duplicates after sorting → combine sort and deduplicate in one step</li>
        <li>Trim whitespace before sorting → leading spaces don't affect order</li>
        <li>One-click copy of sorted output</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Multiple sort modes in one place → no need for different tools</li>
        <li>Combining sort with deduplication is a common workflow → it does both</li>
        <li>Works on very long lists without slowdown</li>
        <li>Case-insensitive mode handles mixed capitalization correctly</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No numeric sort → "10" sorts before "9" in alphabetical mode</li>
        <li>No multi-column sort → this is line-based, not structured data</li>
        <li>No locale-aware sort → language-specific collation rules not supported</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste your list (one item per line)</li>
        <li>Choose the sort order</li>
        <li>Toggle options as needed</li>
        <li>Copy the sorted result</li>
      </ol>

      <p className="mb-4">Five seconds, start to finish.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/text-sorter-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Text Sorter
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up required. All processing happens in your browser.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#text-sorter` `#alphabetical-sort` `#list-tools` `#text-tools` `#productivity`
      </p>
    </article>
  );
}
