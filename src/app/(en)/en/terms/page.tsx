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
          Last updated: {new Date().toISOString().split('T')[0]}
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. Purpose
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            These Terms of Service govern the use of online web utility tools
            provided by {siteConfig.name} (the &quot;Service&quot;) and define the rights,
            obligations, and responsibilities between the Service and users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. Services Provided
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The Service provides the following features for free:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Text conversion and processing tools</li>
            <li>Encoding/Decoding tools</li>
            <li>Formatters and converters</li>
            <li>Image editing tools</li>
            <li>Color-related tools</li>
            <li>Calculators and generators</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. Service Usage
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            1. The Service can be used by anyone without registration.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            2. All data processing occurs in the user&apos;s browser and is not
            transmitted to or stored on our servers.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            3. The Service aims to be available 24/7, but may be temporarily
            suspended for system maintenance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. User Obligations
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Users must not engage in the following activities:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Actions that interfere with stable service operation</li>
            <li>Processing data for illegal purposes using the Service</li>
            <li>Unauthorized copying or distribution of Service content</li>
            <li>Other actions that violate applicable laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. Disclaimer
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            1. The Service is provided free of charge, and we are not responsible
            for any damages arising from service use.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            2. We do not guarantee the accuracy, completeness, or reliability
            of results from tools provided by the Service.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            3. Security and backup of data processed through the Service is
            the user&apos;s responsibility.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. Intellectual Property
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Intellectual property rights for the Service&apos;s design, logo, and content
            belong to the Service operator.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. Changes to Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            These terms may be changed as needed, and amended terms take effect
            upon posting on the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about these Terms of Service, please contact us.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Email: hammaveros@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
