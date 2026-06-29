import Link from 'next/link';

export default function BorderRadiusGeneratorPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Color · July 17, 2026 · 3 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Getting Border Radius Right Without Guessing at Numbers
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/border-radius-generator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Border Radius Generator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        Is it 8px or 12px? Does it need to be the same on all corners, or should the top corners be more rounded? The only way to know is to see it.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Rounding Problem</h2>

      <p className="mb-3">Border radius is one of the smallest CSS properties and also one of the most commonly tweaked by eye:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>You want a card to look slightly rounded but not pill-shaped — and the difference between 8px and 16px matters a lot visually</li>
        <li>You are matching a design mockup where the radius was set in a design tool with a different unit system</li>
        <li>You need asymmetric radii — like sharp bottom corners and rounded top corners — and the CSS shorthand for that is genuinely confusing</li>
        <li>You want an elliptical corner (different horizontal and vertical radii) for a specific decorative shape</li>
        <li>You are building a component library and want to test multiple radius values before committing to a design token</li>
        <li>The CSS shorthand <code>border-radius: 10px 20px 30px 40px / 5px 10px 15px 20px</code> is technically valid but almost no one can read it at a glance</li>
      </ul>

      <p className="mb-4">A visual editor makes this a non-problem. Drag a slider, see the corners update, copy the CSS.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">The Border Radius Generator gives you a live preview element with individual controls for each corner. Here is what you can adjust:</p>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Corner controls:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Top-left, top-right, bottom-right, bottom-left — each independently adjustable</li>
        <li>Link all corners button to maintain equal radii while dragging</li>
        <li>Slider input for quick adjustment or text input for exact pixel values</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Advanced options:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Elliptical radii — separate horizontal and vertical radius values per corner</li>
        <li>Percentage-based values for responsive rounded shapes</li>
        <li>Unit switching between px, %, em, and rem</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Preview:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>A live preview box that updates as you adjust sliders</li>
        <li>Adjustable preview box dimensions so you can match the aspect ratio of your actual component</li>
        <li>Background color selector for the preview box</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Output:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Full <code>border-radius</code> CSS shorthand</li>
        <li>Expanded four-property version if you need explicit per-corner values</li>
        <li>One-click copy</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Shorthand Is Confusing — Here Is Why</h2>

      <p className="mb-3">The CSS <code>border-radius</code> shorthand follows the same top-right-bottom-left clock order as other box model properties, but it gets complicated with four values:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>border-radius: 8px</code> → all four corners are 8px</li>
        <li><code>border-radius: 8px 16px</code> → top-left and bottom-right are 8px, top-right and bottom-left are 16px</li>
        <li><code>border-radius: 8px 16px 24px</code> → top-left 8px, top-right and bottom-left 16px, bottom-right 24px</li>
        <li><code>border-radius: 8px 16px 24px 32px</code> → top-left, top-right, bottom-right, bottom-left individually</li>
      </ul>

      <p className="mb-3">And the slash notation for elliptical corners:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li><code>border-radius: 10px / 5px</code> → all corners have 10px horizontal radius, 5px vertical radius</li>
        <li>Values before the slash are horizontal, values after are vertical</li>
      </ul>

      <p className="mb-4">The generator handles all of this automatically — you move sliders and it writes the correct shorthand for you.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Practical Use Cases</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Standard card component:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>All corners equal, typically 8px to 16px depending on the design system</li>
        <li>Lock all corners and drag one slider to find the right balance</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Tab or nav item:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Rounded top corners, square bottom corners for a tab that sits on a line</li>
        <li>Set top-left and top-right to your desired radius, leave bottom corners at 0</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Pill button:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Set radius to 9999px or 50% — the generator shows you what percentage to use based on your element dimensions</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Decorative blob shape:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Enable elliptical mode and set very different horizontal and vertical radii per corner</li>
        <li>Creates organic-looking shapes without SVG</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Instant visual feedback — no guessing at numbers</li>
        <li>Handles both simple and complex shorthand correctly</li>
        <li>Elliptical corner support is a genuine differentiator from simpler tools</li>
        <li>Preview box dimensions are adjustable — you can match your actual component size</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No CSS import — you cannot paste existing border-radius values to edit them visually</li>
        <li>Preview is a simple rectangle — more complex component shapes are not simulated</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Open the Border Radius Generator</li>
        <li>Drag corner sliders or type pixel values directly</li>
        <li>Toggle "Link all corners" if you want uniform rounding</li>
        <li>Optionally enable elliptical mode for advanced shapes</li>
        <li>Copy the CSS output and paste it into your stylesheet</li>
      </ol>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/border-radius-generator-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Border Radius Generator
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">Drag a slider. See the result. Copy the CSS.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#border-radius` `#css-generator` `#design-tools` `#css-shorthand` `#ui-components` `#free-tools`
      </p>
    </article>
  );
}
