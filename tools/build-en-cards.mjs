#!/usr/bin/env node
/**
 * Build the English side of the flashcard deck from the course PDF.
 *
 * The 564 cards were authored in Vietnamese. There is no English copy of them
 * in the repo, so the English side is recovered from the PDF they were written
 * from: for every card we find the slides that taught that exact topic and keep
 * the slide text as the English card body.
 *
 * Why not just search the whole PDF by keyword: the card is Vietnamese, so the
 * only shared words are service names, and questions like "EBS Snapshot là gì?"
 * share nothing at all. Two structural facts make the search reliable instead:
 *
 *   1. The PDF is a slide deck in the same order as data/s*.js, so card section
 *      sNN corresponds to PDF "Section NN" and nothing outside that range can
 *      match.
 *   2. Every card declares its chapter, and the chapter's English name ("EBS",
 *      "DynamoDB", "CodePipeline") is what the slides use as a heading.
 *
 * So: cut the PDF into sections, locate the chapter inside its section, then let
 * any leftover shared words pick the best slide in that window.
 *
 *   node tools/build-en-cards.mjs --pdf /tmp/dva.txt            # write data/en
 *   node tools/build-en-cards.mjs --pdf /tmp/dva.txt --report   # stats only
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

const argFor = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const PDF_TEXT = argFor("--pdf", "/tmp/dva.txt");
const OUT_DIR = resolve(process.cwd(), "data/en");
const REPORT = process.argv.includes("--report");

/* ---------------------------------------------------------------- load cards */

function loadCards() {
  const sections = [];
  global.window = { DVA_SECTIONS: sections };
  for (let i = 1; i <= 18; i++) {
    new Function(readFileSync(`data/s${String(i).padStart(2, "0")}.js`, "utf8"))();
  }
  return sections;
}

/* ------------------------------------------------------------- split the PDF */

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP = new Set(`the a an and or of to in on for with by from is are be as at that this these those it its
  if then than not no you your we our their can could should would may might must will shall do does did
  what when where which who how why all any both each few more most other some such only own same so too very
  s t just don now la gi va cua cho trong khi thi nen can dung mot cac nhung nay do ra vao de nhu
  card cards thing things use used using`.split(/\s+/));

const tokens = (s) => norm(s).split(" ").filter((w) => w.length > 2 && !STOP.has(w));

/** A slide ends at the copyright footer, so cut there. Keep short chunks too:
    the section dividers ("244 Section 5 • Networking - Amazon VPC") are only
    ~40 characters and are what tells us where each section begins. */
function splitSlides(text) {
  const clean = text.replace(/\f/g, "\n");
  return clean
    .split(/© Copyright by Cloud Mentor Pro \| Confidential/)
    .map((chunk, i) => ({ i, text: chunk.replace(/[ \t]+/g, " ").trim() }))
    .filter((s) => s.text.length > 12);
}

/** Slide 0..3 are the table of contents; matching against them is always wrong. */
const isToc = (s) => /Table of Contents/i.test(s.text.slice(0, 200));

/** Slide index where each PDF section begins.
 *
 *  Only seven sections carry an actual "Section N" divider slide; the rest open
 *  with a title slide ("Containers on AWS", "AWS CloudFormation"). Rather than
 *  guess at a pattern, pin the boundaries and verify them below — a wrong index
 *  would silently attach the wrong chapter's slides to a card, which is worse
 *  than reporting no English at all.
 */
const PDF_SECTION_START = {
  1: 6, 2: 61, 3: 129, 4: 187, 5: 244, 6: 283, 7: 335, 8: 383,
  9: 432, 10: 477, 11: 537, 12: 609, 13: 661, 14: 700, 15: 760, 16: 798,
};

/** Each boundary must be followed by a slide that names the section's topic. */
const PDF_SECTION_PROBE = {
  1: "getting started with aws", 2: "instance storage", 3: "rds",
  4: "amazon s3", 5: "amazon vpc", 6: "containers on aws", 7: "cloudfront",
  8: "cloudformation", 9: "integration messaging", 10: "monitoring",
  11: "lambda", 12: "dynamodb", 13: "api gateway", 14: "serverless sam",
  15: "codedeploy", 16: "advanced identity",
};

