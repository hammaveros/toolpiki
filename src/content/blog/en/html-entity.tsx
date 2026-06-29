import Link from 'next/link';

export default function HtmlEntityPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Encoding · July 4, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        HTML Entities Break in Surprising Ways — This Tool Handles the Conversion
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/html-entity-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the HTML Entity Encoder/Decoder
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I was writing documentation in a CMS and the content had code samples with angle brackets. Every time I saved, the CMS was stripping the tags because it thought they were HTML. The fix was to encode them as entities.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When HTML Entity Encoding Matters</h2>

      <p className="mb-3">Situations where you actually need this:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Displaying code examples in HTML → angle brackets need to be <code>&amp;lt;</code> and <code>&amp;gt;</code></li>
        <li>User-generated content → any text from users needs HTML encoding before rendering to prevent XSS</li>
        <li>CMS content with special characters → some systems strip or mangle unencoded HTML characters</li>
        <li>Email templates → HTML in emails uses entity encoding for safety</li>
        <li>Technical documentation → showing HTML examples without the browser interpreting them</li>
        <li>Decoding encoded content → understanding what an HTML entity represents</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Characters That Must Be Encoded</h2>

      <p className="mb-3">Five characters are reserved in HTML and need encoding in text content:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>&lt;</code> → <code>&amp;lt;</code> (less-than sign, opens HTML tags)</li>
        <li><code>&gt;</code> → <code>&amp;gt;</code> (greater-than sign, closes HTML tags)</li>
        <li><code>&amp;</code> → <code>&amp;amp;</code> (ampersand, starts entity references)</li>
        <li><code>"</code> → <code>&amp;quot;</code> (double quote, needed inside attributes)</li>
        <li><code>'</code> → <code>&amp;apos;</code> (single quote, needed inside single-quoted attributes)</li>
      </ul>

      <p className="mb-4">Other characters can optionally be encoded — accented characters, mathematical symbols, trademark signs.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Named vs Numeric Entities</h2>

      <p className="mb-3">HTML supports two entity formats:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Named → <code>&amp;amp;</code>, <code>&amp;copy;</code>, <code>&amp;mdash;</code> — human-readable, easier to write</li>
        <li>Numeric decimal → <code>&amp;#38;</code>, <code>&amp;#169;</code> — works in any HTML context</li>
        <li>Numeric hex → <code>&amp;#x26;</code>, <code>&amp;#xA9;</code> — alternative numeric format</li>
      </ul>

      <p className="mb-4">Named entities are only recognized if the browser has a reference table for them — HTML5 defines over 2,000 named entities. Numeric entities work universally.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Encode and decode in both directions:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Text to HTML entities:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Encode the five reserved characters → safe for any HTML context</li>
        <li>Option to encode all non-ASCII characters as numeric entities</li>
        <li>Choose named or numeric entity format</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">HTML entities to text:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Decode <code>&amp;amp;</code>, <code>&amp;lt;</code>, numeric entities, and hex entities back to characters</li>
        <li>Handles malformed input gracefully</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Reference table:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Common HTML entities searchable by name or character</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Encoding mode choice → you don't always need to encode everything, just the five reserved chars</li>
        <li>Both named and numeric output formats → useful depending on context</li>
        <li>Bulk encoding of long text blocks → paste an entire HTML template and encode it</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Not a security tool → for production XSS prevention, use a proper HTML sanitizer library in your code</li>
        <li>No XML entity support → XML has a different set of predefined entities</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste your text or HTML</li>
        <li>Choose encode or decode</li>
        <li>Select the entity format if encoding</li>
        <li>Copy the result</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/html-entity-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the HTML Entity Encoder/Decoder
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up required.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#html-entity` `#encoding` `#web-development` `#xss` `#developer-tools`
      </p>
    </article>
  );
}
