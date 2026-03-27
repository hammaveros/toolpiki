import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - ToolPiki',
  description: 'ToolPiki is a free online web tools collection. Text conversion, image editing, encoding, and more.',
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
            ToolPiki is a free online utility service that provides commonly needed web tools.
            Anyone can use it without registration, and all processing happens in your browser,
            so your data is never sent to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Available Tools
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Text Tools</strong> - Character counter, case converter, text diff, etc.</li>
            <li><strong>Encoding/Decoding</strong> - Base64, URL encoding, hash generator, etc.</li>
            <li><strong>Formatters</strong> - JSON, SQL, CSS formatter and minifier</li>
            <li><strong>Image Tools</strong> - Image compression, conversion, resize</li>
            <li><strong>Color Tools</strong> - Color converter, palette generator</li>
            <li><strong>Calculators</strong> - Age calculator, unit converter, regex tester</li>
            <li><strong>Fun Tools</strong> - Lottery generator, tarot, personality tests, etc.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            About the Project
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki is an independent project run by an individual developer.
            It is not affiliated with any company, agency, or organization.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Feedback for service improvement is always welcome.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions, please contact us at the email below.
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
