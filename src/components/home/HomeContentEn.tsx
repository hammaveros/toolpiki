'use client';

import { Card } from '@/components/ui/Card';

export function HomeContentEn() {
  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300">
      {/* About */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          About ToolPiki
        </h2>
        <p className="leading-relaxed">
          ToolPiki is a free online utility website that provides everyday tools you can use directly in your browser.
          No software installation or sign-up required — just open your browser and instantly handle tasks like text conversion, image editing, data formatting, and color code conversion.
          Text and files you input are processed entirely in your browser and never sent to any server.
          The site works seamlessly on both desktop and mobile devices, helping you save time on repetitive tasks.
        </p>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Tool Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📝 Text Tools</h3>
            <p className="text-sm">
              Character counter, case converter, line break remover, duplicate line remover, text sorter, and diff comparison for all your document processing needs.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔐 Encoding/Decoding</h3>
            <p className="text-sm">
              Base64, URL encoding, HTML entities, Unicode, Morse code, JWT decoder, and hash generators for various data transformation needs.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📋 Formatters</h3>
            <p className="text-sm">
              JSON, XML, SQL, YAML formatters and converters, CSS/JS minifier, and Markdown preview — useful for developers and general users alike.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ Image Tools</h3>
            <p className="text-sm">
              Resize, compress, convert (PNG/JPG/WebP), crop, rotate images, Base64 conversion, and favicon generator — all directly in your browser.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎨 Color Tools</h3>
            <p className="text-sm">
              HEX, RGB, HSL color code conversion, palette generator, gradient creator, contrast checker, and image color picker for design work.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔢 Calculators & Generators</h3>
            <p className="text-sm">
              UUID generator, QR code creator, date calculator, percentage calculator, number base converter, unit converter, and password generator.
            </p>
          </Card>
        </div>
      </section>

      {/* How to Use */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          How to Use
        </h2>
        <div className="space-y-2">
          <p>All ToolPiki tools follow the same simple workflow:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Search for a tool or browse by category on the main page.</li>
            <li>Enter text or upload a file on the tool page.</li>
            <li>Adjust settings as needed and click the convert/run button.</li>
            <li>Review the result, then copy or download it.</li>
          </ol>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            You can add frequently used tools to your favorites for quick access. Your recently used tools are also saved automatically.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Results & Disclaimer
        </h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>All tool outputs are provided for reference only. Please verify results for critical tasks.</li>
          <li>Image processing creates new output files without modifying your original files.</li>
          <li>Some features may behave differently depending on your browser. We recommend using the latest version of Chrome, Firefox, Safari, or Edge.</li>
          <li>Large file processing may be slow or fail due to browser memory limitations.</li>
          <li>Users are responsible for verifying results. The service provider does not guarantee accuracy.</li>
        </ul>
      </section>

      {/* Privacy & Ads */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Privacy & Advertising
        </h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Text and files you input are processed in your browser only and never sent to any server.</li>
          <li>Note: Tool processing happens entirely in your browser. However, connection info (IP, browser, etc.) may be collected for service operation and analytics.</li>
          <li>Features like favorites and recent history use your browser's local storage, which stays on your device only.</li>
          <li>Ads may be displayed to support the service, and advertising partners may use cookies.</li>
          <li>For more details, please see our <a href="/en/privacy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</a>.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Do I need to create an account?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. No, all tools are free to use without registration.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Where are my uploaded files stored?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Files are processed only in your browser and are never sent to any server. Data is cleared when you close the page.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Can I use these tools on mobile?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Yes, all tools are optimized for mobile browsers.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Is there a file size limit?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Due to browser memory constraints, very large files (tens of MB) may be difficult to process.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. What should I do if I encounter an error?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Try refreshing the page or using a different browser. If the issue persists, please contact us.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Can I request a new tool?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Yes! If you have a tool suggestion, please submit a request and we'll consider adding it.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
