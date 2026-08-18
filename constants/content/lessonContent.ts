import type { LessonContent } from '@/types/content';

interface Line {
  korean: string;
  english: string;
  romanization: string;
  note?: string;
}

export interface LessonSpec {
  lessonId: string;
  intro: { heading: string; body: string };
  vocabularyIds: string[];
  expressions: Line[];
  listening: Line[];
  speaking: Line[];
  summary: string[];
}

export const LESSON_SPECS: LessonSpec[] = [
  {
    lessonId: 'lesson-friends-smalltalk',
    intro: {
      heading: 'Small talk that works',
      body: 'Korean small talk has three safe openers: the weather, what you ate, and what you did at the weekend. Food is the safest of the three — nobody minds being asked.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '날씨 진짜 좋네요.', english: 'The weather is really nice.', romanization: 'nalssi jinjja jonneyo.' },
      { korean: '밥 먹었어요?', english: 'Have you eaten?', romanization: 'bap meogeosseoyo?', note: 'Less a question than a friendly hello.' },
      { korean: '주말에 뭐 했어요?', english: 'What did you do at the weekend?', romanization: 'jumare mwo haesseoyo?' },
      { korean: '요즘 어떻게 지내요?', english: 'How have you been lately?', romanization: 'yojeum eotteoke jinaeyo?' },
      { korean: '저도요.', english: 'Me too.', romanization: 'jeodoyo.' },
    ],
    listening: [
      { korean: '아, 저도 주말에 쉬었어요.', english: 'Ah, I rested at the weekend too.', romanization: 'a, jeodo jumare swieosseoyo.' },
    ],
    speaking: [
      { korean: '주말에 뭐 했어요?', english: 'What did you do at the weekend?', romanization: 'jumare mwo haesseoyo?' },
    ],
    summary: [
      '밥 먹었어요? is a greeting, not really a question.',
      'Weather, food and weekends are the three safe openers.',
      '저도요 keeps a conversation going with two syllables.',
    ],
  },
  {
    lessonId: 'lesson-friends-banmal',
    intro: {
      heading: 'Dropping the 요',
      body: '반말 is casual speech with the 요 removed. Switching to it without being invited is genuinely rude, so the phrase that asks permission matters more than the grammar.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '말 놓으셔도 돼요.', english: 'You can speak casually to me.', romanization: 'mal noeusyeodo dwaeyo.', note: 'The invitation. Wait for it, or offer it downward.' },
      { korean: '우리 말 놓을까요?', english: 'Shall we drop the formal speech?', romanization: 'uri mal noeulkkayo?' },
      { korean: '어디 가?', english: 'Where are you going?', romanization: 'eodi ga?', note: '반말 — 어디 가요? with the 요 removed.' },
      { korean: '뭐 해?', english: 'What are you doing?', romanization: 'mwo hae?' },
      { korean: '같이 갈래?', english: 'Want to go together?', romanization: 'gachi gallae?' },
    ],
    listening: [
      { korean: '우리 동갑이네! 말 놓자.', english: 'We\'re the same age! Let\'s drop the formal speech.', romanization: 'uri donggabine! mal notja.' },
    ],
    speaking: [
      { korean: '우리 말 놓을까요?', english: 'Shall we drop the formal speech?', romanization: 'uri mal noeulkkayo?' },
    ],
    summary: [
      '반말 is 존댓말 with the 요 removed.',
      'Never switch first with someone older than you.',
      'Same age unlocks it; wait to be offered otherwise.',
    ],
  },
  {
    lessonId: 'lesson-friends-kakao',
    intro: {
      heading: 'Texting like a local',
      body: 'Korean texting has its own alphabet of consonant shortcuts. Using them correctly is the difference between sounding like a textbook and sounding like a person.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: 'ㅋㅋㅋ', english: 'haha', romanization: 'kkk', note: 'Laughing. More ㅋ means funnier.' },
      { korean: 'ㅠㅠ', english: 'crying', romanization: 'yuyu', note: 'Sad, or fake-sad. Extremely common.' },
      { korean: 'ㅇㅇ', english: 'yeah', romanization: 'eung', note: 'Casual yes. Only with friends.' },
      { korean: '넵!', english: 'Yes!', romanization: 'nep!', note: 'A chirpy 네 for a boss. Plain 네 can read cold in a chat.' },
      { korean: '고고', english: 'let\'s go', romanization: 'gogo' },
    ],
    listening: [
      { korean: '오늘 저녁 어때? ㅋㅋ', english: 'How about dinner tonight? haha', romanization: 'oneul jeonyeok eottae? kk' },
    ],
    speaking: [
      { korean: '좋아요! 고고!', english: 'Sounds good! Let\'s go!', romanization: 'joayo! gogo!' },
    ],
    summary: [
      'ㅋㅋㅋ is laughing, ㅠㅠ is crying.',
      '넵 to a boss, ㅇㅇ to a friend, never the other way round.',
      'Plain 네 in a chat can read as cold even though it is polite.',
    ],
  },
  {
    lessonId: 'lesson-friends-compliments',
    intro: {
      heading: 'Compliments and reactions',
      body: 'Korean conversation rewards visible reaction. Staying quiet reads as disinterest, so a handful of reaction words does more work than any grammar point.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '대박!', english: 'Amazing! / No way!', romanization: 'daebak!', note: 'Works for good and bad surprises.' },
      { korean: '진짜요?', english: 'Really?', romanization: 'jinjjayo?' },
      { korean: '완전 좋아요!', english: 'I totally love it!', romanization: 'wanjeon joayo!' },
      { korean: '잘하시네요!', english: 'You\'re good at this!', romanization: 'jalhasineyo!' },
      { korean: '멋있어요.', english: 'That\'s cool.', romanization: 'meosisseoyo.' },
    ],
    listening: [
      { korean: '이번에 시험 100점 받았어요! — 대박!', english: 'I got 100 on the exam! — Amazing!', romanization: 'ibeone siheom baekjeom badasseoyo! — daebak!' },
    ],
    speaking: [
      { korean: '진짜요? 대박!', english: 'Really? Amazing!', romanization: 'jinjjayo? daebak!' },
    ],
    summary: [
      'Reacting out loud is expected, not optional.',
      '대박 covers surprise in both directions.',
      '완전 intensifies almost any adjective.',
    ],
  },
  {
    lessonId: 'lesson-opinions-agree',
    intro: {
      heading: 'Agreeing and disagreeing',
      body: 'Direct disagreement is uncomfortable in Korean. The useful move is to agree partially first, then add your point.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '맞아요.', english: 'That\'s right.', romanization: 'majayo.' },
      { korean: '그렇긴 한데…', english: 'That\'s true, but…', romanization: 'geureotgin hande…', note: 'The standard soft disagreement.' },
      { korean: '글쎄요.', english: 'Hmm, I\'m not sure.', romanization: 'geulsseyo.', note: 'A polite no that avoids saying no.' },
      { korean: '저는 좀 다르게 생각해요.', english: 'I see it a bit differently.', romanization: 'jeoneun jom dareuge saenggakhaeyo.' },
      { korean: '동의해요.', english: 'I agree.', romanization: 'donguihaeyo.' },
    ],
    listening: [
      { korean: '이게 더 낫지 않아요? — 그렇긴 한데…', english: 'Isn\'t this better? — That\'s true, but…', romanization: 'ige deo natji anayo? — geureotgin hande…' },
    ],
    speaking: [
      { korean: '그렇긴 한데, 저는 좀 다르게 생각해요.', english: 'That\'s true, but I see it a bit differently.', romanization: 'geureotgin hande, jeoneun jom dareuge saenggakhaeyo.' },
    ],
    summary: [
      'Agree first, then disagree — the order matters.',
      '글쎄요 declines without the word no.',
      '그렇긴 한데 is the most useful three syllables here.',
    ],
  },
  {
    lessonId: 'lesson-opinions-because',
    intro: {
      heading: 'Giving reasons',
      body: 'Korean has two everyday ways to say because. ~아서/어서 states a cause; ~니까 leans on it as a justification, and only ~니까 works before a suggestion.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '배고파서 밥 먹었어요.', english: 'I ate because I was hungry.', romanization: 'baegopaseo bap meogeosseoyo.', note: '~아서/어서 — plain cause.' },
      { korean: '비가 오니까 택시 타요.', english: 'It\'s raining, so let\'s take a taxi.', romanization: 'biga onikka taeksi tayo.', note: '~니까 before a suggestion.' },
      { korean: '시간이 없어서 못 갔어요.', english: 'I couldn\'t go because I had no time.', romanization: 'sigani eopseoseo mot gasseoyo.' },
      { korean: '피곤하니까 먼저 갈게요.', english: 'I\'m tired, so I\'ll head off first.', romanization: 'pigonhanikka meonjeo galgeyo.' },
      { korean: '왜요?', english: 'Why?', romanization: 'waeyo?' },
    ],
    listening: [
      { korean: '늦어서 죄송합니다.', english: 'Sorry for being late.', romanization: 'neujeoseo joesonghamnida.' },
    ],
    speaking: [
      { korean: '비가 오니까 택시 타요.', english: 'It\'s raining, so let\'s take a taxi.', romanization: 'biga onikka taeksi tayo.' },
    ],
    summary: [
      '~아서/어서 states a cause.',
      '~니까 justifies, and is the one that works before a suggestion.',
      '늦어서 죄송합니다 is the apology you will use most.',
    ],
  },
  {
    lessonId: 'lesson-opinions-maybe',
    intro: {
      heading: 'Softening what you say',
      body: 'Korean speech is full of hedges. ~것 같아요 turns a flat statement into an impression, and it makes almost anything sound more considerate.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '맛있는 것 같아요.', english: 'I think it\'s tasty.', romanization: 'masinneun geot gatayo.', note: 'Softer than 맛있어요.' },
      { korean: '아마 늦을 것 같아요.', english: 'I\'ll probably be late.', romanization: 'ama neujeul geot gatayo.' },
      { korean: '좀 어려운 것 같아요.', english: 'It seems a bit difficult.', romanization: 'jom eoryeoun geot gatayo.', note: '좀 softens it further.' },
      { korean: '혹시 시간 있어요?', english: 'Do you have time, by any chance?', romanization: 'hoksi sigan isseoyo?', note: '혹시 makes a question easy to refuse.' },
      { korean: '잘 모르겠어요.', english: 'I\'m not really sure.', romanization: 'jal moreugesseoyo.' },
    ],
    listening: [
      { korean: '이거 어때요? — 좋은 것 같아요.', english: 'How\'s this? — I think it\'s good.', romanization: 'igeo eottaeyo? — joeun geot gatayo.' },
    ],
    speaking: [
      { korean: '아마 조금 늦을 것 같아요.', english: 'I\'ll probably be a little late.', romanization: 'ama jogeum neujeul geot gatayo.' },
    ],
    summary: [
      '~것 같아요 turns a statement into an impression.',
      '좀 and 혹시 soften requests and questions.',
      'Sounding certain can read as pushy.',
    ],
  },
  {
    lessonId: 'lesson-plans-invite',
    intro: {
      heading: 'Inviting someone out',
      body: 'A Korean invitation is usually phrased so it is easy to decline. ~ㄹ래요? offers rather than asks, which is why it feels comfortable.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '시간 되면 같이 갈래요?', english: 'Want to go together if you\'re free?', romanization: 'sigan doemyeon gachi gallaeyo?' },
      { korean: '커피 한잔할래요?', english: 'Want to grab a coffee?', romanization: 'keopi hanjanhallaeyo?' },
      { korean: '이번 주말에 뭐 해요?', english: 'What are you doing this weekend?', romanization: 'ibeon jumare mwo haeyo?', note: 'Ask this before inviting.' },
      { korean: '좋아요, 언제요?', english: 'Sounds good, when?', romanization: 'joayo, eonjeyo?' },
      { korean: '다음에 꼭 가요.', english: 'Let\'s definitely go next time.', romanization: 'daeume kkok gayo.', note: 'A warm decline.' },
    ],
    listening: [
      { korean: '금요일 저녁 어때요?', english: 'How about Friday evening?', romanization: 'geumyoil jeonyeok eottaeyo?' },
    ],
    speaking: [
      { korean: '커피 한잔할래요?', english: 'Want to grab a coffee?', romanization: 'keopi hanjanhallaeyo?' },
    ],
    summary: [
      '~ㄹ래요? offers rather than demands.',
      'Ask about their plans before inviting.',
      '다음에 꼭 가요 declines without closing the door.',
    ],
  },
  {
    lessonId: 'lesson-plans-cancel',
    intro: {
      heading: 'Changing plans',
      body: 'Cancelling in Korean needs an apology, a reason and an alternative. Leaving out the alternative is what makes it sting.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '미안한데 오늘 못 갈 것 같아요.', english: 'Sorry, I don\'t think I can make it today.', romanization: 'mianhande oneul mot gal geot gatayo.' },
      { korean: '갑자기 일이 생겼어요.', english: 'Something came up suddenly.', romanization: 'gapjagi iri saenggyeosseoyo.', note: 'The standard, and accepted, reason.' },
      { korean: '다음 주로 미뤄도 될까요?', english: 'Could we push it to next week?', romanization: 'daeum juro miryeodo doelkkayo?' },
      { korean: '정말 죄송해요.', english: 'I\'m really sorry.', romanization: 'jeongmal joesonghaeyo.' },
      { korean: '괜찮아요, 다음에 봐요.', english: 'It\'s fine, see you next time.', romanization: 'gwaenchanayo, daeume bwayo.' },
    ],
    listening: [
      { korean: '오늘 야근이라 못 갈 것 같아요.', english: 'I\'m working late, so I don\'t think I can make it.', romanization: 'oneul yageunira mot gal geot gatayo.' },
    ],
    speaking: [
      { korean: '미안한데 다음 주로 미뤄도 될까요?', english: 'Sorry, could we push it to next week?', romanization: 'mianhande daeum juro miryeodo doelkkayo?' },
    ],
    summary: [
      'Apologise, give a reason, offer a new time.',
      '갑자기 일이 생겼어요 is understood and rarely questioned.',
      'Cancelling without offering an alternative is the rude part.',
    ],
  },
  {
    lessonId: 'lesson-plans-confirm',
    intro: {
      heading: 'Confirming details',
      body: 'Korean plans are often agreed loosely and confirmed the day before. The confirmation message is its own small ritual.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '몇 시에 만날까요?', english: 'What time shall we meet?', romanization: 'myeot sie mannalkkayo?' },
      { korean: '어디서 볼까요?', english: 'Where shall we meet?', romanization: 'eodiseo bolkkayo?' },
      { korean: '몇 번 출구에서 만나요.', english: 'Let\'s meet at exit number …', romanization: 'myeot beon chuguueseo mannayo.', note: 'Seoul meeting points are exit numbers.' },
      { korean: '누구 또 와요?', english: 'Who else is coming?', romanization: 'nugu tto wayo?' },
      { korean: '내일 봬요!', english: 'See you tomorrow!', romanization: 'naeil bwaeyo!' },
    ],
    listening: [
      { korean: '내일 일곱 시, 강남역 십 번 출구에서 봐요.', english: 'Tomorrow at seven, Gangnam Station exit ten.', romanization: 'naeil ilgop si, gangnamyeok sip beon chulguueseo bwayo.' },
    ],
    speaking: [
      { korean: '몇 시에 어디서 만날까요?', english: 'What time and where shall we meet?', romanization: 'myeot sie eodiseo mannalkkayo?' },
    ],
    summary: [
      'Confirm the day before — it is expected, not fussy.',
      'Meeting points are station exits.',
      '~ㄹ까요? proposes and invites agreement.',
    ],
  },
  {
    lessonId: 'lesson-errands-bank',
    intro: {
      heading: 'At the bank',
      body: 'Opening a Korean account needs your residence card and a reason for the account. The questions are predictable, which makes them easy to prepare for.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '통장 만들고 싶어요.', english: 'I\'d like to open an account.', romanization: 'tongjang mandeulgo sipeoyo.' },
      { korean: '외국인 등록증이에요.', english: 'This is my residence card.', romanization: 'oegugin deungnokjeungieyo.' },
      { korean: '체크카드도 만들어 주세요.', english: 'A debit card as well, please.', romanization: 'chekeukadeudo mandeureo juseyo.' },
      { korean: '비밀번호는 네 자리예요?', english: 'Is the PIN four digits?', romanization: 'bimilbeonhoneun ne jariyeyo?' },
      { korean: '인터넷뱅킹 신청할게요.', english: 'I\'d like to sign up for online banking.', romanization: 'inteonetbaengking sincheonghalgeyo.' },
    ],
    listening: [
      { korean: '어떤 용도로 사용하실 건가요?', english: 'What will you be using it for?', romanization: 'eotteon yongdoro sayonghasil geongayo?' },
    ],
    speaking: [
      { korean: '통장 만들고 싶어요. 외국인 등록증 있어요.', english: 'I\'d like to open an account. I have my residence card.', romanization: 'tongjang mandeulgo sipeoyo. oegugin deungnokjeung isseoyo.' },
    ],
    summary: [
      'Bring your residence card and passport.',
      'You will be asked what the account is for.',
      '체크카드 is a debit card; 신용카드 is credit.',
    ],
  },
  {
    lessonId: 'lesson-errands-post',
    intro: {
      heading: 'Post office and parcels',
      body: '택배 is woven into daily life here. Most of it is booked in an app, but collecting and sending still happens face to face.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '택배 보내려고요.', english: 'I\'d like to send a parcel.', romanization: 'taekbae bonaeryeogoyo.' },
      { korean: '얼마나 걸려요?', english: 'How long will it take?', romanization: 'eolmana geollyeoyo?' },
      { korean: '등기로 보내 주세요.', english: 'Registered post, please.', romanization: 'deunggiro bonae juseyo.' },
      { korean: '택배 왔어요.', english: 'A parcel arrived.', romanization: 'taekbae wasseoyo.' },
      { korean: '경비실에 맡겨 주세요.', english: 'Please leave it with the security desk.', romanization: 'gyeongbisire matgyeo juseyo.', note: 'Standard for apartment buildings.' },
    ],
    listening: [
      { korean: '국내는 이틀, 해외는 일주일 정도 걸려요.', english: 'Domestic takes two days, overseas about a week.', romanization: 'gungnaeneun iteul, haeoeneun iljuil jeongdo geollyeoyo.' },
    ],
    speaking: [
      { korean: '택배 보내려고요. 얼마나 걸려요?', english: 'I\'d like to send a parcel. How long will it take?', romanization: 'taekbae bonaeryeogoyo. eolmana geollyeoyo?' },
    ],
    summary: [
      '경비실 is the security desk that holds your parcels.',
      '등기 is registered post and worth it for documents.',
      'Domestic delivery is usually next day.',
    ],
  },
  {
    lessonId: 'lesson-errands-phone',
    intro: {
      heading: 'Getting a phone plan',
      body: 'Korean plans are cheap on data and tied to a contract. Prepaid exists but is harder to find, so knowing the words for the contract matters.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '요금제 추천해 주세요.', english: 'Could you recommend a plan?', romanization: 'yogeumje chucheonhae juseyo.' },
      { korean: '데이터 무제한 있어요?', english: 'Do you have unlimited data?', romanization: 'deiteo mujehan isseoyo?' },
      { korean: '약정 몇 년이에요?', english: 'How many years is the contract?', romanization: 'yakjeong myeot nyeonieyo?' },
      { korean: '선불 유심 주세요.', english: 'A prepaid SIM, please.', romanization: 'seonbul yusim juseyo.' },
      { korean: '한 달에 얼마예요?', english: 'How much per month?', romanization: 'han dare eolmayeyo?' },
    ],
    listening: [
      { korean: '이 요금제가 제일 인기 많아요.', english: 'This plan is the most popular.', romanization: 'i yogeumjega jeil ingi manayo.' },
    ],
    speaking: [
      { korean: '데이터 무제한 요금제 있어요?', english: 'Do you have an unlimited data plan?', romanization: 'deiteo mujehan yogeumje isseoyo?' },
    ],
    summary: [
      '약정 is the contract period, usually two years.',
      '선불 유심 is prepaid, easier for short stays.',
      'Unlimited data plans are normal and cheap here.',
    ],
  },
  {
    lessonId: 'lesson-errands-haircut',
    intro: {
      heading: 'At the hair salon',
      body: 'Korean salons will do exactly what you ask, so being vague is the risk. Bring a photo and learn the four or five words that matter.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '조금만 다듬어 주세요.', english: 'Just a trim, please.', romanization: 'jogeumman dadeumeo juseyo.', note: 'The safest thing to say.' },
      { korean: '얼마나 자를까요?', english: 'How much shall I cut?', romanization: 'eolmana jareulkkayo?', note: 'What you will be asked.' },
      { korean: '이 정도로 잘라 주세요.', english: 'About this much, please.', romanization: 'i jeongdoro jalla juseyo.', note: 'Say it while showing with your fingers.' },
      { korean: '펌하고 싶어요.', english: 'I\'d like a perm.', romanization: 'peomhago sipeoyo.' },
      { korean: '앞머리는 그대로 두세요.', english: 'Leave the fringe as it is.', romanization: 'ammeorineun geudaero duseyo.' },
    ],
    listening: [
      { korean: '어떻게 해 드릴까요?', english: 'How would you like it done?', romanization: 'eotteoke hae deurilkkayo?' },
    ],
    speaking: [
      { korean: '조금만 다듬어 주세요. 앞머리는 그대로요.', english: 'Just a trim, please. Leave the fringe.', romanization: 'jogeumman dadeumeo juseyo. ammeorineun geudaeroyo.' },
    ],
    summary: [
      '조금만 다듬어 주세요 is the safe default.',
      'Bring a photo — it beats any sentence.',
      'Salons follow instructions literally, so be specific.',
    ],
  },
  {
    lessonId: 'lesson-health-pharmacy',
    intro: {
      heading: 'At the pharmacy',
      body: 'Korean pharmacists hand out effective medicine for common complaints without a prescription. Describing the symptom clearly is the whole job.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '감기약 주세요.', english: 'Cold medicine, please.', romanization: 'gamgiyak juseyo.' },
      { korean: '머리가 아파요.', english: 'I have a headache.', romanization: 'meoriga apayo.' },
      { korean: '배탈이 났어요.', english: 'I have an upset stomach.', romanization: 'baetari nasseoyo.' },
      { korean: '하루에 몇 번 먹어요?', english: 'How many times a day do I take it?', romanization: 'harue myeot beon meogeoyo?' },
      { korean: '처방전 없어요.', english: 'I don\'t have a prescription.', romanization: 'cheobangjeon eopseoyo.' },
    ],
    listening: [
      { korean: '식후 삼십 분에 드세요.', english: 'Take it thirty minutes after eating.', romanization: 'sikhu samsip bune deuseyo.' },
    ],
    speaking: [
      { korean: '감기약 주세요. 머리가 아파요.', english: 'Cold medicine, please. I have a headache.', romanization: 'gamgiyak juseyo. meoriga apayo.' },
    ],
    summary: [
      '~가 아파요 attaches to any body part.',
      '식후 means after meals, 식전 before.',
      'Many things need no prescription here.',
    ],
  },
  {
    lessonId: 'lesson-health-emergency',
    intro: {
      heading: 'Emergencies',
      body: '119 is fire and ambulance, 112 is police. Both have interpreters. The sentences here are short on purpose.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '도와주세요!', english: 'Help!', romanization: 'dowajuseyo!' },
      { korean: '119에 전화해 주세요.', english: 'Please call 119.', romanization: 'ilillguue jeonhwahae juseyo.', note: 'Fire and ambulance.' },
      { korean: '응급실이 어디예요?', english: 'Where is the emergency room?', romanization: 'eunggeupsiri eodiyeyo?' },
      { korean: '사고가 났어요.', english: 'There\'s been an accident.', romanization: 'sagoga nasseoyo.' },
      { korean: '영어 통역 가능해요?', english: 'Is an English interpreter available?', romanization: 'yeongeo tongyeok ganeunghaeyo?', note: '119 and 112 both offer this.' },
    ],
    listening: [
      { korean: '어디가 아프세요? 움직일 수 있어요?', english: 'Where does it hurt? Can you move?', romanization: 'eodiga apeuseyo? umjigil su isseoyo?' },
    ],
    speaking: [
      { korean: '도와주세요! 119에 전화해 주세요.', english: 'Help! Please call 119.', romanization: 'dowajuseyo! ilillguue jeonhwahae juseyo.' },
    ],
    summary: [
      '119 for fire and ambulance, 112 for police.',
      'Both lines have English interpreters.',
      'Keep the sentences short — they work better under stress.',
    ],
  },
  {
    lessonId: 'lesson-health-appointment',
    intro: {
      heading: 'Making an appointment',
      body: 'Small Korean clinics often take walk-ins, so the phone call is short. Larger hospitals need a booking and your residence card.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '예약하고 싶어요.', english: 'I\'d like to make an appointment.', romanization: 'yeyakhago sipeoyo.' },
      { korean: '오늘 진료 가능해요?', english: 'Can I be seen today?', romanization: 'oneul jillyo ganeunghaeyo?' },
      { korean: '보험 있어요.', english: 'I have insurance.', romanization: 'boheom isseoyo.' },
      { korean: '몇 시에 가면 돼요?', english: 'What time should I come?', romanization: 'myeot sie gamyeon dwaeyo?' },
      { korean: '접수했어요.', english: 'I\'ve checked in.', romanization: 'jeopsuhaesseoyo.' },
    ],
    listening: [
      { korean: '두 시에 오시면 됩니다.', english: 'Two o\'clock will be fine.', romanization: 'du sie osimyeon doemnida.' },
    ],
    speaking: [
      { korean: '오늘 진료 가능해요? 예약하고 싶어요.', english: 'Can I be seen today? I\'d like to book.', romanization: 'oneul jillyo ganeunghaeyo? yeyakhago sipeoyo.' },
    ],
    summary: [
      '접수 is checking in at the desk.',
      'Small clinics usually take walk-ins.',
      'National insurance makes most visits inexpensive.',
    ],
  },
  {
    lessonId: 'lesson-home-contract',
    intro: {
      heading: 'Renting an apartment',
      body: 'Korean rent comes in two shapes. 월세 is a deposit plus monthly rent; 전세 is one very large deposit and no rent at all. The deposit is the number that matters.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '월세가 얼마예요?', english: 'How much is the monthly rent?', romanization: 'wolsega eolmayeyo?' },
      { korean: '보증금은 얼마예요?', english: 'How much is the deposit?', romanization: 'bojeunggeumeun eolmayeyo?', note: 'Usually far larger than in the West.' },
      { korean: '관리비 포함이에요?', english: 'Is the maintenance fee included?', romanization: 'gwallibi pohamieyo?' },
      { korean: '전세도 있어요?', english: 'Do you have any jeonse places?', romanization: 'jeonsedo isseoyo?' },
      { korean: '계약 기간은 이 년이에요.', english: 'The contract is two years.', romanization: 'gyeyak giganeun i nyeonieyo.' },
    ],
    listening: [
      { korean: '보증금 천만 원에 월세 오십만 원이에요.', english: 'Ten million deposit, five hundred thousand a month.', romanization: 'bojeunggeum cheonman wone wolse osipman wonieyo.' },
    ],
    speaking: [
      { korean: '월세랑 보증금이 얼마예요?', english: 'How much are the rent and the deposit?', romanization: 'wolserang bojeunggeumi eolmayeyo?' },
    ],
    summary: [
      '월세 is deposit plus monthly rent.',
      '전세 is a large deposit and no monthly rent.',
      '관리비 is charged on top and is often forgotten.',
    ],
  },
  {
    lessonId: 'lesson-home-utilities',
    intro: {
      heading: 'Bills and utilities',
      body: 'Most bills arrive by app and are paid automatically. The words are worth knowing for the month something goes wrong.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '전기세가 많이 나왔어요.', english: 'The electricity bill came out high.', romanization: 'jeongisega mani nawasseoyo.' },
      { korean: '가스비 어떻게 내요?', english: 'How do I pay the gas bill?', romanization: 'gaseubi eotteoke naeyo?' },
      { korean: '인터넷 신청하고 싶어요.', english: 'I\'d like to sign up for internet.', romanization: 'inteonet sincheonghago sipeoyo.' },
      { korean: '자동이체 할게요.', english: 'I\'ll set up automatic payment.', romanization: 'jadongiche halgeyo.' },
      { korean: '관리비에 포함되어 있어요.', english: 'It\'s included in the maintenance fee.', romanization: 'gwallibie pohamdoeeo isseoyo.' },
    ],
    listening: [
      { korean: '이번 달 관리비는 십오만 원입니다.', english: 'This month\'s maintenance fee is 150,000 won.', romanization: 'ibeon dal gwallibineun sibomman wonimnida.' },
    ],
    speaking: [
      { korean: '인터넷 신청하고 싶어요.', english: 'I\'d like to sign up for internet.', romanization: 'inteonet sincheonghago sipeoyo.' },
    ],
    summary: [
      '관리비 often bundles water, cleaning and security.',
      '자동이체 is direct debit and worth setting up.',
      'Bills arrive by app more often than on paper.',
    ],
  },
  {
    lessonId: 'lesson-home-neighbours',
    intro: {
      heading: 'Neighbours and building rules',
      body: 'Apartment life runs on shared rules: rubbish nights, noise hours, and the 경비 아저씨 who knows everything about the building.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '분리수거는 언제예요?', english: 'When is the recycling day?', romanization: 'bullisugeoneun eonjeyeyo?' },
      { korean: '음식물 쓰레기는 어디에 버려요?', english: 'Where do I put the food waste?', romanization: 'eumsingmul sseuregineun eodie beoryeoyo?', note: 'Separated from everything else.' },
      { korean: '죄송해요, 시끄러웠죠?', english: 'Sorry, were we noisy?', romanization: 'joesonghaeyo, sikkeureowotjyo?' },
      { korean: '경비실에 물어볼게요.', english: 'I\'ll ask at the security desk.', romanization: 'gyeongbisire mureobolgeyo.' },
      { korean: '잘 부탁드립니다.', english: 'Nice to meet you / please be good to me.', romanization: 'jal butakdeurimnida.', note: 'What you say when you move in.' },
    ],
    listening: [
      { korean: '분리수거는 화요일 저녁이에요.', english: 'Recycling is Tuesday evening.', romanization: 'bullisugeoneun hwayoil jeonyeogieyo.' },
    ],
    speaking: [
      { korean: '안녕하세요, 옆집에 이사 왔어요. 잘 부탁드립니다.', english: 'Hello, I moved in next door. Nice to meet you.', romanization: 'annyeonghaseyo, yeopjibe isa wasseoyo. jal butakdeurimnida.' },
    ],
    summary: [
      'Food waste is separated from all other rubbish.',
      'Recycling happens on a fixed night.',
      'Greeting neighbours when you move in is expected.',
    ],
  },
  {
    lessonId: 'lesson-home-repairs',
    intro: {
      heading: 'When something breaks',
      body: 'For anything structural, the landlord or the building office handles it. Reporting clearly gets it fixed faster than apologising.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '보일러가 고장 났어요.', english: 'The boiler is broken.', romanization: 'boilleoga gojang nasseoyo.' },
      { korean: '물이 안 나와요.', english: 'There\'s no water.', romanization: 'muri an nawayo.' },
      { korean: '수리 좀 부탁드려요.', english: 'Could you arrange a repair, please.', romanization: 'suri jom butakdeuryeoyo.' },
      { korean: '언제 오실 수 있어요?', english: 'When can you come?', romanization: 'eonje osil su isseoyo?' },
      { korean: '집주인한테 연락했어요.', english: 'I contacted the landlord.', romanization: 'jipjuinhante yeollakhaesseoyo.' },
    ],
    listening: [
      { korean: '오늘 오후에 기사님이 가실 거예요.', english: 'A technician will come this afternoon.', romanization: 'oneul ohue gisanimi gasil geoyeyo.' },
    ],
    speaking: [
      { korean: '보일러가 고장 났어요. 수리 좀 부탁드려요.', english: 'The boiler is broken. Could you arrange a repair.', romanization: 'boilleoga gojang nasseoyo. suri jom butakdeuryeoyo.' },
    ],
    summary: [
      '고장 났어요 works for any appliance.',
      'Structural repairs are the landlord\'s responsibility.',
      '기사님 is the technician who comes out.',
    ],
  },
  {
    lessonId: 'lesson-arrival-immigration',
    intro: {
      heading: 'Immigration and customs',
      body: 'The questions at Incheon are short and always the same three: why, how long, and where are you staying.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '관광으로 왔어요.', english: 'I\'m here as a tourist.', romanization: 'gwangwangeuro wasseoyo.' },
      { korean: '일주일 있을 거예요.', english: 'I\'ll be here for a week.', romanization: 'iljuil isseul geoyeyo.' },
      { korean: '호텔에서 묵어요.', english: 'I\'m staying at a hotel.', romanization: 'hotereseo mugeoyo.' },
      { korean: '신고할 물건 없어요.', english: 'Nothing to declare.', romanization: 'singohal mulgeon eopseoyo.' },
      { korean: '출장으로 왔어요.', english: 'I\'m here on business.', romanization: 'chuljangeuro wasseoyo.' },
    ],
    listening: [
      { korean: '방문 목적이 뭐예요?', english: 'What is the purpose of your visit?', romanization: 'bangmun mokjeogi mwoyeyo?' },
    ],
    speaking: [
      { korean: '관광으로 왔어요. 일주일 있을 거예요.', english: 'I\'m here as a tourist for a week.', romanization: 'gwangwangeuro wasseoyo. iljuil isseul geoyeyo.' },
    ],
    summary: [
      'Three questions: purpose, length, address.',
      '관광 is tourism, 출장 is a business trip.',
      'Have your accommodation address written down.',
    ],
  },
  {
    lessonId: 'lesson-arrival-transport',
    intro: {
      heading: 'Getting into the city',
      body: 'From Incheon there are three ways in: the airport bus, the AREX train, or a taxi. The bus drops closest to most hotels.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '공항버스 어디서 타요?', english: 'Where do I catch the airport bus?', romanization: 'gonghangbeoseu eodiseo tayo?' },
      { korean: '서울역까지 얼마예요?', english: 'How much to Seoul Station?', romanization: 'seouryeokkkaji eolmayeyo?' },
      { korean: '표 한 장 주세요.', english: 'One ticket, please.', romanization: 'pyo han jang juseyo.' },
      { korean: '얼마나 걸려요?', english: 'How long does it take?', romanization: 'eolmana geollyeoyo?' },
      { korean: '교통카드 살 수 있어요?', english: 'Can I buy a transport card?', romanization: 'gyotongkadeu sal su isseoyo?', note: 'Buy one immediately — it works everywhere.' },
    ],
    listening: [
      { korean: '육천 번 버스 타시면 돼요.', english: 'You can take the 6000 bus.', romanization: 'yukcheon beon beoseu tasimyeon dwaeyo.' },
    ],
    speaking: [
      { korean: '공항버스 어디서 타요?', english: 'Where do I catch the airport bus?', romanization: 'gonghangbeoseu eodiseo tayo?' },
    ],
    summary: [
      'Buy a 교통카드 at the airport — it covers everything.',
      'The airport bus stops closest to most hotels.',
      'AREX express reaches Seoul Station in 45 minutes.',
    ],
  },
  {
    lessonId: 'lesson-arrival-simcard',
    intro: {
      heading: 'SIM cards and wifi',
      body: 'Airport SIM counters are open late and speak English. Getting online in the first ten minutes makes everything else easier.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '유심 사고 싶어요.', english: 'I\'d like to buy a SIM card.', romanization: 'yusim sago sipeoyo.' },
      { korean: '며칠짜리 있어요?', english: 'How many days does it cover?', romanization: 'myeochiljjari isseoyo?' },
      { korean: '데이터만 있으면 돼요.', english: 'Data only is fine.', romanization: 'deiteoman isseumyeon dwaeyo.' },
      { korean: '와이파이 비밀번호가 뭐예요?', english: 'What\'s the wifi password?', romanization: 'waipai bimilbeonhoga mwoyeyo?' },
      { korean: '여기 와이파이 돼요?', english: 'Is there wifi here?', romanization: 'yeogi waipai dwaeyo?' },
    ],
    listening: [
      { korean: '삼십 일짜리 무제한 유심 있어요.', english: 'We have a 30-day unlimited SIM.', romanization: 'samsip iljjari mujehan yusim isseoyo.' },
    ],
    speaking: [
      { korean: '유심 사고 싶어요. 데이터만 있으면 돼요.', english: 'I\'d like a SIM. Data only is fine.', romanization: 'yusim sago sipeoyo. deiteoman isseumyeon dwaeyo.' },
    ],
    summary: [
      '유심 is a SIM card.',
      'Airport counters are open late and speak English.',
      'Cafes and the subway have free wifi almost everywhere.',
    ],
  },
  {
    lessonId: 'lesson-hotel-checkin',
    intro: {
      heading: 'Checking in',
      body: 'Hotel check-in is short and predictable. Passport, reservation name, and the breakfast question.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '체크인하려고요.', english: 'I\'d like to check in.', romanization: 'chekeuinharyeogoyo.' },
      { korean: '예약했어요.', english: 'I have a reservation.', romanization: 'yeyakhaesseoyo.' },
      { korean: '여권 여기 있어요.', english: 'Here is my passport.', romanization: 'yeogwon yeogi isseoyo.' },
      { korean: '조식 몇 시부터예요?', english: 'What time does breakfast start?', romanization: 'josik myeot sibuteoyeyo?' },
      { korean: '와이파이 있어요?', english: 'Is there wifi?', romanization: 'waipai isseoyo?' },
    ],
    listening: [
      { korean: '여권 좀 보여 주시겠어요?', english: 'Could I see your passport?', romanization: 'yeogwon jom boyeo jusigesseoyo?' },
    ],
    speaking: [
      { korean: '체크인하려고요. 예약했어요.', english: 'I\'d like to check in. I have a reservation.', romanization: 'chekeuinharyeogoyo. yeyakhaesseoyo.' },
    ],
    summary: [
      'Passport is required for every hotel check-in.',
      '조식 is breakfast.',
      'Check-in is usually from three in the afternoon.',
    ],
  },
  {
    lessonId: 'lesson-hotel-problems',
    intro: {
      heading: 'When the room is wrong',
      body: 'Korean hotels fix problems quickly if you ask plainly. State what is wrong and what you would like instead.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '방을 바꿀 수 있어요?', english: 'Could I change rooms?', romanization: 'bangeul bakkul su isseoyo?' },
      { korean: '에어컨이 안 돼요.', english: 'The air conditioning isn\'t working.', romanization: 'eeokeoni an dwaeyo.' },
      { korean: '너무 시끄러워요.', english: 'It\'s too noisy.', romanization: 'neomu sikkeureowoyo.' },
      { korean: '수건 좀 더 주세요.', english: 'Some more towels, please.', romanization: 'sugeon jom deo juseyo.' },
      { korean: '뜨거운 물이 안 나와요.', english: 'There\'s no hot water.', romanization: 'tteugeoun muri an nawayo.' },
    ],
    listening: [
      { korean: '바로 확인해 드리겠습니다.', english: 'I\'ll check that right away.', romanization: 'baro hwaginhae deurigetseumnida.' },
    ],
    speaking: [
      { korean: '에어컨이 안 돼요. 방을 바꿀 수 있어요?', english: 'The air conditioning isn\'t working. Could I change rooms?', romanization: 'eeokeoni an dwaeyo. bangeul bakkul su isseoyo?' },
    ],
    summary: [
      '안 돼요 covers anything that will not work.',
      'Say the problem and the fix you want.',
      'Front desks respond quickly to a plain request.',
    ],
  },
  {
    lessonId: 'lesson-hotel-checkout',
    intro: {
      heading: 'Checking out',
      body: 'Luggage storage after checkout is standard and usually free. Late checkout is worth asking for and often granted.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '체크아웃할게요.', english: 'I\'d like to check out.', romanization: 'chekeuautalgeyo.' },
      { korean: '짐 좀 맡길 수 있어요?', english: 'Could I leave my luggage?', romanization: 'jim jom matgil su isseoyo?' },
      { korean: '늦게 체크아웃 가능해요?', english: 'Is late checkout possible?', romanization: 'neutge chekeuaut ganeunghaeyo?' },
      { korean: '택시 좀 불러 주세요.', english: 'Could you call a taxi, please.', romanization: 'taeksi jom bulleo juseyo.' },
      { korean: '영수증 주세요.', english: 'The receipt, please.', romanization: 'yeongsujeung juseyo.' },
    ],
    listening: [
      { korean: '짐은 몇 시에 찾으러 오실 거예요?', english: 'What time will you collect your luggage?', romanization: 'jimeun myeot sie chajeureo osil geoyeyo?' },
    ],
    speaking: [
      { korean: '체크아웃할게요. 짐 좀 맡길 수 있어요?', english: 'I\'d like to check out. Could I leave my luggage?', romanization: 'chekeuautalgeyo. jim jom matgil su isseoyo?' },
    ],
    summary: [
      'Luggage storage after checkout is normal and free.',
      'Late checkout is often granted if you ask.',
      'Front desks will call a taxi for you.',
    ],
  },
  {
    lessonId: 'lesson-sights-tickets',
    intro: {
      heading: 'Tickets and entry',
      body: 'Palaces and museums are cheap, and several are free in hanbok. Ask about discounts — students and groups usually qualify.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '입장료가 얼마예요?', english: 'How much is admission?', romanization: 'ipjangnyoga eolmayeyo?' },
      { korean: '어른 두 장 주세요.', english: 'Two adult tickets, please.', romanization: 'eoreun du jang juseyo.' },
      { korean: '학생 할인 돼요?', english: 'Is there a student discount?', romanization: 'haksaeng harin dwaeyo?' },
      { korean: '몇 시까지 해요?', english: 'What time do you close?', romanization: 'myeot sikkaji haeyo?' },
      { korean: '한복 입으면 무료예요?', english: 'Is it free in hanbok?', romanization: 'hanbok ibeumyeon muryoyeyo?', note: 'True at the palaces.' },
    ],
    listening: [
      { korean: '오늘은 여섯 시까지입니다.', english: 'Today we\'re open until six.', romanization: 'oneureun yeoseot sikkajiimnida.' },
    ],
    speaking: [
      { korean: '어른 두 장 주세요. 학생 할인 돼요?', english: 'Two adult tickets. Is there a student discount?', romanization: 'eoreun du jang juseyo. haksaeng harin dwaeyo?' },
    ],
    summary: [
      '장 counts flat things like tickets.',
      'Palaces are free if you wear hanbok.',
      'Most museums close one day a week — usually Monday.',
    ],
  },
  {
    lessonId: 'lesson-sights-photos',
    intro: {
      heading: 'Photos and politeness',
      body: 'Asking before photographing people is expected. Offering to take someone\'s photo is a small kindness that always lands well.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '사진 찍어도 돼요?', english: 'May I take a photo?', romanization: 'sajin jjigeodo dwaeyo?' },
      { korean: '사진 좀 찍어 주시겠어요?', english: 'Could you take a photo for us?', romanization: 'sajin jom jjigeo jusigesseoyo?' },
      { korean: '같이 찍을까요?', english: 'Shall we take one together?', romanization: 'gachi jjigeulkkayo?' },
      { korean: '여기 눌러 주세요.', english: 'Press here, please.', romanization: 'yeogi nulleo juseyo.' },
      { korean: '한 장 더 부탁드려요.', english: 'One more, please.', romanization: 'han jang deo butakdeuryeoyo.' },
    ],
    listening: [
      { korean: '제가 찍어 드릴까요?', english: 'Shall I take one for you?', romanization: 'jega jjigeo deurilkkayo?' },
    ],
    speaking: [
      { korean: '사진 좀 찍어 주시겠어요?', english: 'Could you take a photo for us?', romanization: 'sajin jom jjigeo jusigesseoyo?' },
    ],
    summary: [
      'Ask before photographing people, always.',
      '~해도 돼요? asks permission for anything.',
      'Offering to take someone\'s photo is normal and welcome.',
    ],
  },
  {
    lessonId: 'lesson-sights-recommend',
    intro: {
      heading: 'Asking for recommendations',
      body: 'Koreans give enthusiastic, specific recommendations if you ask properly. The word 맛집 will find you better food than any app.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '맛집 추천해 주세요.', english: 'Could you recommend a good restaurant?', romanization: 'matjip chucheonhae juseyo.', note: '맛집 means a place known for good food.' },
      { korean: '이 근처에 뭐가 좋아요?', english: 'What\'s good around here?', romanization: 'i geuncheoe mwoga joayo?' },
      { korean: '현지인들은 어디 가요?', english: 'Where do locals go?', romanization: 'hyeonjiindeureun eodi gayo?' },
      { korean: '꼭 가봐야 할 곳 있어요?', english: 'Anywhere I really should visit?', romanization: 'kkok gabwaya hal got isseoyo?' },
      { korean: '여기 유명해요?', english: 'Is this place famous?', romanization: 'yeogi yumyeonghaeyo?' },
    ],
    listening: [
      { korean: '여기 칼국수집이 진짜 맛있어요.', english: 'The kalguksu place here is really good.', romanization: 'yeogi kalguksujibi jinjja masisseoyo.' },
    ],
    speaking: [
      { korean: '이 근처 맛집 추천해 주세요.', english: 'Could you recommend a good place to eat nearby?', romanization: 'i geuncheo matjip chucheonhae juseyo.' },
    ],
    summary: [
      '맛집 is the word that unlocks real food recommendations.',
      '현지인 means a local.',
      'Koreans enjoy being asked and will be specific.',
    ],
  },
  {
    lessonId: 'lesson-office-greetings',
    intro: {
      heading: 'Office etiquette',
      body: 'Korean offices run on a few fixed phrases said at fixed moments. Saying them at the right time matters more than saying them perfectly.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '수고하셨습니다.', english: 'Thank you for your work.', romanization: 'sugohasyeotseumnida.', note: 'Said at the end of the day, to peers and juniors.' },
      { korean: '먼저 들어가 보겠습니다.', english: 'I\'ll head off first.', romanization: 'meonjeo deureoga bogetseumnida.', note: 'Never just leave silently.' },
      { korean: '안녕히 계세요.', english: 'Goodbye — to those staying.', romanization: 'annyeonghi gyeseyo.' },
      { korean: '좋은 아침입니다.', english: 'Good morning.', romanization: 'joeun achimimnida.' },
      { korean: '고생 많으셨어요.', english: 'You\'ve worked hard.', romanization: 'gosaeng maneusyeosseoyo.' },
    ],
    listening: [
      { korean: '오늘도 수고하셨습니다.', english: 'Thank you for your work today too.', romanization: 'oneuldo sugohasyeotseumnida.' },
    ],
    speaking: [
      { korean: '먼저 들어가 보겠습니다. 수고하셨습니다.', english: 'I\'ll head off first. Thank you for your work.', romanization: 'meonjeo deureoga bogetseumnida. sugohasyeotseumnida.' },
    ],
    summary: [
      'Never leave the office without saying something.',
      '수고하셨습니다 goes downward and sideways, not up.',
      '고생 많으셨어요 is warmer and safer with seniors.',
    ],
  },
  {
    lessonId: 'lesson-office-meetings',
    intro: {
      heading: 'In a meeting',
      body: 'Korean meetings favour agreement in the room and disagreement afterwards. These phrases let you take part without committing too early.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '확인해 보고 말씀드리겠습니다.', english: 'I\'ll check and get back to you.', romanization: 'hwaginhae bogo malsseumdeurigetseumnida.', note: 'The most useful sentence in a Korean office.' },
      { korean: '좋은 의견입니다.', english: 'That\'s a good point.', romanization: 'joeun uigyeonimnida.' },
      { korean: '조금만 더 생각해 보겠습니다.', english: 'Let me think about it a bit more.', romanization: 'jogeumman deo saenggakhae bogetseumnida.' },
      { korean: '질문 있습니다.', english: 'I have a question.', romanization: 'jilmun itseumnida.' },
      { korean: '언제까지 필요하세요?', english: 'When do you need it by?', romanization: 'eonjekkaji piryohaseyo?' },
    ],
    listening: [
      { korean: '이 건은 다음 주까지 부탁드립니다.', english: 'Please have this done by next week.', romanization: 'i geoneun daeum jukkaji butakdeurimnida.' },
    ],
    speaking: [
      { korean: '확인해 보고 말씀드리겠습니다.', english: 'I\'ll check and get back to you.', romanization: 'hwaginhae bogo malsseumdeurigetseumnida.' },
    ],
    summary: [
      '확인해 보고 말씀드리겠습니다 buys time politely.',
      'Disagreement usually happens after the meeting.',
      'Always ask the deadline — it will not be volunteered.',
    ],
  },
  {
    lessonId: 'lesson-office-requests',
    intro: {
      heading: 'Asking colleagues for things',
      body: 'A direct request sounds like an order in Korean. Wrapping it in a question and adding 좀 turns it into a favour.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '혹시 시간 괜찮으세요?', english: 'Do you have a moment, by any chance?', romanization: 'hoksi sigan gwaenchaneuseyo?' },
      { korean: '이것 좀 봐 주실 수 있어요?', english: 'Could you take a look at this?', romanization: 'igeot jom bwa jusil su isseoyo?' },
      { korean: '부탁 하나만 드려도 될까요?', english: 'Could I ask you a favour?', romanization: 'butak hanaman deuryeodo doelkkayo?' },
      { korean: '바쁘시면 나중에 해도 괜찮아요.', english: 'If you\'re busy, later is fine.', romanization: 'bappeusimyeon najunge haedo gwaenchanayo.', note: 'Always give the exit.' },
      { korean: '감사합니다, 덕분에 살았어요.', english: 'Thank you, you saved me.', romanization: 'gamsahamnida, deokbune sarasseoyo.' },
    ],
    listening: [
      { korean: '네, 지금 보내 드릴게요.', english: 'Sure, I\'ll send it now.', romanization: 'ne, jigeum bonae deurilgeyo.' },
    ],
    speaking: [
      { korean: '혹시 이것 좀 봐 주실 수 있어요?', english: 'Could you possibly take a look at this?', romanization: 'hoksi igeot jom bwa jusil su isseoyo?' },
    ],
    summary: [
      '좀 turns an instruction into a request.',
      '혹시 makes it easy to say no.',
      'Offering an exit is what makes the ask polite.',
    ],
  },
  {
    lessonId: 'lesson-office-hoesik',
    intro: {
      heading: 'Team dinners',
      body: '회식 is a work dinner and effectively part of the job. The rules are about pouring, receiving and knowing when it ends.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '건배!', english: 'Cheers!', romanization: 'geonbae!' },
      { korean: '제가 따라 드릴게요.', english: 'Let me pour for you.', romanization: 'jega ttara deurilgeyo.', note: 'Never pour your own.' },
      { korean: '두 손으로 받으세요.', english: 'Receive it with both hands.', romanization: 'du soneuro badeuseyo.' },
      { korean: '저는 술을 잘 못해요.', english: 'I can\'t really drink.', romanization: 'jeoneun sureul jal motaeyo.', note: 'Accepted, and better than refusing outright.' },
      { korean: '먼저 일어나 보겠습니다.', english: 'I\'ll head off first.', romanization: 'meonjeo ireona bogetseumnida.' },
    ],
    listening: [
      { korean: '한 잔 더 하시죠!', english: 'Let\'s have one more!', romanization: 'han jan deo hasijyo!' },
    ],
    speaking: [
      { korean: '제가 따라 드릴게요. 건배!', english: 'Let me pour for you. Cheers!', romanization: 'jega ttara deurilgeyo. geonbae!' },
    ],
    summary: [
      'Never pour your own drink.',
      'Receive with both hands from anyone senior.',
      '저는 술을 잘 못해요 is accepted and rarely pushed.',
    ],
  },
  {
    lessonId: 'lesson-email-open',
    intro: {
      heading: 'Writing an email',
      body: 'Korean business email has a fixed skeleton. Getting the opening and the 님 right matters more than the sentences in between.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '안녕하세요, 김 과장님.', english: 'Hello, Manager Kim.', romanization: 'annyeonghaseyo, gim gwajangnim.', note: 'Title plus 님. Never the bare name.' },
      { korean: '수고 많으십니다.', english: 'Thank you for your hard work.', romanization: 'sugo manseumnida.', note: 'Standard second line.' },
      { korean: '다름이 아니라,', english: 'The reason I\'m writing is,', romanization: 'dareumi anira,', note: 'Signals the point is coming.' },
      { korean: '감사합니다.', english: 'Thank you.', romanization: 'gamsahamnida.' },
      { korean: '확인 부탁드립니다.', english: 'Please confirm.', romanization: 'hwagin butakdeurimnida.' },
    ],
    listening: [
      { korean: '보내 주신 자료 잘 받았습니다.', english: 'I received the materials you sent.', romanization: 'bonae jusin jaryo jal badatseumnida.' },
    ],
    speaking: [
      { korean: '안녕하세요. 다름이 아니라 확인 부탁드립니다.', english: 'Hello. I\'m writing to ask you to confirm.', romanization: 'annyeonghaseyo. dareumi anira hwagin butakdeurimnida.' },
    ],
    summary: [
      'Always title plus 님, never a bare name.',
      '수고 많으십니다 is the standard opening line.',
      '다름이 아니라 signals you are getting to the point.',
    ],
  },
  {
    lessonId: 'lesson-email-request',
    intro: {
      heading: 'Making a request in writing',
      body: 'Written requests are softer than spoken ones. 부탁드립니다 does most of the work, and a deadline should always be explicit.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '자료 부탁드립니다.', english: 'The materials, please.', romanization: 'jaryo butakdeurimnida.' },
      { korean: '가능하시면 오늘까지 부탁드려요.', english: 'If possible, by today please.', romanization: 'ganeunghasimyeon oneulkkaji butakdeuryeoyo.' },
      { korean: '일정 조율 가능할까요?', english: 'Could we adjust the schedule?', romanization: 'iljeong joyul ganeunghalkkayo?' },
      { korean: '검토 부탁드립니다.', english: 'Please review this.', romanization: 'geomto butakdeurimnida.' },
      { korean: '바쁘신데 죄송합니다.', english: 'Sorry to bother you when you\'re busy.', romanization: 'bappeusinde joesonghamnida.' },
    ],
    listening: [
      { korean: '네, 내일까지 보내 드리겠습니다.', english: 'Yes, I\'ll send it by tomorrow.', romanization: 'ne, naeilkkaji bonae deurigetseumnida.' },
    ],
    speaking: [
      { korean: '검토 부탁드립니다. 가능하시면 오늘까지요.', english: 'Please review this. By today if possible.', romanization: 'geomto butakdeurimnida. ganeunghasimyeon oneulkkajiyo.' },
    ],
    summary: [
      '부탁드립니다 is the polite ask for anything.',
      'Say the deadline — it will not be assumed.',
      '가능하시면 softens a deadline into a request.',
    ],
  },
  {
    lessonId: 'lesson-email-apology',
    intro: {
      heading: 'Apologising professionally',
      body: 'A Korean work apology names the mistake, takes responsibility, and says what happens next. Skipping the last part makes it sound hollow.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '죄송합니다.', english: 'I apologise.', romanization: 'joesonghamnida.' },
      { korean: '제가 확인을 못 했습니다.', english: 'I failed to check.', romanization: 'jega hwagineul mot haetseumnida.' },
      { korean: '바로 수정하겠습니다.', english: 'I\'ll correct it right away.', romanization: 'baro sujeonghagetseumnida.' },
      { korean: '다시는 이런 일 없도록 하겠습니다.', english: 'I\'ll make sure it doesn\'t happen again.', romanization: 'dasineun ireon il eopdorok hagetseumnida.' },
      { korean: '늦어져서 죄송합니다.', english: 'Sorry for the delay.', romanization: 'neujeojyeoseo joesonghamnida.' },
    ],
    listening: [
      { korean: '괜찮습니다. 다음부터 신경 써 주세요.', english: 'It\'s fine. Please be careful from now on.', romanization: 'gwaenchanseumnida. daeumbuteo singyeong sseo juseyo.' },
    ],
    speaking: [
      { korean: '죄송합니다. 바로 수정하겠습니다.', english: 'I apologise. I\'ll correct it right away.', romanization: 'joesonghamnida. baro sujeonghagetseumnida.' },
    ],
    summary: [
      'Name it, own it, then say what you will do.',
      '죄송합니다 is for work; 미안해요 is for friends.',
      'An apology without a next step sounds hollow.',
    ],
  },
  {
    lessonId: 'lesson-email-messenger',
    intro: {
      heading: 'Work messenger',
      body: 'Korean offices run on messenger. It is faster and shorter than email but still polite — dropping the honorifics is the mistake.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '넵!', english: 'Yes!', romanization: 'nep!', note: 'The office standard. Plain 네 can read cold.' },
      { korean: '확인했습니다.', english: 'Checked / noted.', romanization: 'hwaginhaetseumnida.' },
      { korean: '잠시만요.', english: 'One moment.', romanization: 'jamsimanyo.' },
      { korean: '지금 자리에 없습니다.', english: 'I\'m away from my desk right now.', romanization: 'jigeum jarie eopseumnida.' },
      { korean: '퇴근하겠습니다.', english: 'I\'m heading home.', romanization: 'toegeunhagetseumnida.' },
    ],
    listening: [
      { korean: '이거 확인 부탁드려요! — 넵, 확인했습니다.', english: 'Please check this! — Yes, checked.', romanization: 'igeo hwagin butakdeuryeoyo! — nep, hwaginhaetseumnida.' },
    ],
    speaking: [
      { korean: '넵, 확인했습니다.', english: 'Yes, checked.', romanization: 'nep, hwaginhaetseumnida.' },
    ],
    summary: [
      '넵 is warmer than 네 in a work chat.',
      'Keep honorifics even when messages are short.',
      '확인했습니다 acknowledges without committing.',
    ],
  },
  {
    lessonId: 'lesson-hangul-batchim',
    intro: {
      heading: 'Batchim: the bottom consonant',
      body: 'A Korean syllable can carry a consonant underneath it — 받침, literally "support". It changes the sound, and it is the last piece you need before you can read anything.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '밥', english: 'Rice / a meal', romanization: 'bap', note: 'ㅂ underneath stops the sound short.' },
      { korean: '집', english: 'House', romanization: 'jip' },
      { korean: '책', english: 'Book', romanization: 'chaek' },
      { korean: '물', english: 'Water', romanization: 'mul', note: 'ㄹ at the bottom sounds closer to an L.' },
      { korean: '한국', english: 'Korea', romanization: 'hanguk' },
    ],
    listening: [
      { korean: '밥 먹었어요?', english: 'Have you eaten?', romanization: 'bap meogeosseoyo?' },
    ],
    speaking: [
      { korean: '한국 책이에요.', english: 'It is a Korean book.', romanization: 'hanguk chaegieyo.' },
    ],
    summary: [
      'A batchim is a consonant written under the syllable.',
      'It cuts the vowel short rather than adding a new syllable.',
      'ㄹ at the bottom is closer to an English L than an R.',
    ],
  },
  {
    lessonId: 'lesson-hangul-reading',
    intro: {
      heading: 'Reading real words',
      body: 'You now know enough letters to read most signs in Seoul. Loanwords are the easiest place to start — you already know what they mean.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '커피', english: 'Coffee', romanization: 'keopi' },
      { korean: '버스', english: 'Bus', romanization: 'beoseu' },
      { korean: '택시', english: 'Taxi', romanization: 'taeksi' },
      { korean: '카페', english: 'Cafe', romanization: 'kape' },
      { korean: '아이스크림', english: 'Ice cream', romanization: 'aiseukeurim' },
    ],
    listening: [
      { korean: '커피 한 잔 주세요.', english: 'One coffee, please.', romanization: 'keopi han jan juseyo.' },
    ],
    speaking: [
      { korean: '카페가 어디예요?', english: 'Where is the cafe?', romanization: 'kapega eodiyeyo?' },
    ],
    summary: [
      'Korean has no F or V — they become ㅍ and ㅂ.',
      'A consonant with no vowel gets ㅡ added: bus becomes 버스.',
      'Reading loanwords out loud is the fastest way to get fluent at Hangul.',
    ],
  },
  {
    lessonId: 'lesson-hangul-tricky',
    intro: {
      heading: 'The sounds that trip people up',
      body: 'Three things catch every learner: ㅓ against ㅗ, the Korean ㄹ, and the tense double consonants. Get these and your accent improves immediately.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '서울', english: 'Seoul', romanization: 'seoul', note: 'ㅓ is not "oh" — the mouth is relaxed and open.' },
      { korean: '소', english: 'Cow', romanization: 'so', note: 'ㅗ is rounded. 서 and 소 are different words.' },
      { korean: '사랑', english: 'Love', romanization: 'sarang', note: 'ㄹ between vowels flaps like a soft R.' },
      { korean: '오빠', english: 'Older brother (said by a woman)', romanization: 'oppa', note: 'ㅃ is tense — no puff of air.' },
      { korean: '싸요', english: 'It is cheap', romanization: 'ssayo', note: '사요 means "I buy". Very different.' },
    ],
    listening: [
      { korean: '이거 진짜 싸요.', english: 'This is really cheap.', romanization: 'igeo jinjja ssayo.' },
    ],
    speaking: [
      { korean: '서울에 살아요.', english: 'I live in Seoul.', romanization: 'seoure sarayo.' },
    ],
    summary: [
      'ㅓ is relaxed and open, ㅗ is rounded — they are different words.',
      'ㄹ flaps between vowels and sounds like L at the end.',
      'Double consonants are tense and unaspirated: 싸 is not 사.',
    ],
  },
  {
    lessonId: 'lesson-numbers-time',
    intro: {
      heading: 'Telling the time',
      body: 'Korean uses both number systems in a single clock reading: native Korean for the hour, Sino-Korean for the minutes. It sounds odd until you have said it twice.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '한 시', english: 'One o’clock', romanization: 'han si', note: 'Native numbers for hours.' },
      { korean: '두 시 삼십 분', english: 'Two thirty', romanization: 'du si samsip bun', note: 'Sino numbers for minutes.' },
      { korean: '지금 몇 시예요?', english: 'What time is it now?', romanization: 'jigeum myeot siyeyo?' },
      { korean: '오전', english: 'AM', romanization: 'ojeon' },
      { korean: '오후', english: 'PM', romanization: 'ohu' },
    ],
    listening: [
      { korean: '회의는 세 시예요.', english: 'The meeting is at three.', romanization: 'hoeuineun se siyeyo.' },
    ],
    speaking: [
      { korean: '일곱 시에 만나요.', english: 'Let’s meet at seven.', romanization: 'ilgop sie mannayo.' },
    ],
    summary: [
      'Hours use native numbers: 한, 두, 세, 네.',
      'Minutes use Sino numbers: 십, 이십, 삼십.',
      '몇 시예요? is the question you will actually be asked.',
    ],
  },
  {
    lessonId: 'lesson-numbers-dates',
    intro: {
      heading: 'Days and dates',
      body: 'Months in Korean are just the number plus 월, which makes them far easier than English. Days of the week take a little memorising.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '오늘 며칠이에요?', english: 'What is the date today?', romanization: 'oneul myeochirieyo?' },
      { korean: '삼월 십오일', english: 'March 15th', romanization: 'samwol siboil', note: 'Month number + 월, day number + 일.' },
      { korean: '금요일', english: 'Friday', romanization: 'geumyoil' },
      { korean: '주말', english: 'Weekend', romanization: 'jumal' },
      { korean: '다음 주에 봐요.', english: 'See you next week.', romanization: 'daeum jue bwayo.' },
    ],
    listening: [
      { korean: '토요일에 시간 있어요?', english: 'Are you free on Saturday?', romanization: 'toyoire sigan isseoyo?' },
    ],
    speaking: [
      { korean: '금요일 저녁 어때요?', english: 'How about Friday evening?', romanization: 'geumyoil jeonyeok eottaeyo?' },
    ],
    summary: [
      'Months are the number plus 월 — no names to learn.',
      'Days end in 요일: 월요일 through 일요일.',
      '며칠이에요? asks the date, 몇 시예요? asks the time.',
    ],
  },
  {
    lessonId: 'lesson-numbers-phone',
    intro: {
      heading: 'Phone numbers and addresses',
      body: 'Phone numbers use Sino-Korean digits one at a time. Zero is 공 when reading a number aloud, not 영.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '전화번호가 어떻게 되세요?', english: 'What is your phone number?', romanization: 'jeonhwabeonhoga eotteoke doeseyo?' },
      { korean: '공일공', english: '010', romanization: 'gongilgong', note: 'Every Korean mobile starts with this.' },
      { korean: '카톡 아이디 뭐예요?', english: 'What is your Kakao ID?', romanization: 'katok aidi mwoyeyo?', note: 'Asked far more often than a phone number.' },
      { korean: '주소 좀 알려 주세요.', english: 'Could you tell me the address?', romanization: 'juso jom allyeo juseyo.' },
      { korean: '몇 층이에요?', english: 'Which floor is it?', romanization: 'myeot cheungieyo?' },
    ],
    listening: [
      { korean: '삼 층으로 오세요.', english: 'Come up to the third floor.', romanization: 'sam cheungeuro oseyo.' },
    ],
    speaking: [
      { korean: '제 번호는 공일공이에요.', english: 'My number starts with 010.', romanization: 'je beonhoneun gongilgongieyo.' },
    ],
    summary: [
      'Read phone numbers digit by digit with Sino numbers.',
      'Zero is 공 out loud, not 영.',
      'Koreans usually swap Kakao IDs rather than phone numbers.',
    ],
  },
  {
    lessonId: 'lesson-food-delivery',
    intro: {
      heading: 'Ordering delivery',
      body: 'Korea has the densest delivery network on earth. Most of it happens in an app, so the Korean you need is the request box, not a conversation.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '문 앞에 놔주세요.', english: 'Please leave it at the door.', romanization: 'mun ape nwajuseyo.', note: 'The single most used sentence in Korean delivery.' },
      { korean: '벨 누르지 마세요.', english: 'Please do not ring the bell.', romanization: 'bel nureuji maseyo.' },
      { korean: '얼마나 걸려요?', english: 'How long will it take?', romanization: 'eolmana geollyeoyo?' },
      { korean: '수저는 안 주셔도 돼요.', english: 'No cutlery needed, thanks.', romanization: 'sujeoneun an jusyeodo dwaeyo.' },
      { korean: '배달 시킬까요?', english: 'Shall we order delivery?', romanization: 'baedal sikilkkayo?' },
    ],
    listening: [
      { korean: '주문하신 치킨 배달 왔습니다.', english: 'Delivery for the chicken you ordered.', romanization: 'jumunhasin chikin baedal watseumnida.' },
    ],
    speaking: [
      { korean: '문 앞에 놔주세요. 감사합니다.', english: 'Please leave it at the door. Thank you.', romanization: 'mun ape nwajuseyo. gamsahamnida.' },
    ],
    summary: [
      '문 앞에 놔주세요 goes in the app request box, not to a person.',
      'Tipping is not a thing — the star rating is the currency.',
      'Declining cutlery is normal and slightly greener.',
    ],
  },
  {
    lessonId: 'lesson-food-spicy',
    intro: {
      heading: 'Spicy, sweet, salty',
      body: 'Korean food runs hot. Knowing how to ask for it milder — and how to say it is delicious — will get you a long way in a restaurant.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '많이 매워요?', english: 'Is it very spicy?', romanization: 'mani maewoyo?' },
      { korean: '덜 맵게 해 주세요.', english: 'Please make it less spicy.', romanization: 'deol maepge hae juseyo.' },
      { korean: '진짜 맛있어요!', english: 'This is really delicious!', romanization: 'jinjja masisseoyo!' },
      { korean: '좀 짜요.', english: 'It is a bit salty.', romanization: 'jom jjayo.' },
      { korean: '달아요.', english: 'It is sweet.', romanization: 'darayo.' },
    ],
    listening: [
      { korean: '이거 조금 매울 수 있어요.', english: 'This might be a little spicy.', romanization: 'igeo jogeum maeul su isseoyo.' },
    ],
    speaking: [
      { korean: '덜 맵게 해 주실 수 있어요?', english: 'Could you make it less spicy?', romanization: 'deol maepge hae jusil su isseoyo?' },
    ],
    summary: [
      '맵다 is spicy, 짜다 salty, 달다 sweet.',
      '덜 means "less" and goes before the adjective.',
      'Saying 맛있어요 out loud is genuinely appreciated.',
    ],
  },
  {
    lessonId: 'lesson-food-bill',
    intro: {
      heading: 'Paying the bill',
      body: 'In most Korean restaurants you pay at the counter on the way out, not at the table. Someone usually pays for everyone — offering matters.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '계산할게요.', english: 'I’ll pay / the bill, please.', romanization: 'gyesanhalgeyo.', note: 'Said at the counter as you leave.' },
      { korean: '따로따로 계산해 주세요.', english: 'Separate bills, please.', romanization: 'ttarottaro gyesanhae juseyo.' },
      { korean: '제가 살게요.', english: 'It is on me.', romanization: 'jega salgeyo.' },
      { korean: '카드 되나요?', english: 'Do you take card?', romanization: 'kadeu doenayo?' },
      { korean: '잘 먹었습니다.', english: 'Thank you for the meal.', romanization: 'jal meogeotseumnida.', note: 'Said on the way out. Always appreciated.' },
    ],
    listening: [
      { korean: '카드로 하시겠어요?', english: 'Would you like to pay by card?', romanization: 'kadeuro hasigesseoyo?' },
    ],
    speaking: [
      { korean: '계산할게요. 카드로 할게요.', english: 'The bill, please. By card.', romanization: 'gyesanhalgeyo. kadeuro halgeyo.' },
    ],
    summary: [
      'You pay at the counter, not the table.',
      '잘 먹었습니다 on the way out is standard politeness.',
      'Card is accepted almost everywhere, even for small amounts.',
    ],
  },
  {
    lessonId: 'lesson-transport-bus',
    intro: {
      heading: 'Buses and transfers',
      body: 'One card covers bus, subway and most taxis. Tag on when you board and tag off when you leave — the tag off is what makes the transfer free.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '이 버스 강남 가요?', english: 'Does this bus go to Gangnam?', romanization: 'i beoseu gangnam gayo?' },
      { korean: '환승이에요.', english: 'It is a transfer.', romanization: 'hwanseungieyo.', note: 'What the card reader says when you tag on again.' },
      { korean: '어디서 내려요?', english: 'Where do I get off?', romanization: 'eodiseo naeryeoyo?' },
      { korean: '다음 정류장이에요.', english: 'It is the next stop.', romanization: 'daeum jeongnyujangieyo.' },
      { korean: '카드 찍어 주세요.', english: 'Please tap your card.', romanization: 'kadeu jjigeo juseyo.' },
    ],
    listening: [
      { korean: '이번 정류장은 홍대입구입니다.', english: 'This stop is Hongdae Entrance.', romanization: 'ibeon jeongnyujangeun hongdaeipguimnida.' },
    ],
    speaking: [
      { korean: '이 버스 시청 가요?', english: 'Does this bus go to City Hall?', romanization: 'i beoseu sicheong gayo?' },
    ],
    summary: [
      'Tag on and tag off — tagging off is what keeps the transfer free.',
      '환승 is the word for transferring between lines or modes.',
      'Ask 이 버스 ~ 가요? to check a bus goes where you think.',
    ],
  },
  {
    lessonId: 'lesson-transport-directions',
    intro: {
      heading: 'Asking for directions',
      body: 'Koreans give directions by exit number and landmark far more than by street name. Learn the exits and you will rarely be lost.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '몇 번 출구예요?', english: 'Which exit number?', romanization: 'myeot beon chulguyeyo?' },
      { korean: '직진하세요.', english: 'Go straight.', romanization: 'jikjinhaseyo.' },
      { korean: '왼쪽으로 가세요.', english: 'Go left.', romanization: 'oenjjogeuro gaseyo.' },
      { korean: '오른쪽에 있어요.', english: 'It is on the right.', romanization: 'oreunjjoge isseoyo.' },
      { korean: '여기서 멀어요?', english: 'Is it far from here?', romanization: 'yeogiseo meoreoyo?' },
    ],
    listening: [
      { korean: '삼 번 출구로 나오세요.', english: 'Come out of exit three.', romanization: 'sam beon chulguro naoseyo.' },
    ],
    speaking: [
      { korean: '길 좀 물어봐도 될까요?', english: 'Could I ask you for directions?', romanization: 'gil jom mureobwado doelkkayo?' },
    ],
    summary: [
      'Meeting points in Seoul are exit numbers, not street corners.',
      '직진, 왼쪽, 오른쪽 covers most of what you will be told.',
      'Opening with 길 좀 물어봐도 될까요? makes people stop and help.',
    ],
  },
  {
    lessonId: 'lesson-transport-lost',
    intro: {
      heading: 'When you are lost',
      body: 'The useful sentences are the ones that admit the problem quickly. Koreans will often walk you there rather than explain.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '길을 잃었어요.', english: 'I am lost.', romanization: 'gireul irheosseoyo.' },
      { korean: '여기가 어디예요?', english: 'Where am I?', romanization: 'yeogiga eodiyeyo?' },
      { korean: '도와주세요.', english: 'Please help me.', romanization: 'dowajuseyo.' },
      { korean: '천천히 말해 주세요.', english: 'Please speak slowly.', romanization: 'cheoncheonhi malhae juseyo.' },
      { korean: '영어 하실 수 있어요?', english: 'Do you speak English?', romanization: 'yeongeo hasil su isseoyo?' },
    ],
    listening: [
      { korean: '제가 같이 가 드릴게요.', english: 'I will walk you there.', romanization: 'jega gachi ga deurilgeyo.' },
    ],
    speaking: [
      { korean: '죄송해요, 길을 잃었어요.', english: 'Sorry, I am lost.', romanization: 'joesonghaeyo, gireul irheosseoyo.' },
    ],
    summary: [
      '길을 잃었어요 gets help faster than trying to explain.',
      '천천히 말해 주세요 is the most useful sentence you will learn.',
      'Expect to be walked there rather than given directions.',
    ],
  },
  {
    lessonId: 'lesson-shopping-asking',
    intro: {
      heading: 'Asking for help',
      body: 'Korean shop staff greet you with 어서 오세요 and then leave you alone. When you do need them, 저기요 is how you start.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '저기요.', english: 'Excuse me.', romanization: 'jeogiyo.', note: 'How you get anyone’s attention, politely.' },
      { korean: '이거 있어요?', english: 'Do you have this?', romanization: 'igeo isseoyo?' },
      { korean: '입어 봐도 돼요?', english: 'May I try it on?', romanization: 'ibeo bwado dwaeyo?' },
      { korean: '그냥 볼게요.', english: 'I am just looking.', romanization: 'geunyang bolgeyo.' },
      { korean: '이거 얼마예요?', english: 'How much is this?', romanization: 'igeo eolmayeyo?' },
    ],
    listening: [
      { korean: '어서 오세요! 찾으시는 거 있으세요?', english: 'Welcome! Are you looking for anything?', romanization: 'eoseo oseyo! chajeusineun geo isseuseyo?' },
    ],
    speaking: [
      { korean: '저기요, 이거 입어 봐도 돼요?', english: 'Excuse me, may I try this on?', romanization: 'jeogiyo, igeo ibeo bwado dwaeyo?' },
    ],
    summary: [
      '저기요 is the polite way to get attention anywhere.',
      '그냥 볼게요 politely ends the conversation.',
      '~해도 돼요? asks permission for almost anything.',
    ],
  },
  {
    lessonId: 'lesson-shopping-paying',
    intro: {
      heading: 'Paying and receipts',
      body: 'Korea is close to cashless. You will be asked about a bag and a receipt almost every time, so the answers are worth having ready.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '카드로 할게요.', english: 'I will pay by card.', romanization: 'kadeuro halgeyo.' },
      { korean: '봉투 필요 없어요.', english: 'I do not need a bag.', romanization: 'bongtu piryo eopseoyo.', note: 'Bags cost money in Korean shops.' },
      { korean: '영수증은 괜찮아요.', english: 'No receipt, thanks.', romanization: 'yeongsujeungeun gwaenchanayo.' },
      { korean: '적립 안 해요.', english: 'No points card.', romanization: 'jeongnip an haeyo.' },
      { korean: '현금으로 할게요.', english: 'I will pay cash.', romanization: 'hyeongeumeuro halgeyo.' },
    ],
    listening: [
      { korean: '봉투 필요하세요? 적립은요?', english: 'Do you need a bag? Any points card?', romanization: 'bongtu piryohaseyo? jeongnibeunyo?' },
    ],
    speaking: [
      { korean: '카드로 할게요. 봉투는 괜찮아요.', english: 'By card. No bag, thanks.', romanization: 'kadeuro halgeyo. bongtuneun gwaenchanayo.' },
    ],
    summary: [
      'You will be asked about a bag, a receipt and points every time.',
      '괜찮아요 is a polite no to all three.',
      'Card works even for a thousand-won purchase.',
    ],
  },
  {
    lessonId: 'lesson-shopping-returns',
    intro: {
      heading: 'Exchanges and returns',
      body: 'Keep the receipt and most shops will exchange without argument. Refunds are more likely with the tag still attached.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '교환하고 싶어요.', english: 'I would like to exchange this.', romanization: 'gyohwanhago sipeoyo.' },
      { korean: '환불 되나요?', english: 'Can I get a refund?', romanization: 'hwanbul doenayo?' },
      { korean: '사이즈가 안 맞아요.', english: 'The size does not fit.', romanization: 'saijeuga an majayo.' },
      { korean: '더 큰 거 있어요?', english: 'Do you have a bigger one?', romanization: 'deo keun geo isseoyo?' },
      { korean: '영수증 여기 있어요.', english: 'Here is the receipt.', romanization: 'yeongsujeung yeogi isseoyo.' },
    ],
    listening: [
      { korean: '영수증 가지고 오셨어요?', english: 'Did you bring the receipt?', romanization: 'yeongsujeung gajigo osyeosseoyo?' },
    ],
    speaking: [
      { korean: '사이즈가 안 맞아서 교환하고 싶어요.', english: 'It does not fit, so I would like to exchange it.', romanization: 'saijeuga an majaseo gyohwanhago sipeoyo.' },
    ],
    summary: [
      '교환 is exchange, 환불 is refund — they are handled differently.',
      'Keep the receipt and the tag.',
      '더 큰 거 / 더 작은 거 asks for a bigger or smaller one.',
    ],
  },
  {
    lessonId: 'lesson-shopping-market',
    intro: {
      heading: 'At the market',
      body: 'Traditional markets are cash-friendly, loud and cheaper. A little haggling is expected, and being friendly works better than being firm.',
    },
    vocabularyIds: [],
    expressions: [
      { korean: '조금만 깎아 주세요.', english: 'Could you knock a bit off?', romanization: 'jogeumman kkakka juseyo.' },
      { korean: '두 개 주세요.', english: 'Two of them, please.', romanization: 'du gae juseyo.' },
      { korean: '이거 하나에 얼마예요?', english: 'How much for one of these?', romanization: 'igeo hanae eolmayeyo?' },
      { korean: '맛 좀 볼 수 있어요?', english: 'Can I taste it?', romanization: 'mat jom bol su isseoyo?' },
      { korean: '많이 파세요.', english: 'Hope you sell a lot.', romanization: 'mani paseyo.', note: 'A warm thing to say on the way out.' },
    ],
    listening: [
      { korean: '싸게 드릴게요, 두 개 가져가세요.', english: 'I’ll give you a deal — take two.', romanization: 'ssage deurilgeyo, du gae gajyeogaseyo.' },
    ],
    speaking: [
      { korean: '조금만 깎아 주세요!', english: 'Could you knock a bit off!', romanization: 'jogeumman kkakka juseyo!' },
    ],
    summary: [
      'Haggling is expected at markets, not in shops.',
      'Counting things uses native numbers plus 개.',
      '많이 파세요 on the way out is a small kindness people notice.',
    ],
  },
  {
    lessonId: 'lesson-greetings-hello',
    intro: {
      heading: 'Hello & Goodbye',
      body: 'Korean has one greeting that works almost everywhere — morning, evening, shop or office. You will hear it a hundred times a day in Seoul.',
    },
    vocabularyIds: ['v-annyeong', 'v-annyeonghi', 'v-annyeonghi-gyeseyo', 'v-mannaseo'],
    expressions: [
      { korean: '안녕하세요.', english: 'Hello.', romanization: 'annyeonghaseyo.', note: 'Polite and safe with anyone.' },
      { korean: '만나서 반가워요.', english: 'Nice to meet you.', romanization: 'mannaseo bangawoyo.' },
      { korean: '안녕히 가세요.', english: 'Goodbye — to the person leaving.', romanization: 'annyeonghi gaseyo.' },
      { korean: '안녕히 계세요.', english: 'Goodbye — to the person staying.', romanization: 'annyeonghi gyeseyo.' },
    ],
    listening: [
      { korean: '안녕하세요! 오랜만이에요.', english: 'Hello! Long time no see.', romanization: 'annyeonghaseyo! oraenmanieyo.' },
    ],
    speaking: [
      { korean: '안녕하세요. 만나서 반가워요.', english: 'Hello. Nice to meet you.', romanization: 'annyeonghaseyo. mannaseo bangawoyo.' },
    ],
    summary: [
      '안녕하세요 works as hello at any time of day.',
      'Leaving? The person staying says 안녕히 가세요.',
      'Staying? You say 안녕히 계세요 to them.',
    ],
  },
  {
    lessonId: 'lesson-greetings-yesno',
    intro: {
      heading: 'Yes & No',
      body: 'Korean 네 is closer to "I hear you" than a hard yes. You will use it constantly as a listening signal.',
    },
    vocabularyIds: ['v-ne', 'v-aniyo', 'v-gwaenchanayo', 'v-joayo'],
    expressions: [
      { korean: '네, 맞아요.', english: "Yes, that's right.", romanization: 'ne, majayo.' },
      { korean: '아니요, 괜찮아요.', english: "No, I'm fine.", romanization: 'aniyo, gwaenchanayo.' },
      { korean: '네, 좋아요.', english: 'Yes, sounds good.', romanization: 'ne, joayo.' },
    ],
    listening: [
      { korean: '봉투 필요하세요? — 아니요, 괜찮아요.', english: 'Do you need a bag? — No, I’m fine.', romanization: 'bongtu piryohaseyo? — aniyo, gwaenchanayo.' },
    ],
    speaking: [{ korean: '네, 괜찮아요.', english: "Yes, it's fine.", romanization: 'ne, gwaenchanayo.' }],
    summary: ['네 = yes / I follow you.', '아니요 = no.', '괜찮아요 politely declines anything.'],
  },
  {
    lessonId: 'lesson-greetings-thanks',
    intro: {
      heading: 'Thank You',
      body: 'There are two thank-yous you need: one formal, one warm. Getting the difference right makes you sound thoughtful.',
    },
    vocabularyIds: ['v-gamsa', 'v-gomawo', 'v-cheonmaneyo', 'v-joesonghamnida'],
    expressions: [
      { korean: '감사합니다.', english: 'Thank you.', romanization: 'gamsahamnida.', note: 'Formal — staff, elders, work.' },
      { korean: '고마워요.', english: 'Thanks.', romanization: 'gomawoyo.', note: 'Warm — friends, peers.' },
      { korean: '천만에요.', english: "You're welcome.", romanization: 'cheonmaneyo.' },
    ],
    listening: [
      { korean: '도와주셔서 감사합니다.', english: 'Thank you for your help.', romanization: 'dowajusyeoseo gamsahamnida.' },
    ],
    speaking: [{ korean: '정말 감사합니다.', english: 'Thank you so much.', romanization: 'jeongmal gamsahamnida.' }],
    summary: ['감사합니다 is never wrong.', '고마워요 is for people close to you.', '죄송합니다 is sorry, not thanks.'],
  },
  {
    lessonId: 'lesson-greetings-intro',
    intro: {
      heading: 'Introducing Yourself',
      body: 'Three sentences and you can introduce yourself to anyone in Korea: name, country, and a friendly closer.',
    },
    vocabularyIds: ['v-jeoneun', 'v-ireum', 'v-nara', 'v-migug', 'v-mannaseo'],
    expressions: [
      { korean: '저는 알렉스예요.', english: "I'm Alex.", romanization: 'jeoneun alekseuyeyo.', note: 'Swap in your own name.' },
      { korean: '저는 미국에서 왔어요.', english: 'I came from the United States.', romanization: 'jeoneun migugeseo wasseoyo.' },
      { korean: '이름이 뭐예요?', english: 'What is your name?', romanization: 'ireumi mwoyeyo?' },
    ],
    listening: [
      { korean: '어느 나라에서 왔어요?', english: 'Which country are you from?', romanization: 'eoneu naraeseo wasseoyo?' },
    ],
    speaking: [
      { korean: '안녕하세요. 저는 알렉스예요. 만나서 반가워요.', english: "Hello. I'm Alex. Nice to meet you.", romanization: 'annyeonghaseyo. jeoneun alekseuyeyo. mannaseo bangawoyo.' },
    ],
    summary: ['저는 + name + 예요/이에요 introduces you.', '~에서 왔어요 means "I came from ~".', 'Finish with 반가워요 to sound friendly.'],
  },
  {
    lessonId: 'lesson-cafe-coffee',
    intro: {
      heading: 'Ordering Coffee',
      body: 'Korean cafe ordering is a fixed script. Learn it once and every cafe in the country works the same way.',
    },
    vocabularyIds: ['v-keopi', 'v-amerikano', 'v-juseyo', 'v-hanjan', 'v-aiseu', 'v-ttatteuthan', 'v-teigaut'],
    expressions: [
      { korean: '아메리카노 한 잔 주세요.', english: 'One americano, please.', romanization: 'amerikano han jan juseyo.' },
      { korean: '아이스로 주세요.', english: 'Iced, please.', romanization: 'aiseuro juseyo.' },
      { korean: '테이크아웃 할게요.', english: "I'll take it to go.", romanization: 'teikeuaut halgeyo.' },
    ],
    listening: [
      { korean: '드시고 가세요, 아니면 테이크아웃이세요?', english: 'For here or to go?', romanization: 'deusigo gaseyo, animyeon teikeuautiseyo?' },
    ],
    speaking: [
      { korean: '아이스 아메리카노 한 잔 주세요.', english: 'One iced americano, please.', romanization: 'aiseu amerikano han jan juseyo.' },
    ],
    summary: ['Anything + 주세요 = "please give me that".', '한 잔 counts cups.', '아이스 / 따뜻한 goes before the drink.'],
  },
  {
    lessonId: 'lesson-cafe-water',
    intro: {
      heading: 'Asking for Water',
      body: 'Water is usually self-serve in Korea, but 저기요 plus 주세요 gets you anything you need.',
    },
    vocabularyIds: ['v-mul', 'v-jeogiyo', 'v-jogeum', 'v-juseyo'],
    expressions: [
      { korean: '저기요, 물 좀 주세요.', english: 'Excuse me, some water please.', romanization: 'jeogiyo, mul jom juseyo.' },
      { korean: '얼음 주세요.', english: 'Ice, please.', romanization: 'eoreum juseyo.' },
    ],
    listening: [{ korean: '물은 셀프예요.', english: 'Water is self-serve.', romanization: 'mureun selpeuyeyo.' }],
    speaking: [{ korean: '저기요, 물 좀 주세요.', english: 'Excuse me, some water please.', romanization: 'jeogiyo, mul jom juseyo.' }],
    summary: ['저기요 is how you flag staff politely.', '좀 softens a request.', '셀프 means self-serve.'],
  },
  {
    lessonId: 'lesson-cafe-paying',
    intro: {
      heading: 'Paying',
      body: 'Card is king in Korea. These four lines cover the entire counter exchange.',
    },
    vocabularyIds: ['v-eolmayeyo', 'v-kadeu', 'v-hyeongeum', 'v-yeongsujeung'],
    expressions: [
      { korean: '얼마예요?', english: 'How much is it?', romanization: 'eolmayeyo?' },
      { korean: '카드로 할게요.', english: "I'll pay by card.", romanization: 'kadeuro halgeyo.' },
      { korean: '영수증 주세요.', english: 'Receipt, please.', romanization: 'yeongsujeung juseyo.' },
    ],
    listening: [
      { korean: '적립 카드 있으세요?', english: 'Do you have a points card?', romanization: 'jeongnip kadeu isseuseyo?' },
    ],
    speaking: [{ korean: '카드로 할게요. 영수증 주세요.', english: "I'll pay by card. Receipt, please.", romanization: 'kadeuro halgeyo. yeongsujeung juseyo.' }],
    summary: ['얼마예요? asks any price.', '~로 할게요 chooses a payment method.', 'Staff will ask about 적립 (points) — 괜찮아요 is a fine answer.'],
  },
  {
    lessonId: 'lesson-hangul-consonants',
    intro: {
      heading: 'Hangul Consonants',
      body: 'Hangul was designed to be learned in a day. Each consonant is a picture of the shape your mouth makes.',
    },
    vocabularyIds: ['v-hangugeo'],
    expressions: [
      { korean: 'ㄱ', english: 'g / k — back of the tongue rising', romanization: 'g/k' },
      { korean: 'ㄴ', english: 'n — tongue tip at the ridge', romanization: 'n' },
      { korean: 'ㅁ', english: 'm — closed mouth', romanization: 'm' },
      { korean: 'ㅅ', english: 's — air through a narrow gap', romanization: 's' },
    ],
    listening: [{ korean: '가 나 마 사', english: 'ga na ma sa', romanization: 'ga na ma sa' }],
    speaking: [{ korean: '가나다라마바사', english: 'The Korean alphabet song order.', romanization: 'ganadaramabasa' }],
    summary: ['Consonants are drawn from mouth shapes.', 'A syllable always starts with a consonant.', 'ㅇ at the start is silent.'],
  },
  {
    lessonId: 'lesson-hangul-vowels',
    intro: {
      heading: 'Hangul Vowels',
      body: 'Every vowel is built from three strokes: a vertical line (person), a horizontal line (earth), and a dot (sky).',
    },
    vocabularyIds: ['v-hangugeo'],
    expressions: [
      { korean: 'ㅏ', english: 'a — as in "father"', romanization: 'a' },
      { korean: 'ㅓ', english: 'eo — as in "sun"', romanization: 'eo' },
      { korean: 'ㅗ', english: 'o — as in "go"', romanization: 'o' },
      { korean: 'ㅜ', english: 'u — as in "moon"', romanization: 'u' },
    ],
    listening: [{ korean: '아 어 오 우 이', english: 'a eo o u i', romanization: 'a eo o u i' }],
    speaking: [{ korean: '아 어 오 우 이', english: 'Practise the five core vowels.', romanization: 'a eo o u i' }],
    summary: ['Vertical vowels sit to the right of the consonant.', 'Horizontal vowels sit underneath.', 'Adding a stroke adds a "y" sound: ㅏ → ㅑ.'],
  },
  {
    lessonId: 'lesson-numbers-sino',
    intro: {
      heading: 'Numbers for Money',
      body: 'Korean has two number systems. Sino-Korean is the one on every price tag and phone number.',
    },
    vocabularyIds: ['v-eolmayeyo', 'v-kadeu'],
    expressions: [
      { korean: '일 이 삼 사 오', english: '1 2 3 4 5', romanization: 'il i sam sa o' },
      { korean: '육 칠 팔 구 십', english: '6 7 8 9 10', romanization: 'yuk chil pal gu sip' },
      { korean: '오천 원이에요.', english: "It's 5,000 won.", romanization: 'ocheon wonieyo.' },
    ],
    listening: [{ korean: '사천오백 원입니다.', english: "That's 4,500 won.", romanization: 'sacheonobaek wonimnida.' }],
    speaking: [{ korean: '이거 얼마예요?', english: 'How much is this?', romanization: 'igeo eolmayeyo?' }],
    summary: ['Sino numbers are used for money, dates and phone numbers.', '천 = 1,000, 만 = 10,000.', 'Korean counts in units of 만, not thousands.'],
  },
  {
    lessonId: 'lesson-numbers-native',
    intro: {
      heading: 'Counting Things',
      body: 'Native Korean numbers count objects, people, cups and hours — the things you point at.',
    },
    vocabularyIds: ['v-hanjan', 'v-keopi'],
    expressions: [
      { korean: '하나 둘 셋 넷 다섯', english: '1 2 3 4 5', romanization: 'hana dul set net daseot' },
      { korean: '커피 두 잔 주세요.', english: 'Two coffees, please.', romanization: 'keopi du jan juseyo.' },
    ],
    listening: [{ korean: '몇 분이세요?', english: 'How many people?', romanization: 'myeot buniseyo?' }],
    speaking: [{ korean: '두 명이에요.', english: 'Two people.', romanization: 'du myeongieyo.' }],
    summary: ['하나 becomes 한 before a counter: 한 잔.', '잔 for cups, 명 for people, 개 for things.', 'Use native numbers up to 99.'],
  },
  {
    lessonId: 'lesson-food-restaurant',
    intro: {
      heading: 'At a Restaurant',
      body: 'Ordering for a table in Korea is a team sport. These lines cover arriving, ordering and paying.',
    },
    vocabularyIds: ['v-menyu', 'v-jumun', 'v-gogi', 'v-masisseoyo', 'v-maewoyo'],
    expressions: [
      { korean: '메뉴판 좀 주세요.', english: 'Could I get a menu?', romanization: 'menyupan jom juseyo.' },
      { korean: '이거 두 개 주세요.', english: 'Two of these, please.', romanization: 'igeo du gae juseyo.' },
      { korean: '계산할게요.', english: "I'll pay now.", romanization: 'gyesanhalgeyo.' },
    ],
    listening: [{ korean: '주문하시겠어요?', english: 'Would you like to order?', romanization: 'jumunhasigesseoyo?' }],
    speaking: [{ korean: '이거 두 개 주세요. 안 맵게 해 주세요.', english: 'Two of these please. Not spicy, please.', romanization: 'igeo du gae juseyo. an maepge hae juseyo.' }],
    summary: ['이거 + counter + 주세요 orders anything you can point at.', '계산할게요 asks for the bill.', '안 맵게 해 주세요 saves your evening.'],
  },
  {
    lessonId: 'lesson-food-convenience',
    intro: {
      heading: 'Convenience Store',
      body: 'The 편의점 is a Korean institution. You only need four lines to use one perfectly.',
    },
    vocabularyIds: ['v-pyeonuijeom', 'v-bongtu', 'v-yeongsujeung', 'v-kadeu'],
    expressions: [
      { korean: '봉투 주세요.', english: 'A bag, please.', romanization: 'bongtu juseyo.' },
      { korean: '데워 주세요.', english: 'Please heat it up.', romanization: 'dewo juseyo.' },
      { korean: '괜찮아요.', english: "No thanks, I'm fine.", romanization: 'gwaenchanayo.' },
    ],
    listening: [{ korean: '봉투 필요하세요?', english: 'Do you need a bag?', romanization: 'bongtu piryohaseyo?' }],
    speaking: [{ korean: '이거 데워 주세요.', english: 'Please heat this up.', romanization: 'igeo dewo juseyo.' }],
    summary: ['데워 주세요 heats your 도시락.', 'Bags cost money — say 괜찮아요 to decline.', 'Most stores have a microwave and hot water for free.'],
  },
  {
    lessonId: 'lesson-transport-subway',
    intro: {
      heading: 'Taking the Subway',
      body: 'Seoul’s subway is signposted in English, but asking a person is still faster when you are lost.',
    },
    vocabularyIds: ['v-jihacheol', 'v-yeok', 'v-hwanseung', 'v-chulgu', 'v-eodiyeyo'],
    expressions: [
      { korean: '강남역 어떻게 가요?', english: 'How do I get to Gangnam Station?', romanization: 'gangnamyeok eotteoke gayo?' },
      { korean: '어디서 환승해요?', english: 'Where do I transfer?', romanization: 'eodiseo hwanseunghaeyo?' },
      { korean: '삼 번 출구에서 만나요.', english: "Let's meet at exit 3.", romanization: 'sam beon chulguesseo mannayo.' },
    ],
    listening: [{ korean: '이번 역은 홍대입구역입니다.', english: 'This stop is Hongdae Ipgu Station.', romanization: 'ibeon yeogeun hongdaeipguyeogimnida.' }],
    speaking: [{ korean: '홍대입구역 어떻게 가요?', english: 'How do I get to Hongdae Ipgu Station?', romanization: 'hongdaeipguyeok eotteoke gayo?' }],
    summary: ['~ 어떻게 가요? asks for directions anywhere.', 'Exits are numbered — Koreans meet at exit numbers.', '환승 is the transfer station.'],
  },
  {
    lessonId: 'lesson-transport-taxi',
    intro: {
      heading: 'Taking a Taxi',
      body: 'Three lines will get you into a taxi, to your destination, and back out again.',
    },
    vocabularyIds: ['v-taeksi', 'v-yeok', 'v-yeogiyo-stop'],
    expressions: [
      { korean: '강남역으로 가 주세요.', english: 'To Gangnam Station, please.', romanization: 'gangnamyeogeuro ga juseyo.' },
      { korean: '여기서 세워 주세요.', english: 'Please stop here.', romanization: 'yeogiseo sewo juseyo.' },
      { korean: '카드 되나요?', english: 'Can I pay by card?', romanization: 'kadeu doenayo?' },
    ],
    listening: [{ korean: '어디로 모실까요?', english: 'Where shall I take you?', romanization: 'eodiro mosilkkayo?' }],
    speaking: [{ korean: '이 주소로 가 주세요.', english: 'Please go to this address.', romanization: 'i jusoro ga juseyo.' }],
    summary: ['목적지 + 으로/로 가 주세요 sets the destination.', '여기서 세워 주세요 stops the car.', '되나요? asks "is that possible?" about anything.'],
  },
  {
    lessonId: 'lesson-shopping-sizes',
    intro: {
      heading: 'Sizes & Colors',
      body: 'Korean shops are hands-on. Ask to try things and to swap sizes without any awkwardness.',
    },
    vocabularyIds: ['v-halin', 'v-eolmayeyo', 'v-kadeu'],
    expressions: [
      { korean: '입어 봐도 돼요?', english: 'Can I try it on?', romanization: 'ibeo bwado dwaeyo?' },
      { korean: '더 큰 사이즈 있어요?', english: 'Do you have a bigger size?', romanization: 'deo keun saijeu isseoyo?' },
      { korean: '다른 색 있어요?', english: 'Do you have another colour?', romanization: 'dareun saek isseoyo?' },
    ],
    listening: [{ korean: '이거 새 상품이에요.', english: 'This one is brand new.', romanization: 'igeo sae sangpumieyo.' }],
    speaking: [{ korean: '더 큰 사이즈 있어요?', english: 'Do you have a bigger size?', romanization: 'deo keun saijeu isseoyo?' }],
    summary: ['~ 있어요? asks if a shop has something.', '~해도 돼요? asks permission.', '더 + adjective = "more ~".'],
  },
  {
    lessonId: 'lesson-conversation-smalltalk',
    intro: {
      heading: 'Small Talk',
      body: 'Korean small talk runs on food, weather and weekends. Three questions keep any conversation alive.',
    },
    vocabularyIds: ['v-oneul', 'v-bap', 'v-jaemiisseoyo', 'v-bappayo'],
    expressions: [
      { korean: '밥 먹었어요?', english: 'Have you eaten?', romanization: 'bap meogeosseoyo?', note: 'This is a greeting, not a dinner invitation.' },
      { korean: '주말에 뭐 했어요?', english: 'What did you do on the weekend?', romanization: 'jumare mwo haesseoyo?' },
      { korean: '요즘 어때요?', english: 'How have you been lately?', romanization: 'yojeum eottaeyo?' },
    ],
    listening: [{ korean: '요즘 너무 바빠요.', english: "I'm so busy lately.", romanization: 'yojeum neomu bappayo.' }],
    speaking: [{ korean: '주말에 뭐 했어요?', english: 'What did you do on the weekend?', romanization: 'jumare mwo haesseoyo?' }],
    summary: ['밥 먹었어요? means "how are you".', '뭐 했어요? asks what someone did.', '어때요? asks for an opinion about anything.'],
  },
  {
    lessonId: 'lesson-living-delivery',
    intro: {
      heading: 'Package Delivery',
      body: 'Korean delivery is fast and phone-based. These lines handle the driver, the app and the front desk.',
    },
    vocabularyIds: ['v-baedal', 'v-pojang', 'v-gwaenchanayo'],
    expressions: [
      { korean: '문 앞에 놓아 주세요.', english: 'Please leave it at the door.', romanization: 'mun ape noa juseyo.' },
      { korean: '택배 왔어요?', english: 'Did the package arrive?', romanization: 'taekbae wasseoyo?' },
      { korean: '경비실에 맡겨 주세요.', english: 'Please leave it with the security desk.', romanization: 'gyeongbisire matgyeo juseyo.' },
    ],
    listening: [{ korean: '택배입니다. 문 앞에 뒀어요.', english: 'Delivery. I left it at the door.', romanization: 'taekbaeimnida. mun ape dwosseoyo.' }],
    speaking: [{ korean: '문 앞에 놓아 주세요.', english: 'Please leave it at the door.', romanization: 'mun ape noa juseyo.' }],
    summary: ['문 앞 = in front of the door.', '경비실 is the building security office.', '~아/어 주세요 politely asks for a favour.'],
  },
  {
    lessonId: 'lesson-travel-airport',
    intro: {
      heading: 'At the Airport',
      body: 'From immigration to the airport bus, this is the Korean you need in your first hour in the country.',
    },
    vocabularyIds: ['v-beoseu', 'v-eodiyeyo', 'v-kadeu'],
    expressions: [
      { korean: '여행으로 왔어요.', english: "I'm here for travel.", romanization: 'yeohaengeuro wasseoyo.' },
      { korean: '티머니 카드 주세요.', english: 'A T-money card, please.', romanization: 'timeoni kadeu juseyo.' },
      { korean: '공항버스 어디서 타요?', english: 'Where do I catch the airport bus?', romanization: 'gonghangbeoseu eodiseo tayo?' },
    ],
    listening: [{ korean: '방문 목적이 뭐예요?', english: 'What is the purpose of your visit?', romanization: 'bangmun mokjeogi mwoyeyo?' }],
    speaking: [{ korean: '공항버스 어디서 타요?', english: 'Where do I catch the airport bus?', romanization: 'gonghangbeoseu eodiseo tayo?' }],
    summary: ['~으로 왔어요 states your purpose.', '어디서 타요? asks where to board.', 'T-money works on every bus, subway and most taxis.'],
  },
  {
    lessonId: 'lesson-work-greetings',
    intro: {
      heading: 'Office Greetings',
      body: 'Korean offices run on a handful of set phrases. Using them correctly signals that you understand the culture.',
    },
    vocabularyIds: ['v-hoesa', 'v-sugohasyeotseumnida', 'v-hoeui'],
    expressions: [
      { korean: '안녕하십니까.', english: 'Good morning (formal).', romanization: 'annyeonghasimnikka.' },
      { korean: '수고하셨습니다.', english: 'Good work today.', romanization: 'sugohasyeotseumnida.', note: 'Say it to peers and juniors, not to your boss.' },
      { korean: '먼저 들어가 보겠습니다.', english: "I'll head out first.", romanization: 'meonjeo deureoga bogesseumnida.' },
    ],
    listening: [{ korean: '회의 세 시에 시작합니다.', english: 'The meeting starts at 3.', romanization: 'hoeui se sie sijakhamnida.' }],
    speaking: [{ korean: '수고하셨습니다. 먼저 들어가 보겠습니다.', english: "Good work today. I'll head out first.", romanization: 'sugohasyeotseumnida. meonjeo deureoga bogesseumnida.' }],
    summary: ['~습니다 is the formal business ending.', '수고하셨습니다 closes the workday.', 'Leaving before others needs a polite phrase.'],
  },
  {
    lessonId: 'lesson-conversation-opinions',
    intro: {
      heading: 'Giving an Opinion',
      body: 'Korean opinions come wrapped in softeners. Saying something flatly can read as blunt, so learn the cushion first.',
    },
    vocabularyIds: ['v-saenggak', 'v-machayo', 'v-geulsseyo'],
    expressions: [
      { korean: '제 생각에는 좋은 것 같아요.', english: 'In my opinion, it seems good.', romanization: 'je saenggageneun joeun geot gatayo.', note: '~것 같아요 softens almost any statement.' },
      { korean: '네, 맞아요.', english: "Yes, that's right.", romanization: 'ne, majayo.' },
      { korean: '글쎄요, 조금 다르게 생각해요.', english: "Hmm, I see it a little differently.", romanization: 'geulsseyo, jogeum dareuge saenggakhaeyo.' },
    ],
    listening: [
      { korean: '어떻게 생각하세요?', english: 'What do you think?', romanization: 'eotteoke saenggakhaseyo?' },
    ],
    speaking: [
      { korean: '제 생각에는 괜찮은 것 같아요.', english: 'I think it seems fine.', romanization: 'je saenggageneun gwaenchaneun geot gatayo.' },
    ],
    summary: [
      '~것 같아요 turns a claim into an impression.',
      '글쎄요 buys you time and softens disagreement.',
      'Direct contradiction is rare — lead with agreement, then adjust.',
    ],
  },
  {
    lessonId: 'lesson-conversation-feelings',
    intro: {
      heading: 'Talking About Feelings',
      body: 'Four adjectives cover most of what you need to say about your day.',
    },
    vocabularyIds: ['v-pigonhaeyo', 'v-sinnayo', 'v-seuteureseu', 'v-seopseophaeyo'],
    expressions: [
      { korean: '오늘 너무 피곤해요.', english: "I'm so tired today.", romanization: 'oneul neomu pigonhaeyo.' },
      { korean: '요즘 스트레스 많이 받아요.', english: "I've been really stressed lately.", romanization: 'yojeum seuteureseu mani badayo.', note: '스트레스 pairs with 받다 — you "receive" stress.' },
      { korean: '내일 여행 가서 신나요.', english: "I'm excited to travel tomorrow.", romanization: 'naeil yeohaeng gaseo sinnayo.' },
    ],
    listening: [{ korean: '괜찮아요? 무슨 일 있어요?', english: 'Are you okay? Is something wrong?', romanization: 'gwaenchanayo? museun il isseoyo?' }],
    speaking: [{ korean: '조금 피곤하지만 괜찮아요.', english: "I'm a bit tired but I'm fine.", romanization: 'jogeum pigonhajiman gwaenchanayo.' }],
    summary: ['너무 = "so / too much".', '스트레스 받다 is the fixed pairing.', '~지만 joins two clauses as "but".'],
  },
  {
    lessonId: 'lesson-conversation-plans',
    intro: {
      heading: 'Making Plans',
      body: 'Koreans make plans fast and confirm the day before. These lines do both.',
    },
    vocabularyIds: ['v-yaksok', 'v-eonje', 'v-daeum-e'],
    expressions: [
      { korean: '언제 시간 괜찮아요?', english: 'When are you free?', romanization: 'eonje sigan gwaenchanayo?' },
      { korean: '토요일 어때요?', english: 'How about Saturday?', romanization: 'toyoil eottaeyo?' },
      { korean: '그럼 그때 봬요.', english: 'See you then.', romanization: 'geureom geuttae bwaeyo.' },
    ],
    listening: [{ korean: '이번 주말에 뭐 해요?', english: 'What are you doing this weekend?', romanization: 'ibeon jumare mwo haeyo?' }],
    speaking: [{ korean: '토요일 어때요? 저는 괜찮아요.', english: 'How about Saturday? I am free.', romanization: 'toyoil eottaeyo? jeoneun gwaenchanayo.' }],
    summary: ['~ 어때요? proposes anything.', '약속 means a plan with a person, not a promise.', '봬요 is the polite "see you".'],
  },
  {
    lessonId: 'lesson-conversation-declining',
    intro: {
      heading: 'Saying No Politely',
      body: 'A flat 아니요 to an invitation feels cold. Korean declines with a reason and a future opening.',
    },
    vocabularyIds: ['v-mianhajiman', 'v-daeum-e', 'v-yaksok'],
    expressions: [
      { korean: '미안하지만 오늘은 어려울 것 같아요.', english: "Sorry, today looks difficult for me.", romanization: 'mianhajiman oneureun eoryeoul geot gatayo.' },
      { korean: '다음에 꼭 같이 가요!', english: "Let's definitely go together next time!", romanization: 'daeume kkok gachi gayo!' },
      { korean: '이미 약속이 있어서요.', english: 'It is because I already have plans.', romanization: 'imi yaksogi isseoseoyo.' },
    ],
    listening: [{ korean: '아쉽네요. 그럼 다음에요!', english: "That's a shame. Next time then!", romanization: 'aswimneyo. geureom daeumeyo!' }],
    speaking: [{ korean: '미안하지만 다음에 갈게요.', english: "Sorry, I'll go next time.", romanization: 'mianhajiman daeume galgeyo.' }],
    summary: ['Always pair a decline with 다음에.', '~아서요 gives a reason and softens the sentence end.', 'Ending on an invitation keeps the relationship warm.'],
  },
  {
    lessonId: 'lesson-living-pharmacy',
    intro: {
      heading: 'At the Pharmacy',
      body: 'Korean pharmacists hand out medicine for minor issues without a prescription. Describe the symptom and they do the rest.',
    },
    vocabularyIds: ['v-yakguk', 'v-yak', 'v-apayo', 'v-gamgi'],
    expressions: [
      { korean: '감기약 주세요.', english: 'Cold medicine, please.', romanization: 'gamgiyak juseyo.' },
      { korean: '머리가 아파요.', english: 'My head hurts.', romanization: 'meoriga apayo.', note: 'Body part + 가/이 아파요 works for anything.' },
      { korean: '하루에 몇 번 먹어요?', english: 'How many times a day do I take it?', romanization: 'harue myeot beon meogeoyo?' },
    ],
    listening: [{ korean: '식후 삼십 분에 드세요.', english: 'Take it 30 minutes after meals.', romanization: 'sikhu samsip bune deuseyo.' }],
    speaking: [{ korean: '목이 아파요. 약 주세요.', english: 'My throat hurts. Medicine, please.', romanization: 'mogi apayo. yak juseyo.' }],
    summary: ['~가 아파요 describes any pain.', '약국 handles minor illness without a doctor.', '식후 = after meals, 식전 = before meals.'],
  },
  {
    lessonId: 'lesson-living-emergency',
    intro: {
      heading: 'Getting Help Fast',
      body: 'Short, loud and unambiguous. These are the sentences to memorise before you need them.',
    },
    vocabularyIds: ['v-dowajuseyo', 'v-byeongwon', 'v-apayo'],
    expressions: [
      { korean: '도와주세요!', english: 'Please help me!', romanization: 'dowajuseyo!' },
      { korean: '119 불러 주세요.', english: 'Please call 119.', romanization: 'ilillgu bulleo juseyo.', note: '119 is fire and ambulance; 112 is police.' },
      { korean: '병원에 가야 해요.', english: 'I need to go to the hospital.', romanization: 'byeongwone gaya haeyo.' },
    ],
    listening: [{ korean: '어디가 아프세요?', english: 'Where does it hurt?', romanization: 'eodiga apeuseyo?' }],
    speaking: [{ korean: '도와주세요! 119 불러 주세요.', english: 'Help! Please call 119.', romanization: 'dowajuseyo! ilillgu bulleo juseyo.' }],
    summary: ['119 = ambulance and fire.', '112 = police.', '~아/어야 해요 means "I have to".'],
  },
  {
    lessonId: 'lesson-living-apartment',
    intro: {
      heading: 'Apartment Problems',
      body: 'Most issues go through the 관리실 (management office) rather than the landlord directly.',
    },
    vocabularyIds: ['v-jibju-in', 'v-gowajang', 'v-ttatteutan-mul', 'v-gwanribi'],
    expressions: [
      { korean: '뜨거운 물이 안 나와요.', english: 'There is no hot water.', romanization: 'tteugeoun muri an nawayo.' },
      { korean: '보일러가 고장났어요.', english: 'The boiler is broken.', romanization: 'boilleoga gojangnasseoyo.' },
      { korean: '언제 고쳐 주실 수 있어요?', english: 'When can you fix it?', romanization: 'eonje gochyeo jusil su isseoyo?' },
    ],
    listening: [{ korean: '오늘 오후에 사람 보낼게요.', english: "I'll send someone this afternoon.", romanization: 'oneul ohue saram bonaelgeyo.' }],
    speaking: [{ korean: '뜨거운 물이 안 나와요. 확인 부탁드려요.', english: 'There is no hot water. Please check it.', romanization: 'tteugeoun muri an nawayo. hwagin butakdeuryeoyo.' }],
    summary: ['안 + verb makes it negative.', '고장났어요 covers any broken appliance.', '관리비 is the monthly building fee, separate from rent.'],
  },
  {
    lessonId: 'lesson-travel-hotel',
    intro: {
      heading: 'Checking In',
      body: 'Four lines cover arrival, luggage, and getting an extra hour in the morning.',
    },
    vocabularyIds: ['v-yeyak', 'v-chekeuin', 'v-jim'],
    expressions: [
      { korean: '체크인 하려고 하는데요.', english: "I'd like to check in.", romanization: 'chekeuin haryeogo haneundeyo.' },
      { korean: '예약했어요. 이름은 알렉스입니다.', english: 'I have a reservation under Alex.', romanization: 'yeyakhaesseoyo. ireumeun alekseuimnida.' },
      { korean: '짐 좀 맡길 수 있어요?', english: 'Could I leave my luggage?', romanization: 'jim jom matgil su isseoyo?' },
    ],
    listening: [{ korean: '체크아웃은 열한 시입니다.', english: 'Checkout is at 11.', romanization: 'chekeuauseun yeolhan siimnida.' }],
    speaking: [{ korean: '체크인 하려고 하는데요. 예약했어요.', english: "I'd like to check in. I have a reservation.", romanization: 'chekeuin haryeogo haneundeyo. yeyakhaesseoyo.' }],
    summary: ['~하려고 하는데요 politely states your intention.', '~ㄹ 수 있어요? asks if something is possible.', 'Give your name in Roman letters — staff will find it.'],
  },
  {
    lessonId: 'lesson-travel-sightseeing',
    intro: {
      heading: 'Tickets & Photos',
      body: 'Buying entry and asking a stranger for a photo — the two things every traveller does daily.',
    },
    vocabularyIds: ['v-ipjangnyo', 'v-sajin', 'v-eolmayeyo'],
    expressions: [
      { korean: '어른 두 장 주세요.', english: 'Two adult tickets, please.', romanization: 'eoreun du jang juseyo.' },
      { korean: '사진 좀 찍어 주실 수 있어요?', english: 'Could you take a photo for me?', romanization: 'sajin jom jjigeo jusil su isseoyo?' },
      { korean: '여기서 사진 찍어도 돼요?', english: 'May I take photos here?', romanization: 'yeogiseo sajin jjigeodo dwaeyo?' },
    ],
    listening: [{ korean: '입장은 다섯 시까지입니다.', english: 'Entry is until 5pm.', romanization: 'ipjangeun daseot sikkajiimnida.' }],
    speaking: [{ korean: '사진 좀 찍어 주실 수 있어요?', english: 'Could you take a photo for me?', romanization: 'sajin jom jjigeo jusil su isseoyo?' }],
    summary: ['장 counts flat things like tickets.', '~주실 수 있어요? is a very polite request.', '~해도 돼요? asks permission.'],
  },
  {
    lessonId: 'lesson-work-email',
    intro: {
      heading: 'Writing a Work Message',
      body: 'Korean work writing follows a fixed skeleton: greeting, context, request, closing. Fill in the blanks and you sound native.',
    },
    vocabularyIds: ['v-butakdeurimnida', 'v-hwagin', 'v-jeonhandeurimnida', 'v-ilcheong'],
    expressions: [
      { korean: '안녕하세요, 마케팅팀 알렉스입니다.', english: 'Hello, this is Alex from the marketing team.', romanization: 'annyeonghaseyo, maketingtim alekseuimnida.' },
      { korean: '자료 전달드립니다.', english: 'I am forwarding the materials.', romanization: 'jaryo jeondaldeurimnida.' },
      { korean: '확인 부탁드립니다.', english: 'Please kindly confirm.', romanization: 'hwagin butakdeurimnida.', note: 'The standard closing request in Korean work mail.' },
    ],
    listening: [{ korean: '일정 조정 가능할까요?', english: 'Would adjusting the schedule be possible?', romanization: 'iljeong jojeong ganeunghalkkayo?' }],
    speaking: [{ korean: '확인 부탁드립니다. 감사합니다.', english: 'Please kindly confirm. Thank you.', romanization: 'hwagin butakdeurimnida. gamsahamnida.' }],
    summary: ['Open by naming your team and yourself.', '~드립니다 is the humble form that makes writing polite.', 'Close with 부탁드립니다 or 감사합니다.'],
  },
];

