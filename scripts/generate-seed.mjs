#!/usr/bin/env node
/**
 * Generates supabase/seed/seed.sql from the bundled TypeScript content so the
 * database and the offline app can never drift apart.
 *
 *   npm run seed:generate
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRoot = path.resolve(import.meta.dirname, '..');
const outDir = mkdtempSync(path.join(tmpdir(), 'koreango-seed-'));

function quote(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return `${value}`;
  return `'${String(value).replace(/'/g, "''")}'`;
}

function textArray(values) {
  if (!values?.length) return `'{}'`;
  return `ARRAY[${values.map(quote).join(', ')}]::text[]`;
}

function jsonb(value) {
  return value === null || value === undefined ? 'null' : `${quote(JSON.stringify(value))}::jsonb`;
}

function insert(table, columns, rows) {
  if (rows.length === 0) return '';
  const values = rows.map((row) => `  (${row.join(', ')})`).join(',\n');
  const updates = columns
    .filter((column) => column !== 'id')
    .map((column) => `${column} = excluded.${column}`)
    .join(', ');

  return [
    `insert into public.${table} (${columns.join(', ')})`,
    'values',
    values,
    `on conflict (id) do update set ${updates};`,
    '',
  ].join('\n');
}

try {
  execFileSync(
    'npx',
    [
      'tsc',
      '--project', path.join(projectRoot, 'scripts/tsconfig.seed.json'),
      '--outDir', outDir,
    ],
    { cwd: projectRoot, stdio: 'inherit' },
  );

  const load = async (relative) =>
    import(pathToFileURL(path.join(outDir, 'constants/content', relative)).href);

  const { COURSES, UNITS, LESSONS } = await load('courses.js');
  const { VOCABULARY } = await load('vocabulary.js');
  const { LESSON_CONTENT } = await load('lessonContent.js');
  const { QUIZZES } = await load('quizzes.js');
  const { DAILY_PHRASES } = await load('dailyPhrases.js');

  const sections = [
    `-- =============================================================================
-- KoreanGo seed data — GENERATED FILE, DO NOT EDIT BY HAND.
--
-- Regenerate with:  npm run seed:generate
-- Apply with:       supabase db reset   (or psql -f supabase/seed/seed.sql)
--
-- Every statement is idempotent, so re-running it is safe.
-- =============================================================================
`,
    insert(
      'courses',
      ['id', 'title', 'description', 'level', 'order_index', 'is_premium', 'emoji', 'accent'],
      COURSES.map((course) => [
        quote(course.id), quote(course.title), quote(course.description),
        course.level, course.orderIndex, quote(course.isPremium),
        quote(course.emoji), quote(course.accent),
      ]),
    ),
    insert(
      'units',
      ['id', 'course_id', 'title', 'description', 'order_index'],
      UNITS.map((unit) => [
        quote(unit.id), quote(unit.courseId), quote(unit.title),
        quote(unit.description), unit.orderIndex,
      ]),
    ),
    insert(
      'lessons',
      ['id', 'unit_id', 'title', 'description', 'lesson_type', 'estimated_minutes', 'order_index', 'is_premium'],
      LESSONS.map((lesson) => [
        quote(lesson.id), quote(lesson.unitId), quote(lesson.title), quote(lesson.description),
        quote(lesson.lessonType), lesson.estimatedMinutes, lesson.orderIndex, quote(lesson.isPremium),
      ]),
    ),
    insert(
      'vocabulary',
      ['id', 'korean', 'english', 'romanization', 'example_korean', 'example_english', 'audio_url', 'category', 'level'],
      VOCABULARY.map((word) => [
        quote(word.id), quote(word.korean), quote(word.english), quote(word.romanization),
        quote(word.exampleKorean), quote(word.exampleEnglish), quote(word.audioUrl),
        quote(word.category), word.level,
      ]),
    ),
    insert(
      'lesson_content',
      ['id', 'lesson_id', 'content_type', 'korean_text', 'english_text', 'romanization', 'audio_url', 'metadata', 'order_index'],
      LESSON_CONTENT.map((block) => [
        quote(block.id), quote(block.lessonId), quote(block.contentType),
        quote(block.koreanText), quote(block.englishText), quote(block.romanization),
        quote(block.audioUrl), jsonb(block.metadata), block.orderIndex,
      ]),
    ),
    insert(
      'quizzes',
      ['id', 'lesson_id', 'question_type', 'question', 'prompt', 'correct_answer', 'options', 'metadata'],
      QUIZZES.map((quiz) => [
        quote(quiz.id), quote(quiz.lessonId), quote(quiz.questionType), quote(quiz.question),
        quote(quiz.prompt), quote(quiz.correctAnswer), textArray(quiz.options), jsonb(quiz.metadata),
      ]),
    ),
    insert(
      'daily_phrases',
      ['id', 'korean', 'english', 'romanization', 'category', 'audio_url', 'publish_date'],
      DAILY_PHRASES.map((phrase) => [
        quote(phrase.id), quote(phrase.korean), quote(phrase.english), quote(phrase.romanization),
        quote(phrase.category), quote(phrase.audioUrl), quote(phrase.publishDate),
      ]),
    ),
  ];

  const target = path.join(projectRoot, 'supabase/seed/seed.sql');
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, sections.join('\n'));

  const counts = {
    courses: COURSES.length,
    units: UNITS.length,
    lessons: LESSONS.length,
    vocabulary: VOCABULARY.length,
    lesson_content: LESSON_CONTENT.length,
    quizzes: QUIZZES.length,
    daily_phrases: DAILY_PHRASES.length,
  };

  console.log(`Wrote ${path.relative(projectRoot, target)}`);
  for (const [table, count] of Object.entries(counts)) {
    console.log(`  ${table}: ${count}`);
  }
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