function verifySectionStarts(slides) {
  const bad = [];
  for (const [n, idx] of Object.entries(PDF_SECTION_START)) {
    const probe = PDF_SECTION_PROBE[n];
    const win = slides.slice(idx, idx + 3).map((s) => norm(s.text)).join(" ");
    if (!win.includes(probe)) bad.push(`section ${n} @${idx} missing "${probe}"`);
  }
  if (bad.length) throw new Error("PDF section boundaries drifted:\n  " + bad.join("\n  "));
}

function pdfSectionRange(n) {
  const from = PDF_SECTION_START[n];
  if (from == null) return null;
  const nexts = Object.keys(PDF_SECTION_START)
    .map(Number)
    .filter((k) => k > n)
    .sort((a, b) => a - b);
  const to = nexts.length ? PDF_SECTION_START[nexts[0]] : Infinity;
  return { from, to };
}

/** Card section id -> PDF section number (s07 -> 7). s17/s18 are DVA-C03
    additions that the DVA-C02 course PDF does not cover. */
const cardSectionToPdf = (sid) => {
  const n = Number(String(sid).replace(/^s/, ""));
  return n <= 16 ? n : null;
};

/* ------------------------------------------------------------- chapter anchors */

/** Chapter label -> words that mark that topic's slides. Hand-written because the
    deck's chapter slugs ("EBS", "Basics") are not the slide headings
    ("What's an EBS Volume?", "AWS Lambda"). */
const CHAPTER_ANCHORS = {
  "Global Infrastructure": ["aws global infrastructure", "regions", "availability zones"],
  IAM: ["iam", "iam users groups policies", "aws cli"],
  EC2: ["ec2", "instance types", "instance purchasing options"],
  EBS: ["ebs volume", "what s an ebs volume", "ebs snapshots"],
  Storage: ["instance store", "efs", "elastic file system"],
  "ELB & ASG": ["elastic load balancing", "high availability", "auto scaling"],
  RDS: ["amazon rds overview", "rds", "read replicas"],
  Aurora: ["aurora"],
  ElastiCache: ["elasticache", "redis", "memcached"],
  "Route 53": ["route 53", "hosted zone"],
  "S3 Basics": ["amazon s3", "s3 buckets", "s3 overview"],
  "S3 Advanced": ["s3 lifecycle", "s3 replication", "s3 performance"],
  "S3 Security": ["s3 security", "s3 encryption", "bucket policy"],
  "CIDR & VPC": ["understanding cidr", "subnets", "vpc"],
  Gateways: ["internet gateway", "nat gateway", "route tables"],
  Security: ["security groups", "nacls", "network acl"],
  Connectivity: ["vpc peering", "vpc endpoints", "site to site vpn"],
  Docker: ["docker", "containers"],
  ECS: ["amazon ecs", "fargate", "ecs clusters"],
  ECR: ["ecr", "elastic container registry"],
  EKS: ["eks", "kubernetes"],
  CloudFront: ["cloudfront"],
  Beanstalk: ["elastic beanstalk"],
  Templates: ["cloudformation", "template anatomy"],
  Functions: ["intrinsic functions", "fn::", "pseudo parameters"],
  Advanced: ["nested stacks", "change sets", "depends on", "stack policies"],
  SQS: ["amazon sqs", "simple queue service", "sqs standard"],
  SNS: ["amazon sns", "simple notification service"],
  Kinesis: ["kinesis"],
  Overview: ["monitoring", "cloudwatch"],
  CloudWatch: ["cloudwatch metrics", "cloudwatch logs", "alarms"],
  EventBridge: ["eventbridge", "event bus"],
  "X-Ray": ["x ray", "xray", "tracing"],
  CloudTrail: ["cloudtrail"],
  Basics: ["aws lambda", "lambda"],
  Invocation: ["lambda invocation", "event source mapping", "lambda integration"],
  Config: ["lambda configuration", "lambda environment variables", "lambda concurrency"],
  Capacity: ["dynamodb", "read write capacity", "rcu wcu"],
  Operations: ["dynamodb operations", "batchwriteitem", "conditional writes"],
  Stages: ["api gateway", "stages", "integration types"],
  Ops: ["usage plans", "api gateway security", "throttling"],
  SAM: ["sam", "serverless application model"],
  CDK: ["cdk", "cloud development kit"],
  Cognito: ["cognito"],
  "Step Functions": ["step functions"],
  AppSync: ["appsync"],
  Amplify: ["amplify"],
  CICD: ["code series", "cicd", "continuous integration"],
  CodeCommit: ["codecommit"],
  CodePipeline: ["codepipeline"],
  CodeBuild: ["codebuild"],
  CodeDeploy: ["codedeploy"],
  CodeArtifact: ["codeartifact"],
  CodeGuru: ["codeguru"],
  AppConfig: ["appconfig"],
  "CloudShell & Amazon Q": ["cloudshell", "amazon q"],
  STS: ["sts", "assume role"],
  "IAM Advanced": ["iam advanced", "permission boundaries", "identity federation"],
  KMS: ["kms", "encryption", "envelope encryption"],
  Secrets: ["secrets manager", "parameter store", "ssm"],
  Others: ["other services", "ses", "opensearch"],
  "AppConfig & Systems Manager": ["appconfig", "systems manager", "ssm"],
};

