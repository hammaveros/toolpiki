'use client';

import { Card } from '@/components/ui/Card';

export function HomeContentEn() {
  return (
    <div className="space-y-8 text-gray-700 dark:text-gray-300">
      {/* About */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          What is ToolPiki?
        </h2>
        <p className="leading-relaxed mb-3">
          ToolPiki is a collection of browser-based utilities designed to handle the small, repetitive tasks that eat into your day.
          Whether you need to tidy up a JSON payload, shrink an image before uploading, or look up a color code, you can do it here in seconds without installing anything.
        </p>
        <p className="leading-relaxed mb-3">
          Privacy is built in by default. Every tool runs locally in your browser, which means your data never leaves your device.
          There are no accounts to create, no subscriptions to manage, and no hidden paywalls.
        </p>
        <p className="leading-relaxed">
          The site is fully responsive and works equally well on desktops, tablets, and phones.
          Over 100 tools are available today, and new ones are added regularly based on user feedback.
        </p>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          What Can You Do Here?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📝 Text Processing</h3>
            <p className="text-sm">
              Count characters, sort lines, strip whitespace, analyze word frequency, or compare two blocks of text side by side — perfect for writers and data wranglers.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔐 Encoding & Hashing</h3>
            <p className="text-sm">
              Encode or decode Base64, URLs, and HTML entities. Generate hashes, inspect JWTs, or convert between Unicode formats — all common developer tasks in one place.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📋 Code Formatters</h3>
            <p className="text-sm">
              Beautify or minify JSON, XML, SQL, YAML, CSS, and JavaScript. Quickly clean up messy code or prepare compressed output for production.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ Image Editing</h3>
            <p className="text-sm">
              Compress, resize, crop, rotate, and convert images between PNG, JPG, and WebP. Create favicons or extract Base64 strings — no software needed.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎨 Color Utilities</h3>
            <p className="text-sm">
              Convert between HEX, RGB, and HSL. Generate palettes, build gradients, check accessibility contrast ratios, or extract dominant colors from an image.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔢 Calculators & Generators</h3>
            <p className="text-sm">
              Create UUIDs, QR codes, and secure passwords. Calculate date differences, convert units and number bases, or compute percentages on the fly.
            </p>
          </Card>
        </div>
      </section>

      {/* How to Use */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Getting Started
        </h2>
        <div className="space-y-2">
          <p>Every tool follows the same straightforward workflow:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Type a keyword in the search bar or pick a category from the homepage.</li>
            <li>Paste your data or drag and drop a file onto the tool page.</li>
            <li>Tweak any options and hit the action button — results appear instantly.</li>
            <li>Copy the output to your clipboard or download it as a file.</li>
          </ol>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Tap the star icon on any tool to bookmark it for faster access next time. Your recent activity is also tracked automatically.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Things to Keep in Mind
        </h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Outputs are intended as a helpful reference. For mission-critical work, always double-check the results.</li>
          <li>Image tools generate new files and never alter your originals.</li>
          <li>Older browsers may not support every feature. We recommend the latest version of Chrome, Edge, Safari, or Firefox.</li>
          <li>Extremely large files may exceed your browser's memory limit and cause processing to stop.</li>
          <li>You are responsible for how you use the results. We do not guarantee 100% accuracy.</li>
        </ul>
      </section>

      {/* Privacy & Ads */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Data Protection & Ads
        </h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Your inputs and uploaded files stay in your browser and are never transmitted to an external server.</li>
          <li>Anonymous usage statistics (page views, device info) may be collected to help improve the service.</li>
          <li>Bookmarks and recent history are stored in your browser's local storage and remain on your device only.</li>
          <li>Ads may appear to help cover operating costs, and ad networks may place cookies on your device.</li>
          <li>For full details, please review our <a href="/en/privacy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</a>.</li>
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
              Q. Is everything really free?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Yes — every tool is free with no usage limits and no hidden premium tiers.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Could my data be leaked?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. No. All processing happens inside your browser. Nothing you type or upload is ever sent to a server.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Do the tools work offline?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Once the page has loaded, most tools will continue to function even if your internet connection drops.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Are my bookmarks synced across devices?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Bookmarks are saved to your browser's local storage, so they only exist on the device where you set them.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Which browsers are supported?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Any modern browser — Chrome, Edge, Safari, or Firefox — running a recent version will work perfectly.</p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. How can I suggest a tool or report a bug?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">A. Use the feedback link at the bottom of any page. We review every submission and respond as quickly as possible.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
