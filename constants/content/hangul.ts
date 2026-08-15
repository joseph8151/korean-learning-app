import type { HangulCharacter } from '@/types/content';

export const HANGUL_CONSONANTS: HangulCharacter[] = [
  { id: 'h-g', character: 'ㄱ', romanization: 'g / k', type: 'consonant', exampleSyllable: '가', exampleRomanization: 'ga', tip: 'Looks like the back of your tongue rising.' },
  { id: 'h-n', character: 'ㄴ', romanization: 'n', type: 'consonant', exampleSyllable: '나', exampleRomanization: 'na', tip: 'The shape of your tongue touching the ridge.' },
  { id: 'h-d', character: 'ㄷ', romanization: 'd / t', type: 'consonant', exampleSyllable: '다', exampleRomanization: 'da', tip: 'ㄴ with a lid on top.' },
  { id: 'h-r', character: 'ㄹ', romanization: 'r / l', type: 'consonant', exampleSyllable: '라', exampleRomanization: 'ra', tip: 'Between an English r and l — tap the ridge once.' },
  { id: 'h-m', character: 'ㅁ', romanization: 'm', type: 'consonant', exampleSyllable: '마', exampleRomanization: 'ma', tip: 'A closed mouth.' },
  { id: 'h-b', character: 'ㅂ', romanization: 'b / p', type: 'consonant', exampleSyllable: '바', exampleRomanization: 'ba', tip: 'ㅁ opening at the top.' },
  { id: 'h-s', character: 'ㅅ', romanization: 's', type: 'consonant', exampleSyllable: '사', exampleRomanization: 'sa', tip: 'Air escaping through a narrow gap.' },
  { id: 'h-ng', character: 'ㅇ', romanization: 'silent / ng', type: 'consonant', exampleSyllable: '아', exampleRomanization: 'a', tip: 'Silent at the start, "ng" at the end.' },
  { id: 'h-j', character: 'ㅈ', romanization: 'j', type: 'consonant', exampleSyllable: '자', exampleRomanization: 'ja', tip: 'ㅅ with a roof.' },
  { id: 'h-ch', character: 'ㅊ', romanization: 'ch', type: 'consonant', exampleSyllable: '차', exampleRomanization: 'cha', tip: 'ㅈ plus a puff of air.' },
  { id: 'h-k', character: 'ㅋ', romanization: 'k', type: 'consonant', exampleSyllable: '카', exampleRomanization: 'ka', tip: 'ㄱ plus a puff of air.' },
  { id: 'h-t', character: 'ㅌ', romanization: 't', type: 'consonant', exampleSyllable: '타', exampleRomanization: 'ta', tip: 'ㄷ plus a puff of air.' },
  { id: 'h-p', character: 'ㅍ', romanization: 'p', type: 'consonant', exampleSyllable: '파', exampleRomanization: 'pa', tip: 'ㅂ plus a puff of air.' },
  { id: 'h-h', character: 'ㅎ', romanization: 'h', type: 'consonant', exampleSyllable: '하', exampleRomanization: 'ha', tip: 'A little hat over ㅇ.' },
];

