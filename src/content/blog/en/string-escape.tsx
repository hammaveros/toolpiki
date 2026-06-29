import Link from 'next/link';

export default function StringEscapePostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Text · July 2, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Escaping Strings Manually Is How Bugs Get Introduced
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/string-escape-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the String Escape Tool
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I spent thirty minutes tracking down a JSON parse error that turned out to be a single unescaped backslash in a file path.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When String Escaping Comes Up</h2>

      <p className="mb-3">More situations than just programming:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Embedding user text in JSON → quotes and backslashes need escaping</li>
        <li>Writing HTML with special characters → angle brackets, ampersands need entity encoding</li>
        <li>Building URLs with query parameters → spaces and special characters need percent-encoding</li>
        <li>Shell scripts → spaces, quotes, and special characters need escaping</li>
        <li>SQL queries → quotes in values need escaping (though parameterized queries are better)</li>
        <li>Config files → special characters in values depending on the format</li>
      </ul>

      <p className="mb-4">Each context has its own escaping rules, and mixing them up causes bugs that are frustrating to debug.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Manual Escaping Is Risky</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>You forget edge cases → a backslash before a backslash, a newline in a JSON string</li>
        <li>Different formats escape the same characters differently → HTML <code>&amp;amp;</code> vs URL <code>%26</code></li>
        <li>Nested contexts are confusing → a URL inside an HTML attribute inside a JSON value</li>
        <li>Unescaping is just as error-prone → decoding things manually reintroduces mistakes</li>
      </ul>

      <p className="mb-4">I have introduced more bugs through manual escaping than through any other single cause.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Paste your string and choose which escaping format you need:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">JSON escaping:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Escapes quotes, backslashes, newlines, tabs, control characters</li>
        <li>Produces a valid JSON string literal</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">HTML entity encoding:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Converts &lt; &gt; &amp; &quot; into their entity forms</li>
        <li>Safe for embedding in HTML attributes and content</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">URL percent-encoding:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Encodes spaces, special characters for use in URLs</li>
        <li>Handles both full URL encoding and component encoding</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">All modes support both escape and unescape:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Paste escaped text to decode it back to original</li>
        <li>Useful for reading escaped log output or config values</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>All three common formats in one place → no switching between tools</li>
        <li>Both directions (escape and unescape) → useful in both directions</li>
        <li>Handles edge cases correctly → double backslashes, nested quotes, control characters</li>
        <li>No data sent to a server → safe for sensitive strings</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No shell escaping → bash quoting rules are complex enough to need a dedicated tool</li>
        <li>No regex escaping → escaping for use in regex patterns not included</li>
        <li>No context detection → you choose the format manually</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste your string</li>
        <li>Select the format (JSON, HTML, or URL)</li>
        <li>Choose escape or unescape</li>
        <li>Copy the result</li>
      </ol>

      <p className="mb-4">Useful any time you need to safely embed text in a different format.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/string-escape-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the String Escape Tool
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up required. Nothing is sent to a server.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#string-escape` `#json` `#html-entity` `#url-encoding` `#developer-tools`
      </p>
    </article>
  );
}
