import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}.`,
};

export default function PrivacyPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Privacy Policy
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          Effective date: {new Date().toISOString().split('T')[0]}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. Overview
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki (toolpiki.com) values your privacy. This policy explains how
            we handle information when you use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. Client-Side Processing
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Every tool on ToolPiki runs entirely within your browser.
            Text, images, files, and any other input you provide are processed locally
            on your device and are never uploaded to our servers.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            We do not require account creation or login, so we never ask for
            personally identifiable information such as your name, email, or phone number.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. Automatically Collected Data
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            To maintain and improve the website, the following data may be logged automatically:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Timestamp and IP address of your visit</li>
            <li>Device type, browser, and operating system</li>
            <li>Pages viewed and time spent on each page</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            This data is used in aggregate form and is not linked to individual users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. Cookies and Local Storage
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki uses browser local storage to remember your preferences,
            such as dark mode settings and favorite tools.
            This data stays on your device and is not transmitted to any server.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Third-party services such as advertising and analytics providers
            may also set cookies. You can block or clear cookies in your browser settings,
            though doing so may affect certain features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. Third-Party Advertising (Google AdSense)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki may display ads served by Google AdSense to cover operating costs.
            Google uses cookies and web beacons to serve ads tailored to your browsing activity.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            You can opt out of personalized advertising at any time through{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Google Ad Settings
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. Data Retention
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Automatically collected log data is deleted promptly after analysis,
            unless a longer retention period is required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. Policy Updates
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may revise this privacy policy to reflect changes in the law or our services.
            Any updates will be posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            For privacy-related questions or requests, please reach out to us.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Email: hammaveros@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
