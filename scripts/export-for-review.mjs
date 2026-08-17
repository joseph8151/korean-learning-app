#!/usr/bin/env node
/**
 * Bundles the source into a few Markdown files you can upload to ChatGPT (or
 * any other reviewer) for a whole-project read.
 *
 * Only files git already tracks are included, so anything in .gitignore —
 * `.env` above all — cannot leak. On top of that, every file is scanned for
 * things that look like credentials and the run aborts if any are found:
 * a review bundle is a file you are about to hand to a third party, and it is
 * the easiest possible way to publish a key by accident.
 *
 *   node scripts/export-for-review.mjs
 *
 * Output lands in review-bundle/, which is git-ignored.
 */
import { Buffer } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const OUT_DIR = 'review-bundle';
// ChatGPT accepts large files, but a reviewer reads a 300KB chunk far better
// than a 3MB one, and smaller parts survive context limits.
const MAX_PART_BYTES = 300_000;

const SKIP_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg',
  '.ttf', '.otf', '.woff', '.woff2', '.mp3', '.wav', '.m4a',
  '.zip', '.jks', '.keystore', '.p8', '.p12', '.pdf',
]);

const SKIP_PATHS = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  `${OUT_DIR}/`,
];

const LANGUAGE_BY_EXTENSION = {
  '.ts': 'ts', '.tsx': 'tsx', '.js': 'js', '.mjs': 'js', '.jsx': 'jsx',
  '.json': 'json', '.sql': 'sql', '.md': 'markdown', '.yml': 'yaml',
  '.yaml': 'yaml', '.html': 'html', '.css': 'css', '.sh': 'bash',
};

/**
 * Patterns for real credentials. Deliberately narrow: matching the *word*
 * "key" or "secret" would fire on every line that reads a config value and
 * train you to ignore the warning.
 */
const SECRET_PATTERNS = [
  // The header must be followed by actual base64 body. Matching the header
  // alone flags the code that *strips* it, which is the opposite of a leak.
  // `\\n` is included because service-account keys arrive JSON-escaped.
  [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----(?:\\n|[\r\n])+[A-Za-z0-9+/=\r\n]{40,}/,
    'a private key block',
  ],
  [/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./, 'a JWT (Supabase keys look like this)'],
  [/\bsk-[A-Za-z0-9]{20,}/, 'an OpenAI-style secret key'],
  [/\bsk-ant-[A-Za-z0-9-]{20,}/, 'an Anthropic API key'],
  [/\bghp_[A-Za-z0-9]{30,}/, 'a GitHub personal access token'],
  [/"private_key_id"\s*:/, 'a Google service-account JSON'],
  [/\bAIza[0-9A-Za-z_-]{30,}/, 'a Google API key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'an AWS access key id'],
];

function trackedFiles() {
  const output = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8', maxBuffer: 64e6 });
  return output.split('\0').filter(Boolean);
}

function isTextFile(path) {
  if (SKIP_PATHS.some((skip) => path === skip || path.startsWith(skip))) return false;
  if (SKIP_EXTENSIONS.has(extname(path).toLowerCase())) return false;
  try {
    // A megabyte of one file is generated output, not something to review.
    if (statSync(path).size > 1_000_000) return false;
  } catch {
    return false;
  }
  return true;
}

const files = trackedFiles().filter(isTextFile).sort();

// --- Refuse to write a bundle that contains credentials. -------------------
const findings = [];
for (const path of files) {
  const contents = readFileSync(path, 'utf8');
  for (const [pattern, description] of SECRET_PATTERNS) {
    if (pattern.test(contents)) findings.push(`  ${path} — looks like ${description}`);
  }
}

if (findings.length > 0) {
  console.error('Refusing to build a review bundle: possible credentials found.\n');
  console.error(findings.join('\n'));
  console.error('\nRemove or redact these, then run again. Never paste real keys into a chat.');
  process.exit(1);
}

// --- Write the parts. ------------------------------------------------------
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const parts = [];
let current = [];
let currentBytes = 0;

for (const path of files) {
  const language = LANGUAGE_BY_EXTENSION[extname(path).toLowerCase()] ?? '';
  const section = `\n\n## \`${path}\`\n\n\`\`\`${language}\n${readFileSync(path, 'utf8')}\n\`\`\`\n`;
  const bytes = Buffer.byteLength(section, 'utf8');

  if (currentBytes + bytes > MAX_PART_BYTES && current.length > 0) {
    parts.push(current);
    current = [];
    currentBytes = 0;
  }

  current.push(section);
  currentBytes += bytes;
}
if (current.length > 0) parts.push(current);

parts.forEach((sections, index) => {
  const name = `part-${String(index + 1).padStart(2, '0')}-of-${String(parts.length).padStart(2, '0')}.md`;
  const header =
    `# KoreanGo source — part ${index + 1} of ${parts.length}\n\n` +
    'React Native (Expo SDK 57) + TypeScript + Supabase. Each section below is one file.\n';
  writeFileSync(join(OUT_DIR, name), header + sections.join(''), 'utf8');
});

const prompt = `# Review brief

You are reviewing KoreanGo, a Korean-learning app for foreigners, built with
Expo SDK 57 / React Native 0.86 / TypeScript (strict) / Supabase / Zustand.
It ships to Google Play first, then the App Store.

The source is split across ${parts.length} files named part-01-of-${String(parts.length).padStart(2, '0')}.md and so on.
**Read every part before answering.** Each section header is the file path.

Please report, most serious first:

1. **Correctness bugs** — logic that produces a wrong result, crashes, or
   breaks on an edge case. Give the file, the line, and an input that triggers it.
2. **Security problems** — anything that would let a client grant itself
   Premium, read another user's data, or expose a secret. Row Level Security
   is on every table; the app never holds a service-role key.
3. **Google Play rejection risks** — permissions, billing flow, privacy
   policy, data-safety accuracy.
4. **React Native specific issues** — memory leaks, missing cleanup, work
   during render, list performance, Android-versus-iOS differences.
5. **Accessibility and UX gaps.**

Do not rewrite the whole app or suggest a different stack. For each finding,
give the file, what breaks, and the smallest fix.

If you are not sure something is a real defect, say so rather than guessing.
`;

writeFileSync(join(OUT_DIR, 'REVIEW-PROMPT.md'), prompt, 'utf8');

const totalBytes = parts.reduce(
  (sum, sections) => sum + sections.reduce((n, s) => n + Buffer.byteLength(s, 'utf8'), 0),
  0,
);

console.log(`Wrote ${parts.length} part(s) + REVIEW-PROMPT.md to ${OUT_DIR}/`);
console.log(`${files.length} files, ${(totalBytes / 1024).toFixed(0)} KB total.`);
console.log('\nUpload every part-*.md file together, then paste REVIEW-PROMPT.md as your message.');
