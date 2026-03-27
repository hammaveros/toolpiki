import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact - ToolPiki',
  description: 'Send us your inquiries, feedback, or bug reports about ToolPiki.',
};

export default function ContactPageEn() {
  const email = siteConfig.contactEmail;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Contact
      </h1>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        For bug reports, feature requests, or any other inquiries, please reach out via email.
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <a
          href={`mailto:${email}`}
          className="text-blue-600 dark:text-blue-400 hover:underline text-lg"
        >
          {email}
        </a>
      </div>

      <a
        href={`mailto:${email}?subject=[ToolPiki] Inquiry`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Send Email
      </a>
    </div>
  );
}
