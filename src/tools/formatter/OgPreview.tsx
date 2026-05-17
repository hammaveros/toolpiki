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
    siteName: '내 웹사이트',
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
          📱 카톡으로 링크 보낼 때 보이는 그 카드, 미리 만들어보기
        </h2>
        <p className="text-sm leading-relaxed">
          블로그 글이나 랜딩 페이지를 카카오톡·페이스북·X(트위터)에 공유했을 때 자동으로 따라붙는 썸네일 카드를 결정하는 게 바로 Open Graph 태그입니다.
          이 도구는 og:title, og:description, og:image, og:url 같은 값을 입력하면 세 플랫폼에서 어떻게 보일지 실시간으로 시뮬레이션해 주고,
          그대로 복사해 &lt;head&gt; 안에 붙여 넣을 수 있는 메타 태그 코드까지 만들어 줍니다.
          배포 전에 카드가 깨지거나 이미지가 잘리지 않는지 확인하는 용도로 가장 자주 사용됩니다.
          입력값은 어디에도 저장되지 않고 브라우저 안에서만 처리됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 주요 OG 태그와 권장값
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
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:title</td><td>페이지 제목 (카드 헤드라인)</td><td>60자 이내</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:description</td><td>페이지 설명 (서브 텍스트)</td><td>160자 이내</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:image</td><td>미리보기 이미지 URL</td><td>1200×630px</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:url</td><td>정식 URL (canonical)</td><td>절대 경로</td></tr>
              <tr className="border-b dark:border-gray-800"><td className="py-2 px-2 font-mono">og:type</td><td>콘텐츠 유형</td><td>website / article 등</td></tr>
              <tr><td className="py-2 px-2 font-mono">og:site_name</td><td>사이트 이름</td><td>브랜드명 짧게</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🖼️ 1200×630 이미지를 만들 때 챙겨야 할 것들
        </h2>
        <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><strong>비율 1.91:1</strong> — 1200×630px이 표준. 정사각형 이미지는 카카오톡에서 위/아래가 잘리는 일이 흔합니다.</li>
          <li><strong>파일 크기</strong> — 5MB 이하지만, 빠른 캐시 보장을 위해 1MB 미만(보통 200~500KB)이 좋습니다. PNG보단 JPG 80% 품질이 가성비 우위.</li>
          <li><strong>중요 정보는 중앙 60% 안</strong> — 플랫폼마다 크롭 영역이 미세하게 달라서 가장자리는 잘릴 수 있습니다.</li>
          <li><strong>텍스트는 이미지 면적의 20% 이하</strong> — 페이스북이 옛날부터 권고해 온 룰. 현재도 노출 가중치에 영향을 줍니다.</li>
          <li><strong>HTTPS 절대 URL</strong> — 상대 경로(/og.png)는 외부 크롤러가 해석하지 못합니다. 반드시 <span className="font-mono">https://</span>로 시작하는 전체 주소.</li>
          <li><strong>og:image:width / og:image:height</strong>도 같이 적어주면 일부 메신저가 카드를 더 빠르게 그립니다.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💬 플랫폼별 동작 차이
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">카카오톡</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">og 태그를 그대로 사용. 캐시가 강해서 수정 후 카카오 디벨로퍼스의 &quot;공유 디버거&quot;로 초기화 필요.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">페이스북</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sharing Debugger에서 &quot;Scrape Again&quot;을 눌러야 새 정보 반영. og:site_name이 카드 상단에 노출.</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded">
            <p className="font-medium mb-1">X (트위터)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">twitter:card 태그가 우선. summary_large_image면 큰 카드, summary면 작은 카드.</p>
          </div>
        </div>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          {
            question: 'OG 태그를 수정했는데 카카오톡 미리보기가 여전히 옛날 그대로예요',
            answer: '카카오톡은 og 정보를 자체 캐시에 길게 보관합니다. https://developers.kakao.com/tool/clear/og 에 URL을 넣고 캐시를 비우면 보통 30초 안에 새 이미지로 갱신됩니다. 페이스북은 Sharing Debugger, X는 Card Validator를 같은 방식으로 쓰면 됩니다.',
          },
          {
            question: 'og:image는 꼭 절대 URL이어야 하나요? /images/og.png는 안 되나요?',
            answer: '네, 외부 크롤러는 도메인 컨텍스트 없이 페이지를 가져오는 경우가 많기 때문에 반드시 https:// 로 시작하는 전체 URL이어야 합니다. CDN URL을 쓰는 게 캐시 안정성과 속도 면에서 가장 무난합니다.',
          },
          {
            question: 'twitter:card 태그와 og 태그를 둘 다 넣어야 하나요?',
            answer: 'X(트위터)는 og 태그를 폴백으로 읽지만, twitter:* 태그가 있으면 그쪽을 우선합니다. 일관된 결과를 원한다면 og 태그 5개 + twitter:card / twitter:title / twitter:description / twitter:image 정도를 함께 적어두는 게 안전합니다.',
          },
          {
            question: '동적으로 URL마다 다른 OG 이미지를 만들고 싶어요',
            answer: 'Next.js라면 app/opengraph-image.tsx 또는 @vercel/og를 쓰면 페이지별 동적 이미지를 만들 수 있고, 다른 프레임워크에서는 Cloudflare Workers + satori 같은 조합이 흔합니다. 본 도구로는 미리 그려둔 결과물을 미리보기 시뮬레이션하는 용도로 사용하세요.',
          },
        ]}
      />
    </div>
  );
}
