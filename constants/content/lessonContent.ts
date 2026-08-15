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
