import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `Terms of Service - ${siteConfig.name}`,
  description: `Terms of Service for ${siteConfig.name}. Covers usage, user responsibility, operator rights, and changes or discontinuation of the service.`,
};

export default function TermsPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Terms of Service
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          Effective date: 2026-04-27
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            These Terms of Service govern your use of ToolPiki (toolpiki.com, the &quot;Site&quot;).
            By accessing or using the Site, you agree to be bound by these Terms. If you do not agree,
            please discontinue use of the Site.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            These Terms are applied together with our
            {' '}<a href="/en/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
            In the event of conflict between the two, these Terms take precedence.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. Description of Service
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki provides a collection of browser-based utilities at no charge. No software
            installation or account registration is required. The Site offers tools across the
            following categories:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Text analysis and manipulation (character counting, sorting, comparison, etc.)</li>
            <li>Data encoding and conversion (Base64, URL encoding, hashing, etc.)</li>
            <li>Code formatters (JSON, XML, SQL, YAML, CSS, and more)</li>
            <li>Image processing and optimization (compression, resizing, format conversion)</li>
            <li>Color utilities (HEX/RGB/HSL conversion, palettes, gradients)</li>
            <li>Calculators and generators (UUID, QR code, password, etc.)</li>
            <li>Fun and entertainment tools (horoscopes, personality tests, recommendations)</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Most tools run entirely in the browser, so input data is not uploaded to a ToolPiki
            server.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. Conditions of Use
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            a) All tools are freely accessible without signing up.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            b) Data you enter is processed exclusively within your browser. Nothing is sent to or
            stored on a ToolPiki server. See the Privacy Policy for full details.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            c) We strive to keep the Site available around the clock, but downtime may occur due to
            maintenance, system updates, or upstream network issues. The operator is not liable for
            losses caused by such interruptions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. User Responsibilities and Prohibited Conduct
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            You agree to comply with applicable law and these Terms. You will not:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Overload the Site with automated bulk requests, bots, or scripts</li>
            <li>Use any tool for unlawful, harmful, sexually explicit, or violent purposes</li>
            <li>Reproduce or redistribute the Site&apos;s source code, design, or content without permission</li>
            <li>Exploit security vulnerabilities or otherwise interfere with normal operation</li>
            <li>Infringe the intellectual property, image, or privacy rights of others</li>
            <li>Violate applicable laws including copyright and information network laws</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            If prohibited use is detected, the operator may restrict access from the relevant IP or
            actor without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            a) The Site is provided free of charge on an &quot;as-is&quot; basis. The operator accepts
            no liability for any loss or damage resulting from use of the Site.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            b) Tool outputs are not guaranteed to be accurate, complete, or fit for any particular
            purpose. For critical applications — legal, medical, financial, security — you should
            independently verify all results.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            c) Tools in the <strong>fun category</strong> — horoscopes, fortunes, tarot,
            compatibility, personality tests — are entertainment only. Please do not use their
            output as the basis for important decisions.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            d) You are solely responsible for managing and backing up any data you process through
            the Site. The operator is not liable for data loss caused by closing the browser, clearing
            cache, or similar user actions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. Operator Rights
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The operator retains the following rights to maintain service quality and reasonable
            operation:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Add, change, merge, or remove tools at any time</li>
            <li>Retire tools that see very low usage or become difficult to maintain</li>
            <li>Adjust ad placements and switch between ad networks</li>
            <li>Update these Terms and the Privacy Policy</li>
            <li>Restrict access in response to violations of these Terms</li>
            <li>Modify or remove content in response to legal or rights-infringement notices</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. Service Changes and Discontinuation
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The operator may change or discontinue any part of the Site for reasonable cause. We try to
            announce material changes in advance, but in urgent cases — security incidents, upstream
            outages, regulatory changes — changes may take effect without prior notice.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            The operator is not liable for any losses arising from service changes, downtime, or
            discontinuation. If the Site is shut down entirely, reasonable advance notice will be
            provided where possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. Advertising
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The Site uses ad networks such as Google AdSense and Kakao AdFit to cover operating costs.
            Ads are placed so they do not interrupt tool usage, and they are intentionally not shown
            on horoscope, fortune, tarot, compatibility, lottery, or chat pages.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Any transaction with a product or service shown in an ad takes place directly between the
            advertiser and the user. The operator is not a party to those transactions and bears no
            responsibility for them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            9. Intellectual Property
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            All rights to the Site&apos;s design, icons, logos, written content, and tool descriptions
            belong to the operator. Reproduction, redistribution, or commercial use without permission
            is prohibited.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Outputs you generate with the tools — QR codes, processed images, color values, formatted
            code, and so on — are yours to use freely.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            10. Modifications to These Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We reserve the right to update these Terms at any time. Revised Terms become effective once
            published on this page. Material changes that disadvantage users will be announced with
            reasonable advance notice before taking effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            11. Governing Law and Disputes
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            These Terms are governed by the laws of the Republic of Korea. In the event of a dispute,
            the operator and the user will first attempt to resolve the matter amicably through
            good-faith discussion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            12. Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Questions or feedback about these Terms can be sent to the email below.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Email:{' '}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
