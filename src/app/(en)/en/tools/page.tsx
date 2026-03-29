'use client';

import { toolsEn } from '@/data/tools-en';
import { categoryListEn } from '@/data/categories-en';
import { ToolsClientPage } from '@/components/tools/ToolsClientPage';

export default function ToolsPageEn() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <ToolsClientPage tools={toolsEn} categories={categoryListEn} isEnglish />
    </section>
  );
}
