#!/usr/bin/env node
/**
 * Import the Amplify question bank into data/quiz/bank.js.
 *
 * Source: https://main.dx407egisqiw0.amplifyapp.com/questions.json
 * 255 DVA questions, each with its answers, the correct letters, and a written
 * Vietnamese explanation (~850 chars). That explanation is what makes the quiz
 * teach instead of just score, so it is kept verbatim.
 *
 *   node tools/import-amplify-quiz.mjs
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const SRC = process.argv[2] || "/tmp/quiz-bank.json";
const OUT = resolve(process.cwd(), "data/quiz/bank.js");

const LETTERS = "ABCDEFGH";

function clean(s) {
  return String(s || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function main() {
  const raw = JSON.parse(await readFile(SRC, "utf8"));
  const list = Array.isArray(raw) ? raw : raw.questions || [];
  if (!list.length) throw new Error("no questions in source");

  const out = [];
  const seen = new Set();

  for (const q of list) {
    const text = clean(q.text);
    const answers = Array.isArray(q.answers) ? q.answers : [];
    if (!text || answers.length < 2) continue;

    const options = answers.map((a) => clean(a.text));
    const letters = (q.correctAnswer || []).map((l) => String(l).toUpperCase());

    // letters -> indexes, using the answer ids so a reordered list still works
    const correct = [];
    letters.forEach((l) => {
      const byId = answers.findIndex((a) => String(a.id).toUpperCase() === l);
      const idx = byId >= 0 ? byId : LETTERS.indexOf(l);
      if (idx >= 0 && idx < options.length && !correct.includes(idx)) correct.push(idx);
    });
    if (!correct.length) continue;

    const key = text.slice(0, 120).toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      id: String(q.id || out.length + 1),
      q: text,
      options,
      correct,
      multi: correct.length > 1,
      explanation: clean(q.explanation),
    });
  }

  const header =
    `/* DVA practice bank — ${out.length} questions with written Vietnamese explanations.\n` +
    `   Source: main.dx407egisqiw0.amplifyapp.com/questions.json\n` +
    `   Regenerate with tools/import-amplify-quiz.mjs */\n`;

  const body =
    "window.DVA_QUIZ_BANK = " +
    JSON.stringify(out)
      .replace(/\},\{/g, "},\n{")
      .replace(/^\[/, "[\n") +
    ";\n";

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, header + body, "utf8");
  console.log(`wrote ${out.length} questions -> ${OUT}`);
  console.log(`  multi-answer: ${out.filter((q) => q.multi).length}`);
  console.log(`  with explanation: ${out.filter((q) => q.explanation.length > 80).length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
