import Link from 'next/link';

export default function ContrastCheckerPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Color · July 15, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Check Color Contrast for WCAG Accessibility — Pass or Fail, Instantly
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/contrast-checker-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Contrast Checker
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Our design used light gray text on a white background. It looked elegant in Figma. Turned out it failed WCAG AA. We had to rethink the whole palette.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Contrast Matters</h2>

      <p className="mb-3">Text that is visually hard to read is a barrier for everyone — but it's a particular problem for users with low vision, visual fatigue, or age-related changes in eyesight. About 253 million people worldwide live with some form of vision impairment. Many more have situational impairments: reading a phone in sunlight, dim environment, or tired eyes at the end of a long day.</p>

      <p className="mb-3">Poor contrast is one of the most common accessibility failures on the web. It's also one of the most preventable — you just need to check the ratio before shipping.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What WCAG Says About Contrast</h2>

      <p className="mb-3">The Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios for text and interactive elements. There are two conformance levels:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>WCAG AA (minimum) → required for most legal accessibility compliance (US ADA, EU EN 301 549, etc.)</li>
        <li>WCAG AAA (enhanced) → stricter standard; required for some government and healthcare contexts</li>
      </ul>

      <p className="mb-3">The specific ratios:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Normal text (under 18pt or under 14pt bold) → AA requires 4.5:1 | AAA requires 7:1</li>
        <li>Large text (18pt or larger, or 14pt+ bold) → AA requires 3:1 | AAA requires 4.5:1</li>
        <li>UI components (buttons, form fields, focus indicators) → AA requires 3:1</li>
        <li>Decorative elements and logos → no requirement</li>
      </ul>

      <p className="mb-4">The contrast ratio scale runs from 1:1 (identical colors, no contrast) to 21:1 (black text on white background, maximum possible contrast).</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How the Contrast Ratio Is Calculated</h2>

      <p className="mb-3">WCAG defines relative luminance as a measure of a color's intrinsic brightness on a scale from 0 (pure black) to 1 (pure white). The formula converts RGB values through a gamma correction function before combining them.</p>

      <p className="mb-3">The contrast ratio between two colors is then:</p>

      <p className="mb-3 font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded p-3">
        ratio = (L_lighter + 0.05) / (L_darker + 0.05)
      </p>

      <p className="mb-4">This formula means that white text on black (#000000) gives the maximum ratio of 21:1, while identical colors give 1:1. The 0.05 offset accounts for ambient reflectance in real viewing conditions.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter foreground and background colors in HEX, RGB, or HSL</li>
        <li>See the contrast ratio instantly</li>
        <li>Pass/fail indicators for WCAG AA and AAA at both normal and large text sizes</li>
        <li>Pass/fail for UI component requirements</li>
        <li>Live text preview → see how the colors actually look at both text sizes</li>
        <li>Suggestions for adjusting the color to reach a passing ratio</li>
      </ul>

      <p className="mb-4">The live preview is important. A 4.6:1 ratio passes AA, but whether it feels readable depends on the typeface, weight, and context. Preview it with your actual text content before finalizing.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Common Failures and How to Fix Them</h2>

      <p className="mb-3">The most frequent contrast failures in real-world designs:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Light gray text on white → classic "elegant" design choice that often fails AA</li>
        <li>Colored text on colored backgrounds → brand colors that look great together can have insufficient contrast</li>
        <li>Placeholder text → often styled lighter than label text and frequently fails</li>
        <li>Disabled state text → needs at least some minimum contrast even in disabled states</li>
        <li>White text on medium-brightness backgrounds → works on dark backgrounds but fails on mid-range colors</li>
      </ul>

      <p className="mb-3">Quick fixes that usually work:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Darken the text color → moving from #888 to #767676 moves many cases across the AA threshold</li>
        <li>Use the AAA version as your AA → if your target is AA, designing to AAA gives you a buffer</li>
        <li>Increase font weight → bold text has a lower threshold (3:1 instead of 4.5:1)</li>
        <li>Increase font size → large text (18pt+) has a lower threshold</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Instant results — no waiting, no calculation</li>
        <li>Shows all four relevant thresholds at once</li>
        <li>Live preview gives real-world context</li>
        <li>Free and requires no sign-up</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>WCAG 2.x contrast is a blunt instrument — passing doesn't guarantee readability in all contexts</li>
        <li>The new APCA (Advanced Perceptual Contrast Algorithm, used in WCAG 3.0 proposals) is more nuanced but not yet standardized</li>
        <li>Doesn't handle semi-transparent overlays automatically</li>
        <li>Context matters — passing the ratio is necessary but not sufficient</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Enter your foreground (text) color</li>
        <li>Enter your background color</li>
        <li>Read the contrast ratio and pass/fail indicators</li>
        <li>Adjust colors if needed until you pass the required level</li>
      </ol>

      <p className="mb-4">Takes about 30 seconds per color pair.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/contrast-checker-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Contrast Checker
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">WCAG AA and AAA. Instant pass/fail. Free.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#contrast-checker` `#wcag` `#accessibility` `#color-contrast` `#web-design`
      </p>
    </article>
  );
}
