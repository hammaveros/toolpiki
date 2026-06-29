import Link from 'next/link';

export default function FlexboxPlaygroundPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Formatter · July 17, 2026 · 5 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Flexbox Makes Sense Once You Can See It. Here Is a Playground That Lets You.
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/flexbox-playground-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Flexbox Playground
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        You have read the flexbox guide twice. You still have to look up whether it is <code>align-items</code> or <code>justify-content</code> that controls horizontal alignment when the flex direction is row.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Flexbox Trips People Up</h2>

      <p className="mb-3">Flexbox is powerful and most developers use it daily. But a few things remain confusing no matter how experienced you are:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>The main axis and cross axis switch when you change <code>flex-direction</code> — what <code>justify-content</code> does changes depending on whether you are in row or column mode</li>
        <li><code>align-items</code> aligns children on the cross axis, not the main axis — this is counterintuitive when you first learn it</li>
        <li><code>align-self</code> overrides <code>align-items</code> for individual children, but only along the cross axis</li>
        <li><code>flex-grow</code>, <code>flex-shrink</code>, and <code>flex-basis</code> interact in ways that are hard to predict without seeing them live</li>
        <li><code>flex-wrap</code> changes the layout significantly — wrapping items with <code>align-content</code> is a completely different mental model from non-wrapping flex</li>
        <li>The shorthand <code>flex: 1</code> expands to <code>flex: 1 1 0%</code>, not <code>flex: 1 1 auto</code> — this difference matters in some layouts</li>
      </ul>

      <p className="mb-4">Reading about these properties is fine. Changing them and seeing the result in real time is how the mental model actually clicks.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Flexbox Playground Does</h2>

      <p className="mb-3">The tool gives you a live flexbox container with adjustable children. Every CSS flexbox property is exposed as a toggle or dropdown, and the layout updates immediately as you change values.</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Container properties (applied to the flex parent):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>flex-direction</code> → row, row-reverse, column, column-reverse</li>
        <li><code>flex-wrap</code> → nowrap, wrap, wrap-reverse</li>
        <li><code>justify-content</code> → flex-start, flex-end, center, space-between, space-around, space-evenly</li>
        <li><code>align-items</code> → stretch, flex-start, flex-end, center, baseline</li>
        <li><code>align-content</code> → same options as justify-content, applies when wrapping</li>
        <li><code>gap</code> → row-gap and column-gap controls</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Item properties (applied to individual flex children):</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>flex-grow</code> → 0 to 5 slider per item</li>
        <li><code>flex-shrink</code> → 0 to 3 slider per item</li>
        <li><code>flex-basis</code> → auto, 0, or fixed pixel values</li>
        <li><code>align-self</code> → overrides container's align-items for a specific child</li>
        <li><code>order</code> → change visual order without changing DOM order</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Playground controls:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Add or remove flex children</li>
        <li>Resize each child to different widths and heights to see how the container responds</li>
        <li>Toggle container width constraints to see how flex-wrap behaves at different breakpoints</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Output:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Generated CSS for the container and each item, updated live</li>
        <li>Copy container CSS button</li>
        <li>Copy item CSS button per child</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Things Worth Experimenting With</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">The justify-content and align-items swap:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Set flex-direction to row, then set justify-content: center → items center horizontally</li>
        <li>Switch flex-direction to column — now justify-content: center → items center vertically</li>
        <li>Seeing this switch happen live explains why the mental model trips people up</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">flex-grow behavior:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Add three children: set the first to flex-grow: 1, the second to flex-grow: 2, third to flex-grow: 0</li>
        <li>Watch how the available space gets distributed proportionally</li>
        <li>Set flex-basis: 0 on all three and observe how the space division changes</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Wrapping behavior:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Add five items with fixed widths and enable flex-wrap: wrap</li>
        <li>Resize the container width to see items wrap to the next line</li>
        <li>Toggle align-content to see how multi-line flex containers distribute rows</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Common Flexbox Recipes</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Centering an element both horizontally and vertically:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>display: flex; justify-content: center; align-items: center;</code></li>
        <li>Classic solution — the playground confirms it works and shows why</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Navigation bar with logo left, links right:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>display: flex; justify-content: space-between; align-items: center;</code></li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Sidebar + main content layout:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Sidebar: <code>flex: 0 0 250px;</code> (does not grow or shrink, fixed width)</li>
        <li>Main: <code>flex: 1;</code> (takes up all remaining space)</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Equal-width columns:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>All children: <code>flex: 1;</code></li>
        <li>All children grow equally and share the container width</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Covers all flexbox container and item properties in one place</li>
        <li>Adding and resizing children makes flex-grow behavior genuinely understandable</li>
        <li>Generated CSS output is immediately usable in a real project</li>
        <li>No setup, no account — open it and start experimenting</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Does not cover CSS Grid — that is a separate layout system and a separate tool</li>
        <li>No saved layouts — each session starts fresh</li>
        <li>Preview area is a simplified container — real-world complexity (nested flex, overflow, etc.) is not simulated</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Open the Flexbox Playground</li>
        <li>Adjust container properties using the dropdowns and toggles on the left panel</li>
        <li>Add, remove, or resize children using the item controls</li>
        <li>Experiment with individual item properties by selecting a specific child</li>
        <li>Copy the generated CSS when you have the layout you want</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/flexbox-playground-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Flexbox Playground
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Change a value. See the layout update. Understand why it works.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#flexbox` `#css-layout` `#css-flexbox` `#web-development` `#design-tools` `#free-tools`
      </p>
    </article>
  );
}
