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
    '커피 한 잔 뚝딱~ 오늘도 살았다 ☕',
    '아메리카노 완성! 쓴맛이 인생맛 ☕',
    '라떼 한 잔에 마음이 녹는다~ 🥛☕',
    '에스프레소 샷 추가! 눈이 번쩍 ⚡☕',
    '커피 향이 탕비실에 퍼진다~ ☕✨',
    '오늘의 커피는 좀 잘 나왔다 ☕👨‍🍳',
  ],
  coffeeFail: [
    '컵을 기울였는데 방향이 반대였다... ☕💦',
    '커피 머신이 이상한 소리를 내기 시작했다 🔧💨',
    '설탕인 줄 알고 소금을 넣었다 🧂😇',
    '컵 뚜껑을 안 닫고 들었다... 바닥이 커피색 🫠',
    '머신에서 연기가 난다... 괜찮은 건가 💀💨',
    '옆 사람 컵이랑 바꿔 마실 뻔했다 😱',
  ],
  snack: [
    '눈치 100단 발휘해서 하나 집었다 🍪',
    '맨 아래에 숨겨둔 초콜릿 발굴 성공 🍫✨',
    '오늘의 간식은 내 거~ 냠냠 🍩',
    '사탕 하나 슬쩍... 아무도 못 봤지? 🍬',
    '젤리 하나 쏙~ 완벽한 범행 🍭',
    '쿠키 하나 겟! 오늘 운수 좋은 날 🍪🎉',
    '과자 봉지 소리 안 나게 여는 기술 습득 🥷🍪',
  ],
  snackFail: [
    '주머니에 넣다가 팀장님이랑 눈이 마주쳤다 👀💀',
    '과자 봉지가 펑! 온 탕비실이 쳐다본다 📢😱',
    '몰래 먹는데 부스러기가 옷에 왕창... 증거 인멸 실패 🕵️',
    '손 뻗었는데 바구니가 텅 비어있다... 누구야 범인 😤',
    '옆에서 "나도 하나~" 연쇄 반응 시작됐다 🤝🤝🤝',
    '간식 들고 나가다가 문에 걸렸다 🚪💥',
    'CCTV 빨간불이 깜빡이고 있다... 📷🔴',
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
