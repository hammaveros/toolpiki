import Link from 'next/link';

export default function LoremIpsumPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Text · July 23, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Lorem Ipsum: Where It Came From and Why Designers Still Use It 500 Years Later
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/lorem-ipsum-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Lorem Ipsum Generator
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        You are designing a layout and need text to fill the content area. Real content is not ready. You need words that look like words without being words that distract from the design.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Lorem Ipsum Actually Is</h2>

      <p className="mb-3">
        Lorem ipsum is derived from a work by Cicero — specifically from "De Finibus Bonorum et Malorum" (On the Ends of Good and Evil), written in 45 BC. The standard Lorem ipsum passage beginning "Lorem ipsum dolor sit amet, consectetur adipiscing elit" is a scrambled and modified excerpt from Book I, Section 32 of that text.
      </p>

      <p className="mb-3">The original Latin reads: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..." which translates roughly to: "There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..."</p>

      <p className="mb-4">
        The scrambled version has been used in typesetting since the 1500s. Richard McClintock, a professor at Hampden-Sydney College, traced the origin in 1994. The text entered widespread digital use when Aldus PageMaker shipped with Lorem ipsum as its default placeholder text in the 1980s. Since then, it has become a design industry standard that virtually every designer and developer recognizes.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Designers Use Placeholder Text Instead of Real Content</h2>

      <p className="mb-3">
        The design rationale is sound and worth understanding:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Reviewers focus on layout, not words → when placeholder text is used, people look at the design; when real text is used, they read and edit the content instead</li>
        <li>Content is often not ready → design phases typically precede content production; you need something to fill the space</li>
        <li>Even word distribution → Lorem ipsum has a natural distribution of letter and word lengths that approximates real Latin text, which approximates the visual density of English or other Latin-script languages</li>
        <li>No emotional reaction → real text, even dummy real text, carries connotations; Lorem ipsum is neutral</li>
        <li>No copyright concern → Lorem ipsum is public domain and ancient enough that nobody owns it</li>
      </ul>

      <p className="mb-4">
        The alternative — typing "text text text text" or repeating "content goes here" — looks worse visually and still distracts attention. Lorem ipsum has the right visual texture without the distraction.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Encounter Lorem Ipsum in the Wild</h2>

      <p className="mb-3">
        Placeholder text appears in more contexts than just graphic design:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Web and app mockups → wireframes and prototypes before real content exists</li>
        <li>UI component libraries → documentation examples showing how a text block looks in context</li>
        <li>CMS demos → showing how a content management system renders articles</li>
        <li>Email templates → demonstrating layout before the actual email copy is written</li>
        <li>Print layouts → magazines and books during layout review before final text is set</li>
        <li>Typography specimens → showing how a font renders at different sizes in flowing text</li>
        <li>Database seeding → populating development databases with realistic-looking text data</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Critique of Lorem Ipsum</h2>

      <p className="mb-3">
        Not everyone agrees it is the best approach. The main criticisms:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>It hides real content problems → a heading that works with "Lorem ipsum" might break with a real 80-character headline; you do not find out until content is added</li>
        <li>It lets layouts avoid content reality → designs often look better with idealized placeholder text than with the messy, varied, real content they will eventually hold</li>
        <li>Clients do not understand it → stakeholders who are not designers sometimes see Lorem ipsum in a mockup and think the design is incomplete in a different way than intended</li>
        <li>Content-first design → some design methodologies argue you should design around real or representative content from the start</li>
      </ul>

      <p className="mb-4">
        These are valid points. In practice, using Lorem ipsum is a pragmatic choice for early-stage design exploration, with the understanding that real content will be integrated and tested before anything ships. The tool serves its purpose in that context.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What This Tool Does</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Generate Lorem ipsum in configurable amounts: by words, sentences, or paragraphs</li>
        <li>Start with "Lorem ipsum dolor sit amet..." (the traditional start) or generate varied text throughout</li>
        <li>Copy to clipboard with one click</li>
        <li>Multiple paragraph output for multi-section layouts</li>
        <li>HTML tag output option — wraps paragraphs in &lt;p&gt; tags for direct use in HTML</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Alternatives to Traditional Lorem Ipsum</h2>

      <p className="mb-3">
        If you want placeholder text with more personality:
      </p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Hipster Ipsum → "Quinoa kale chips activated charcoal, distillery mixtape lo-fi artisan..."</li>
        <li>Bacon Ipsum → every sentence involves bacon in some capacity</li>
        <li>Corporate Ipsum → sounds like a real business document, useful for enterprise product mockups</li>
        <li>Cupcake Ipsum → sweet-themed placeholder text</li>
      </ul>

      <p className="mb-4">
        These are fun for internal use or when you want the placeholder to signal that it is clearly placeholder. For professional client presentations, traditional Lorem ipsum is usually preferable — it is neutral and universally understood.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Configurable output — words, sentences, or paragraphs</li>
        <li>HTML output option — saves a step when working in markup</li>
        <li>One-click copy — fast to use mid-workflow</li>
        <li>Starts with the traditional phrase — meets designer expectations</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Text only — no image placeholder generation</li>
        <li>No custom word lists — for domain-specific placeholder text you need a different approach</li>
        <li>No RTL or non-Latin script variants — Latin characters only</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/lorem-ipsum-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Lorem Ipsum Generator
        </Link>
      </p>
      <p className="text-gray-600 dark:text-gray-400">Words, sentences, or paragraphs — HTML output option, one-click copy.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#lorem-ipsum` `#placeholder-text` `#design` `#typography` `#web-design`
      </p>
    </article>
  );
}
