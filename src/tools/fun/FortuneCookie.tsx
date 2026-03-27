'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { ResultShareButtons } from '@/components/share/ResultShareButtons';
import { siteConfig } from '@/data/site';
import { FaqSection } from '@/components/ui/FaqItem';

type FortuneCategory = 'comfort' | 'motivation' | 'relationship' | 'life' | 'humor' | 'all';
type MoodType = 'tired' | 'sad' | 'anxious' | 'happy' | 'bored' | null;

const moodInfo: Record<Exclude<MoodType, null>, { label: string; emoji: string; categories: FortuneCategory[] }> = {
  tired: { label: '피곤해요', emoji: '😴', categories: ['comfort', 'humor'] },
  sad: { label: '우울해요', emoji: '😢', categories: ['comfort', 'motivation'] },
  anxious: { label: '불안해요', emoji: '😰', categories: ['comfort', 'life'] },
  happy: { label: '기분 좋아요', emoji: '😊', categories: ['motivation', 'humor'] },
  bored: { label: '심심해요', emoji: '😐', categories: ['humor', 'relationship'] },
};

interface Fortune {
  text: string;
  category: FortuneCategory;
}

const categoryInfo: Record<Exclude<FortuneCategory, 'all'>, { label: string; emoji: string; bg: string; gradient: string }> = {
  comfort: {
    label: '위로',
    emoji: '🫂',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    gradient: 'from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30'
  },
  motivation: {
    label: '동기부여',
    emoji: '🔥',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    gradient: 'from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30'
  },
  relationship: {
    label: '인간관계',
    emoji: '💝',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    gradient: 'from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30'
  },
  life: {
    label: '일과 삶',
    emoji: '🌿',
    bg: 'bg-green-50 dark:bg-green-900/20',
    gradient: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
  },
  humor: {
    label: '유머',
    emoji: '😄',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    gradient: 'from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30'
  },
};

