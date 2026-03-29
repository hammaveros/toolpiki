// 채팅이 조용할 때 자연스럽게 나오는 분위기 메시지
export const AMBIENT_MESSAGES = [
  { text: '...소곤소곤', emoji: '🤫' },
  { text: '커피 향이 솔솔~', emoji: '☕' },
  { text: '누군가 하품을 했다', emoji: '🥱' },
  { text: '시계 소리만 똑딱똑딱', emoji: '🕐' },
  { text: '창밖에 비가 온다', emoji: '🌧️' },
  { text: '누군가 과자 봉지를 뜯었다', emoji: '🍪' },
  { text: '형광등이 깜빡', emoji: '💡' },
  { text: '키보드 소리만 탈탈탈', emoji: '⌨️' },
  { text: '누군가 기지개를 켰다', emoji: '🙆' },
  { text: '에어컨 바람이 솔솔', emoji: '❄️' },
  { text: '커피 머신이 우웅~', emoji: '☕' },
  { text: '먼 곳에서 전화벨이 울린다', emoji: '📞' },
  { text: '벽시계가 째깍째깍', emoji: '⏰' },
  { text: '누군가 콧노래를 부른다', emoji: '🎵' },
  { text: '마우스 클릭 소리 딸깍', emoji: '🖱️' },
];

// 인터랙션 관련 메시지
export const INTERACTION_MESSAGES = {
  coffee: [
    '따뜻한 커피를 내렸어요 ☕',
    '아메리카노 한 잔 완성! ☕',
    '향긋한 커피가 준비됐어요 ☕',
    '에스프레소 샷 추가! ☕',
    '라떼 한 잔 완성~ 🥛☕',
  ],
  coffeeFail: [
    '커피를 쏟아버렸다!! 😱☕',
    '앗... 커피가 키보드 위로... 💀',
    '커피 머신이 고장났다! 🔧',
    '컵을 떨어뜨렸다... 🫠',
    '설탕을 너무 많이 넣었다 🤢',
  ],
  snack: [
    '과자 하나 몰래 집었어요 🍪',
    '초코칩 쿠키 득템! 🍪',
    '냠냠... 맛있다 🍪',
    '간식 타임~ 🍩',
    '사탕 하나 주워왔어요 🍬',
    '젤리 하나 슬쩍~ 🍭',
    '초콜릿 발견! 🍫',
  ],
  snackFail: [
    '소매에 왕창 넣다가 들켜버렸다!! 🚨',
    '팀장님이 뒤에 서 있었다... 👀',
    '간식 바구니가 비어있다... 누가 다 먹었지? 😱',
    '과자 봉지 뜯는 소리가 온 사무실에 울렸다 📢',
    '몰래 먹다가 부스러기가 키보드에... 💀',
    '간식 도둑 CCTV에 찍혔다! 📷',
    '옆자리에서 "나도 하나..." 하고 말았다 🤝',
  ],
};

export function getRandomAmbient() {
  return AMBIENT_MESSAGES[Math.floor(Math.random() * AMBIENT_MESSAGES.length)];
}

export function getRandomInteraction(type: 'coffee' | 'snack'): { text: string; failed: boolean } {
  // 실패 확률
  if (type === 'coffee' && Math.random() < 0.35) {
    const fails = INTERACTION_MESSAGES.coffeeFail;
    return { text: fails[Math.floor(Math.random() * fails.length)], failed: true };
  }
  if (type === 'snack' && Math.random() < 0.3) {
    const fails = INTERACTION_MESSAGES.snackFail;
    return { text: fails[Math.floor(Math.random() * fails.length)], failed: true };
  }
  const msgs = INTERACTION_MESSAGES[type];
  return { text: msgs[Math.floor(Math.random() * msgs.length)], failed: false };
}

// 탕비실 고정 문구 (상단에 랜덤 표시)
export const HEADER_QUOTES = [
  '여기 있는 거 팀장님한테 비밀임',
  '일하는 척 하면서 보세요',
  '커피 한 잔 하면서 쉬어가요',
  '오늘도 수고했어요',
  '아무도 안 봐요 편하게 쉬세요',
  '잠깐 쉬어가는 거예요',
  '여기선 다 괜찮아요',
  '나무들만 듣고 있어요',
];
