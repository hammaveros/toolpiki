import Link from 'next/link';

export default function LetterQrPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Calculator · July 12, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Turn a Message into a QR Code — Shareable Letters Without Apps
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/letter-qr-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Letter QR Generator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I wanted to put a personal message on a printed card. A QR code that opens a letter felt more interesting than a URL to some website.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Is a Letter QR Code?</h2>

      <p className="mb-3">A standard QR code usually encodes a URL — scan it, get taken to a website. But QR codes can encode any text, including multi-line messages.</p>

      <p className="mb-3">A letter QR code encodes your written message directly into the QR code itself. When someone scans it, their phone shows the text — no website visit required, no app to download, no login.</p>

      <p className="mb-4">It's a way to embed a personal message in physical objects: greeting cards, product packaging, event invitations, posters, gifts.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Use Cases</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Greeting cards → print a card with a QR code that reveals a longer personal message when scanned</li>
        <li>Wedding invitations → encode ceremony details or a heartfelt note</li>
        <li>Product packaging → a message from the maker to the customer</li>
        <li>Gifts → a note attached to a physical gift, accessible by scanning</li>
        <li>Memorials → encode a tribute message on a printed or engraved memorial item</li>
        <li>Event programs → encode the full schedule or speaker notes in a compact QR code</li>
        <li>Business cards → a personal statement or pitch that's too long to print</li>
      </ul>

      <p className="mb-4">The core appeal: you can put a lot of text in a small printed space, and the person receiving it can read it whenever they want by scanning.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How Much Text Can a QR Code Hold?</h2>

      <p className="mb-3">QR codes have a maximum data capacity that depends on the error correction level you choose:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Low error correction → up to ~4,000 characters of text</li>
        <li>Medium error correction → up to ~3,000 characters</li>
        <li>High error correction → up to ~2,000 characters</li>
      </ul>

      <p className="mb-3">Higher error correction makes the code more resilient to damage (scratches, dirt, partial obscuring) but reduces capacity and increases the density of the pattern.</p>

      <p className="mb-4">For most letter use cases, 500–1,500 characters is practical. Longer messages produce denser QR codes that are harder to scan reliably, especially at small print sizes.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Write your message in a text area</li>
        <li>Preview the QR code in real time as you type</li>
        <li>Choose error correction level</li>
        <li>Customize the QR code color and background</li>
        <li>Download as PNG or SVG for printing</li>
        <li>All processing in the browser — no server, no account</li>
      </ul>

      <p className="mb-4">The live preview is useful because it shows you how the density changes as you add more text. If the code looks too dense (too many tiny squares), consider shortening your message or reducing the error correction level.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Tips for Printing</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Minimum print size → at least 2 cm × 2 cm for reliable scanning</li>
        <li>High contrast → black on white is most reliable; avoid dark-on-dark or light-on-light</li>
        <li>Quiet zone → leave a clear border of at least 4 modules around the code</li>
        <li>Test before printing at scale → scan the proof before committing to a large print run</li>
        <li>Use SVG for print → SVG scales without quality loss, better for high-DPI printing</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No infrastructure needed — recipient just scans with any phone</li>
        <li>Offline-readable — the message is in the code, not on a server</li>
        <li>Private — no data is stored anywhere</li>
        <li>Works for any occasion with a personal message</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Message is static — you can't change it after printing</li>
        <li>Very long messages create dense codes that scan less reliably</li>
        <li>No read receipt — no way to know if someone scanned it</li>
        <li>QR codes printed on curved surfaces or glossy materials can fail to scan</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Type or paste your message</li>
        <li>Watch the QR code generate live</li>
        <li>Adjust error correction and color if needed</li>
        <li>Download PNG or SVG</li>
        <li>Include in your printed design</li>
      </ol>

      <p className="mb-4">Under two minutes from message to printable QR code.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/letter-qr-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Letter QR Generator
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up. No server. Message goes straight into the QR code.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#qr-code` `#letter-qr` `#personal-message` `#greeting-card` `#print`
      </p>
    </article>
  );
}
