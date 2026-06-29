import Link from 'next/link';

export default function HttpStatusCodePostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Reference · July 9, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        What Does That HTTP Status Code Mean? A Reference You Actually Want to Use
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/http-status-code-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the HTTP Status Code Reference
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Got a 422 back from an API. I knew it wasn't a 400 or a 404, but I couldn't remember exactly what 422 means versus 400, or when to use which one.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Codes You Always Look Up</h2>

      <p className="mb-3">Be honest — you look these up more often than you admit:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Is it 401 or 403 for "not logged in vs. logged in but not allowed"?</li>
        <li>What's the difference between 400 and 422?</li>
        <li>When should I return 201 vs. 200 for a POST?</li>
        <li>What exactly does 304 mean and when does the browser use it?</li>
        <li>When is 503 vs. 502 the right response from a gateway?</li>
        <li>What are the 1xx codes and when do they show up?</li>
      </ul>

      <p className="mb-4">
        HTTP has over 60 defined status codes across five classes (1xx through 5xx). You work with a dozen or so regularly. The rest come up occasionally and require a quick reference check. Having a fast, searchable reference cuts that lookup from 30 seconds to 5.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Not Just Google It?</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Google results → often land on articles that bury the answer under background</li>
        <li>MDN → accurate but dense; slower than you need for a quick lookup</li>
        <li>RFC 9110 → the authoritative spec, but not reader-friendly</li>
        <li>Wikipedia → includes historical codes you'll never encounter</li>
      </ul>

      <p className="mb-4">
        I wanted a reference that shows me the code, the name, a one-line description, and a practical note on when to use it — in under three seconds.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Core features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Search by code number (type "422" → instantly see the result)</li>
        <li>Search by keyword (type "redirect" → see 301, 302, 307, 308)</li>
        <li>Browse by class (1xx, 2xx, 3xx, 4xx, 5xx)</li>
        <li>Each code shows: number, name, description, practical usage notes</li>
        <li>Highlights deprecated codes</li>
        <li>Notes on common browser and framework behaviors</li>
      </ul>

      <p className="mb-3">Coverage includes:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>All standard codes from RFC 9110 and common extensions</li>
        <li>WebDAV extensions (207, 422, 423, 424, 507)</li>
        <li>Commonly used unofficial codes (418, 429, 451)</li>
        <li>Cloudflare and CDN-specific codes (520-527)</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Codes That Confuse Everyone</h2>

      <p className="mb-4">
        <strong>401 vs. 403:</strong> 401 Unauthorized means the request lacks valid authentication credentials. Despite the name, it's really about authentication. 403 Forbidden means the server understood the request, the client is authenticated, but access is denied. 401 → "Who are you?", 403 → "I know who you are, you can't have this."
      </p>

      <p className="mb-4">
        <strong>400 vs. 422:</strong> 400 Bad Request is a general-purpose client error — malformed syntax, invalid request framing. 422 Unprocessable Entity (originally a WebDAV extension, now mainstream) means the request was well-formed syntactically but semantically wrong — like passing a valid JSON object with invalid field values. Use 422 when you understand the request but the content is wrong.
      </p>

      <p className="mb-4">
        <strong>301 vs. 302 vs. 307 vs. 308:</strong> 301 and 308 are permanent redirects (the moved-permanently kind). 302 and 307 are temporary. The difference between 301/302 and 307/308 is whether the HTTP method changes on redirect — 307/308 preserve the method, 301/302 traditionally allow changing POST to GET. Use 308 for permanent redirects if you want to guarantee the method is preserved.
      </p>

      <p className="mb-4">
        <strong>502 vs. 503 vs. 504:</strong> 502 Bad Gateway means a gateway or proxy received an invalid response from an upstream server. 503 Service Unavailable means the server is temporarily overloaded or down for maintenance. 504 Gateway Timeout means the gateway didn't get a response from the upstream server in time.
      </p>

      <p className="mb-4">
        <strong>200 vs. 201 vs. 204:</strong> 200 OK is the general success. 201 Created should be returned when a POST or PUT creates a new resource — include a <code>Location</code> header pointing to it. 204 No Content means success but no body to return — useful for DELETE or PUT operations that don't return the updated resource.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Search by number is instant — type the code, get the answer</li>
        <li>Practical usage notes answer "when should I use this" not just "what does it mean"</li>
        <li>Side-by-side comparisons for commonly confused codes</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Not the RFC — use the spec for authoritative decisions</li>
        <li>Some vendor-specific codes (custom 5xx ranges) aren't covered</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Type the status code number or a keyword in the search box</li>
        <li>See the matching codes with descriptions</li>
        <li>Click a code for full details and usage notes</li>
        <li>Browse by class if you're exploring a range</li>
      </ol>

      <p className="mb-4">Faster than opening a browser tab and searching.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/http-status-code-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the HTTP Status Code Reference
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">A quick reference for every HTTP status code.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#http-status-codes` `#rest-api` `#http-reference` `#developer-tools` `#web-development`
      </p>
    </article>
  );
}
