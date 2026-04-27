import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `Contact - ${siteConfig.name}`,
  description: 'Get in touch with ToolPiki for feedback, tool suggestions, bug reports, or general inquiries. Every message is read by the person who runs the site.',
};

export default function ContactPageEn() {
  const email = siteConfig.contactEmail;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Contact
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          ToolPiki is a small site run by a single person. That means there is no support bot and no
          ticketing queue — every email is <strong>read and answered by the person who actually
          maintains the site</strong>. If something is broken, missing, or hard to use, it genuinely
          helps to hear about it.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">
          What kind of messages are welcome?
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Bug reports</strong> — a tool is not working or producing unexpected output</li>
          <li><strong>Tool suggestions</strong> — useful utilities you wish were on the site</li>
          <li><strong>Improvement ideas</strong> — better defaults, missing options, layout fixes</li>
          <li><strong>Typo and translation reports</strong> — awkward English or Korean phrasing</li>
          <li><strong>Advertising inquiries</strong> — partnerships related to ads on the site</li>
          <li><strong>General questions</strong> — about how the site is operated, data handling, or terms</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">
          Helpful details for bug reports
        </h2>
        <p>
          Including the following information makes it much faster to track down a problem:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>The tool name or page URL where the issue happened</li>
          <li>The input you used (a small reproducible example helps a lot)</li>
          <li>Any error message or a screenshot of the broken state</li>
          <li>Your browser and operating system (for example, Chrome 122 on Windows 11)</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">
          Response times
        </h2>
        <p>
          Most messages get a reply within 1–3 business days. Because this is a solo project,
          weekends, holidays, or travel can occasionally delay responses. For simple bug reports we
          sometimes prioritize fixing the issue on the site over writing a reply, so do not be
          surprised if you see the bug fixed before the reply arrives.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-8 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Contact email</p>
        <a
          href={`mailto:${email}`}
          className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-medium"
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
