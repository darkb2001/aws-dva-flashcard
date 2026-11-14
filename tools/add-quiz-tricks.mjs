#!/usr/bin/env node
/**
 * Add a "trick" (exam technique hint) to every question that lacks one.
 *
 * The bank ships a written explanation but only one question had a Tips section,
 * so a candidate learned why an answer was right without learning how to spot it
 * next time. This derives the trick from the vocabulary of the question itself:
 * each rule maps a signal in the stem to the reflex that signal should trigger.
 * Rules are ordered by specificity; the first strong match wins, and a question
 * with no clear signal gets a generic reminder rather than an invented claim.
 *
 *   node tools/add-quiz-tricks.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const FILE = resolve(process.cwd(), "data/quiz/bank.js");

/* signal in the stem -> the reflex it should trigger.
   Keep these genuinely exam-shaped: an exclusion word, a superlative, a service name. */
const RULES = [
  {
    test: /\b(LEAST (?:management )?(?:overhead|operational|privilege|amount of (?:change|configuration))|FEWEST|MINIMUM (?:change|configuration))\b/i,
    tip: "Gặp LEAST/FEWEST/MINIMUM → loại phương án cần tự vận hành (EC2, tự build, tự rotate). Dịch vụ managed + fewer moving parts thắng.",
  },
  {
    test: /\b(MOST (?:secure|securest|cost-effective|highly available|scalable|reliable|operational efficiency)|HIGHEST level of security)\b/i,
    tip: "Gặp MOST/HIGHEST → ưu tiên phương án dùng IAM role + KMS + dịch vụ managed; loại phương án lưu credential trong code/S3/file.",
  },
  {
    test: /\bencrypt(?:ed|ion)? at rest\b/i,
    tip: "“Encrypted at rest” luôn cần KMS (SSE-KMS cho S3/EBS, KMS cho DynamoDB). Nếu đề hỏi thêm cross-account → nhớ bucket policy / key policy.",
  },
  {
    test: /\b(access token|API key|credential|password|secret|database password)\b/i,
    tip: "Access token / API key / password → AWS Secrets Manager (có rotation). Parameter Store chỉ khi đề nói rõ “ít tốn kém” hoặc “free tier”.",
  },
  {
    test: /\b(container|Docker|image)\b.*\b(registry|store|push|pull)\b|\bECR\b/i,
    tip: "Container image → ECR; chạy container không muốn quản server → Fargate. Nếu đề nhắc Kubernetes API/manifest → EKS.",
  },
  {
    test: /\b(cold start|SnapStart|provisioned concurrency)\b/i,
    tip: "Cold start: tăng memory (CPU tỷ lệ thuận) → rồi Provisioned Concurrency nếu cần latency ổn định, SnapStart nếu là Java. Provisioned tốn phí cả khi idle.",
  },
  {
    test: /\bthrottl/i,
    tip: "Throttling: kiểm tra (1) concurrency limit với Lambda, (2) hot partition với DynamoDB, (3) capacity mode. Xử lý gốc bằng retry + exponential backoff TRƯỚC khi tăng capacity.",
  },
  {
    test: /\b(UnprocessedKeys|BatchGetItem|BatchWriteItem)\b/i,
    tip: "Batch API trả UnprocessedKeys/UnprocessedItems → retry đúng những item đó với exponential backoff + jitter; đừng retry cả batch ngay lập tức.",
  },
  {
    test: /\b(decouple|asynchronous|async|fan-?out|buffer)\b/i,
    tip: "Decouple → SQS (queue, 1 consumer) hoặc SNS fan-out (nhiều subscriber). Cần filter nội dung phức tạp → EventBridge.",
  },
  {
    test: /\b(retry|DLQ|dead[- ]letter|poison|idempotenc)/i,
    tip: "Lỗi xử lý lặp lại → DLQ + maxReceiveCount. Lambda async tự retry 2 lần; muốn kiểm soát tốt hơn thì dùng on-failure destination. Luôn thiết kế idempotent.",
  },
  {
    test: /\b(cross-account|another account|multiple accounts|different account)\b/i,
    tip: "Cross-account → IAM role + trust policy (hoặc resource policy). Không bao giờ copy credential sang account khác.",
  },
  {
    test: /\b(real-?time|streaming|stream|Kinesis|Firehose)\b/i,
    tip: "Streaming: Kinesis Data Streams khi cần tự xử lý/nhiều consumer; Firehose khi chỉ cần đổ dữ liệu vào S3/Redshift/OpenSearch (near real-time, không quản shard).",
  },
  {
    test: /\b(CloudFormation|stack|template|SAM|CDK)\b/i,
    tip: "CloudFormation: Parameters + AllowedValues để giới hạn lựa chọn; rollback tự động khi stack fail; change set để xem trước thay đổi. SAM = CloudFormation cho serverless.",
  },
  {
    test: /\b(Blue\/Green|Canary|rolling|deploy(?:ment)? strategy|shift traffic)\b/i,
    tip: "Canary = % traffic nhỏ trước (API Gateway canary, Lambda alias weighted). Blue/Green = môi trường mới rồi switch toàn bộ. Rolling = thay dần từng instance.",
  },
  {
    test: /\b(X-Ray|trace|segment|subsegment)\b/i,
    tip: "Trace phân tán → X-Ray; trên on-premises/server ngoài AWS cần chạy X-Ray daemon. Bật tracing ở MỌI service trong đường đi, nếu không trace sẽ đứt.",
  },
  {
    test: /\b(CloudWatch|alarm|metric|log group|Logs Insights)\b/i,
    tip: "Metric để alarm, Logs để điều tra. Muốn alarm theo nội dung log → tạo metric filter trước. Nhớ đặt retention cho log group để tránh phí.",
  },
  {
    test: /\b(presigned|pre-signed)\b/i,
    tip: "Presigned URL cấp quyền tạm thời theo credential người tạo — hết hạn thì URL chết, và không thể thu hồi trước hạn ngoài việc rotate key.",
  },
  {
    test: /\b(Cognito|identity pool|user pool|federat)\b/i,
    tip: "User pool = authentication (đăng nhập). Identity pool = authorization (đổi token thành credential AWS tạm thời). Đừng lẫn hai vai trò này.",
  },
  {
    test: /\b(VPC endpoint|PrivateLink|private subnet|NAT gateway)\b/i,
    tip: "Private subnet không có internet: cần NAT Gateway để ra ngoài; gọi service AWS thì dùng VPC endpoint (gateway cho S3/DynamoDB, interface/PrivateLink cho phần còn lại).",
  },
  {
    test: /\b(DAX|ElastiCache|Redis|Memcached|cache)\b/i,
    tip: "DAX chỉ tăng tốc ĐỌC DynamoDB. ElastiCache cho cache tầng ứng dụng (Redis: persistence/pub-sub; Memcached: đơn giản, multi-thread).",
  },
  {
    test: /\b(GSI|LSI|global secondary index|partition key|hot partition)\b/i,
    tip: "GSI tạo sau được, eventual consistent, có capacity riêng. LSI phải tạo cùng bảng, strongly consistent được. Partition key lệch → hot partition.",
  },
  {
    test: /\b(IAM (?:policy|role|permission)|least privilege|assume role|trust policy)\b/i,
    tip: "IAM: explicit Deny luôn thắng. Policy cần cả Action + Resource. Với Lambda/ECS hãy dùng execution role, không nhúng access key.",
  },
  {
    test: /\b(step functions|state machine|orchestrat)\b/i,
    tip: "Nhiều bước tuần tự + retry + xử lý lỗi từng bước → Step Functions (không nhồi hết vào 1 Lambda).",
  },
  {
    test: /\b(API Gateway|REST API|HTTP API|usage plan|throttl.*API)\b/i,
    tip: "API Gateway: HTTP API rẻ/nhanh cho proxy đơn giản; REST API cần usage plan, API key, request validation. Timeout cứng 29s — việc dài phải async.",
  },
  {
    test: /\b(S3|bucket|object|lifecycle|storage class)\b/i,
    tip: "S3: lifecycle để chuyển storage class/xoá; versioning bảo vệ khỏi xoá nhầm; bucket policy cho cross-account; presigned URL cho truy cập tạm.",
  },
];