const fortunes: Fortune[] = [
  // 위로 (55개)
  { text: "지금 하고 있는 방식이 꼭 틀린 건 아닙니다.", category: 'comfort' },
  { text: "오늘은 속도를 줄여도 괜찮은 날입니다.", category: 'comfort' },
  { text: "멈춰도 괜찮습니다. 멈추는 것도 움직임입니다.", category: 'comfort' },
  { text: "지금 느끼는 감정은 영원하지 않습니다.", category: 'comfort' },
  { text: "당신이 생각하는 것보다 괜찮은 상황일 수 있습니다.", category: 'comfort' },
  { text: "지금 쉬어도 아무도 뭐라 하지 않습니다.", category: 'comfort' },
  { text: "피곤하면 쉬어도 됩니다.", category: 'comfort' },
  { text: "무리하지 않아도 됩니다.", category: 'comfort' },
  { text: "하고 싶지 않으면 안 해도 됩니다.", category: 'comfort' },
  { text: "아직 시간은 있습니다.", category: 'comfort' },
  { text: "당장 답이 없어도 괜찮습니다.", category: 'comfort' },
  { text: "지금 고민은 나중에 보면 작을 수도 있습니다.", category: 'comfort' },
  { text: "어떤 하루든 끝은 있습니다.", category: 'comfort' },
  { text: "걱정했던 일이 안 일어날 수도 있습니다.", category: 'comfort' },
  { text: "모든 걸 알 필요는 없습니다.", category: 'comfort' },
  { text: "때로는 그냥 흘러가게 두는 것도 방법입니다.", category: 'comfort' },
  { text: "지금 이 순간도 충분히 의미가 있습니다.", category: 'comfort' },
  { text: "불확실함 속에서도 한 발은 나아가고 있습니다.", category: 'comfort' },
  { text: "힘든 시간도 결국 지나갑니다.", category: 'comfort' },
  { text: "완벽하지 않아도 충분히 괜찮습니다.", category: 'comfort' },
  { text: "남들과 비교하지 않아도 됩니다. 당신만의 속도가 있으니까요.", category: 'comfort' },
  { text: "지금 이대로도 충분합니다.", category: 'comfort' },
  { text: "쉬는 것도 일의 일부입니다.", category: 'comfort' },
  { text: "어제의 기준으로 오늘을 판단하지 않아도 됩니다.", category: 'comfort' },
  { text: "모든 게 연결되어 있지 않아도 괜찮습니다.", category: 'comfort' },
  { text: "울고 싶으면 울어도 됩니다.", category: 'comfort' },
  { text: "당신의 감정은 틀리지 않았습니다.", category: 'comfort' },
  { text: "지금 힘든 건 당신이 약해서가 아닙니다.", category: 'comfort' },
  { text: "버틴 것만으로도 대단한 겁니다.", category: 'comfort' },
  { text: "아무것도 안 해도 존재 자체로 충분합니다.", category: 'comfort' },
  { text: "지금 겪는 일은 당신 잘못이 아닐 수 있습니다.", category: 'comfort' },
  { text: "내일은 오늘보다 나을 수 있습니다.", category: 'comfort' },
  { text: "조금씩 나아지고 있습니다. 보이지 않을 뿐이에요.", category: 'comfort' },
  { text: "오늘 하루 살아낸 것만으로도 잘한 겁니다.", category: 'comfort' },
  { text: "당신은 충분히 노력하고 있습니다.", category: 'comfort' },
  { text: "괜찮지 않아도 괜찮다고 말해도 됩니다.", category: 'comfort' },
  { text: "지치면 잠시 내려놔도 됩니다. 다시 들면 되니까요.", category: 'comfort' },
  { text: "당신이 느끼는 무게는 아무도 대신 느낄 수 없습니다. 그래서 더 대단한 겁니다.", category: 'comfort' },
  { text: "세상이 시끄러울 때 조용히 있어도 됩니다.", category: 'comfort' },
  { text: "지금 아무것도 못 하겠다면, 그냥 숨만 쉬어도 됩니다.", category: 'comfort' },
  { text: "당신은 생각보다 많은 사람에게 소중한 존재입니다.", category: 'comfort' },
  { text: "약한 모습을 보여도 괜찮습니다. 그것도 당신이니까요.", category: 'comfort' },
  { text: "모든 걸 혼자 해결하지 않아도 됩니다.", category: 'comfort' },
  { text: "지금 이 감정도 결국 지나갈 구름 같은 겁니다.", category: 'comfort' },
  { text: "당신이 잘못해서 힘든 게 아닙니다.", category: 'comfort' },
  { text: "가끔은 도움을 요청하는 것도 용기입니다.", category: 'comfort' },
  { text: "어둠이 깊을수록 별은 더 밝게 빛납니다.", category: 'comfort' },
  { text: "오늘 하루가 힘들었다면, 내일은 조금 다를 수 있습니다.", category: 'comfort' },
  { text: "당신은 혼자가 아닙니다. 잊지 마세요.", category: 'comfort' },
  { text: "실수해도 됩니다. 그게 사람이니까요.", category: 'comfort' },
  { text: "눈물이 나면 그냥 흘리세요. 마음이 가벼워집니다.", category: 'comfort' },
  { text: "잘하고 있습니다. 정말로요.", category: 'comfort' },
  { text: "당신의 하루를 응원하는 사람이 여기 있습니다.", category: 'comfort' },
  { text: "지금 느끼는 외로움도 결국 지나갑니다.", category: 'comfort' },
  { text: "쉬어가는 것도 앞으로 가는 겁니다.", category: 'comfort' },

  // 동기부여 (55개)
  { text: "완벽하지 않아도 시작할 수 있습니다.", category: 'motivation' },
  { text: "작은 변화도 변화입니다.", category: 'motivation' },
  { text: "오늘 하루는 어제와 같을 필요가 없습니다.", category: 'motivation' },
  { text: "안 될 것 같은 일도 가끔은 됩니다.", category: 'motivation' },
  { text: "오늘의 작은 성취도 성취입니다.", category: 'motivation' },
  { text: "잘 모르겠으면 일단 해보는 것도 방법입니다.", category: 'motivation' },
  { text: "당신은 이미 많은 걸 해냈습니다.", category: 'motivation' },
  { text: "완벽한 타이밍은 없습니다. 지금이 그 타이밍일 수 있습니다.", category: 'motivation' },
  { text: "지금 놓친 것 같아도 돌아올 수 있습니다.", category: 'motivation' },
  { text: "완전히 새로운 것보다 약간의 변화가 더 쉽습니다.", category: 'motivation' },
  { text: "오늘 배운 건 내일도 쓸모가 있습니다.", category: 'motivation' },
  { text: "실패해도 경험이 남습니다.", category: 'motivation' },
  { text: "한 걸음이 천 리의 시작입니다.", category: 'motivation' },
  { text: "지금 당장 못해도 결국엔 하게 됩니다.", category: 'motivation' },
  { text: "어제의 나보다 나은 오늘의 나면 충분합니다.", category: 'motivation' },
  { text: "생각보다 많은 선택지가 이미 있습니다.", category: 'motivation' },
  { text: "지금 고민하고 있는 그 일, 생각보다 단순할 수 있습니다.", category: 'motivation' },
  { text: "뭔가 하고 있다면, 그것만으로도 충분합니다.", category: 'motivation' },
  { text: "시작이 반입니다. 이미 반은 한 셈입니다.", category: 'motivation' },
  { text: "잘하는 것보다 꾸준히 하는 게 더 중요합니다.", category: 'motivation' },
  { text: "지금 이 문장을 읽고 있다는 건, 여유가 있다는 뜻입니다.", category: 'motivation' },
  { text: "오늘 하루도 나름의 리듬이 있습니다.", category: 'motivation' },
  { text: "노력한 만큼 어딘가에 쌓이고 있습니다.", category: 'motivation' },
  { text: "포기하지 않으면 실패가 아닙니다.", category: 'motivation' },
  { text: "가끔은 우연을 믿어도 됩니다.", category: 'motivation' },
  { text: "지금 준비하고 있는 게 나중에 빛을 발합니다.", category: 'motivation' },
  { text: "오늘의 삽질이 내일의 실력입니다.", category: 'motivation' },
  { text: "실패는 성공의 반대가 아니라 과정입니다.", category: 'motivation' },
  { text: "늦었다고 생각할 때가 진짜 시작할 때입니다.", category: 'motivation' },
  { text: "지금 하는 고민이 미래의 나를 만듭니다.", category: 'motivation' },
  { text: "못하는 게 아니라 아직 안 해본 겁니다.", category: 'motivation' },
  { text: "방향이 맞다면 속도는 중요하지 않습니다.", category: 'motivation' },
  { text: "오늘 심은 씨앗이 언젠가 열매가 됩니다.", category: 'motivation' },
  { text: "지금 어렵다는 건 성장하고 있다는 증거입니다.", category: 'motivation' },
  { text: "할 수 있다고 생각하면 이미 반은 된 겁니다.", category: 'motivation' },
  { text: "어제 못 한 일을 오늘 하면 그게 성장입니다.", category: 'motivation' },
  { text: "두려움은 새로운 걸 시작할 때 느끼는 자연스러운 감정입니다.", category: 'motivation' },
  { text: "당신이 포기하지 않는 한 가능성은 항상 있습니다.", category: 'motivation' },
  { text: "작은 습관이 큰 결과를 만듭니다.", category: 'motivation' },
  { text: "지금 흘리는 땀은 나중에 빛이 됩니다.", category: 'motivation' },
  { text: "남들이 뭐라 하든 당신의 길을 가세요.", category: 'motivation' },
  { text: "오늘 한 줄의 코드가 내일의 서비스가 됩니다.", category: 'motivation' },
  { text: "꿈이 크면 시작이 어려운 게 당연합니다.", category: 'motivation' },
  { text: "지금 힘든 건 더 높이 올라가고 있기 때문입니다.", category: 'motivation' },
  { text: "매일 1%씩 나아지면 1년 후에는 37배가 됩니다.", category: 'motivation' },
  { text: "실력은 반복에서 나옵니다.", category: 'motivation' },
  { text: "지금 이 순간이 미래의 나를 만드는 중입니다.", category: 'motivation' },
  { text: "성공한 사람들도 처음엔 초보였습니다.", category: 'motivation' },
  { text: "오늘 공부한 게 내일의 무기가 됩니다.", category: 'motivation' },
  { text: "끈기는 재능보다 강합니다.", category: 'motivation' },
  { text: "지금 안 되는 건 아직 방법을 못 찾은 것뿐입니다.", category: 'motivation' },
  { text: "도전하는 것 자체가 이미 성공입니다.", category: 'motivation' },
  { text: "한 번의 실패로 모든 게 끝나지 않습니다.", category: 'motivation' },
  { text: "당신의 노력은 절대 배신하지 않습니다.", category: 'motivation' },
  { text: "지금 멈추면 여기가 끝입니다. 한 발만 더 가보세요.", category: 'motivation' },

  // 인간관계 (45개)
  { text: "지금 생각하고 있는 그 사람도 당신을 생각하고 있을지 모릅니다.", category: 'relationship' },
  { text: "비교할 필요 없습니다. 각자의 길이 있습니다.", category: 'relationship' },
  { text: "남들과 같은 속도일 필요는 없습니다.", category: 'relationship' },
  { text: "모든 관계가 깊을 필요는 없습니다.", category: 'relationship' },
  { text: "혼자만의 시간도 소중합니다.", category: 'relationship' },
  { text: "좋은 관계는 서로 편한 관계입니다.", category: 'relationship' },
  { text: "말하지 않아도 알아주길 바라면 안 됩니다.", category: 'relationship' },
  { text: "모든 사람에게 좋은 사람일 필요 없습니다.", category: 'relationship' },
  { text: "거리를 두는 것도 배려입니다.", category: 'relationship' },
  { text: "진짜 친구는 연락 안 해도 어색하지 않습니다.", category: 'relationship' },
  { text: "가끔은 먼저 연락해도 괜찮습니다.", category: 'relationship' },
  { text: "사람은 변합니다. 그게 자연스러운 겁니다.", category: 'relationship' },
  { text: "인연은 억지로 만들 수 없습니다.", category: 'relationship' },
  { text: "좋은 말 한마디가 하루를 바꿉니다.", category: 'relationship' },
  { text: "이해하려 하지 말고 그냥 들어주세요.", category: 'relationship' },
  { text: "모든 만남에는 이유가 있습니다.", category: 'relationship' },
  { text: "때로는 침묵이 최선의 대답입니다.", category: 'relationship' },
  { text: "상처 준 사람도 상처받은 사람일 수 있습니다.", category: 'relationship' },
  { text: "헤어짐도 성장의 일부입니다.", category: 'relationship' },
  { text: "당신을 좋아하는 사람은 분명 있습니다.", category: 'relationship' },
  { text: "관계도 쉬어가야 할 때가 있습니다.", category: 'relationship' },
  { text: "진심은 언젠가 통합니다.", category: 'relationship' },
  { text: "모든 사람을 이해할 필요는 없습니다.", category: 'relationship' },
  { text: "좋아하는 사람과 있으면 시간이 빨리 갑니다.", category: 'relationship' },
  { text: "싫으면 거절해도 됩니다. 그게 정상입니다.", category: 'relationship' },
  { text: "나를 좋아해주는 사람을 소중히 하세요.", category: 'relationship' },
  { text: "미운 사람도 자기 사정이 있습니다.", category: 'relationship' },
  { text: "오래된 친구가 있다는 건 행운입니다.", category: 'relationship' },
  { text: "관계에서 완벽을 기대하면 안 됩니다.", category: 'relationship' },
  { text: "가끔은 혼자가 편할 때도 있습니다.", category: 'relationship' },
  { text: "먼저 웃으면 상대도 웃게 됩니다.", category: 'relationship' },
  { text: "고마운 사람에게 고맙다고 말해보세요. 오늘이 좋은 날입니다.", category: 'relationship' },
  { text: "가까운 사이일수록 예의가 중요합니다.", category: 'relationship' },
  { text: "모든 사람의 마음을 얻으려 하면 자기 마음을 잃습니다.", category: 'relationship' },
  { text: "진짜 좋은 사람은 당신을 있는 그대로 받아들입니다.", category: 'relationship' },
  { text: "오해는 대화로 풀 수 있습니다. 포기하지 마세요.", category: 'relationship' },
  { text: "함께 웃을 수 있는 사람이 있다면 그게 행복입니다.", category: 'relationship' },
  { text: "관계는 양쪽 다 노력해야 유지됩니다.", category: 'relationship' },
  { text: "상대방의 입장에서 한 번만 생각해보세요.", category: 'relationship' },
  { text: "좋은 사람은 멀리 가도 결국 돌아옵니다.", category: 'relationship' },
  { text: "말보다 행동이 더 많은 걸 말해줍니다.", category: 'relationship' },
  { text: "사소한 관심이 큰 감동이 됩니다.", category: 'relationship' },
  { text: "진짜 사과는 변하는 모습으로 보여주는 겁니다.", category: 'relationship' },
  { text: "만나야 할 사람은 결국 만나게 되어 있습니다.", category: 'relationship' },
  { text: "좋은 이별도 있습니다. 서로를 위한 이별이라면요.", category: 'relationship' },

  // 일과 삶 (45개)
  { text: "결정을 미루는 것도 하나의 결정입니다.", category: 'life' },
  { text: "어떤 선택이든 틀린 건 아닙니다.", category: 'life' },
  { text: "계획대로 안 되는 것도 계획의 일부입니다.", category: 'life' },
  { text: "지금 보이지 않는 것도 분명히 있습니다.", category: 'life' },
  { text: "조용한 하루도 하루입니다.", category: 'life' },
  { text: "나중에 웃으며 떠올릴 수도 있습니다.", category: 'life' },
  { text: "오늘은 오늘의 일만 해도 됩니다.", category: 'life' },
  { text: "지금은 그냥 있어도 되는 시간입니다.", category: 'life' },
  { text: "굳이 서두르지 않아도 되는 순간입니다.", category: 'life' },
  { text: "가끔은 아무것도 하지 않는 게 정답일 때도 있습니다.", category: 'life' },
  { text: "일과 삶의 균형은 매일 다릅니다.", category: 'life' },
  { text: "오늘 못 한 일은 내일 해도 됩니다.", category: 'life' },
  { text: "완벽한 계획보다 실행이 중요합니다.", category: 'life' },
  { text: "정답은 하나가 아닙니다.", category: 'life' },
  { text: "인생은 마라톤입니다. 천천히 가도 됩니다.", category: 'life' },
  { text: "때로는 돌아가는 길이 빠른 길입니다.", category: 'life' },
  { text: "모든 일에 의미를 찾을 필요는 없습니다.", category: 'life' },
  { text: "행복은 어디에나 있습니다. 보이지 않을 뿐입니다.", category: 'life' },
  { text: "지금 이 순간도 인생의 일부입니다.", category: 'life' },
  { text: "과거는 바꿀 수 없지만 해석은 바꿀 수 있습니다.", category: 'life' },
  { text: "매일 같은 일상도 소중합니다.", category: 'life' },
  { text: "지금 하는 일이 나중에 도움이 됩니다.", category: 'life' },
  { text: "작은 행복을 모으면 큰 행복이 됩니다.", category: 'life' },
  { text: "삶은 예측 불가능해서 재미있습니다.", category: 'life' },
  { text: "지금 겪는 일도 언젠가 추억이 됩니다.", category: 'life' },
  { text: "후회는 해도 좋지만 오래 하지는 마세요.", category: 'life' },
  { text: "완벽한 삶은 없습니다. 있어 보이는 것뿐입니다.", category: 'life' },
  { text: "인생에 정해진 순서는 없습니다.", category: 'life' },
  { text: "지금 모르는 게 나중에 알게 됩니다.", category: 'life' },
  { text: "오늘이 가장 젊은 날입니다.", category: 'life' },
  { text: "가끔은 계획 없이 사는 것도 괜찮습니다.", category: 'life' },
  { text: "내가 선택한 길이 맞는 길입니다.", category: 'life' },
  { text: "변화가 두렵다면, 변하지 않는 게 더 위험할 수 있습니다.", category: 'life' },
  { text: "오늘 하루를 잘 보내는 것이 인생을 잘 사는 겁니다.", category: 'life' },
  { text: "남의 인생에 정답이 있는 것처럼 보여도 그건 착각입니다.", category: 'life' },
  { text: "지금 쓸모없어 보이는 경험도 언젠가 쓸모 있어집니다.", category: 'life' },
  { text: "돈보다 시간이 더 소중할 때가 있습니다.", category: 'life' },
  { text: "좋아하는 일을 하면 월요일도 괜찮아집니다.", category: 'life' },
  { text: "건강이 최고의 재산입니다. 오늘도 잘 드세요.", category: 'life' },
  { text: "인생은 한 번뿐입니다. 하고 싶은 거 하세요.", category: 'life' },
  { text: "지금 당장 답이 안 나와도 살다 보면 나옵니다.", category: 'life' },
  { text: "나이는 숫자일 뿐입니다. 시작에 늦은 건 없습니다.", category: 'life' },
  { text: "가진 게 적어도 행복할 수 있습니다.", category: 'life' },
  { text: "오늘 하루도 감사할 일이 하나쯤은 있습니다.", category: 'life' },
  { text: "바쁘게 사는 게 잘 사는 건 아닙니다.", category: 'life' },

  // 유머 (50개)
  { text: "오늘 저녁은 맛있는 걸 드세요. 제가 허락합니다.", category: 'humor' },
  { text: "월요일은 화요일이 되면 끝납니다.", category: 'humor' },
  { text: "배고프면 밥 드세요. 그게 답입니다.", category: 'humor' },
  { text: "자도 자도 피곤한 건 정상입니다.", category: 'humor' },
  { text: "다이어트는 내일부터 하면 됩니다.", category: 'humor' },
  { text: "운동은 마음속으로 해도 됩니다.", category: 'humor' },
  { text: "집이 최고입니다. 이견 없습니다.", category: 'humor' },
  { text: "커피 한 잔이 해결해줄 겁니다. 아마도요.", category: 'humor' },
  { text: "놀 때 놀고 쉴 때도 노세요.", category: 'humor' },
  { text: "오늘의 야근은 내일의 야근을 부릅니다.", category: 'humor' },
  { text: "인생은 짧습니다. 맛있는 거 드세요.", category: 'humor' },
  { text: "월급은 통장을 스쳐 지나갑니다.", category: 'humor' },
  { text: "금요일은 반드시 옵니다.", category: 'humor' },
  { text: "주말은 생각보다 짧습니다. 아껴 쓰세요.", category: 'humor' },
  { text: "잠은 보약입니다. 많이 드세요.", category: 'humor' },
  { text: "고민해도 결국 배달 시킵니다.", category: 'humor' },
  { text: "어차피 내일도 출근입니다. 오늘은 쉬세요.", category: 'humor' },
  { text: "오늘 하루도 수고했습니다. 택배나 뜯으세요.", category: 'humor' },
  { text: "귀찮으면 안 해도 됩니다. 내일의 나에게 맡기세요.", category: 'humor' },
  { text: "행복은 치킨 안에 있습니다.", category: 'humor' },
  { text: "돈 걱정은 돈이 생기면 하세요.", category: 'humor' },
  { text: "살찌면 어때요. 귀여워지는 겁니다.", category: 'humor' },
  { text: "오늘의 할 일은 내일의 나에게 위임합니다.", category: 'humor' },
  { text: "현실은 게임보다 밸런스가 안 좋습니다.", category: 'humor' },
  { text: "열심히 일한 당신, 떠나라. 지금 당장.", category: 'humor' },
  { text: "적당히 하세요. 인생 길어요.", category: 'humor' },
  { text: "이불 밖은 위험합니다.", category: 'humor' },
  { text: "야식은 먹고 후회하는 게 맞습니다.", category: 'humor' },
  { text: "아무것도 안 해도 배는 고픕니다.", category: 'humor' },
  { text: "쿠폰이 있으면 써야 합니다. 그게 예의입니다.", category: 'humor' },
  { text: "오늘 점심 뭐 먹지? 이게 진짜 고민입니다.", category: 'humor' },
  { text: "세상에서 가장 긴 시간: 퇴근 전 1시간.", category: 'humor' },
  { text: "알람 끄고 5분만 더 자는 게 인생 최고의 순간입니다.", category: 'humor' },
  { text: "맛있는 건 0칼로리입니다. 마음의 칼로리요.", category: 'humor' },
  { text: "통장 잔고는 보지 마세요. 마음의 평화를 위해.", category: 'humor' },
  { text: "하기 싫은 일이 있으면 일단 과자부터 드세요.", category: 'humor' },
  { text: "오늘도 출근했다는 것 자체가 승리입니다.", category: 'humor' },
  { text: "잠이 보약이라면 저는 만병통치약이 필요합니다.", category: 'humor' },
  { text: "로또는 사야 됩니다. 안 사면 확률이 0%입니다.", category: 'humor' },
  { text: "내일부터 열심히 살겠습니다. 매일 하는 말이지만요.", category: 'humor' },
  { text: "운동할 시간에 맛있는 걸 먹는 게 더 행복합니다.", category: 'humor' },
  { text: "인생 뭐 있어요. 먹고 자고 또 먹으면 됩니다.", category: 'humor' },
  { text: "오늘의 나는 내일의 나보다 젊습니다. 축하합니다.", category: 'humor' },
  { text: "회의가 길어지면 졸린 건 본능입니다.", category: 'humor' },
  { text: "체중계는 가전제품 중 가장 잔인합니다.", category: 'humor' },
  { text: "핸드폰 배터리가 나보다 더 빨리 지칩니다.", category: 'humor' },
  { text: "카페에서 커피 한 잔이면 뭐든 할 수 있을 것 같습니다. 기분만요.", category: 'humor' },
  { text: "세상에 공짜는 없다지만, 공짜 와이파이는 있습니다.", category: 'humor' },
  { text: "오늘 하루도 무사히 끝나면 그걸로 됐습니다.", category: 'humor' },
  { text: "내 인생의 주인공은 나인데 왜 엑스트라 같을까요.", category: 'humor' },
];