const anchorsFor = (chapter) =>
  [...new Set([...(CHAPTER_ANCHORS[chapter] || []), ...tokens(chapter)])].filter(Boolean);

/** Score a slide as a candidate for one card.
 *
 *  Two signals matter and they are not equally strong. The slide *title* is the
 *  topic ("API Gateway – CORS"), so a title hit means the slide is about the
 *  thing being asked. Shared body words are much weaker — every DynamoDB slide
 *  contains "dynamodb", which tells us nothing about which one answers the card.
 *  Weighting the title far above the body is what stops "CORS trên API Gateway?"
 *  from being answered by a Usage Plans slide that merely repeats "api gateway".
 */
function scoreSlide(slideText, card, chapterAnchors) {
  const lines = slideText.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  // a slide title is the first line that is not the page number
  const title = norm(lines.find((l) => !/^\d{1,3}$/.test(l)) || "");
  const body = norm(slideText);
  const qTokens = [...new Set(tokens(card.q))];
  const chapter = norm(card.chapter);

  let score = 0;

  for (const t of qTokens) {
    if (title.includes(t)) score += t.length > 5 ? 12 : 7;      // title hit: strong
    else if (body.includes(t)) score += t.length > 6 ? 2 : 1;   // body hit: weak
  }

  // the chapter itself is a weak prior: prefer slides inside the right chapter,
  // but never let it outvote an actual title match
  for (const a of chapterAnchors) if (title.includes(a)) score += 3;
  for (const a of chapterAnchors) if (body.includes(a)) score += 1;

  // exact topic ownership: a slide whose title is exactly this chapter
  if (chapter && title.includes(chapter)) score += 4;

  // prefer slides that actually explain something; a title-only slide ("DynamoDB
  // - Basics / • DynamoDB is made of Tables") teaches less than the full slide
  const bullets = lines.filter((l) => /^[•\-–*]/.test(l)).length;
  score += Math.min(bullets, 8);

  return score;
}

/** Rank every slide in the section, not just a window: the first match is often
 *  the neighbouring slide, while the real answer sits a few slides down. */
function rankSlides(slides, range, card, chapterAnchors) {
  const out = [];
  for (let i = range.from; i < range.to && i < slides.length; i++) {
    const sc = scoreSlide(slides[i].text, card, chapterAnchors);
    if (sc > 0) out.push({ slide: slides[i], score: sc });
  }
  return out.sort((a, b) => b.score - a.score);
}

/* ---------------------------------------------------------------- slide text */

/** The English prompt for a card is the slide's own title: it is the topic in
    English ("What's an EBS Volume?", "EBS Snapshots", "Delete on Termination
    attribute"). The Vietnamese question is not translated word for word — the
    title is what the author was actually teaching. */
function slideTitle(text) {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((l) => !/^\d{1,3}$/.test(l))
    .filter((l) => !/^© Copyright/.test(l))
    .filter((l) => !/^(https?:\/\/|www\.)/i.test(l));
  const first = lines.find((l) => !/^[•\-–*]/.test(l));
  if (!first) return "";
  // a wrapped heading ("AWS Certified Developer -\nAssociate") arrives in pieces
  const idx = lines.indexOf(first);
  let title = first;
  const next = lines[idx + 1];
  if (next && !/^[•\-–*]/.test(next) && !/[.:?!]$/.test(title) && title.length < 60) {
    title = title + " " + next;
  }
  return title.replace(/\s+/g, " ").trim().slice(0, 120);
}

