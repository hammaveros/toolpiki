import Link from 'next/link';

export default function HexViewerPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Encoding · July 5, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Looking Inside a File — Hex View Tells You What the Extension Doesn't
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/hex-viewer-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Hex Viewer
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        A user uploaded a file claiming it was a PNG image. The extension said .png. But when I looked at the first few bytes in hex, the magic number was completely wrong. It wasn't an image at all.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When Hex View Is Actually Useful</h2>

      <p className="mb-3">Not just for security researchers — practical situations include:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Verifying file types → file extensions can be wrong, magic bytes don't lie</li>
        <li>Debugging encoding issues → seeing exactly which bytes are causing problems</li>
        <li>Understanding binary protocols → reading what was actually sent or received</li>
        <li>Inspecting compiled output → looking at bytecode or compiled data</li>
        <li>Data recovery → understanding file structure when headers are corrupted</li>
        <li>Security work → analyzing suspicious files without executing them</li>
        <li>Learning → understanding how text and binary data are actually stored</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How Hex Viewers Work</h2>

      <p className="mb-3">The traditional hex viewer layout shows three columns:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Offset → the position of each byte from the start of the file (in hex)</li>
        <li>Hex values → each byte shown as two hex digits (00–FF)</li>
        <li>ASCII → the printable ASCII character for each byte, or a dot for non-printable bytes</li>
      </ul>

      <p className="mb-4">This three-column view lets you see both the raw binary values and the text characters at the same position. You can tell at a glance where readable text starts and ends in a file.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">File Magic Numbers — The Real File Type Check</h2>

      <p className="mb-3">Every common file format starts with known byte sequences:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>PNG → <code>89 50 4E 47</code> (reads as .PNG in ASCII)</li>
        <li>JPEG → <code>FF D8 FF</code></li>
        <li>PDF → <code>25 50 44 46</code> (reads as %PDF)</li>
        <li>ZIP → <code>50 4B 03 04</code> (reads as PK)</li>
        <li>ELF executable → <code>7F 45 4C 46</code> (reads as .ELF)</li>
        <li>GIF → <code>47 49 46 38</code> (reads as GIF8)</li>
      </ul>

      <p className="mb-4">If the first bytes don't match the expected magic number for the file extension, something is wrong.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">View text or file data in hexadecimal format:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Text input mode:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Type or paste any text and see it as hex bytes</li>
        <li>Each character shown with its hex value, decimal value, and position</li>
        <li>Traditional three-column hex dump layout</li>
        <li>Non-ASCII characters shown with their full byte sequences</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Display options:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Bytes per row → 8, 16, or 32 bytes per line</li>
        <li>Uppercase or lowercase hex digits</li>
        <li>Show or hide the ASCII column</li>
        <li>Highlight specific byte values</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Navigation:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Jump to offset</li>
        <li>Search for hex pattern or ASCII string</li>
        <li>Copy selection as hex or as text</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Immediate view without installing software → useful for a quick check</li>
        <li>Text input makes it easy to see how a string looks in bytes</li>
        <li>Non-ASCII character handling is clear → multi-byte characters shown correctly</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Browser-based → not suitable for very large files (use a desktop hex editor for files over a few MB)</li>
        <li>Text input only → for binary file upload, you would need a desktop tool like HxD or xxd</li>
        <li>No editing → this is a viewer, not an editor</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste text or enter a string you want to inspect</li>
        <li>Read the hex dump in the three-column view</li>
        <li>Adjust display options if needed</li>
        <li>Copy the hex output if you need it elsewhere</li>
      </ol>

      <p className="mb-4">Good for understanding how text becomes bytes, especially for encoding debugging.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/hex-viewer-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Hex Viewer
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No sign-up required. Nothing is uploaded to a server.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#hex-viewer` `#hex-dump` `#binary` `#encoding` `#developer-tools`
      </p>
    </article>
  );
}
