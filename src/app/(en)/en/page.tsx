'use client';

import { toolsEn } from '@/data/tools-en';
import { categoryListEn } from '@/data/categories-en';
import { ToolsClientPageEn } from '@/components/tools/ToolsClientPageEn';
import { HomeContentEn } from '@/components/home/HomeContentEn';

export default function HomePageEn() {
  return (
    <>
      {/* Hero + Intro Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 pt-10 pb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              ToolPiki
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Free Online Tools Collection
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed space-y-2">
              <p>
                Text conversion, Base64 encoding, JSON formatter, image compression, color code conversion and
                <strong className="text-gray-700 dark:text-gray-300"> 100+ free tools</strong> available
                without signup.
              </p>
              <p>
                All processing happens in your browser - no files are uploaded to servers.
                Use with confidence, your data stays private.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter + Tool Grid (with favorites & recent) */}
      <section className="container mx-auto px-4 py-4">
        <ToolsClientPageEn tools={toolsEn} categories={categoryListEn} isMainPage />
      </section>

      {/* Site Content (for AdSense) */}
      <section className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
        <HomeContentEn />
      </section>
    </>
  );
}
