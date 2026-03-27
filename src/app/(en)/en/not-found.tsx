import Link from 'next/link';

// Popular Tools TOP 5
const popularTools = [
  { slug: 'character-counter-en', name: 'Character Counter', icon: '🔢' },
  { slug: 'json-formatter-en', name: 'JSON Formatter', icon: '📋' },
  { slug: 'image-compress-en', name: 'Image Compress', icon: '📦' },
  { slug: 'qr-generator-en', name: 'QR Generator', icon: '📱' },
  { slug: 'color-converter-en', name: 'Color Converter', icon: '🎨' },
];

// Popular Categories
const popularCategories = [
  { slug: 'text', name: 'Text', icon: '📝' },
  { slug: 'image', name: 'Image', icon: '🖼️' },
  { slug: 'calculator', name: 'Calculator', icon: '🔢' },
  { slug: 'fun', name: 'Fun & Games', icon: '🎮' },
];

export default function NotFoundEn() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-8xl animate-bounce">🔍</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Oops! Nothing here...
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          The page you&apos;re looking for might have been moved or doesn&apos;t exist.
          <br />
          How about trying one of these instead? 👇
        </p>

        {/* Home Button */}
        <Link
          href="/en"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all hover:scale-105 mb-12"
        >
          <span>🏠</span>
          Back to Home
        </Link>

        {/* Popular Tools TOP 5 */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
            <span>🔥</span> Popular Tools TOP 5
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {popularTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/en/tools/${tool.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <span className="text-2xl">{tool.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {tool.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
            <span>📂</span> Browse Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/en?category=${cat.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