function tidy(text) {
  let lines = text
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((l) => !/^© Copyright/.test(l))
    .filter((l) => !/^\d{1,3}$/.test(l))
    .filter((l) => !/^Section \d+\b/.test(l))
    .filter((l) => !/^(https?:\/\/|www\.)/i.test(l))
    .filter((l) => !/^\/[\w./-]*\.(html?|pdf)\b/i.test(l));

  // The split leaves the tail of the previous slide at the top; drop it when it
  // is not a plausible heading.
  const firstBullet = lines.findIndex((l) => /^[•\-–*]/.test(l));
  if (firstBullet > 0) {
    const head = lines.slice(0, firstBullet);
    const titleLike = head.length === 1 && head[0].length < 70 && !/[.:]$/.test(head[0]);
    if (!titleLike) lines = lines.slice(firstBullet);
  }

  while (lines.length && /^(AWS Certified Developer|Table of Contents)/i.test(lines[0])) lines.shift();

  const out = [];
  let prev = "";
  for (const l of lines) {
    if (l === prev) continue;
    out.push(l.startsWith("•") || /^[-–*]/.test(l) ? l : l);
    prev = l;
  }
  return out.join("\n");
}

/** Bullets whose text got wrapped by the PDF need rejoining, otherwise the card
    shows one sentence per line with ragged breaks. */
function reflow(body) {
  const lines = body.split("\n");
  const out = [];
  for (const line of lines) {
    const isBullet = /^[•\-–*]/.test(line);
    const prev = out[out.length - 1];
    const prevContinues =
      prev &&
      /^[•\-–*]/.test(prev) &&
      !/[.:;!?]$/.test(prev) &&
      !/^[A-Z]/.test(line) &&
      !isBullet;
    if (prevContinues) out[out.length - 1] = prev + " " + line;
    else out.push(line);
  }
  return out.join("\n");
}

/* ---------------------------------------------------------------- main */

async function main() {
  const sections = loadCards();
  const slides = splitSlides(await readFile(PDF_TEXT, "utf8"));
  verifySectionStarts(slides);
  const rangeOf = (n) => {
    const r = pdfSectionRange(n);
    if (!r) return null;
    return { from: r.from, to: Math.min(r.to, slides.length) };
  };

  const perSection = {};
  let total = 0, withEnglish = 0, noSource = [];
  const chapterMiss = {};

  for (const sec of sections) {
    const out = [];
    const pdfN = cardSectionToPdf(sec.id);
    const range = pdfN ? rangeOf(pdfN) : null;
    const anchors = {};
    for (const ch of new Set(sec.cards.map((c) => c.chapter))) anchors[ch] = anchorsFor(ch);

    for (const card of sec.cards) {
      total++;
      let body = "";
      let best = null;
      if (range) {
        const ranked = rankSlides(slides, range, card, anchors[card.chapter] || []);
        best = ranked[0];
        if (best && best.score >= 7) {
          // keep the winning slide plus a directly related neighbour, which
          // usually carries the rest of the same topic
          const picked = [best.slide];
          const near = ranked.slice(1).find((r) => r.score >= best.score * 0.7);
          if (near) picked.push(near.slide);
          body = picked.map((sl) => tidy(sl.text)).filter(Boolean).join("\n---\n");
        }
      }
      if (!body) {
        noSource.push({ sid: sec.id, chapter: card.chapter, q: card.q.slice(0, 55) });
        chapterMiss[card.chapter] = (chapterMiss[card.chapter] || 0) + 1;
      } else {
        withEnglish++;
      }
      const title = body && best ? slideTitle(best.slide.text) : "";
      out.push({
        chapter: card.chapter,
        q: card.q,            // Vietnamese original, kept for reference
        eq: title,            // English prompt taken from the slide heading
        en: body ? reflow(body) : "",
      });
    }
    perSection[sec.id] = out;
  }

  console.log(`cards: ${total}`);
  console.log(`with English source: ${withEnglish} (${Math.round((100 * withEnglish) / total)}%)`);
  console.log(`without: ${noSource.length}`, chapterMiss);
  noSource.slice(0, 12).forEach((m) => console.log("  -", m.sid, m.chapter, "|", m.q));

  if (REPORT) return;

  await mkdir(OUT_DIR, { recursive: true });
  for (const [sid, cards] of Object.entries(perSection)) {
    await writeFile(
      resolve(OUT_DIR, `${sid}.js`),
      `window.DVA_EN = window.DVA_EN || {};\nwindow.DVA_EN[${JSON.stringify(sid)}] = ${JSON.stringify(cards)};\n`,
      "utf8"
    );
  }
  console.log("wrote -> data/en/");
}

main().catch((e) => { console.error(e); process.exit(1); });
