#!/usr/bin/env node
/**
 * Crawl ExamTopics DVA-C02 practice questions into data/quiz/bank.js.
 *
 * ExamTopics ships the correct answer in the served HTML: every choice carries
 * a `data-correct<questionId>` attribute, and the explanation sits in
 * `#ccc<questionId>`. So one plain HTTP fetch per page is enough — no token, no
 * headless browser.
 *
 *   node tools/crawl-examtopics.mjs            # all pages
 *   node tools/crawl-examtopics.mjs --pages 3  # first 3 pages only (smoke test)
 *
 * Be considerate: the script sleeps between requests.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const BASE = "https://www.examtopics.com/exams/amazon/aws-certified-developer-associate-dva-c02/view";
const OUT = resolve(process.cwd(), "data/quiz/bank.js");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const argPages = (() => {
  const i = process.argv.indexOf("--pages");
  return i > -1 ? Number(process.argv[i + 1]) : Infinity;
})();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

/** HTML fragment -> plain text, keeping paragraph/line structure. */
function toText(html) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|li|div)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Split the page into per-question blocks. */
function parsePage(html) {
  const cards = html.split(/<div class="[^"]*exam-question-card"/);
  const out = [];

  for (const card of cards.slice(1)) {
    const idMatch = card.match(/class="card-body question-body" data-id="(\d+)"/);
    if (!idMatch) continue;
    const qid = idMatch[1];

    // stem: the first card-text paragraph
    const stemMatch = card.match(/<p class="card-text">([\s\S]*?)<\/p>/);
    if (!stemMatch) continue;
    const stem = toText(stemMatch[1]);

    // choices, in document order, with their letter
    const choices = [];
    const choiceRe =
      /<li class="multi-choice-item"[^>]*>\s*<span class="multi-choice-letter"[^>]*data-choice-letter="([A-Z])"[^>]*>[\s\S]*?<\/span>([\s\S]*?)<\/li>/g;
    let m;
    while ((m = choiceRe.exec(card)) !== null) {
      const text = toText(m[2])
        .replace(/\s*Most Voted\s*$/i, "")
        .trim();
      if (text) choices.push({ letter: m[1], text, correct: false });
    }
    if (choices.length < 2) continue;

    // correct letters appear as data-correct<qid> attributes on the correct <li>
    const marked = new Set();
    const correctRe = new RegExp(`data-correct${qid}`, "g");
    if (correctRe.test(card)) {
      // re-scan choice <li> tags and note which carry the marker
      const liRe = /<li class="multi-choice-item"[^>]*>/g;
      let li;
      let idx = 0;
      while ((li = liRe.exec(card)) !== null) {
        if (li[0].includes(`data-correct${qid}`)) marked.add(idx);
        idx++;
      }
    }

    // the authoritative answer string from the explanation block
    let answerLetters = "";
    const ansBlock = card.match(/<div class="card-text question-answer[^"]*" id="ccc(\d+)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
    if (ansBlock) {
      const lm = ansBlock[2].match(/Correct Answer:\s*<\/strong>\s*<strong[^>]*>\s*([A-Z](?:\s*,\s*[A-Z])*)/);
      if (lm) answerLetters = lm[1].replace(/[^A-Z]/g, "");
    }

    const letters = answerLetters
      ? answerLetters.split("")
      : [...marked].map((i) => choices[i] && choices[i].letter).filter(Boolean);

    if (!letters.length) continue; // no answer -> useless for a quiz
    choices.forEach((c) => { c.correct = letters.includes(c.letter); });
    if (!choices.some((c) => c.correct)) continue;

    // explanation prose (the answer header and vote chatter are noise)
    let explanation = "";
    if (ansBlock) {
      explanation = toText(ansBlock[2])
        .replace(/Correct Answer:[\s\S]{0,120}?Community vote[^\n]*\n?/i, "")
        .replace(/Community vote[^\n]*\n?/gi, "")
        .replace(/The stated answer are community vote[^\n]*\n?/gi, "")
        .replace(/\n{2,}/g, "\n")
        .trim()
        .slice(0, 1400);
    }

    out.push({
      id: qid,
      q: stem,
      options: choices.map((c) => c.text),
      correct: choices.map((c, i) => (c.correct ? i : -1)).filter((i) => i >= 0),
      multi: letters.length > 1,
      explanation,
    });
  }
  return out;
}

async function fetchPage(n) {
  const url = `${BASE}/${n}/`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`page ${n}: HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const all = [];
  const seen = new Set();
  let emptyStreak = 0;

  for (let n = 1; n <= argPages; n++) {
    let html;
    try {
      html = await fetchPage(n);
    } catch (err) {
      console.log(`page ${n}: ${err.message} — stopping`);
      break;
    }
    const qs = parsePage(html);
    let added = 0;
    for (const q of qs) {
      if (seen.has(q.id)) continue;
      seen.add(q.id);
      all.push(q);
      added++;
    }
    console.log(`page ${n}: ${qs.length} parsed, ${added} new (total ${all.length})`);

    if (added === 0) {
      emptyStreak++;
      if (emptyStreak >= 2) { console.log("two empty pages in a row — stopping"); break; }
    } else emptyStreak = 0;

    await sleep(1200);
  }

  if (!all.length) {
    console.error("nothing parsed — markup probably changed");
    process.exit(1);
  }

  const header = `/* ExamTopics DVA-C02 practice bank — crawled ${new Date().toISOString().slice(0, 10)}.
   ${all.length} questions with official correct answers. Regenerate with tools/crawl-examtopics.mjs */\n`;
  const body =
    "window.DVA_QUIZ_BANK = " +
    JSON.stringify(all)
      .replace(/\},\{/g, "},\n{")
      .replace(/^\[/, "[\n") +
    ";\n";

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, header + body, "utf8");
  console.log(`\nwrote ${all.length} questions -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
