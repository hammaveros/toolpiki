import Link from 'next/link';

export default function MessageLengthCheckerPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Text · July 2, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Why SMS Messages Sometimes Split Into Multiple Parts (And How to Avoid It)
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/message-length-checker-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Message Length Checker
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        A client asked why their promotional SMS campaign was charging twice per message. Turns out their messages were 162 characters — just two over the 160-character limit.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The SMS Character Limit Problem</h2>

      <p className="mb-3">Here is what most people don't know about SMS:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Standard SMS limit is 160 characters using GSM-7 encoding</li>
        <li>If you use any special characters (like curly quotes, em dashes, or emoji), the encoding switches to UCS-2</li>
        <li>UCS-2 messages have a limit of only 70 characters per segment</li>
        <li>Multi-part SMS uses 7 characters per segment for header overhead — so the effective limit drops to 153 (GSM) or 67 (UCS-2)</li>
        <li>Every segment costs the same as a full SMS — two parts means double the cost</li>
      </ul>

      <p className="mb-4">A single smart quote or emoji can cut your available characters by more than half and double your messaging bill.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why This Matters Beyond Cost</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>User experience → multi-part messages sometimes arrive out of order on older devices</li>
        <li>Character limits for social media bios and platform descriptions → Twitter, Instagram, LinkedIn</li>
        <li>Meta descriptions for SEO → ideally under 160 characters to avoid truncation in search results</li>
        <li>Push notification limits → usually 100–200 characters before truncation</li>
        <li>Form field validation → knowing the byte size helps when building forms with server-side limits</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Paste your message text and instantly see:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Character count</li>
        <li>Byte size (UTF-8)</li>
        <li>SMS encoding detected → GSM-7 or UCS-2</li>
        <li>Number of SMS segments required</li>
        <li>Characters remaining in the current segment</li>
        <li>Warning when special characters force UCS-2 encoding</li>
        <li>Which specific character triggered the encoding switch</li>
      </ul>

      <p className="mb-3">Platform reference limits shown:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Twitter/X → 280 characters</li>
        <li>Instagram bio → 150 characters</li>
        <li>Meta description → 160 characters</li>
        <li>WhatsApp → 65,536 characters</li>
        <li>Single SMS (GSM) → 160 characters</li>
        <li>Single SMS (UCS-2) → 70 characters</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Common Characters That Break GSM Encoding</h2>

      <p className="mb-3">These look innocent but switch SMS to UCS-2:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Smart quotes → " " ' ' (Word and Google Docs auto-correct to these)</li>
        <li>Em dashes → — (commonly typed as double hyphens, auto-converted by some apps)</li>
        <li>Ellipsis character → … (looks like three dots but is one character in UCS-2)</li>
        <li>Any emoji → forces UCS-2 immediately</li>
        <li>Currency symbols → € £ ¥</li>
        <li>Accented characters beyond GSM extended set</li>
      </ul>

      <p className="mb-4">The tool highlights exactly which characters are causing the issue.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Segment counting is accurate — matches what carriers actually do</li>
        <li>Character highlighting tells you exactly what to fix</li>
        <li>Multiple platform limits in one view → no need to switch tools</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Carrier-specific behavior not simulated → some carriers handle edge cases differently</li>
        <li>No send capability → this is for counting, not sending</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste or type your message text</li>
        <li>Check the encoding type and segment count</li>
        <li>If it shows UCS-2, look for highlighted problem characters</li>
        <li>Edit to stay within your target limit</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/message-length-checker-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Message Length Checker
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up required.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#sms` `#character-count` `#message-length` `#gsm` `#text-tools`
      </p>
    </article>
  );
}