const FALLBACK =
  "Đọc kỹ từ khoá quyết định trong đề (LEAST/MOST/FEWEST, “real-time”, “cross-account”, “least operational overhead”) — chúng thường loại ngay 2 phương án. Loại phương án tự vận hành nhiều hơn nếu đề hỏi managed.";

function pickTrick(text) {
  for (const rule of RULES) {
    if (rule.test.test(text)) return rule.tip;
  }
  return FALLBACK;
}

function alreadyHasTrick(explanation) {
  return /^Tips?\s*:/im.test(explanation || "");
}

async function main() {
  const src = await readFile(FILE, "utf8");
  const match = src.match(/window\.DVA_QUIZ_BANK\s*=\s*(\[[\s\S]*\]);/);
  if (!match) throw new Error("could not read DVA_QUIZ_BANK from bank.js");
  const bank = JSON.parse(match[1]);

  let added = 0;
  bank.forEach((q) => {
    if (alreadyHasTrick(q.explanation)) return;
    const tip = pickTrick(q.q + " " + (q.options || []).join(" "));
    q.explanation = String(q.explanation || "").trimEnd() + "\n\nTips:\n" + tip;
    added++;
  });

  const header = src.slice(0, src.indexOf("window.DVA_QUIZ_BANK"));
  const body =
    "window.DVA_QUIZ_BANK = " +
    JSON.stringify(bank).replace(/\},\{/g, "},\n{").replace(/^\[/, "[\n") +
    ";\n";
  await writeFile(FILE, header + body, "utf8");
  console.log(`added a trick to ${added} of ${bank.length} questions`);
}

main().catch((e) => { console.error(e); process.exit(1); });
