import Link from 'next/link';

export default function UnixTimestampPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Encoding · June 26, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        What Does 1719446400 Mean? Reading Unix Timestamps in API Responses
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/unix-timestamp-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Unix Timestamp Converter
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        The API response has a `created_at` field set to 1719446400 and I need to know if that is from today, last week, or six months ago.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need This</h2>

      <p className="mb-3">Unix timestamps show up constantly in software development and data work:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>API responses → most REST and GraphQL APIs return timestamps as Unix epoch integers</li>
        <li>Database records → `created_at`, `updated_at`, `deleted_at` columns stored as integers or bigints</li>
        <li>Log files → system logs, server access logs, and application logs almost always use Unix timestamps</li>
        <li>JWT tokens → the `exp` and `iat` claims are Unix timestamps, and you need to know if a token has expired</li>
        <li>Event tracking → analytics systems store event times as millisecond-precision Unix timestamps</li>
        <li>Debugging time-related bugs → "the event fired at the wrong time" is much easier to investigate when you can read the timestamps</li>
        <li>Scheduled jobs → cron-adjacent systems often express execution times as Unix timestamps</li>
        <li>File system metadata → `mtime`, `atime`, and `ctime` on files are epoch-based</li>
      </ul>

      <p className="mb-4">The core problem is always the same: you have a number, and you need to know what time it represents in human terms.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">A Quick Explanation of Unix Timestamps</h2>

      <p className="mb-3">A Unix timestamp (also called an epoch timestamp) is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC. That reference point is called the Unix epoch.</p>

      <p className="mb-3">Some things worth knowing:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Standard Unix timestamps count seconds. A timestamp of 1719446400 = June 27, 2024, 00:00:00 UTC.</li>
        <li>Millisecond timestamps are 1000x larger. JavaScript's `Date.now()` returns milliseconds, so 1719446400000 is the same moment.</li>
        <li>Negative timestamps are valid and represent dates before 1970.</li>
        <li>Timestamps are always UTC. Converting to local time requires knowing the timezone offset.</li>
        <li>The year 2038 problem exists for 32-bit systems that store timestamps as signed integers, but 64-bit systems are fine until the year 292 million or so.</li>
      </ul>

      <p className="mb-4">Knowing whether you are dealing with seconds or milliseconds matters a lot. A timestamp of 1719446400 is mid-2024. A timestamp of 17194464 is November 1970. If someone gives you what looks like a small timestamp, it is probably seconds. If the number has 13 digits, it is probably milliseconds.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Problem with Existing Options</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Browser console → `new Date(1719446400000)` works, but you have to remember whether to multiply by 1000 or not, and you have to open DevTools</li>
        <li>Online converters → most are fine but require navigating to the site, and many have confusing UIs that do not clearly separate seconds vs milliseconds</li>
        <li>Shell commands → `date -d @1719446400` works on Linux, has a different syntax on macOS, and does not help at all on Windows</li>
        <li>Spreadsheet formulas → `=(A1/86400)+DATE(1970,1,1)` works but requires a spreadsheet to be open and the formula to be memorized</li>
        <li>IDE plugins → some exist, but they are language-specific and add startup overhead</li>
      </ul>

      <p className="mb-4">The browser console approach is what most developers default to, but it has two persistent issues: the seconds vs milliseconds confusion, and the need to have DevTools open. When you are reading through API docs or reviewing a data dump, context-switching to the console breaks flow.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What I Built</h2>

      <p className="mb-3">A dedicated converter that handles the seconds vs milliseconds ambiguity automatically and shows output in multiple formats at once:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Timestamp to human-readable date:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Paste a Unix timestamp (seconds or milliseconds — it auto-detects)</li>
        <li>Shows the result in UTC and in your local timezone simultaneously</li>
        <li>Displays multiple formats: ISO 8601, human-readable, relative time ("3 days ago")</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Human-readable date to timestamp:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter a date and time in a standard format</li>
        <li>Get back both seconds and milliseconds timestamps</li>
        <li>Useful when you need to construct a query with a time filter, or set an expiry in a JWT</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Current timestamp:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Shows the current Unix timestamp updating in real time</li>
        <li>One-click copy for both seconds and milliseconds versions</li>
        <li>Useful when writing tests that need a "now" timestamp</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Real Debugging Scenarios</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">JWT token expiry:</p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        A token keeps getting rejected. The `exp` field in the payload is 1719360000. Paste it into the converter: June 26, 2024, 00:00:00 UTC. The token expired yesterday. That explains the rejections.
      </p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Log file timestamp mismatch:</p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Server logs show an event at timestamp 1719446400 but the UI shows it happened at a different time. Converter shows 1719446400 is midnight UTC. The UI is displaying it in the user's local timezone (UTC-5), so it shows as June 26, 19:00 — five hours earlier. Not a bug, just a timezone display issue.
      </p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Building a date range query:</p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Need to query events from June 1, 2024 to June 30, 2024. Convert both dates to timestamps: start = 1717200000, end = 1719705600. Paste those into the query. Done.
      </p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Milliseconds vs seconds confusion:</p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        An analytics API returns `event_time: 1719446400000`. Is that seconds or milliseconds? It has 13 digits — milliseconds. The converter auto-detects this and shows the correct date without you needing to divide by 1000 manually first.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Auto-detects seconds vs milliseconds → removes the most common confusion point</li>
        <li>Shows UTC and local time simultaneously → eliminates timezone ambiguity</li>
        <li>Bidirectional conversion → works both ways without switching modes</li>
        <li>Live current timestamp → useful for writing code that uses "now"</li>
        <li>No page reload needed → fast to use during debugging</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Local time is based on your browser's timezone setting → if you need to convert to a specific third timezone, you would need a timezone converter</li>
        <li>Auto-detection is heuristic → a 10-digit number is assumed to be seconds, 13-digit is assumed to be milliseconds; edge cases exist</li>
        <li>No batch conversion → converts one timestamp at a time; for bulk operations you would need a script</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste a Unix timestamp into the input field</li>
        <li>The converter auto-detects seconds vs milliseconds</li>
        <li>See the result in UTC and local time, in multiple formats</li>
        <li>To convert a date to a timestamp, switch to the date input mode and enter a date and time</li>
        <li>Copy the timestamp in seconds or milliseconds with one click</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/unix-timestamp-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Unix Timestamp Converter
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up. Paste a timestamp, read the result, get back to debugging.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#unix-timestamp` `#epoch-converter` `#developer-tools` `#debugging` `#free-tools`
      </p>
    </article>
  );
}
