import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: `About - ${siteConfig.name}`,
  description: 'ToolPiki is a free, browser-based toolkit for everyday tasks. Learn about the project, our operating philosophy, how new tools are chosen, and how we handle your data.',
};

export default function AboutPageEn() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        About ToolPiki
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            What is ToolPiki?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki (toolpiki.com) is a free collection of browser-based utilities for the small,
            repetitive tasks that fill up a working day. The name is a blend of &quot;Tool&quot; and
            &quot;Pick&quot; — <strong>pick the tool you need and use it right away</strong>.
            Counting characters, formatting JSON, compressing an image, generating a QR code,
            converting between color formats — none of these tasks deserve a full app install or a
            registration form, but skipping them adds up to real time. ToolPiki is meant to be a
            quiet workbench where each of those small chores has a clean, reliable home.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            Most tools are usable the moment the page loads. Results update as you type, and you can
            either copy the output to your clipboard or download it as a file. Tools you bookmark show
            up at the top of the homepage on your next visit, and a separate &quot;recently used&quot;
            section helps you find what you opened earlier. There are over 100 tools in total, sorted
            by category, and the search bar matches against names, descriptions, and tags so partial
            keywords work fine.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Operating Philosophy
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki was built out of frustration with the typical online utility experience —
            ad-stuffed pages, mandatory signups, surprise paywalls, and tools that quietly upload
            your data to a server. The whole point of this site is to remove that friction. We try to
            keep the following principles in everything we ship:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-2">
            <li>
              <strong>No signup, no login</strong>: every tool works the moment you open it. There is
              no account creation, email confirmation, or trial period.
            </li>
            <li>
              <strong>Inputs stay on your device</strong>: nearly every tool runs entirely in the
              browser, so the text and files you provide are not uploaded to a ToolPiki server. This
              makes the site reasonably safe for work documents and personal files.
            </li>
            <li>
              <strong>Ads stay out of the way</strong>: a small number of ads cover operating costs,
              but their position and density are limited so they do not interrupt actual usage.
              Sensitive pages — horoscopes, fortunes, tarot, compatibility, lottery, chat — show no
              ads at all.
            </li>
            <li>
              <strong>Speed and simplicity over flash</strong>: clean layouts, instant results, and
              easy export beat animations and gimmicks every time.
            </li>
            <li>
              <strong>Tools we actually use</strong>: each tool is added because it solves a real
              problem we hit ourselves, or because users have asked for it repeatedly. Trend-chasing
              for its own sake is avoided.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Who Runs This?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            ToolPiki is a <strong>solo project run by a single developer</strong>. There is no parent
            company, no holding group, and no marketing team. One person handles development, design,
            content, ad management, and user support. That keeps decisions about which tools to add
            sharp and consistent, and lets the site move quickly when something needs to change.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            The flip side is that this is a small operation, not a 24/7 service. If something breaks
            late at night, it might take a day to get fixed, and feature work moves at the pace of one
            person. The trade-off is that user feedback is read directly by the person who can act on
            it. Reasonable suggestions often ship within days, and most emails get a real reply.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            How New Tools Are Chosen
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Before a tool is added to the site, it has to pass a short checklist:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-2">
            <li>
              <strong>Real demand</strong>: the tool addresses a problem we have seen ourselves,
              encountered in user feedback, or noticed in clear search demand.
            </li>
            <li>
              <strong>No duplicates</strong>: if the site already has a similar tool, we improve the
              existing one instead of adding a parallel version.
            </li>
            <li>
              <strong>Client-side first</strong>: whenever possible, the tool runs in the browser. This
              keeps inputs private and makes results show up faster.
            </li>
            <li>
              <strong>Hand-checked</strong>: even when a third-party library handles the heavy lifting,
              we test the output, edge cases, mobile layout, and dark mode before publishing.
            </li>
            <li>
              <strong>Ongoing maintenance</strong>: tools are revisited regularly to track library
              updates and browser changes. Tools that almost no one uses are eventually retired so the
              catalogue stays focused.
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            Tools are organised into seven categories — text, encoding, formatters, image, color,
            calculators &amp; generators, and fun &amp; tests — with somewhere between 8 and 25 tools
            in each. The search bar checks tool names, descriptions, and tags, so a partial keyword
            usually finds what you need.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Site Policies
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Advertising.</strong> ToolPiki uses Google AdSense and Kakao AdFit to cover
            operating costs. Ads only appear in places that do not interrupt the tool itself, and they
            are intentionally not shown on horoscope, fortune, tarot, compatibility, lottery, or chat
            pages. Those pages are also excluded from search engine indexing.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            <strong>Fun-category tools.</strong> Horoscopes, personality tests, and similar tools are
            entertainment only — the result screens make this clear. Please do not use them as the
            basis for important decisions.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            <strong>Data handling, in short.</strong> Inputs, uploaded files, and tool options stay in
            your browser and are not sent to a ToolPiki server. Bookmarks, recent history, and
            preferences such as dark mode are kept in your browser&apos;s local storage on your device
            only. Anonymous usage statistics may be collected to improve the service. The full details
            live in our <a href="/en/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-3">
            <strong>Content and copyright.</strong> The site&apos;s design, icons, and written content
            belong to the operator. Outputs you generate with the tools — QR codes, processed images,
            color values, formatted code, and so on — are yours to use freely. Full usage terms are in
            the <a href="/en/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Contact
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Tool suggestions, bug reports, feature requests, and ad inquiries can all go to the email
            address below. Most messages get a real reply, and reasonable feedback often ships within
            a few days.
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
