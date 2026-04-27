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
          ToolPiki is a free collection of browser-based utilities built to handle the small, repetitive
          tasks that take up too much of your day. Counting characters, formatting JSON, compressing images,
          generating QR codes, converting color values — every tool runs directly in your browser, with no
          downloads, no installs, and no account creation required. The goal is simple: instead of jumping between
          ad-heavy websites or installing yet another desktop app, you can pick the tool you need and get the
          job done in a few seconds.
        </p>
        <p className="leading-relaxed mb-3">
          The most important thing to know is that <strong>everything happens locally inside your browser</strong>.
          The text you paste, the files you drop, and the options you set are processed on your device and are not
          uploaded to a ToolPiki server. When you close the tab, that data is gone. Because of this, you can use
          ToolPiki for work documents and personal files with reasonable confidence. There are no logins, no
          subscriptions, no hidden paywalls, and no premium tier.
        </p>
        <p className="leading-relaxed">
          The site is fully responsive, so it behaves the same on desktops, tablets, and phones, and a dark mode is
          available out of the box. There are over 100 tools available today, and new ones are added every week
          based on what users actually need. ToolPiki is not trying to be a flashy platform — it is meant to be a
          quiet workbench where small chores get finished cleanly, with as little friction as possible.
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
            <p className="text-sm leading-relaxed">
              Count characters and words, sort lines, remove duplicates, strip whitespace, change case,
              analyze word frequency, and compare two blocks of text side by side. Useful when writing
              blog posts, reports, or any content that needs to fit a specific length.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔐 Encoding & Hashing</h3>
            <p className="text-sm leading-relaxed">
              Encode and decode Base64, URLs, and HTML entities. Generate MD5, SHA-1, and SHA-256 hashes,
              inspect JWT payloads, and convert between Unicode formats. Common developer chores all in one
              place, with one-click copy on every result.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📋 Code Formatters</h3>
            <p className="text-sm leading-relaxed">
              Beautify or minify JSON, XML, SQL, YAML, CSS, JavaScript, and HTML. Configure indent size,
              quote style, and validation rules to match your project conventions. Great for cleaning up
              messy payloads or preparing minified output for production.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ Image Editing</h3>
            <p className="text-sm leading-relaxed">
              Compress, resize, crop, and rotate images. Convert between PNG, JPG, and WebP. Generate
              favicons or extract Base64 strings — all without installing any software. Original files are
              never overwritten; new versions are saved as separate downloads.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎨 Color Utilities</h3>
            <p className="text-sm leading-relaxed">
              Convert between HEX, RGB, and HSL. Build palettes and gradients, extract dominant colors
              from an image, and check WCAG contrast ratios for accessibility. A handy companion for
              designers, frontend developers, and anyone fine-tuning a website&apos;s look.
            </p>
          </Card>
          <Card variant="bordered" className="p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔢 Calculators &amp; Generators</h3>
            <p className="text-sm leading-relaxed">
              Generate UUIDs, QR codes, and secure passwords. Calculate date differences, convert units
              and number bases, work out percentages, or create random selections. Each tool remembers
              your preferred options inside the browser so the next visit is faster.
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
          <p>Every tool follows the same simple workflow, so you only have to learn it once.</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>
              Type a keyword in the search bar at the top, or browse the homepage by category — text, image,
              color, calculator, and so on. Search matches against tool names, descriptions, and tags so
              partial keywords work fine.
            </li>
            <li>
              Open a tool, then paste your text or drop a file onto the input area. Most tools update results
              automatically as you type, so there is no need to hit a separate &quot;run&quot; button.
            </li>
            <li>
              Adjust any options that apply — indent size, output format, compression level — using the
              controls next to the result. Each option includes a short hint about what it does.
            </li>
            <li>
              Copy the output to your clipboard with a single click, or download it as a file. For visual
              outputs like QR codes and processed images, you can choose between common formats such as
              PNG and JPG.
            </li>
            <li>
              Tap the star icon to bookmark a tool. Bookmarked tools appear at the top of the homepage on
              your next visit, and a separate &quot;recently used&quot; section also tracks tools you have
              opened lately.
            </li>
          </ol>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Things to Keep in Mind
        </h2>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            Tool outputs are intended as a helpful reference. For high-stakes work — contracts, medical
            information, financial records — always verify the result with a second source.
          </li>
          <li>
            Image tools do not modify your originals. They produce new files that you can download
            separately, and the uploaded copy lives only in your browser memory until you close the tab.
          </li>
          <li>
            Older browsers may not support every feature. We recommend using a recent version of Chrome,
            Edge, Safari, or Firefox for the smoothest experience.
          </li>
          <li>
            Very large files may exceed your browser&apos;s memory budget and cause processing to slow down
            or stop. For high-resolution images or videos, resizing first usually solves the problem.
          </li>
          <li>
            You are responsible for how you use the results. We do not guarantee 100% accuracy, especially
            for security-sensitive operations such as hashing or token decoding.
          </li>
          <li>
            Fun-category tools — horoscopes, personality quizzes, random pickers — are entertainment only.
            Please do not use them as the basis for important decisions.
          </li>
          <li>
            Some tools depend on third-party libraries, and version differences can cause minor variations
            in output. Cross-checking results between tools is a good habit when accuracy matters.
          </li>
        </ul>
      </section>

      {/* Privacy & Ads */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Data Protection &amp; Ads
        </h2>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li>
            Your inputs, uploaded files, and tool options stay in your browser. They are not sent to or
            stored on a ToolPiki server.
          </li>
          <li>
            Anonymous usage statistics — page views, device type, referrer — may be collected to help
            improve the site. This data is never linked to an individual user.
          </li>
          <li>
            Bookmarks, recent history, and preferences such as dark mode are stored in your browser&apos;s
            local storage. They live on your device only and are not synced between devices.
          </li>
          <li>
            Ads may appear on general tool pages to cover operating costs. We use <strong>Google AdSense</strong> and
            <strong> Kakao AdFit</strong> as our ad networks, and these networks may set cookies on your device
            to deliver more relevant ads.
          </li>
          <li>
            You can opt out of personalized advertising through Google Ad Settings, or block cookies entirely
            in your browser&apos;s privacy settings.
          </li>
          <li>
            Ads are intentionally not shown on horoscope, fortune, tarot, compatibility, lottery, or chat
            pages, and those pages are also excluded from search engine indexing.
          </li>
          <li>
            For the full details, please see our <a href="/en/privacy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</a> and
            {' '}<a href="/en/terms" className="text-blue-600 dark:text-blue-400 underline">Terms of Service</a>.
          </li>
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
              Q. Is everything really free? Are there hidden paywalls?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Yes, every tool is free with no usage limits. There is no signup, no card on file, and
              no premium tier. Operating costs are covered by the ads shown on general tool pages.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Could my data be leaked or stored?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Almost every tool runs entirely client-side, so the text you paste and the files you upload
              never reach a ToolPiki server. You can verify this yourself in the Network tab of your browser&apos;s
              developer tools.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Do the tools work offline?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Once a tool page has loaded, most tools will keep working even if your internet connection
              drops. A few features that depend on external services may need a connection, but the
              everyday utilities run locally.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Are bookmarks synced across my devices?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Bookmarks and recent history are stored in each browser&apos;s local storage, so they only
              exist on the device where you set them. Private or incognito sessions also keep them only
              while the window is open.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Which browsers are supported?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Recent versions of Chrome, Edge, Safari, and Firefox all work well, on both desktop and
              mobile. Internet Explorer and other legacy browsers are not supported because they lack the
              modern APIs the tools rely on.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Can I rely on the results for professional work?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Standard utilities — character counters, JSON formatters, color converters and so on — are
              fine for everyday work. We do not guarantee 100% accuracy though, so for critical use cases
              you should double-check the output with a dedicated tool or library.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Are ads shown on every page?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. No. We deliberately exclude pages that are sensitive or unsuitable for advertising —
              horoscopes, fortunes, tarot, compatibility, lottery, and chat — from showing ads. General
              tool pages may show Google AdSense and Kakao AdFit ads.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. How are new tools chosen?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. We add tools that we use ourselves or that come up in user feedback. Each tool is built
              or reviewed by hand before it goes live, and we try to avoid duplicating something the site
              already does well.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. How do I report a bug or suggest a tool?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Please use the email address on the <a href="/en/contact" className="text-blue-600 dark:text-blue-400 underline">Contact</a> page.
              Bug reports are most useful when they include the browser you used, the input that caused the
              problem, and a screenshot if possible.
            </p>
          </details>
          <details className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-gray-900 dark:text-white">
              Q. Does ToolPiki work well on mobile?
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
              A. Yes. The layout adapts to small screens automatically. Some tools that produce wide output —
              for example code formatters with long lines — are simply easier to read on a desktop, but
              everything is functional on a phone or tablet.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
