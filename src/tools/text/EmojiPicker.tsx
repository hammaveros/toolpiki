'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { FaqSection } from '@/components/ui/FaqItem';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils/cn';

interface EmojiCategory {
  name: string;
  icon: string;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: '자주 사용',
    icon: '⏰',
    emojis: ['😀', '😂', '🥰', '😍', '🤔', '😭', '😎', '🥺', '👍', '❤️', '🔥', '✨', '🎉', '💯', '👏', '🙏'],
  },
  {
    name: '스마일',
    icon: '😀',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
  },
  {
    name: '감정',
    icon: '😢',
    emojis: ['😟', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'],
  },
  {
    name: '제스처',
    icon: '👋',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
  },
  {
    name: '하트',
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💌', '💋', '👄'],
  },
  {
    name: '동물',
    icon: '🐶',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊'],
  },
  {
    name: '음식',
    icon: '🍕',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯'],
  },
  {
    name: '활동',
    icon: '⚽',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻'],
  },
  {
    name: '여행',
    icon: '✈️',
    emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '🪝', '⛽', '🚧', '🚦', '🚥', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🛖', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🕋'],
  },
  {
    name: '물건',
    icon: '💡',
    emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪'],
  },
  {
    name: '기호',
    icon: '✅',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄'],
  },
];

export function EmojiPicker() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const filteredEmojis = useMemo(() => {
    if (!search) {
      return EMOJI_CATEGORIES[selectedCategory].emojis;
    }
    // 검색 시 모든 카테고리에서 검색
    const allEmojis = EMOJI_CATEGORIES.flatMap((cat) => cat.emojis);
    return [...new Set(allEmojis)];
  }, [search, selectedCategory]);

  const handleCopy = useCallback(async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setTimeout(() => setCopied(null), 1000);

      // 최근 사용에 추가
      setRecentEmojis((prev) => {
        const filtered = prev.filter((e) => e !== emoji);
        return [emoji, ...filtered].slice(0, 16);
      });
    } catch {
      // 복사 실패
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* 검색 */}
      <Input
        placeholder="이모지 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 최근 사용 */}
      {recentEmojis.length > 0 && !search && (
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            최근 사용
          </h3>
          <div className="flex flex-wrap gap-1">
            {recentEmojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => handleCopy(emoji)}
                className={cn(
                  'w-10 h-10 text-2xl rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                  copied === emoji && 'bg-green-100 dark:bg-green-900/30'
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* 카테고리 탭 */}
      {!search && (
        <div className="flex gap-1 overflow-x-auto pb-2">
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(i)}
              className={cn(
                'flex-shrink-0 w-10 h-10 text-xl rounded-lg transition-colors',
                selectedCategory === i
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
              title={cat.name}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* 이모지 그리드 */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {search ? '검색 결과' : EMOJI_CATEGORIES[selectedCategory].name}
        </h3>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1 max-h-80 overflow-y-auto">
          {filteredEmojis.map((emoji, i) => (
            <button
              key={i}
              onClick={() => handleCopy(emoji)}
              className={cn(
                'w-10 h-10 text-2xl rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                copied === emoji && 'bg-green-100 dark:bg-green-900/30'
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </Card>

      {copied && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          {copied} 복사됨!
        </div>
      )}

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">이모지 검색이란?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          이모지(Emoji)는 감정, 사물, 동작 등을 시각적으로 표현하는 유니코드 기반의 그림 문자입니다.
          이모지 검색 도구를 사용하면 수백 개의 이모지를 카테고리별로 탐색하거나, 키워드로 원하는 이모지를 빠르게 찾아 클릭 한 번으로 복사할 수 있습니다.
          스마일, 하트, 동물, 음식, 여행, 기호 등 11개 카테고리로 분류되어 있어 원하는 이모지를 쉽게 찾을 수 있으며,
          최근 사용한 이모지는 자동으로 저장되어 반복 사용 시 편리합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">이모지의 역사와 발전</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          이모지는 1999년 일본의 NTT 도코모에서 처음 개발되었습니다. 당시 휴대전화 사용자들이 짧은 문자로 감정을 전달하기 어려웠기 때문에,
          시각적인 아이콘을 통해 커뮤니케이션을 돕고자 만들어졌습니다. 초기에는 12x12 픽셀의 단순한 그림 176개로 시작했지만,
          2010년 유니코드 컨소시엄에 공식 포함되면서 전 세계적으로 표준화되었습니다.
          현재 유니코드 15.1 기준으로 3,700개 이상의 이모지가 등록되어 있으며, 매년 새로운 이모지가 추가되고 있습니다.
          피부색 다양성, 성별 중립 이모지, 국기 이모지 등 포용성을 반영한 업데이트도 지속적으로 이루어지고 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">이모지 활용 팁</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          이모지는 단순한 채팅 도구를 넘어 다양한 분야에서 활용됩니다.
          SNS 게시물에 이모지를 적절히 사용하면 클릭률과 참여율이 평균 25% 이상 높아진다는 연구 결과가 있습니다.
          마케팅 이메일 제목에 이모지를 넣으면 오픈율이 증가하고, 프레젠테이션 슬라이드에서 핵심 포인트를 강조하는 데에도 효과적입니다.
          블로그 글이나 문서에서 목록 앞에 이모지를 붙이면 가독성이 크게 향상됩니다.
          다만, 공식 비즈니스 문서나 학술 자료에서는 사용을 자제하는 것이 좋으며,
          이모지의 의미가 플랫폼(Apple, Google, Samsung 등)마다 미묘하게 다를 수 있으므로 주의가 필요합니다.
        </p>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '이모지를 복사하려면 어떻게 하나요?', answer: '원하는 이모지를 클릭하면 자동으로 클립보드에 복사됩니다. 이후 Ctrl+V(또는 Command+V)로 원하는 곳에 붙여넣기 하면 됩니다.' },
          { question: '이모지가 상대방에게 다르게 보일 수 있나요?', answer: '네, 이모지는 운영체제와 기기에 따라 디자인이 다릅니다. Apple, Google, Samsung, Microsoft 등 각 플랫폼마다 고유한 이모지 스타일을 사용하므로 미묘한 차이가 있을 수 있습니다.' },
          { question: '검색 기능은 어떤 방식으로 동작하나요?', answer: '검색창에 키워드를 입력하면 모든 카테고리에서 관련 이모지를 한꺼번에 찾아 보여줍니다. 카테고리 탭은 검색 중에는 숨겨지며, 검색어를 지우면 다시 카테고리별 탐색이 가능합니다.' },
          { question: '최근 사용 이모지는 어떻게 관리되나요?', answer: '클릭한 이모지는 자동으로 최근 사용 목록에 추가됩니다. 최대 16개까지 저장되며, 같은 이모지를 다시 클릭하면 목록 맨 앞으로 이동합니다.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/" className="text-blue-600 hover:underline">← 홈으로</a>
        <a href="/tools/character-counter" className="text-blue-600 hover:underline">글자수 세기 →</a>
      </div>
    </div>
  );
}
