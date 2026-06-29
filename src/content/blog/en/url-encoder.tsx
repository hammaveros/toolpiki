import Link from 'next/link';

export default function UrlEncoderPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Encoding · June 29, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Why Your URL Broke — and How URL Encoding Actually Works
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/url-encoder-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the URL Encoder / Decoder
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I pasted a URL into my API and got a 400 error. Took me an hour to realize the problem was a space character.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need This</h2>

      <p className="mb-3">URL encoding issues show up constantly in web development and everyday use:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Building API requests → query parameters with special characters need to be encoded</li>
        <li>Constructing redirect URLs → the destination URL must be encoded inside the outer URL</li>
        <li>Working with search queries → spaces and punctuation break raw URLs</li>
        <li>Sharing links with non-ASCII characters → accented letters, CJK characters, emoji</li>
        <li>Debugging a broken URL → you need to decode a percent-encoded string to read it</li>
        <li>Writing web scraping scripts → extracting and re-encoding URL parameters</li>
        <li>Testing forms → confirming what data is actually being submitted</li>
        <li>Copying URLs from browser address bars → they often show decoded form but need encoded form in code</li>
      </ul>

      <p className="mb-4">Anyone who works with the web encounters this sooner or later. Usually at the worst possible moment.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">A Quick Explanation of What URL Encoding Is</h2>

      <p className="mb-3">URLs can only contain a limited set of characters. Letters, numbers, and a handful of symbols like hyphens and underscores are safe. Everything else — spaces, ampersands, equals signs, non-ASCII characters — has to be represented using percent encoding.</p>

      <p className="mb-3">Percent encoding replaces each problematic character with a percent sign followed by two hex digits. A space becomes <code>%20</code>. An ampersand becomes <code>%26</code>. An equals sign becomes <code>%3D</code>.</p>

      <p className="mb-3">This matters because URLs are parsed by multiple systems — browsers, servers, proxies, CDNs — and each one expects the encoding to be correct. If a space appears literally in a URL, one system might interpret it as the end of the URL. Another might throw an error. Another might pass it through silently and cause bugs further down the stack.</p>

      <p className="mb-4">When you are debugging a broken API call or a malformed redirect, the first thing to check is whether your parameters are properly encoded.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Problem with Existing Options</h2>

      <p className="mb-3">There are ways to encode and decode URLs, but they all have friction:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Browser console → <code>encodeURIComponent()</code> works, but you have to open DevTools and remember the right function name every time</li>
        <li>Python or Node → fast if you are already in a terminal, slow if you are not</li>
        <li>Online tools → many are plastered with ads, some have character limits, others track what you paste</li>
        <li>Manual calculation → converting characters to hex by hand is something no one should ever do</li>
        <li>Guessing → sometimes you just add <code>%20</code> yourself and hope for the best</li>
      </ul>

      <p className="mb-4">The browser console approach is probably the fastest for developers, but it still requires opening DevTools and switching context. For a non-developer, it is completely inaccessible.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What I Built</h2>

      <p className="mb-3">The URL Encoder / Decoder handles both directions in one place. You paste your text, choose encode or decode, and the result appears immediately.</p>

      <p className="mb-3">Features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>URL encode → converts any text to percent-encoded format safe for use in a URL</li>
        <li>URL decode → converts percent-encoded strings back to readable text</li>
        <li>Real-time output → results update as you type, no button needed</li>
        <li>Handles the full character set → Unicode, emoji, CJK, special characters all work</li>
        <li>One-click copy → copy the result to clipboard with a single click</li>
        <li>Runs in the browser → nothing is sent to a server, safe for sensitive data</li>
        <li>Works on mobile → useful when you are away from a laptop</li>
      </ul>

      <p className="mb-3">A small but useful detail: the tool also shows you a table of common character encodings for reference. If you want to understand what <code>%2F</code> or <code>%3A</code> means without encoding something, you can look it up directly.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Common Encoding Mistakes That Break Things</h2>

      <p className="mb-3">These are the errors that show up over and over:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Double encoding</p>
      <p className="mb-4">You encode a URL once, then encode the result again. <code>%20</code> becomes <code>%2520</code>. The server decodes it once and gets <code>%20</code> instead of a space. Everything is wrong. This happens most often when you encode a parameter that already contains an encoded URL.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Encoding the entire URL instead of just the parameter</p>
      <p className="mb-4">If you encode the whole URL including the slashes and colons, you end up with <code>https%3A%2F%2Fexample.com%2Fpath</code>, which no browser will follow correctly. You should only encode the values of query parameters, not the URL structure itself.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Forgetting to encode spaces in file names</p>
      <p className="mb-4">A file named <code>my document.pdf</code> turns into a broken URL if the space is not encoded. The server sees the URL end after <code>my</code> and returns a 404. Encode the space as <code>%20</code> or replace it with a hyphen before putting file names in URLs.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Instant results → no submit button, the output appears as you type</li>
        <li>Handles edge cases → Unicode characters, emoji, and percent signs within the input all encode correctly</li>
        <li>Clean interface → the encode and decode outputs are clearly labeled</li>
        <li>Privacy-safe → your input stays in the browser</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Does not parse full URLs → it encodes or decodes the entire input as a string, so you need to isolate the part you want to encode yourself</li>
        <li>No batch processing → one input at a time</li>
        <li>No history → closing the tab resets everything</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Open the tool</li>
        <li>Paste the text or URL fragment you want to encode or decode</li>
        <li>The encoded and decoded versions appear immediately in the output panels</li>
        <li>Click the copy button to grab the result</li>
        <li>Paste it wherever you need it</li>
      </ol>

      <p className="mb-4">Takes about five seconds once the tab is open.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/url-encoder-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the URL Encoder / Decoder
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up. Paste your text and get the encoded version immediately.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#url-encoding` `#percent-encoding` `#web-development` `#developer-tools` `#encoding`
      </p>
    </article>
  );
}
