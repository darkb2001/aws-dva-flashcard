#!/usr/bin/env node
/**
 * Crawl Cloud Exam Pro — AWS DVA-C02 practice exams (course 3).
 *
 * Usage:
 *   CEP_TOKEN="<cognito idToken>" node tools/crawl-cloudexam.mjs
 *   node tools/crawl-cloudexam.mjs --token "<idToken>"
 *
 * Auth header is `Authorization: <idToken>` (no "Bearer" prefix).
 *
 * Output:
 *   raw/cep-course.json            course + exam list
 *   raw/cep-exam-<id>.json         raw attempt payload (55 KB each)
 *   raw/cep-detail-<id>.json       raw attempt detail (has correctAnswer + explanation)
 *   data/exams/e01.js … e06.js     app-ready exam data
 */
import fs from "node:fs";
import path from "node:path";

const API = "https://user-api.cloudexam.pro/api";
const COURSE_ID = 3;
const ROOT = path.resolve(process.cwd());
const RAW = path.join(ROOT, "raw");
const OUT = path.join(ROOT, "data", "exams");

const argv = process.argv.slice(2);
let token = process.env.CEP_TOKEN || "";
const ti = argv.indexOf("--token");
if (ti > -1) token = argv[ti + 1] || token;
if (!token) {
  console.error("Thiếu token. Đặt biến môi trường CEP_TOKEN hoặc --token <idToken>.");
  process.exit(1);
}

const AUTH = { Authorization: token };

