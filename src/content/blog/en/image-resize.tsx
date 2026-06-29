import Link from 'next/link';

export default function ImageResizePostEn() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Image · July 11, 2026 · 4 min read</p>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Resize Images to Exact Dimensions Without Installing Anything
      </h1>

      <p className="mb-4">
        <Link href="/en/tools/image-resize-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Image Resizer
        </Link>
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-6">
        The upload form said "maximum 200×200 pixels." My photo was 3024×4032. I just needed to resize it quickly.
      </blockquote>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">When You Need to Resize an Image</h2>

      <p className="mb-3">Image resizing comes up far more often than most people expect:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Online form uploads → strict pixel dimension requirements for ID photos or documents</li>
        <li>Email signatures → company logo needs to be exactly 200×50px</li>
        <li>Web development → building a layout that requires specific image dimensions</li>
        <li>CMS uploads → WordPress, Notion, or other platforms reject images above a certain size</li>
        <li>Printing → need to scale an image down to match a specific print size at a given DPI</li>
        <li>Sending to someone → original photo is too large to share comfortably via messaging apps</li>
      </ul>

      <p className="mb-4">In almost all of these situations, you know exactly what you want. You need a specific width, or a specific height, or both — without distorting the image.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">The Problem with Typical Approaches</h2>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Windows Photos app → resizing is buried in menus and has limited presets</li>
        <li>Preview on macOS → Tools menu → Adjust Size, which works fine, but requires opening the app and saving</li>
        <li>Photoshop / GIMP → far more power than you need for a simple resize</li>
        <li>Online tools → most upload your image to a server, which is a problem if the content is sensitive</li>
        <li>Command line (ImageMagick) → great for developers, not practical for quick one-off tasks</li>
      </ul>

      <p className="mb-4">For a single quick resize, you shouldn't need to open a full image editor or worry about where your file is going.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Browser-Based, Nothing Uploaded</h2>

      <p className="mb-3">This tool processes your image entirely in the browser using the Canvas API. Your file never leaves your device.</p>

      <p className="mb-3">Features:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Resize by width, height, or both</li>
        <li>Lock aspect ratio → change one dimension, the other updates automatically</li>
        <li>Percentage resize → scale to 50%, 75%, or any percentage of the original</li>
        <li>Output format → JPEG, PNG, or WebP</li>
        <li>Quality slider → control compression for JPEG and WebP</li>
        <li>Before/after file size comparison</li>
      </ul>

      <p className="mb-4">The aspect ratio lock is the feature most people reach for first. Type in a target width, and the height adjusts automatically — no manual proportion calculation.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Understanding Aspect Ratio Lock</h2>

      <p className="mb-3">When you resize an image, the two main options are:</p>

      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Constrained resize (aspect ratio locked) → the image scales proportionally; no distortion</li>
        <li>Unconstrained resize → width and height are set independently; can stretch or squish the image</li>
      </ul>

      <p className="mb-4">For most use cases, constrained resize is what you want. The exception is when a system requires an exact pixel dimension on both axes — for example, a 200×200 profile photo. In that case, you may need to crop first, then resize.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Honest Assessment</h2>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">What works well:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>Fast → no upload, processes locally</li>
        <li>Private → nothing leaves your browser</li>
        <li>Aspect ratio lock makes common tasks trivial</li>
        <li>Format conversion included — resize and convert in one step</li>
      </ul>

      <p className="mb-2 font-medium text-gray-800 dark:text-gray-200">Limitations:</p>
      <ul className="space-y-1 mb-4 text-gray-700 dark:text-gray-300">
        <li>No batch processing → one image at a time</li>
        <li>RAW formats not supported</li>
        <li>Very large images may slow down on low-memory devices</li>
        <li>Upscaling beyond original resolution will look blurry — that's a physics limitation, not a tool issue</li>
      </ul>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use It</h2>

      <ol className="space-y-1 mb-4 text-gray-700 dark:text-gray-300 list-decimal list-inside">
        <li>Drop your image onto the page or click to select</li>
        <li>Enter your target width or height (or percentage)</li>
        <li>Check that aspect ratio lock is on if you want proportional scaling</li>
        <li>Choose output format and quality</li>
        <li>Click Download</li>
      </ol>

      <p className="mb-4">About 30 seconds from start to finish.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Try It</h2>

      <p className="mb-4">
        <Link href="/en/tools/image-resize-en" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
          👉 Try the Image Resizer
        </Link>
      </p>

      <p className="text-gray-600 dark:text-gray-400">No uploads. No account. Works in any modern browser.</p>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        `#image-resize` `#resize-image-online` `#image-dimensions` `#free-tool` `#no-upload`
      </p>
    </article>
  );
}
