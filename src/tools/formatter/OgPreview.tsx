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

export function OgPreview() {
  const [og, setOg] = useState<OgData>({
    title: '내 웹사이트 제목',
    description: '웹사이트에 대한 설명입니다. SNS에서 공유될 때 이 텍스트가 표시됩니다.',
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
      {/* 입력 필드 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">OG 태그 설정</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:title</label>
            <input
              type="text"
              value={og.title}
              onChange={(e) => updateOg('title', e.target.value)}
              placeholder="페이지 제목"
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:site_name</label>
            <input
              type="text"
              value={og.siteName}
              onChange={(e) => updateOg('siteName', e.target.value)}
              placeholder="사이트 이름"
              className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">og:description</label>
            <textarea
              value={og.description}
              onChange={(e) => updateOg('description', e.target.value)}
              placeholder="페이지 설명"
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

      {/* 미리보기 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 카카오톡 */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span className="text-yellow-500">💬</span> 카카오톡
          </h3>
          <div className="bg-[#b2c7d9] p-3 rounded-lg">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
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
                <p className="text-xs text-gray-500 mb-1">{og.siteName || new URL(og.url || 'https://example.com').hostname}</p>
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{og.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{og.description}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 페이스북 */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span className="text-blue-600">📘</span> 페이스북
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

        {/* 트위터 */}
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>𝕏</span> 트위터/X
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

      {/* 메타 태그 출력 */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">메타 태그 코드</h3>
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
          📱 OG 미리보기란?
        </h2>
        <p className="text-sm leading-relaxed">
          Open Graph(OG) 태그는 웹페이지가 소셜 미디어에서 공유될 때 표시되는 제목, 설명, 이미지를 정의합니다.
          이 도구를 사용하면 카카오톡, 페이스북, 트위터 등 각 플랫폼에서 링크가 어떻게 미리보기 되는지 실시간으로 확인할 수 있습니다.
          설정한 내용은 바로 복사 가능한 메타 태그 코드로 생성되어 웹사이트 &lt;head&gt; 섹션에 붙여넣기만 하면 됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 주요 OG 태그
        </h2>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-2">태그</th>
                <th className="text-left py-2 px-2">설명</th>
                <th className="text-left py-2 px-2">권장 값</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:title</td><td>페이지 제목</td><td>60자 이내</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:description</td><td>페이지 설명</td><td>160자 이내</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:image</td><td>미리보기 이미지</td><td>1200×630px</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:url</td><td>정식 URL</td><td>절대 경로</td></tr>
              <tr><td className="py-2 px-2 font-mono">og:type</td><td>콘텐츠 유형</td><td>website, article 등</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 OG 이미지 최적화 팁
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>권장 크기</strong>: 1200×630px (1.91:1 비율)로 대부분의 플랫폼에 최적화</li>
          <li><strong>파일 형식</strong>: JPG, PNG 사용 (PNG는 투명 배경 가능)</li>
          <li><strong>파일 크기</strong>: 5MB 이하, 1MB 미만 권장</li>
          <li><strong>중요 내용 중앙</strong>: 플랫폼마다 크롭 영역이 다를 수 있음</li>
          <li><strong>텍스트 포함 시</strong>: 20% 이하로 유지 (Facebook 정책)</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'OG 태그를 수정했는데 왜 미리보기가 안 바뀌나요?',
            answer: '플랫폼들은 OG 정보를 캐싱합니다. Facebook은 Sharing Debugger, Twitter는 Card Validator로 캐시를 갱신할 수 있습니다. 카카오톡은 초기화 도구를 제공합니다.',
          },
          {
            question: 'og:image는 반드시 절대 URL이어야 하나요?',
            answer: '네, 상대 경로는 인식되지 않습니다. https://로 시작하는 전체 URL을 사용해야 합니다.',
          },
          {
            question: 'Twitter Card와 OG 태그를 둘 다 넣어야 하나요?',
            answer: '트위터는 og 태그도 읽지만, twitter:card 등 전용 태그가 있으면 우선 적용됩니다. 최적의 결과를 위해 둘 다 넣는 것을 권장합니다.',
          },
        ]}
      />
    </div>
  );
}