async function api(p, init = {}) {
  const res = await fetch(API + p, {
    ...init,
    headers: { ...AUTH, "Content-Type": "application/json", Accept: "application/json", ...(init.headers || {}) },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  if (!res.ok) {
    const msg = typeof body === "object" ? JSON.stringify(body) : String(body).slice(0, 200);
    const err = new Error(`${init.method || "GET"} ${p} → ${res.status} ${msg}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

/** HTML → plain text, preserving list structure and code blocks. */
function html2text(html) {
  if (!html) return "";
  let s = String(html);
  s = s.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => "\n```\n" + code.replace(/<[^>]+>/g, "") + "\n```\n");
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => "`" + c.replace(/<[^>]+>/g, "") + "`");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<li[^>]*>/gi, "\n• ");
  s = s.replace(/<\/(p|div|li|tr|h[1-6]|ul|ol)>/gi, "\n");
  s = s.replace(/<hr\s*\/?>/gi, "\n---\n");
  s = s.replace(/<[^>]+>/g, "");
  const ent = { "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&rsquo;": "'", "&lsquo;": "'", "&ldquo;": '"', "&rdquo;": '"', "&mdash;": "—", "&ndash;": "–", "&hellip;": "…", "&rarr;": "→", "&ge;": "≥", "&le;": "≤" };
  s = s.replace(/&[a-z]+;|&#\d+;/gi, (m) => ent[m.toLowerCase()] ?? m);
  s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ");
  return s.trim();
}

/**
 * Map display options.
 * `answersPos` = for each display slot, which original answer index to show.
 * e.g. answersPos [3,0,1,2] → option 1 shows answers[3].
 */
function orderOptions(q) {
  const answers = Array.isArray(q.answers) ? q.answers : [];
  let pos = q.answersPos;
  if (typeof pos === "string") {
    try { pos = JSON.parse(pos); } catch { pos = String(pos).match(/\d+/g)?.map(Number); }
  }
  if (!Array.isArray(pos) || pos.length !== answers.length) {
    return answers.map((t, orig) => ({ text: t, orig }));
  }
  return pos.map((orig) => ({ text: answers[orig], orig }));
}

function mapCorrect(q, opts) {
  let ca = q.correctAnswer;
  if (typeof ca === "string") {
    try { ca = JSON.parse(ca); } catch { ca = [ca]; }
  }
  if (!Array.isArray(ca)) ca = ca == null ? [] : [ca];

  const idx = new Set();
  ca.forEach((c) => {
    if (c == null) return;
    const s = String(c).trim();
    // try match against original answer texts (raw, then stripped)
    let k = opts.findIndex((o) => String(o.text || "").trim() === s);
    if (k < 0) {
      const st = html2text(s);
      k = opts.findIndex((o) => html2text(o.text) === st);
    }
    if (k > -1) idx.add(k);
    else {
      // letter form "B" / "B,C"
      const letters = s.match(/^[A-H]$/) ? [s] : (s.match(/\b[A-H]\b/g) || []);
      letters.forEach((L) => {
        const n = L.charCodeAt(0) - 65;
        if (n < opts.length) idx.add(n);
      });
    }
  });
  // Fallback: parse the explanation's "✅ Đáp án đúng" line
  if (!idx.size && q.explanation) {
    const txt = html2text(q.explanation);
    const m = txt.match(/✅[^\n]*\n+([^\n]+)/);
    if (m) {
      const line = m[1].replace(/^[A-H][.)]\s*/, "").trim();
      const k = opts.findIndex((o) => {
        const t = html2text(o.text);
        return t && (line.includes(t.slice(0, 60)) || t.includes(line.slice(0, 60)));
      });
      if (k > -1) idx.add(k);
    }
  }
  return [...idx].sort((a, b) => a - b);
}

function normalize(detail, meta) {
  const list = (detail.attemptAnswers || []).slice().sort((a, b) => (a.pos ?? 0) - (b.pos ?? 0));
  const questions = list.map((q, i) => {
    const opts = orderOptions(q);
    const correct = mapCorrect(q, opts);
    return {
      n: i + 1,
      q: html2text(q.questionText),
      options: opts.map((o) => html2text(o.text)),
      correct,
      answer: html2text(q.explanation),
      multi: (correct.length > 1) || (q.correctAnswersNum || 1) > 1,
    };
  });
  return {
    id: meta.idx,
    name: meta.name,
    duration: meta.duration ?? 150,
    pass: meta.pass ?? 72,
    questions,
  };
}

const js = (v) => JSON.stringify(v);

function toJsFile(exam) {
  const head = [
    `/* ${exam.name} — Cloud Exam Pro · AWS DVA-C02 (course ${COURSE_ID})`,
    ` * ${exam.questions.length} câu · ${exam.duration} phút · điểm đạt ${exam.pass}%`,
    ` * Sinh tự động bởi tools/crawl-cloudexam.mjs — đừng sửa tay.`,
    ` */`,
    `window.DVA_EXAM_SETS = window.DVA_EXAM_SETS || [];`,
    `window.DVA_EXAM_SETS[${exam.id - 1}] = {`,
    `  id: ${exam.id},`,
    `  name: ${js(exam.name)},`,
    `  duration: ${exam.duration},`,
    `  pass: ${exam.pass},`,
    `  questions: [`,
  ];
  const rows = exam.questions.map(
    (q) =>
      `    { n: ${q.n}, multi: ${q.multi}, q: ${js(q.q)}, options: ${js(q.options)}, correct: ${js(q.correct)}, answer: ${js(q.answer)} },`
  );
  const tail = [`  ]`, `};`, ``];
  return [...head, ...rows, ...tail].join("\n");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(RAW, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });

  console.log("→ GET /courses/%d/exams", COURSE_ID);
  const course = await api(`/courses/${COURSE_ID}/exams`);
  fs.writeFileSync(path.join(RAW, "cep-course.json"), JSON.stringify(course, null, 2));
  const exams = course.exams || [];
  console.log(`✓ ${exams.length} đề: ${exams.map((e) => e.exam_name).join(" · ")}`);

  const done = [];
  for (const [i, ex] of exams.entries()) {
    const examId = ex.exam_id;
    console.log(`\n[${i + 1}/${exams.length}] ${ex.exam_name} (exam ${examId})`);
    try {
      const hist = await api(`/exams/${examId}/history`);
      const versionId = hist.currentVersionId || hist.examVersionId;
      fs.writeFileSync(path.join(RAW, `cep-history-${examId}.json`), JSON.stringify(hist, null, 2));
      console.log(`  version ${versionId} · ${hist.questionCount} câu · ${hist.durationMinutes} phút`);

      const attempt = await api("/attempts", {
        method: "POST",
        body: JSON.stringify({ examVersionId: versionId }),
      });
      fs.writeFileSync(path.join(RAW, `cep-attempt-${examId}.json`), JSON.stringify(attempt, null, 2));
      console.log(`  ✓ attempt ${attempt.attemptId} — ${attempt.attemptAnswers?.length ?? 0} câu`);

      const detail = await api(`/attempts/${attempt.attemptId}`);
      fs.writeFileSync(path.join(RAW, `cep-detail-${examId}.json`), JSON.stringify(detail, null, 2));

      const norm = normalize(detail, {
        idx: i + 1,
        name: ex.exam_name,
        duration: hist.durationMinutes,
        pass: hist.passThreshold,
      });

      const missing = norm.questions.filter((q) => !q.correct.length);
      const badOpts = norm.questions.filter((q) => q.options.length < 2 || q.options.some((o) => !o));
      console.log(`  ✓ ${norm.questions.length} câu · thiếu đáp án: ${missing.length} · option lỗi: ${badOpts.length}`);
      if (missing.length) missing.slice(0, 3).forEach((q) => console.log(`     ⚠ câu ${q.n}: ${q.q.slice(0, 70)}…`));

      done.push(norm);

      // leave the attempt paused, not dangling as "In progress"
      try {
        await api(`/attempts/${attempt.attemptId}`, {
          method: "PUT",
          body: JSON.stringify({ status: "Paused" }),
        });
      } catch { /* cosmetic only */ }
    } catch (e) {
      console.error(`  ✗ ${e.message}`);
      if (e.status === 401) {
        console.error("\nToken hết hạn. Lấy idToken mới từ DevTools → Application → Cookies →\n" +
          "CognitoIdentityServiceProvider.<pool>.<email>.idToken, rồi chạy lại với --token.");
        process.exit(2);
      }
    }
    await sleep(350);
  }

  done.forEach((exam, i) => {
    const file = path.join(OUT, `e${String(i + 1).padStart(2, "0")}.js`);
    fs.writeFileSync(file, toJsFile(exam));
    console.log(`✓ ${path.relative(ROOT, file)} — ${exam.questions.length} câu`);
  });

  const total = done.reduce((n, e) => n + e.questions.length, 0);
  const noAns = done.reduce((n, e) => n + e.questions.filter((q) => !q.correct.length).length, 0);
  console.log(`\n━━━ Xong: ${done.length} đề / ${total} câu ${noAns ? `(${noAns} câu thiếu đáp án)` : "(đủ 100% đáp án)"} ━━━`);
}

main().catch((e) => {
  console.error("\n✗", e.message);
  process.exit(1);
});
