#!/usr/bin/env node
/**
 * Import the Amplify question bank into data/quiz/bank.js.
 *
 * Source: https://main.dx407egisqiw0.amplifyapp.com/questions.json
 * 255 DVA questions, each with its answers, the correct letters, and a written
 * Vietnamese explanation (~850 chars). That explanation is what makes the quiz
 * teach instead of just score, so it is kept verbatim.
 *
 * The source contains the same question twice: once under a "qN" id with a
 * short explanation, once under a numeric id with a longer one. Deduping on the
 * first 120 characters was wrong twice over — it dropped one genuinely different
 * Kinesis question that shares an opening paragraph, and it kept whichever copy
 * happened to come first instead of the better-explained one. We now key on the
 * whole normalised stem and keep the richer copy.
 *
 * Ids from the source collide (two "q5", and "14".."65" each appear twice), so
 * store.quiz[q.id] would merge unrelated questions and the "never repeat a
 * question you got right" filter would hide the wrong one. Ids are reassigned
 * from the final order.
 *
 *   node tools/import-amplify-quiz.mjs [path/to/questions.json]
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

/** Identity of a question: the whole stem, case and spacing flattened. */
function stemKey(text) {
  return clean(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function prepare(q) {
  const text = clean(q.text);
  const answers = Array.isArray(q.answers) ? q.answers : [];
  if (!text || answers.length < 2) return null;

  const options = answers.map((a) => clean(a.text));
  const letters = (q.correctAnswer || []).map((l) => String(l).toUpperCase());

  // letters -> indexes, using the answer ids so a reordered list still works
  const correct = [];
  letters.forEach((l) => {
    const byId = answers.findIndex((a) => String(a.id).toUpperCase() === l);
    const idx = byId >= 0 ? byId : LETTERS.indexOf(l);
    if (idx >= 0 && idx < options.length && !correct.includes(idx)) correct.push(idx);
  });
  if (!correct.length) return null;

  return {
    id: String(q.id || ""),
    q: text,
    options,
    correct,
    multi: correct.length > 1,
    explanation: clean(q.explanation),
  };
}

async function main() {
  const raw = JSON.parse(await readFile(SRC, "utf8"));
  const list = Array.isArray(raw) ? raw : raw.questions || [];
  if (!list.length) throw new Error("no questions in source");

  const byStem = new Map();
  let droppedIncomplete = 0;

  for (const source of list) {
    const item = prepare(source);
    if (!item) { droppedIncomplete++; continue; }

    const key = stemKey(item.q);
    const prev = byStem.get(key);
    // same question twice: keep the copy that actually explains the answer
    if (!prev) byStem.set(key, item);
    else if (item.explanation.length > prev.explanation.length) byStem.set(key, item);
  }

  const out = [...byStem.values()].map((item, i) => ({ ...item, id: `q${i + 1}` }));

  const header =
    `/* DVA practice bank — ${out.length} questions with written Vietnamese explanations.\n` +
    `   Source: main.dx407egisqiw0.amplifyapp.com/questions.json (255 rows, deduped)\n` +
    `   Regenerate with tools/import-amplify-quiz.mjs */\n`;

  const body =
    "window.DVA_QUIZ_BANK = " +
    JSON.stringify(out)
      .replace(/\},\{/g, "},\n{")
      .replace(/^\[/, "[\n") +
    ";\n";

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, header + body, "utf8");

  const ids = new Set(out.map((q) => q.id));
  console.log(`read ${list.length} rows -> wrote ${out.length} questions`);
  console.log(`  dropped as incomplete: ${droppedIncomplete}`);
  console.log(`  duplicates merged: ${list.length - droppedIncomplete - out.length}`);
  console.log(`  multi-answer: ${out.filter((q) => q.multi).length}`);
  console.log(`  unique ids: ${ids.size} (must equal ${out.length})`);
  if (ids.size !== out.length) throw new Error("id collision");
}

main().catch((e) => { console.error(e); process.exit(1); });