function line(
  lessonId: string,
  type: LessonContent['contentType'],
  orderIndex: number,
  value: Partial<LessonContent>,
): LessonContent {
  return {
    id: `${lessonId}-${type}-${orderIndex}`,
    lessonId,
    contentType: type,
    koreanText: null,
    englishText: null,
    romanization: null,
    audioUrl: null,
    metadata: null,
    orderIndex,
    ...value,
  };
}

export function buildLessonContent(spec: LessonSpec): LessonContent[] {
  const blocks: LessonContent[] = [];
  let order = 0;

  blocks.push(
    line(spec.lessonId, 'introduction', order++, {
      koreanText: null,
      englishText: spec.intro.body,
      metadata: { heading: spec.intro.heading },
    }),
  );

  spec.vocabularyIds.forEach((vocabularyId) => {
    blocks.push(
      line(spec.lessonId, 'vocabulary', order++, { metadata: { vocabularyId } }),
    );
  });

  spec.expressions.forEach((expression) => {
    blocks.push(
      line(spec.lessonId, 'expression', order++, {
        koreanText: expression.korean,
        englishText: expression.english,
        romanization: expression.romanization,
        metadata: expression.note ? { note: expression.note } : null,
      }),
    );
  });

  spec.listening.forEach((item) => {
    blocks.push(
      line(spec.lessonId, 'listening', order++, {
        koreanText: item.korean,
        englishText: item.english,
        romanization: item.romanization,
      }),
    );
  });

  spec.speaking.forEach((item) => {
    blocks.push(
      line(spec.lessonId, 'speaking', order++, {
        koreanText: item.korean,
        englishText: item.english,
        romanization: item.romanization,
      }),
    );
  });

  blocks.push(
    line(spec.lessonId, 'summary', order++, {
      metadata: { points: spec.summary },
    }),
  );

  return blocks;
}

export const LESSON_CONTENT: LessonContent[] = LESSON_SPECS.flatMap(buildLessonContent);
