import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `Terms of Service - ${siteConfig.name}`,
  description: `Terms of Service for ${siteConfig.name}.`,
};

export default function TermsPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Terms of Service
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          Effective date: {new Date().toISOString().split('T')[0]}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing or using ToolPiki (toolpiki.com, referred to as the &quot;Site&quot;),
            you agree to be bound by these Terms of Service.
            If you do not agree, please discontinue use of the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. Description of Service
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki offers a collection of browser-based utilities at no charge.
            No software installation or account registration is required.
            The tools span the following categories:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Text analysis and manipulation</li>
            <li>Data encoding and conversion</li>
            <li>Code formatting and beautification</li>
            <li>Image processing and optimization</li>
            <li>Color utilities and palette creation</li>
            <li>Calculators and generators</li>
            <li>Fun and entertainment tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. How the Service Works
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            a) All tools are freely accessible without signing up.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            b) Data you enter is processed exclusively within your browser.
            Nothing is sent to or stored on our servers.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            c) We strive to keep the Site available around the clock, but downtime
            may occur due to maintenance or unforeseen technical issues.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. Prohibited Conduct
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            You agree not to:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Overload the Site with automated bulk requests or scripts</li>
            <li>Use any tool for unlawful or harmful purposes</li>
            <li>Reproduce or redistribute the Site&apos;s source code or content without permission</li>
            <li>Engage in any activity that infringes the rights of others or violates applicable law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            a) The Site is provided free of charge, on an &quot;as-is&quot; basis.
            We accept no liability for any loss or damage resulting from your use of the Site.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            b) Tool outputs are not guaranteed to be accurate or complete.
            For critical applications, you should independently verify all results.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            c) You are solely responsible for managing and backing up any data
            you process through the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. Intellectual Property
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            All rights to the Site&apos;s design, icons, logos, and written content
            are owned by the Site operator.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. Modifications
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We reserve the right to update these terms at any time.
            Revised terms become effective once published on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Questions about these terms? Drop us a line.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Email: hammaveros@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
