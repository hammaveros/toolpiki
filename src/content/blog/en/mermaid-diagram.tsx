import Link from 'next/link';

export default function MermaidDiagramPostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Developer Tools · July 10, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Write Diagrams as Code and Preview Them Instantly — No Diagramming Tool Required
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/mermaid-diagram-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Mermaid Diagram Editor
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        I needed a flowchart for a README. Figma felt like overkill. Dragging boxes in a GUI tool for a simple flow diagram took longer than writing the whole document.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Why Diagrams in Code Make Sense for Developers</h2>

      <p className="mb-3">Familiar scenario:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Architecture documentation → diagram tools produce images that go stale</li>
        <li>Pull request descriptions → embedding a diagram helps reviewers understand the change</li>
        <li>README files → a flowchart is worth a thousand words of prose</li>
        <li>Sequence diagrams for API interactions → tedious to draw manually</li>
        <li>Entity-relationship diagrams → for data model documentation</li>
        <li>State machines → for explaining business logic flows</li>
        <li>Gantt charts → for sprint or project planning in markdown</li>
      </ul>

      <p className="mb-4">
        GUI diagramming tools have their place — Figma, Miro, Lucidchart are great for complex diagrams that need precise layout and visual polish. But for developer documentation, where you want the diagram to live alongside the code, be version-controlled, and be easy to update, text-based diagrams win.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Mermaid Is</h2>

      <p className="mb-4">
        Mermaid is a JavaScript-based diagramming library that renders diagrams from a markdown-like text syntax. You describe the diagram in text, and it renders as an SVG. It's natively supported in GitHub Markdown (code blocks with the <code>mermaid</code> language tag render as diagrams), GitLab, Notion, Obsidian, and many other tools.
      </p>

      <p className="mb-4">
        The syntax is designed to be readable even before it's rendered. A flowchart might look like:
      </p>

      <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm overflow-x-auto mb-4">
        {`flowchart TD
    A[User logs in] --> B{Valid credentials?}
    B -- Yes --> C[Issue JWT token]
    B -- No --> D[Return 401]`}
      </pre>

      <p className="mb-4">
        The diagram type is declared first (<code>flowchart</code>, <code>sequenceDiagram</code>, <code>classDiagram</code>, etc.), then the nodes and edges are defined. The syntax for each diagram type is slightly different but follows the same general pattern.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What the Tool Does</h2>

      <p className="mb-3">Core features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Type Mermaid syntax on the left, see the diagram render on the right in real time</li>
        <li>Supports all major diagram types: flowchart, sequence, class, state, ER, Gantt, pie, mindmap</li>
        <li>Error messages when syntax is invalid — with line numbers</li>
        <li>Export the diagram as SVG or PNG</li>
        <li>Copy the Mermaid source code with one click</li>
        <li>Starter templates for each diagram type</li>
      </ul>

      <p className="mb-3">Extra features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Theme switcher (default, dark, forest, neutral)</li>
        <li>Zoom and pan on the rendered diagram</li>
        <li>Link sharing — encode the diagram in the URL</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Diagram Types and When to Use Each</h2>

      <p className="mb-4">
        <strong>Flowchart</strong> (<code>flowchart</code> or <code>graph</code>): General-purpose directed graphs. Use for decision trees, process flows, system overviews. The most commonly used type.
      </p>

      <p className="mb-4">
        <strong>Sequence diagram</strong> (<code>sequenceDiagram</code>): Shows interactions between actors over time. Use for API call flows, authentication sequences, system communication.
      </p>

      <p className="mb-4">
        <strong>Class diagram</strong> (<code>classDiagram</code>): Shows classes, their attributes, methods, and relationships. Use for OOP designs, data model documentation.
      </p>

      <p className="mb-4">
        <strong>State diagram</strong> (<code>stateDiagram-v2</code>): Shows states and transitions. Use for state machines, order status flows, user journey states.
      </p>

      <p className="mb-4">
        <strong>ER diagram</strong> (<code>erDiagram</code>): Entity-relationship diagrams for database schema documentation. Shows tables, attributes, and relationships.
      </p>

      <p className="mb-4">
        <strong>Gantt chart</strong> (<code>gantt</code>): Project schedules with tasks and timelines. Useful in planning documents and sprint summaries in markdown.
      </p>

      <p className="mb-4">
        <strong>Pie chart</strong> (<code>pie</code>): Simple proportional data visualization. Good for quick data summaries in documentation.
      </p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Instant preview catches syntax errors before you paste into a README</li>
        <li>Starter templates mean you don't need to memorize syntax</li>
        <li>SVG export produces clean, scalable diagrams</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Complex diagrams with many nodes can get messy — layout control is limited</li>
        <li>Styling options are more limited than in GUI tools</li>
        <li>No drag-and-drop — everything is written by hand</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Pick a diagram type from the template menu</li>
        <li>Edit the starter template to match your diagram</li>
        <li>Watch the preview update in real time</li>
        <li>Export as SVG/PNG or copy the source to embed in your markdown</li>
      </ol>

      <p className="mb-4">Simple diagrams take 2–3 minutes to write from scratch.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/mermaid-diagram-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Mermaid Diagram Editor
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No account. Works instantly in your browser.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#mermaid` `#diagrams-as-code` `#flowchart` `#developer-tools` `#documentation`
      </p>
    </article>
  );
}
