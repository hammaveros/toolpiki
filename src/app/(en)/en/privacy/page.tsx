import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}. Covers how data is processed, cookies, ad networks (Google AdSense, Kakao AdFit), and search-engine tools.`,
};

export default function PrivacyPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Privacy Policy
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          Effective date: 2026-04-27
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            1. Overview
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki (toolpiki.com, the &quot;Site&quot;) takes user privacy seriously. This policy explains
            what information the Site handles, which third-party services are involved, and what choices
            you have regarding your data.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            ToolPiki does not require user accounts, so personal information such as names, email
            addresses, or phone numbers is not collected directly. However, the Site does rely on
            advertising, anonymous usage analytics, and search-engine tooling, all of which involve some
            automatically collected data and third-party cookies. The sections below describe each in
            detail.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            2. Tool Inputs (Client-Side Processing)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Nearly every tool on the Site runs entirely within your browser. Text you paste, files you
            upload, and options you set are processed locally on your device and are never transmitted
            to a ToolPiki server. When you close the page, that data is gone from memory.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            There is no signup, login, or payment flow, so the Site does not collect personally
            identifiable information such as names, email addresses, phone numbers, or government IDs.
            If you voluntarily send us an email, the contents of that email are used only to respond to
            your inquiry.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            3. Automatically Collected Data
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            To operate and improve the Site, the following information may be logged automatically:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Timestamp of access and IP address (handled in masked form where possible)</li>
            <li>Device type, operating system, browser type and version</li>
            <li>Referrer URL, pages viewed, and time spent on each page</li>
            <li>Screen resolution, language, and timezone for anonymous analytics</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            This data is used in aggregate or anonymous form only. It is used for service uptime
            monitoring, identifying popular tools, and diagnosing errors. It is not used to identify
            individual users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            4. Cookies and Local Storage
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki uses two kinds of client-side storage:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>
              <strong>Local storage</strong>: stores user preferences such as dark mode, bookmarked
              tools, recent history, and per-tool option memory. This data lives on your device only and
              is never sent to a server.
            </li>
            <li>
              <strong>Cookies</strong>: may be set by advertising and analytics partners. See section 5
              for details.
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            You can block or delete cookies through your browser settings, though some features (such as
            personalized ads or saved bookmarks across sessions) may stop working as expected.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            5. Third-Party Advertising and Analytics
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The Site uses the following ad networks to cover operating costs. These services may set
            their own cookies and identifiers in order to deliver and measure advertising:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-2">
            <li>
              <strong>Google AdSense, Google Ad Manager, and DoubleClick</strong>: Google&apos;s
              advertising network may show personalized ads based on browsing activity. You can review
              Google&apos;s policies and disable personalized ads in
              {' '}<a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google Ad Settings</a>.
            </li>
            <li>
              <strong>Kakao AdFit</strong>: Kakao&apos;s advertising network, used for serving and
              measuring ads. It may use cookies or advertising identifiers for those purposes.
            </li>
            <li>
              <strong>Analytics tooling</strong>: anonymous, aggregate analytics may be used to study
              site usage. This data is not tied to individual users.
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            <strong>Pages with no ads.</strong> ToolPiki does not display ads on horoscope, fortune,
            tarot, compatibility, lottery, or chat pages. These pages are also excluded from search
            engine indexing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            6. Search Engine Tooling
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The Site uses standard webmaster tools to manage how its pages appear in search engines:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>
              <strong>Google Search Console</strong> for monitoring indexing status, search performance,
              and crawl errors at an aggregate level.
            </li>
            <li>
              <strong>Naver Search Advisor</strong> for managing visibility on Naver, including a site
              verification meta tag.
            </li>
            <li>
              <strong>Bing Webmaster Tools</strong> and similar services may be used for the same
              purpose on other search engines.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            7. Data Retention
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Automatically collected log and analytics data is deleted within a reasonable period after
            it has served its purpose, unless a longer retention period is required by applicable law.
            Any data retained by ad networks is governed by their own retention policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            8. Your Rights
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            You can exercise the following rights at any time:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
            <li>Block or clear cookies through your browser settings</li>
            <li>Disable personalized advertising via Google Ad Settings</li>
            <li>Clear local storage data (bookmarks, recent history) by clearing site data in your browser</li>
            <li>Email us with questions regarding the data handling described in this policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            9. Policy Updates
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            This privacy policy may be updated to reflect changes in the law, our services, or
            third-party policies. Updates will be posted on this page, with reasonable advance notice
            for material changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            10. Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            For privacy-related questions or requests, please reach out using the email below.
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
