import { DAILY_PHRASES, LESSONS, VOCABULARY } from '@/constants/content';

export type SearchResultKind = 'lesson' | 'vocabulary' | 'phrase';

export interface SearchResult {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  detail: string | null;
  href: string;
}

function matches(haystack: (string | null | undefined)[], needle: string): boolean {
  return haystack.some((value) => value?.toLowerCase().includes(needle));
}

export function searchEverything(rawQuery: string, limit = 30): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (query.length === 0) return [];

  const results: SearchResult[] = [];

  for (const word of VOCABULARY) {
    if (matches([word.korean, word.english, word.romanization, word.category], query)) {
      results.push({
        id: word.id,
        kind: 'vocabulary',
        title: word.korean,
        subtitle: word.english,
        detail: word.romanization,
        href: `/practice/vocabulary?focus=${word.id}`,
      });
    }
  }

  for (const lesson of LESSONS) {
    if (matches([lesson.title, lesson.description], query)) {
      results.push({
        id: lesson.id,
        kind: 'lesson',
        title: lesson.title,
        subtitle: lesson.description,
        detail: `${lesson.estimatedMinutes} min`,
        href: `/lesson/${lesson.id}`,
      });
    }
  }

  for (const phrase of DAILY_PHRASES) {
    if (matches([phrase.korean, phrase.english, phrase.romanization], query)) {
      results.push({
        id: phrase.id,
        kind: 'phrase',
        title: phrase.korean,
        subtitle: phrase.english,
        detail: phrase.romanization,
        href: '/daily',
      });
    }
  }

  return results.slice(0, limit);
}
