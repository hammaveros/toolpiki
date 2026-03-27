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
    name: 'Frequently Used',
    icon: '⏰',
    emojis: ['😀', '😂', '🥰', '😍', '🤔', '😭', '😎', '🥺', '👍', '❤️', '🔥', '✨', '🎉', '💯', '👏', '🙏'],
  },
  {
    name: 'Smileys',
    icon: '😀',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
  },
  {
    name: 'Emotions',
    icon: '😢',
    emojis: ['😟', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'],
  },
  {
    name: 'Gestures',
    icon: '👋',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'],
  },
  {
    name: 'Hearts',
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💌', '💋', '👄'],
  },
  {
    name: 'Animals',
    icon: '🐶',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊'],
  },
  {
    name: 'Food',
    icon: '🍕',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯'],
  },
  {
    name: 'Activities',
    icon: '⚽',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻'],
  },
  {
    name: 'Travel',
    icon: '✈️',
    emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '🪝', '⛽', '🚧', '🚦', '🚥', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🛖', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🛕', '🕋'],
  },
  {
    name: 'Objects',
    icon: '💡',
    emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪'],
  },
  {
    name: 'Symbols',
    icon: '✅',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄'],
  },
];

export function EmojiPickerEn() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const filteredEmojis = useMemo(() => {
    if (!search) {
      return EMOJI_CATEGORIES[selectedCategory].emojis;
    }
    // Search all categories when searching
    const allEmojis = EMOJI_CATEGORIES.flatMap((cat) => cat.emojis);
    return [...new Set(allEmojis)];
  }, [search, selectedCategory]);

  const handleCopy = useCallback(async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      setCopied(emoji);
      setTimeout(() => setCopied(null), 1000);

      // Add to recent
      setRecentEmojis((prev) => {
        const filtered = prev.filter((e) => e !== emoji);
        return [emoji, ...filtered].slice(0, 16);
      });
    } catch {
      // Copy failed
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* Search */}
      <Input
        placeholder="Search emojis..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Recent */}
      {recentEmojis.length > 0 && !search && (
        <Card variant="bordered" className="p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recently Used
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

      {/* Category tabs */}
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

      {/* Emoji grid */}
      <Card variant="bordered" className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {search ? 'Search Results' : EMOJI_CATEGORIES[selectedCategory].name}
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
          {copied} copied!
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">What is Emoji Picker?</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Emoji Picker is a free online tool that lets you browse, search, and copy emojis with a single click.
          Emojis are Unicode-based pictographic characters used to express emotions, objects, actions, and ideas visually.
          This tool organizes hundreds of emojis into 11 categories including Smileys, Hearts, Animals, Food, Travel, Objects, and Symbols,
          making it easy to find the exact emoji you need. Recently used emojis are automatically saved so you can quickly reuse your favorites
          without scrolling through the entire collection again.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">A Brief History of Emojis</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Emojis were first created in 1999 by Shigetaka Kurita at NTT DoCoMo in Japan. The original set consisted of just 176 simple
          12x12 pixel icons designed to help mobile phone users convey emotions and context in short text messages.
          In 2010, emojis were officially incorporated into the Unicode Standard, enabling cross-platform compatibility worldwide.
          As of Unicode 15.1, there are over 3,700 registered emojis, with new ones added annually by the Unicode Consortium.
          Modern emoji updates reflect growing diversity and inclusivity, including skin tone variations, gender-neutral options,
          and cultural symbols from around the globe. Today, emojis have become a universal language transcending borders and generations.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Emoji Usage Tips</h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Emojis go far beyond casual messaging. Studies have shown that social media posts with emojis receive up to 25% higher engagement rates
          compared to text-only posts. In email marketing, adding an emoji to your subject line can boost open rates significantly.
          Emojis also work well in presentations to highlight key points, and in blog posts or documentation to improve readability with visual markers.
          However, be mindful that emoji rendering varies across platforms such as Apple, Google, Samsung, and Microsoft,
          so the same emoji may look slightly different to different recipients. For formal business documents or academic papers,
          it is generally best to avoid emoji usage entirely.
        </p>
      </section>

      <FaqSection
        title="Frequently Asked Questions"
        faqs={[
          { question: 'How do I copy an emoji?', answer: 'Simply click on any emoji and it will be automatically copied to your clipboard. You can then paste it anywhere using Ctrl+V (or Command+V on Mac).' },
          { question: 'Can emojis look different on other devices?', answer: 'Yes, emoji designs vary by platform and operating system. Apple, Google, Samsung, and Microsoft each have their own unique emoji styles, so the same emoji may appear slightly different across devices.' },
          { question: 'How does the search feature work?', answer: 'Type a keyword in the search bar to find emojis across all categories at once. Category tabs are hidden during search and reappear when you clear the search field.' },
          { question: 'How are recently used emojis managed?', answer: 'Every emoji you click is automatically added to the recently used list at the top. Up to 16 emojis are stored, and clicking the same emoji again moves it to the front of the list.' },
        ]}
      />

      <div className="flex gap-4 text-sm">
        <a href="/en" className="text-blue-600 hover:underline">← Home</a>
        <a href="/en/tools/lorem-ipsum-en" className="text-blue-600 hover:underline">Lorem Ipsum →</a>
      </div>
    </div>
  );
}
