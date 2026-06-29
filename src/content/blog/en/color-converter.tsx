import Link from 'next/link';

export default function ColorConverterPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Color · June 22, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        HEX, RGB, HSL: Why Designers and Developers Keep Having This Conversation
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/color-converter-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Color Converter
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        The designer sends over the brand color as HSL. The CSS file uses HEX. Figma shows RGB. You need all three and you need them now.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Color Format Gap Between Design and Development</h2>

      <p className="mb-3">
        Designers and developers work with color every day. They rarely use the same format for it.
      </p>

      <p className="mb-3">
        Designers tend to think in HSL — hue, saturation, lightness. It maps well to how humans perceive color relationships. If a color is too dark, you increase the lightness. If it feels too muted, you raise the saturation. HSL is intuitive once you know it, and most design tools expose it prominently.
      </p>

      <p className="mb-3">
        Developers tend to think in HEX. It is compact, it is what gets copied from color pickers in the browser, and it is what appears in most design systems and style guides. Copy a color from Figma's inspect panel and you probably get a HEX value.
      </p>

      <p className="mb-3">RGB sits somewhere in between. It is useful for CSS when you need alpha channel opacity (rgba). It is also what some APIs and data formats use internally.</p>

      <p className="mb-3">Common situations where the mismatch matters:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Brand guidelines document specifies HSL → your CSS file needs HEX</li>
        <li>Figma uses HEX → your Tailwind config uses HSL (the default in newer Tailwind setups)</li>
        <li>You need rgba with opacity → you have HEX, need RGB numbers to construct it</li>
        <li>A design token pipeline exports in one format → your consumption end expects another</li>
        <li>You are debugging a color that looks off → converting between formats helps you reason about what is happening</li>
        <li>A client sends a brand color as RGB values in a brief → you need HEX to drop it into code</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Each Format Is Actually For</h2>

      <p className="mb-3">
        Understanding why each format exists helps you decide which to use when you have a choice.
      </p>

      <p className="mb-3">
        <strong className="font-semibold text-gray-900 dark:text-white">HEX</strong> is shorthand for RGB expressed in base-16. `#FF5733` means R=255, G=87, B=51. It is compact, paste-friendly, and universally understood. The downside is that it is completely opaque to human intuition — there is no way to look at `#3A7BF4` and understand that it is a medium-blue without running it through something.
      </p>

      <p className="mb-3">
        <strong className="font-semibold text-gray-900 dark:text-white">RGB</strong> breaks color into red, green, and blue channels, each from 0 to 255. `rgb(255, 87, 51)` is more readable than HEX if you understand channel mixing, but still not particularly intuitive. Its main advantage in CSS is `rgba`, which adds an alpha (opacity) channel: `rgba(255, 87, 51, 0.5)` is 50% transparent. HEX can do transparency too (8-digit HEX), but rgba is more familiar.
      </p>

      <p className="mb-3">
        <strong className="font-semibold text-gray-900 dark:text-white">HSL</strong> is hue, saturation, lightness. `hsl(14, 100%, 60%)` is the same orange as the examples above, but now you can see why: hue 14 is in the red-orange range, 100% saturation is fully vivid, 60% lightness is medium bright. If you want a lighter version, you increase the lightness. HSL is the format that makes color relationships legible without running the code.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Problem with Just Searching for a Converter</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Many converters only do HEX to RGB → you still need a second tool for HSL</li>
        <li>Some show the output but make copying awkward → no copy button, you manually select text</li>
        <li>Others do not show a color preview → you have to trust the math without seeing the result</li>
        <li>Some tools do not handle shorthand HEX (three-digit, like `#F53`) → they error out</li>
        <li>Mobile layouts break on most converter sites → barely usable on a phone</li>
      </ul>

      <p className="mb-4">
        A lot of color converters were clearly built as quick demos rather than tools someone uses every day. They work in the narrow case and break the moment you do something slightly non-standard.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <p className="mb-3">Type or paste a color in any format and get all three outputs instantly:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Input: HEX, RGB, or HSL</li>
        <li>Output: all three formats simultaneously, with one-click copy buttons</li>
        <li>Live color preview → see the actual color as you type</li>
        <li>Handles shorthand HEX (three-digit format like `#F00`)</li>
        <li>Handles HEX with and without the `#` prefix</li>
        <li>Works on mobile</li>
      </ul>

      <p className="mb-4">
        The color preview is the part that earns its place. When you are debugging why a color looks wrong in the browser versus in the design file, being able to see the actual rendered color as you adjust values helps you catch the problem. You typed `hsl(200, 80, 50)` instead of `hsl(200, 80%, 50%)` — the preview shows something wrong immediately.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">A Note on Tailwind and CSS Custom Properties</h2>

      <p className="mb-3">
        Tailwind CSS v3 and later use HSL for color definitions in the config. If you are setting up a custom color palette or extending a theme, you need HSL values. If your design file gives you HEX, you need to convert.
      </p>

      <p className="mb-3">
        CSS custom properties (variables) used for theming often look like this:
      </p>

      <p className="mb-3 font-mono text-sm bg-gray-100 dark:bg-gray-800 rounded p-3">
        --color-primary: 220 90% 56%;
      </p>

      <p className="mb-3">
        That is HSL without the `hsl()` wrapper, just the three numbers. Tailwind uses this pattern to support opacity modifiers like `bg-primary/50`. When you convert a HEX brand color to HSL, you get the numbers you need to drop straight into that pattern.
      </p>

      <p className="mb-4">
        If you have spent fifteen minutes looking at a HEX value wondering what the HSL equivalent is so you can wire up a Tailwind theme, this is the tool for that.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>All three formats in one view → no switching between tools</li>
        <li>One-click copy → paste directly into code or a design tool</li>
        <li>Live preview keeps you grounded in what the color actually looks like</li>
        <li>Handles common input variations → shorthand HEX, missing hash, different spacing in RGB/HSL</li>
        <li>No account, no ads obscuring the input, no slow load time</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No CMYK or Pantone support → print formats need a different tool</li>
        <li>No color picker / eyedropper → you have to know the starting value</li>
        <li>No color palette generation → for that, dedicated tools like Coolors are better</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Paste or type your color in any format (HEX, RGB, or HSL)</li>
        <li>See the color preview update in real time</li>
        <li>Find the format you need in the output section</li>
        <li>Click the copy button next to it</li>
        <li>Paste into your code or design tool</li>
      </ol>

      <p className="mb-4">Takes about five seconds once you have the starting color.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/color-converter-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Color Converter
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">HEX, RGB, and HSL. All at once. No friction.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#color-converter` `#hex-rgb-hsl` `#css-colors` `#design-tools` `#tailwind`
      </p>
    </article>
  );
}
