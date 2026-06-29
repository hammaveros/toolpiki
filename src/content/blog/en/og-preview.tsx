import Link from 'next/link';

export default function OgPreviewPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">SEO Tools · July 10, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Your Link Preview on Slack Looks Terrible. Fix It Before You Ship
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/og-preview-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Open Graph Preview Tool
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Deployed a new page. Posted it in the team Slack channel. The link preview showed the wrong title, a placeholder image, and a truncated description that cut off at an awkward place. Not a great look.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Where Open Graph Previews Show Up</h2>

      <p className="mb-3">Basically everywhere a URL gets shared:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Slack, Teams, Discord → link unfurling shows the OG card</li>
        <li>Twitter/X → the card preview when you paste a URL in a tweet</li>
        <li>LinkedIn → article previews in posts</li>
        <li>Facebook → link posts use OG data for the preview</li>
        <li>WhatsApp, iMessage → link previews in messages</li>
        <li>Search engine results → some use OG description as the snippet</li>
        <li>Bookmarking tools → Pocket, Instapaper, browser bookmarks use OG title</li>
      </ul>

      <p className="mb-4">
        Open Graph meta tags were originally created by Facebook in 2010 to standardize how URLs appear when shared on social platforms. They've since become a de facto standard used by most platforms that render link previews. Getting them right affects how your content appears every time anyone shares your URL.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why OG Tags Are Easy to Get Wrong</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Title too long → platforms truncate at different lengths</li>
        <li>Description not set → platform falls back to first paragraph of text</li>
        <li>Image wrong dimensions → shown letterboxed, zoomed, or not shown at all</li>
        <li>Image URL not absolute → won't load when the page is fetched by a crawler</li>
        <li>Twitter Card tags missing → Twitter falls back to OG tags, which may not fit the card layout</li>
        <li>Cache issues → updated tags don't show because the platform cached the old version</li>
      </ul>

      <p className="mb-4">
        The problem is that you can't see these issues until you actually share the URL and see the preview. By then the page might already be deployed. Testing before deployment requires a tool that fetches the page and renders the expected preview — which is exactly what this does.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Core features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter a URL — the tool fetches the page and reads its OG tags</li>
        <li>Shows a preview card as it would appear on Twitter, Facebook, LinkedIn, and Slack</li>
        <li>Lists all detected OG meta tags with their values</li>
        <li>Warns about missing required tags</li>
        <li>Flags issues: title too long, image wrong size, relative URLs</li>
        <li>Shows raw meta tag output alongside the visual preview</li>
      </ul>

      <p className="mb-3">Practical extras:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Toggle between platform previews to see the differences</li>
        <li>Instructions for refreshing the OG cache on major platforms</li>
        <li>Quick-copy snippets for missing tags</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Open Graph Tags That Matter Most</h2>

      <p className="mb-4">
        The essential four that every page should have:
      </p>

      <p className="mb-4">
        <code>og:title</code> — The title of the page as it should appear in the preview card. Keep it under 60 characters to avoid truncation. This is separate from the HTML <code>&lt;title&gt;</code> tag — you can have a longer document title and a shorter OG title.
      </p>

      <p className="mb-4">
        <code>og:description</code> — A description for the preview card, typically 150–160 characters. Should be compelling and relevant, not just the first sentence of the body text.
      </p>

      <p className="mb-4">
        <code>og:image</code> — The image to show in the preview card. Must be an absolute URL. Recommended dimensions: 1200×630 pixels (1.91:1 ratio) for most platforms. Square 1:1 images also work for some card layouts. The image should be under 5MB and a common format (JPEG, PNG, WebP).
      </p>

      <p className="mb-4">
        <code>og:url</code> — The canonical URL of the page. Helps platforms associate shares of the same content.
      </p>

      <p className="mb-4">
        For Twitter specifically, add <code>twitter:card</code> set to <code>summary_large_image</code> if you want the big image card layout. Without it, Twitter falls back to the smaller <code>summary</code> card, which shows a small thumbnail.
      </p>

      <p className="mb-4">
        One common mistake: setting the <code>og:image</code> to a relative URL like <code>/images/og.png</code>. When Twitter or Slack fetches your page, they see a relative URL that doesn't resolve without knowing your domain. Always use absolute URLs: <code>https://yourdomain.com/images/og.png</code>.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Cache Problem</h2>

      <p className="mb-4">
        Even after you fix your OG tags and deploy, you may still see old previews. Every platform that shows link previews caches the scraped data. Twitter's card validator lets you force a re-scrape. Facebook has the Sharing Debugger. LinkedIn has the Post Inspector. For Slack, there's no direct way to force a refresh — you have to wait for the cache to expire (usually 24–72 hours) or add a query parameter to the URL to make it look like a different URL.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Visual preview across multiple platforms is the key feature — shows you what you're getting</li>
        <li>Missing tag warnings catch the most common oversights</li>
        <li>Faster than opening each platform's own debugger tool</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Requires the page to be publicly accessible (can't test localhost)</li>
        <li>Previews are approximations — each platform renders slightly differently</li>
        <li>Can't force cache refresh on external platforms</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Enter the URL of the page you want to check</li>
        <li>See the OG preview as it would appear on each platform</li>
        <li>Check the warnings for missing or malformed tags</li>
        <li>Fix the issues and re-check before deploying</li>
      </ol>

      <p className="mb-4">Takes seconds — much faster than deploying, sharing, and realizing it's broken.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/og-preview-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Open Graph Preview Tool
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Check your OG tags before your next deployment.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#open-graph` `#og-tags` `#social-preview` `#seo` `#developer-tools`
      </p>
    </article>
  );
}
