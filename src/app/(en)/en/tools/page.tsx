'use client';

import { toolsEn } from '@/data/tools-en';
import { categoryListEn } from '@/data/categories-en';
import { ToolsClientPageEn } from '@/components/tools/ToolsClientPageEn';

export default function ToolsPageEn() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <ToolsClientPageEn tools={toolsEn} categories={categoryListEn} />
    </section>
  );
}