export const HANGUL_VOWELS: HangulCharacter[] = [
  { id: 'h-a', character: 'ㅏ', romanization: 'a', type: 'vowel', exampleSyllable: '아', exampleRomanization: 'a', tip: 'As in "father".' },
  { id: 'h-ya', character: 'ㅑ', romanization: 'ya', type: 'vowel', exampleSyllable: '야', exampleRomanization: 'ya', tip: 'ㅏ with an extra stroke = add a y sound.' },
  { id: 'h-eo', character: 'ㅓ', romanization: 'eo', type: 'vowel', exampleSyllable: '어', exampleRomanization: 'eo', tip: 'As in "sun".' },
  { id: 'h-yeo', character: 'ㅕ', romanization: 'yeo', type: 'vowel', exampleSyllable: '여', exampleRomanization: 'yeo', tip: 'ㅓ plus y.' },
  { id: 'h-o', character: 'ㅗ', romanization: 'o', type: 'vowel', exampleSyllable: '오', exampleRomanization: 'o', tip: 'As in "go". Written under the consonant.' },
  { id: 'h-yo', character: 'ㅛ', romanization: 'yo', type: 'vowel', exampleSyllable: '요', exampleRomanization: 'yo', tip: 'ㅗ plus y.' },
  { id: 'h-u', character: 'ㅜ', romanization: 'u', type: 'vowel', exampleSyllable: '우', exampleRomanization: 'u', tip: 'As in "moon".' },
  { id: 'h-yu', character: 'ㅠ', romanization: 'yu', type: 'vowel', exampleSyllable: '유', exampleRomanization: 'yu', tip: 'ㅜ plus y.' },
  { id: 'h-eu', character: 'ㅡ', romanization: 'eu', type: 'vowel', exampleSyllable: '으', exampleRomanization: 'eu', tip: 'Lips flat, like a quiet grunt.' },
  { id: 'h-i', character: 'ㅣ', romanization: 'i', type: 'vowel', exampleSyllable: '이', exampleRomanization: 'i', tip: 'As in "see".' },
];

export const HANGUL_BATCHIM: HangulCharacter[] = [
  { id: 'h-bat-k', character: '받침 ㄱ', romanization: 'k (stopped)', type: 'batchim', exampleSyllable: '악', exampleRomanization: 'ak', tip: 'Stop the sound in your throat — no release.' },
  { id: 'h-bat-n', character: '받침 ㄴ', romanization: 'n', type: 'batchim', exampleSyllable: '안', exampleRomanization: 'an', tip: 'Tongue stays on the ridge.' },
  { id: 'h-bat-l', character: '받침 ㄹ', romanization: 'l', type: 'batchim', exampleSyllable: '알', exampleRomanization: 'al', tip: 'Closer to English "l" than "r" here.' },
  { id: 'h-bat-m', character: '받침 ㅁ', romanization: 'm', type: 'batchim', exampleSyllable: '암', exampleRomanization: 'am', tip: 'Close your lips at the end.' },
  { id: 'h-bat-p', character: '받침 ㅂ', romanization: 'p (stopped)', type: 'batchim', exampleSyllable: '압', exampleRomanization: 'ap', tip: 'Lips close but do not pop.' },
  { id: 'h-bat-ng', character: '받침 ㅇ', romanization: 'ng', type: 'batchim', exampleSyllable: '앙', exampleRomanization: 'ang', tip: 'Like the end of "song".' },
];

export const HANGUL_COMBINATIONS = [
  { consonant: 'ㄱ', vowel: 'ㅏ', syllable: '가', romanization: 'ga', meaning: 'go (stem)' },
  { consonant: 'ㄴ', vowel: 'ㅏ', syllable: '나', romanization: 'na', meaning: 'I / me' },
  { consonant: 'ㅁ', vowel: 'ㅜ', syllable: '무', romanization: 'mu', meaning: 'radish' },
  { consonant: 'ㅅ', vowel: 'ㅗ', syllable: '소', romanization: 'so', meaning: 'cow' },
  { consonant: 'ㅂ', vowel: 'ㅣ', syllable: '비', romanization: 'bi', meaning: 'rain' },
  { consonant: 'ㅎ', vowel: 'ㅏ', syllable: '하', romanization: 'ha', meaning: 'do (stem)' },
];

export const HANGUL_STAGES = [
  { id: 'consonants', title: 'Consonants', subtitle: '14 basic letters', data: HANGUL_CONSONANTS },
  { id: 'vowels', title: 'Vowels', subtitle: '10 basic letters', data: HANGUL_VOWELS },
  { id: 'batchim', title: 'Batchim', subtitle: 'Final consonants', data: HANGUL_BATCHIM },
] as const;
