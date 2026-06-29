import Link from 'next/link';

export default function ColorBlindSimulatorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Color · July 13, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        See How Colors Look to Colorblind Users — Accessibility Simulation
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/color-blind-simulator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Color Blind Simulator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        We shipped a dashboard with red and green status indicators. A user emailed us saying they couldn't tell them apart. I had never thought about it.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Colorblindness Accessibility Matters</h2>

      <p className="mb-3">Approximately 8% of men and 0.5% of women have some form of color vision deficiency. That's about 1 in 12 men. In a typical user base of 10,000 people, you're looking at hundreds of users who experience color differently than you do.</p>

      <p className="mb-3">The impact is real:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Red/green status indicators → the most common failure. "Is this error or success?" becomes genuinely ambiguous.</li>
        <li>Charts and graphs with color-only encoding → multiple data series become indistinguishable</li>
        <li>Form validation → red error borders that are the only signal something is wrong</li>
        <li>Maps → region data encoded purely in color</li>
        <li>Traffic light metaphors → used heavily in dashboards, project management tools, health apps</li>
      </ul>

      <p className="mb-4">The fix isn't always "don't use color." It's "don't use color as the only signal." Adding an icon, a label, a pattern, or a text indicator alongside the color solves the problem.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Types of Color Vision Deficiency</h2>

      <p className="mb-3">The main types:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Deuteranopia (red-green, green-weak) → most common; difficulty distinguishing red and green. ~5% of men.</li>
        <li>Protanopia (red-green, red-weak) → reds appear darker; difficulty distinguishing red, orange, yellow, green. ~1% of men.</li>
        <li>Tritanopia (blue-yellow) → rare; difficulty distinguishing blue and green, yellow and red. Less than 0.1%.</li>
        <li>Achromatopsia (total color blindness) → extremely rare; sees only in shades of gray.</li>
      </ul>

      <p className="mb-4">Deuteranopia is by far the most common, which is why red/green is the most frequently cited accessibility problem. But testing for all types is best practice.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <p className="mb-3">Simulates how a color palette or specific colors appear under different types of color vision deficiency:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enter a hex color or a set of colors</li>
        <li>See how each color appears under Deuteranopia, Protanopia, Tritanopia, and Achromatopsia</li>
        <li>Side-by-side comparison between original and simulated view</li>
        <li>Apply simulation to a palette to see which color pairs become hard to distinguish</li>
        <li>All processing in the browser — no data sent to a server</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Practical Design Guidance</h2>

      <p className="mb-3">After running a simulation, here's what to look for:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Do two "different" colors become visually similar in the simulation? → They need a non-color differentiator</li>
        <li>Does contrast stay sufficient? → A color pair with enough contrast for normal vision might lose contrast under CVD</li>
        <li>Are interactive elements still identifiable? → Buttons, links, and warnings need to remain distinct</li>
      </ul>

      <p className="mb-3">Solutions that don't require removing color:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Add icons alongside color-coded status indicators (✓, ✗, ⚠)</li>
        <li>Add text labels ("Error", "Success", "Warning")</li>
        <li>Use patterns or textures in charts instead of relying on color alone</li>
        <li>Ensure sufficient contrast ratios even in simulated views</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Covers all major CVD types in one tool</li>
        <li>Side-by-side comparison is immediate and visual</li>
        <li>Useful early in the design process before implementing a color system</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Simulates single colors or palettes — not full UI screenshots (see the image simulator for that)</li>
        <li>Color vision is highly individual; simulations are approximations, not exact representations</li>
        <li>Doesn't account for context — how colors read depends on their surroundings</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Enter the colors from your design — your brand palette, button colors, status indicators</li>
        <li>Review each simulation type</li>
        <li>Identify color pairs that become hard to distinguish</li>
        <li>Add non-color differentiators for those cases</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/color-blind-simulator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Color Blind Simulator
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Check your palette. Make design decisions that work for everyone.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#color-blindness` `#accessibility` `#colorblind-simulator` `#wcag` `#design-tools`
      </p>
    </article>
  );
}
