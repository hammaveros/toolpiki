import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - ToolPiki',
  description: 'ToolPiki is a free, browser-based toolkit for everyday tasks. No signup required.',
};

export default function AboutPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        About
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            What is ToolPiki?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki is a free, browser-based toolkit built for everyday productivity.
            The name combines &quot;Tool&quot; and &quot;Pick&quot; — pick the tool you need, use it instantly.
            No downloads, no accounts, no data leaving your device.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Everything runs client-side, meaning your input never touches our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Tool Categories
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Text</strong> - Character counter, diff checker, word frequency analyzer, and more</li>
            <li><strong>Encoding</strong> - Base64, URL encoding, hash generation, and more</li>
            <li><strong>Formatters</strong> - JSON, CSS, HTML, SQL code beautifiers</li>
            <li><strong>Image</strong> - Compression, format conversion, resizing</li>
            <li><strong>Color</strong> - HEX/RGB/HSL conversion, palette builder</li>
            <li><strong>Calculators</strong> - Unit conversion, QR generator, regex tester, and more</li>
            <li><strong>Fun</strong> - Horoscope, personality quizzes, random pickers, and more</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            About the Project
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki is a solo side project maintained by a single developer.
            It is not associated with any company or organization,
            and has no revenue streams other than advertising.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Got an idea for a new tool or spotted a bug? We would love to hear from you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Have a question or suggestion? Send us an email and we will get back to you.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Email:{' '}
            <a
              href="mailto:hammaveros@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              hammaveros@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
