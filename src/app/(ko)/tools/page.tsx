'use client';

import { tools } from '@/data/tools';
import { categoryList } from '@/data/categories';
import { ToolsClientPage } from '@/components/tools/ToolsClientPage';

export default function ToolsPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <ToolsClientPage tools={tools} categories={categoryList} />
    </section>
  );
}
