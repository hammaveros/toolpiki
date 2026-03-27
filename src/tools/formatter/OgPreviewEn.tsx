'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { FaqSection } from '@/components/ui/FaqItem';

interface OgData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  type: string;
}

export function OgPreviewEn() {
  const [og, setOg] = useState<OgData>({
    title: 'My Website Title',
    description: 'A brief description of your website. This text appears when shared on social media.',
    image: 'https://placehold.co/1200x630/3b82f6/ffffff?text=OG+Image',
    url: 'https://example.com',
    siteName: 'My Website',
    type: 'website',
  });

  const updateOg = (key: keyof OgData, value: string) => {
    setOg(prev => ({ ...prev, [key]: value }));
  };

  const metaTags = `<meta property="og:title" content="${og.title}" />
<meta property="og:description" content="${og.description}" />
<meta property="og:image" content="${og.image}" />
<meta property="og:url" content="${og.url}" />
<meta property="og:site_name" content="${og.siteName}" />
<meta property="og:type" content="${og.type}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${og.title}" />
<meta name="twitter:description" content="${og.description}" />
<meta name="twitter:image" content="${og.image}" />`;

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">OG Tag Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:title</label>
            <input
              type="text"
              value={og.title}
              onChange={(e) => updateOg('title', e.target.value)}
              placeholder="Page title"
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:site_name</label>
            <input
              type="text"
              value={og.siteName}
              onChange={(e) => updateOg('siteName', e.target.value)}
              placeholder="Site name"
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:description</label>
            <textarea
              value={og.description}
              onChange={(e) => updateOg('description', e.target.value)}
              placeholder="Page description"
              rows={2}
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:image (URL)</label>
            <input
              type="text"
              value={og.image}
              onChange={(e) => updateOg('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:url</label>
            <input
              type="text"
              value={og.url}
              onChange={(e) => updateOg('url', e.target.value)}
              placeholder="https://example.com/page"
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:type</label>
            <select
              value={og.type}
              onChange={(e) => updateOg('type', e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
              <option value="profile">profile</option>
              <option value="video.other">video</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LinkedIn */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span className="text-blue-700">💼</span> LinkedIn
          </h3>
          <div className="bg-[#f3f2ef] p-3 rounded-lg">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              {og.image && (
                <div className="aspect-[1.91/1] bg-gray-100">
                  <img
                    src={og.image}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{og.title}</p>
                <p className="text-xs text-gray-500 mt-1">{new URL(og.url || 'https://example.com').hostname}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Facebook */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span className="text-blue-600">📘</span> Facebook
          </h3>
          <div className="bg-[#f0f2f5] p-3 rounded-lg">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              {og.image && (
                <div className="aspect-[1.91/1] bg-gray-100">
                  <img
                    src={og.image}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="p-3 bg-[#f0f2f5]">
                <p className="text-xs text-gray-500 uppercase">{new URL(og.url || 'https://example.com').hostname}</p>
                <p className="text-sm font-semibold text-[#1d2129] mt-1 line-clamp-2">{og.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{og.description}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Twitter/X */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>𝕏</span> Twitter/X
          </h3>
          <div className="bg-black p-3 rounded-lg">
            <div className="bg-black rounded-xl overflow-hidden border border-gray-800">
              {og.image && (
                <div className="aspect-[2/1] bg-gray-900">
                  <img
                    src={og.image}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="p-3">
                <p className="text-sm text-white line-clamp-2">{og.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{og.description}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <span>🔗</span> {new URL(og.url || 'https://example.com').hostname}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Meta Tags Output */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta Tags Code</h3>
          <CopyButton text={metaTags} />
        </div>
        <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
          {metaTags}
        </pre>
      </Card>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📱 What is OG Preview?
        </h2>
        <p className="text-sm leading-relaxed">
          Open Graph (OG) tags define the title, description, and image that appear when a webpage is shared on social media.
          This tool lets you see in real-time how your link will appear on platforms like Facebook, Twitter, and LinkedIn.
          The configured settings are generated as copy-ready meta tag code that you can paste directly into your website's &lt;head&gt; section.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 Key OG Tags
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">Tag</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-left py-2 px-2">Recommended</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:title</td><td>Page title</td><td>Under 60 chars</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:description</td><td>Page description</td><td>Under 160 chars</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:image</td><td>Preview image</td><td>1200×630px</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:url</td><td>Canonical URL</td><td>Absolute path</td></tr>
              <tr><td className="py-2 px-2 font-mono">og:type</td><td>Content type</td><td>website, article, etc.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 OG Image Optimization Tips
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>Recommended size</strong>: 1200×630px (1.91:1 ratio) optimized for most platforms</li>
          <li><strong>File format</strong>: JPG or PNG (PNG supports transparency)</li>
          <li><strong>File size</strong>: Under 5MB, ideally under 1MB</li>
          <li><strong>Center important content</strong>: Crop areas vary by platform</li>
          <li><strong>Text overlay</strong>: Keep under 20% of image area (Facebook policy)</li>
        </ul>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          {
            question: 'Why does the preview not change after updating OG tags?',
            answer: 'Platforms cache OG information. Use Facebook Sharing Debugger or Twitter Card Validator to refresh the cache and see your updates.',
          },
          {
            question: 'Does og:image need to be an absolute URL?',
            answer: 'Yes, relative paths are not recognized. Use a full URL starting with https://.',
          },
          {
            question: 'Should I include both Twitter Cards and OG tags?',
            answer: 'Twitter reads OG tags but prioritizes its own twitter: tags when present. Including both is recommended for optimal results.',
          },
        ]}
      />
    </div>
  );
}
