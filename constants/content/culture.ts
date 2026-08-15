import type { CultureArticle } from '@/types/content';

export const CULTURE_ARTICLES: CultureArticle[] = [
  {
    id: 'culture-uri',
    title: 'Why Koreans Say "우리"',
    subtitle: 'Our country, our company, our mum.',
    emoji: '🤝',
    readMinutes: 3,
    isPremium: false,
    sections: [
      {
        heading: 'Our, not my',
        body: 'Koreans say 우리 나라 (our country), 우리 회사 (our company), even 우리 엄마 (our mum) — when talking to someone who is clearly not their sibling. It is not a mistake.',
      },
      {
        heading: 'Where it comes from',
        body: 'Korean identity is built around the group you belong to. Saying 우리 signals that you and the listener share a world. Saying 내 (my) can sound like you are drawing a line between you.',
      },
      {
        heading: 'How to use it',
        body: 'Use 우리 for things that belong to a group you are part of: 우리 팀, 우리 학교, 우리 집. Keep 제 (my, humble) for genuinely personal items: 제 핸드폰, 제 이름.',
      },
    ],
  },
  {
    id: 'culture-cafe',
    title: 'Korean Cafe Culture',
    subtitle: 'Why there are four cafes on one block.',
    emoji: '☕',
    readMinutes: 3,
    isPremium: false,
    sections: [
      { heading: 'A cafe is a living room', body: 'Apartments are small and study rooms are noisy, so cafes are where Koreans work, study, date and hide from the weather. Nobody rushes you out.' },
      { heading: 'The iced americano rule', body: '아아 (iced americano) is ordered year-round, including in February. It is close to a national beverage.' },
      { heading: 'Ordering script', body: '아이스 아메리카노 한 잔 주세요 → 드시고 가세요? → 네, 먹고 갈게요 / 테이크아웃 할게요. That is the entire interaction.' },
    ],
  },
  {
    id: 'culture-restaurant',
    title: 'How to Order at a Restaurant',
    subtitle: 'Shared dishes, side dishes and the call button.',
    emoji: '🍚',
    readMinutes: 4,
    isPremium: false,
    sections: [
      { heading: 'Order for the table', body: 'Korean meals are shared. Ordering "2인분" (two servings) of one dish is normal — you do not each pick your own main.' },
      { heading: '반찬 are free', body: 'Side dishes come automatically and are refillable. Say 반찬 좀 더 주세요 to get more, at no charge.' },
      { heading: 'The call button', body: 'Most tables have a button. Press it instead of waving. No button? 저기요! across the room is completely normal and not rude.' },
    ],
  },
  {
    id: 'culture-drinking',
    title: 'Korean Drinking Etiquette',
    subtitle: 'Two hands, turned head, never your own glass.',
    emoji: '🍻',
    readMinutes: 4,
    isPremium: true,
    sections: [
      { heading: 'Never pour your own', body: 'Watch your neighbour’s glass, not your own. Someone else fills yours; you fill theirs.' },
      { heading: 'Two hands for elders', body: 'Pour and receive with two hands when the other person is older or senior to you.' },
      { heading: 'Turn away to drink', body: 'With a much older person, turn your head slightly away from them as you drink. It reads as respect, not avoidance.' },
    ],
  },
  {
    id: 'culture-jondaetmal',
    title: 'Using 존댓말',
    subtitle: 'Politeness is a setting, not a personality.',
    emoji: '🎚️',
    readMinutes: 4,
    isPremium: true,
    sections: [
      { heading: 'Three everyday levels', body: '~습니다 (formal), ~요 (polite, your default), and 반말 (casual). As a learner, live in ~요 and you will never offend anyone.' },
      { heading: 'When to drop to 반말', body: 'Only after the other person offers: 말 놔도 돼요? Dropping it yourself, uninvited, is the actual faux pas.' },
      { heading: 'Age decides', body: 'Koreans ask your age early. It is not nosiness — it decides which speech level both of you use.' },
    ],
  },
  {
    id: 'culture-convenience',
    title: 'Korean Convenience Stores',
    subtitle: 'A restaurant, an ATM and a parcel office.',
    emoji: '🏪',
    readMinutes: 3,
    isPremium: false,
    sections: [
      { heading: 'Eat in', body: 'There is a microwave, hot water, chopsticks and a counter. 도시락 plus 컵라면 is a legitimate dinner.' },
      { heading: '1+1 and 2+1', body: 'These stickers mean buy one get one, or buy two get one. You must take the free item at the same time.' },
      { heading: 'The phrases', body: '봉투 주세요 (a bag please), 데워 주세요 (heat it please), 괜찮아요 (no thanks).' },
    ],
  },
  {
    id: 'culture-subway',
    title: 'Subway Etiquette',
    subtitle: 'The rules nobody tells you.',
    emoji: '🚇',
    readMinutes: 3,
    isPremium: false,
    sections: [
      { heading: 'Priority seats stay empty', body: 'The pink and dark seats at the car ends stay free even when the train is packed. Sitting there as a young adult draws real disapproval.' },
      { heading: 'Meet at exit numbers', body: 'Nobody says "the north side". They say 6번 출구에서 만나요 — meet at exit 6.' },
      { heading: 'Quiet car, loud phones', body: 'Talking on the phone is fine, but keep it short and quiet. Speakerphone is not.' },
    ],
  },
  {
    id: 'culture-dating',
    title: 'Dating in Korea',
    subtitle: 'Anniversaries, couple looks and 썸.',
    emoji: '💕',
    readMinutes: 4,
    isPremium: true,
    sections: [
      { heading: '썸 comes first', body: '썸 is the stage before dating — mutual interest, constant messaging, nothing official. 썸 타다 means "to be in that stage".' },
      { heading: 'Day 100', body: 'Couples count from the day they start dating and celebrate 100일. Skipping it is noticed.' },
      { heading: 'Useful lines', body: '우리 사귈래요? (shall we date?), 오늘 시간 있어요? (do you have time today?), 보고 싶어요 (I miss you).' },
    ],
  },
];
