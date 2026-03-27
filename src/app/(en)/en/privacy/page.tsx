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
          Last updated: {new Date().toISOString().split('T')[0]}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {siteConfig.name} is a service that can be used without registration,
            and we do not directly collect personal information from users.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            However, the following information may be automatically collected during service use:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Visit date/time, IP address</li>
            <li>Browser type and operating system</li>
            <li>Pages visited and usage records</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. How We Use Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Collected information is used only for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Service provision and operation</li>
            <li>Service improvement and statistical analysis</li>
            <li>Prevention of fraudulent use</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. Cookies
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {siteConfig.name} uses cookies to improve user experience and serve advertisements.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            You can refuse or delete cookies through your browser settings,
            but some services may be limited in such cases.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. Advertising
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {siteConfig.name} displays advertisements through Google AdSense.
            Google may use cookies to display ads based on user interests.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            For more information about Google&apos;s advertising privacy practices, please see{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Google Advertising Policies
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. Data Retention
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Automatically collected information is destroyed immediately after statistical analysis,
            or stored for a period according to relevant laws before destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Email: hammaveros@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