export function FortuneCookie() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [recentFortunes, setRecentFortunes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FortuneCategory>('all');
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);
  // 감정 기반 필터링
  const getFilteredFortunes = useCallback(() => {
    if (selectedMood) {
      const moodCategories = moodInfo[selectedMood].categories;
      return fortunes.filter(f => moodCategories.includes(f.category));
    }
    if (selectedCategory === 'all') {
      return fortunes;
    }
    return fortunes.filter(f => f.category === selectedCategory);
  }, [selectedCategory, selectedMood]);

  const filteredFortunes = getFilteredFortunes();

  const openCookie = useCallback(() => {
    if (filteredFortunes.length === 0) return;

    setIsOpening(true);
    setFortune(null);

    setTimeout(() => {
      // 최근 10개에 포함되지 않은 문장들 필터링
      const availableFortunes = filteredFortunes.filter(f => !recentFortunes.includes(f.text));

      // 모두 최근에 나왔으면 전체에서 선택
      const poolToUse = availableFortunes.length > 0 ? availableFortunes : filteredFortunes;

      const newIndex = Math.floor(Math.random() * poolToUse.length);
      const selected = poolToUse[newIndex];

      // 최근 문장 목록 업데이트 (최대 10개 유지)
      setRecentFortunes(prev => {
        const updated = [...prev, selected.text];
        return updated.slice(-10);
      });

      setFortune(selected);
      setIsOpening(false);
    }, 800);
  }, [filteredFortunes, recentFortunes]);

  // 감정 선택 시 카테고리 초기화
  const handleMoodSelect = (mood: MoodType) => {
    if (selectedMood === mood) {
      setSelectedMood(null);
    } else {
      setSelectedMood(mood);
      setSelectedCategory('all');
    }
  };

  // 카테고리 선택 시 감정 초기화
  const handleCategorySelect = (cat: FortuneCategory) => {
    setSelectedCategory(cat);
    setSelectedMood(null);
  };

  const currentCatInfo = fortune && fortune.category !== 'all' ? categoryInfo[fortune.category] : null;

  return (
    <div className="space-y-2">
      {/* 감정 선택 */}
      <Card variant="bordered" className="p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">지금 기분이 어때요?</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(moodInfo) as Exclude<MoodType, null>[]).map((mood) => (
            <button
              key={mood}
              onClick={() => handleMoodSelect(mood)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMood === mood
                  ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-400 ring-offset-1'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {moodInfo[mood].emoji} {moodInfo[mood].label}
            </button>
          ))}
        </div>

        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">또는 카테고리 선택</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'all' && !selectedMood
                ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🥠 전체
          </button>
          {(Object.keys(categoryInfo) as Exclude<FortuneCategory, 'all'>[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat && !selectedMood
                  ? `${categoryInfo[cat].bg} ring-2 ring-offset-1`
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {categoryInfo[cat].emoji} {categoryInfo[cat].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selectedMood
            ? `${moodInfo[selectedMood].emoji} ${moodInfo[selectedMood].label}에 맞는 `
            : ''}
          <span className="font-bold">{filteredFortunes.length}개</span> 문장
        </p>
      </Card>

      {/* 쿠키 영역 */}
      <Card
        variant="bordered"
        className={`p-4 md:p-6 text-center min-h-[250px] flex flex-col items-center justify-center transition-all duration-500 ${
          fortune && currentCatInfo
            ? `bg-gradient-to-br ${currentCatInfo.gradient}`
            : ''
        }`}
      >
        {!fortune && !isOpening && (
          <>
            <div className="text-6xl mb-6">🥠</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              쿠키를 열어 오늘의 문장을 확인하세요
            </p>
            <Button onClick={openCookie} size="lg">
              쿠키 열기
            </Button>
          </>
        )}

        {isOpening && (
          <div className="text-6xl animate-bounce">🥠</div>
        )}

        {fortune && !isOpening && currentCatInfo && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm ${currentCatInfo.bg}`}>
                {currentCatInfo.emoji} {currentCatInfo.label}
              </span>
            </div>
            <div className="text-4xl mb-4">📜</div>
            <p className="text-xl md:text-2xl leading-relaxed max-w-md mb-6 font-medium">
              "{fortune.text}"
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button onClick={openCookie} variant="secondary">
                다시 열기
              </Button>
              <CopyButton text={fortune.text} label="복사" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 w-full max-w-md">
              <ResultShareButtons
                url={`${siteConfig.url}/tools/fortune-cookie`}
                title="🥠 오늘의 포춘쿠키"
                description={fortune.text}
              />
            </div>
          </>
        )}
      </Card>

      <div className="text-xs text-gray-400 dark:text-gray-500 text-center space-y-1">
        <p>• 기분에 맞는 문장을 추천받거나 카테고리를 선택하세요</p>
        <p>• 총 250개의 문장이 준비되어 있습니다</p>
      </div>

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-8 text-gray-700 dark:text-gray-300">
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🥠 포춘 쿠키란?
        </h2>
        <p className="text-sm leading-relaxed">
          포춘 쿠키를 클릭해서 오늘의 짧은 문장을 받아보는 도구입니다.
          위로, 동기부여, 인간관계, 일과 삶, 유머 등 5가지 카테고리에서 250개 이상의 문장이 준비되어 있습니다.
          기분에 따라 카테고리를 선택하거나 랜덤으로 받아보세요.
          간단한 문장이지만 하루를 시작하는 작은 힘이 될 수 있습니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          📋 카테고리별 문장 유형
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">카테고리</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">주제</th>
                <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">추천 상황</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">💚 위로</td>
                <td className="py-2 pr-4">힘내라는 따뜻한 말</td>
                <td className="py-2">지친 날, 우울할 때</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">🔥 동기부여</td>
                <td className="py-2 pr-4">도전과 성취 격려</td>
                <td className="py-2">목표가 필요할 때</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">💛 인간관계</td>
                <td className="py-2 pr-4">소통과 이해</td>
                <td className="py-2">대인관계 고민</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">💜 일과 삶</td>
                <td className="py-2 pr-4">워라밸, 커리어</td>
                <td className="py-2">일 고민 있을 때</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">😄 유머</td>
                <td className="py-2 pr-4">가벼운 재미</td>
                <td className="py-2">기분전환</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          💡 활용 팁
        </h2>
        <ul className="text-sm space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
          <li><strong>아침 루틴:</strong> 하루 시작할 때 한 번 열어보기</li>
          <li><strong>기분 맞춤:</strong> 현재 기분에 맞는 카테고리 선택</li>
          <li><strong>공유하기:</strong> 좋은 문장은 친구에게 공유</li>
          <li><strong>스크린샷:</strong> 마음에 드는 문장은 저장해두기</li>
        </ul>
      </section>

      <FaqSection
        title="자주 묻는 질문"
        faqs={[
          { question: '문장은 매번 바뀌나요?', answer: '네, 250개 이상의 문장 중 랜덤으로 선택됩니다. 같은 카테고리 내에서도 다양한 문장이 나옵니다.' },
          { question: '하루 횟수 제한이 있나요?', answer: '아니요, 횟수 제한 없이 원하는 만큼 열어볼 수 있습니다. 다시 열기 버튼으로 계속 새 문장을 받을 수 있어요.' },
          { question: '문장을 저장할 수 있나요?', answer: '복사 버튼으로 클립보드에 복사하거나, 공유 기능으로 SNS에 공유할 수 있습니다.' },
        ]}
      />
    </div>
  );
}
