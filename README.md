# AWS DVA-C03 · Flashcard & Thi thử

Ứng dụng HTML tĩnh: **564 flashcard (18 section)** + **6 đề thi thử** (390 câu) crawl từ Cloud Exam Pro.

Lộ trình học bám theo **DVA-C03** (hiệu lực từ 01/12/2026), nhưng vẫn dùng được để thi **DVA-C02** vì nền tảng dịch vụ gần như trùng nhau.

Không backend, không tài khoản: **mọi tiến độ lưu trong `localStorage` của trình duyệt người dùng**, nên ai mở web cũng có phiên riêng của mình.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/darkb2001/aws-dva-flashcard)

## Mở app

```bash
python3 -m http.server 8767
# rồi mở http://127.0.0.1:8767/index.html
```

Mở trực tiếp bằng `file://` vẫn chạy, nhưng nên dùng server để tránh giới hạn của trình duyệt.

## Cấu trúc

```
index.html            giao diện + toàn bộ logic (Học / Trắc nghiệm / Thi thử / Danh sách)
vercel.json           cấu hình deploy (cache + clean URLs)
assets/*.woff2        font tự host (Bricolage, Be Vietnam Pro, JetBrains Mono) — chạy offline được
data/s01.js … s18.js  564 flashcard theo 18 section
data/quiz/bank.js     190 câu trắc nghiệm DVA (đáp án + giải thích + trick)
data/exams/e01.js … e06.js   6 đề thi thử 65 câu (có đáp án + giải thích tiếng Việt)
tools/crawl-cloudexam.mjs    crawler Cloud Exam Pro
```

## Lưu phiên trên trình duyệt

| Key | Lưu gì |
|---|---|
| `dva-flashcard-v1` | Tiến độ từng thẻ (Leitner level, lịch ôn, số đúng/sai, ghim) + streak |
| `dva-ui-v1` | Chỗ đang đọc: mode, section, bộ lọc, từ khoá, thẻ hiện tại, trạng thái lật |
| `dva-exam-live-v1` | **Bài thi đang làm dở**: đáp án đã chọn, cờ, câu hiện tại, giờ kết thúc |
| `dva-exam-history-v1` | Lịch sử 40 lần thi gần nhất (điểm, số câu đúng, thời gian) |
| `dva-theme` | Lựa chọn sáng/tối (không có thì theo hệ thống) |

- Đóng tab giữa lúc thi vẫn quay lại được: mở lại web sẽ thấy banner **"Bạn đang làm dở … Tiếp tục / Bỏ bài"**, đồng hồ chạy tiếp theo giờ kết thúc đã lưu.
- Hết giờ trong lúc không mở web thì lượt thi đó bị bỏ (không thể nộp thay).
- Nút **Đặt lại** chỉ xoá tiến độ flashcard; lịch sử thi và phiên đang đọc giữ nguyên.
- Dữ liệu nằm trên máy người dùng, không đồng bộ giữa các thiết bị. Muốn đồng bộ thì cần backend.

## Deploy

Repo này là site tĩnh, deploy thẳng lên Vercel:

```bash
# cách 1: kéo repo về rồi deploy
vercel --prod

# cách 2: import repo trên vercel.com/new, framework preset = Other, không cần build
```

`vercel.json` đã cấu hình: HTML không cache, font cache vĩnh viễn, `data/*.js` cache 1 giờ.

## Giao diện

- Sáng/tối theo hệ thống, đổi tay được; lựa chọn lưu ở `localStorage` (`dva-theme`).
- Ba breakpoint: desktop (sidebar cố định), tablet & mobile (sidebar trượt, thanh trên 2 hàng).
- Icon là SVG tự vẽ trong `index.html` (`.i`), không dùng emoji.
- Tôn trọng `prefers-reduced-motion` và `prefers-contrast`.

## Chế độ Thi thử

- 6 đề × 65 câu, **150 phút** (130 phút chuẩn + 30 phút hỗ trợ ESL cho thí sinh không phải bản ngữ), điểm đạt 72%
- Đồng hồ đếm ngược, đánh dấu câu (phím `F`), bảng điều hướng câu hỏi (thu gọn được trên mobile)
- Câu nhiều đáp án được nhận diện tự động
- Nộp bài → điểm %, đúng/sai/bỏ trống, xem lại từng câu kèm giải thích

## Đối chiếu đề cương DVA-C03

Barem chính thức (hiệu lực 01/12/2026):

| Domain | Trọng số | ≈ số câu /50 |
|---|---|---|
| 1. Development with AWS Services | **30%** | 15 |
| 2. Security | **26%** | 13 |
| 3. Testing and Deployment | **22%** | 11 |
| 4. Troubleshooting and Optimization | **22%** | 11 |

Domain 4 tăng từ **18% (C02) → 22% (C03)**; phần AI được thêm vào cả 3 domain đầu.

### Phân bổ thẻ hiện tại

Thanh **Domain** trong sidebar phân loại **từng thẻ** theo nội dung thực tế (không theo section) và so với barem:

| Domain | Tỷ lệ thẻ | Barem | Chênh |
|---|---|---|---|
| DEV | ~35% | 30% | +5 |
| SEC | ~25% | 26% | −1 |
| DEP | ~21% | 22% | −1 |
| TRB | ~19% | 22% | −3 |

Vì sao không gán theo section: **IAM** nằm trong section EC2, **CloudWatch** nằm trong section Lambda — gán theo section sẽ đẩy DEV lên 56% và làm SEC/TRB chỉ còn 10%.

### Kho trắc nghiệm (khác với đề thi thử)

Ba kho **tách biệt**, đừng lẫn:

| Kho | Dùng cho | Số câu | Nội dung |
|---|---|---|---|
| `data/s01–s18.js` | Học (flashcard) | 564 thẻ | câu hỏi mở + đáp án viết |
| `data/quiz/bank.js` | **Trắc nghiệm** | 190 câu | 4–5 phương án thật, đáp án đúng, giải thích + trick |
| `data/exams/e01–e06.js` | **Thi thử** | 390 câu | 6 đề × 65 câu, 150 phút |

Trước đây chế độ Trắc nghiệm **mượn đáp án của thẻ khác làm phương án nhiễu**, nên phương án có thể phản đối chính câu hỏi và “đáp án đúng” thực ra là câu trả lời của một thẻ khác. Đã bỏ hẳn cách đó: trắc nghiệm giờ chỉ dùng câu hỏi có phương án và đáp án viết riêng cho nó.

Nguồn bank: `main.dx407egisqiw0.amplifyapp.com/questions.json`. File gốc có **255 dòng nhưng chỉ 190 câu**: 65 dòng là bản sao của cùng một câu, mỗi câu xuất hiện 2 lần (một lần id `qN` giải thích ngắn, một lần id số giải thích dài). Importer giữ bản giải thích đầy đủ hơn, nên **không mất câu nào** — đã đối chiếu: 190 khoá stem duy nhất ở nguồn, 190 câu trong bank.

`tools/add-quiz-tricks.mjs` bổ sung mục **Trick làm bài** cho những câu chưa có (nguồn đã có `**Tips:**` ở 105 câu). Trick lấy từ từ khoá quyết định trong đề: LEAST/MOST, cross-account, streaming, throttling, cold start, GSI hot partition…

Id trong bank được đánh lại từ 1; nguồn có id trùng (hai `q5`, `14`–`65` mỗi số hai lần) nên nếu giữ nguyên thì tiến độ `store.quiz[id]` sẽ gộp nhầm hai câu khác nhau.

```bash
node tools/import-amplify-quiz.mjs /tmp/quiz-bank.json   # nạp lại bank
node tools/add-quiz-tricks.mjs                           # thêm trick
```

Phân bổ domain trong bank: DEV 40% · SEC 27% · DEP 21% · TRB 12% (barem 30/26/22/22 — TRB còn thiếu).

### Chủ đề mới của C03 đã bổ sung

- **Section 17 — AI-assisted Development & AI Security** (16 thẻ): Amazon Q Developer, Kiro, CodeGuru, AI-assisted testing/CI-CD, **Amazon Bedrock** (InvokeModel, Converse, Knowledge Bases, Agents, Guardrails, Provisioned Throughput), **Bedrock AgentCore**, **AI Security** (prompt injection, PII masking, agent permissions, human-in-the-loop).
- **Section 18 — Troubleshooting & Optimization Deep Dive** (22 thẻ): Lambda throttling/cold start/SnapStart/Power Tuning, SQS visibility & long polling, Kinesis hot shard, DynamoDB throttling & consistency, DAX, ElastiCache, CloudFront invalidation, metric filter & Logs Insights, X-Ray.
- **Dịch vụ đã có sẵn từ trước**: AppConfig (15 thẻ), CloudShell (4), PrivateLink (5), Data Firehose (10), Amazon Q (4).

### Ghi chú phạm vi

- Bedrock/AgentCore chỉ ở mức **khái niệm và kiểm soát quyền** — AWS **không** yêu cầu thiết kế RAG hay prompt engineering chuyên sâu.
- Section 15 (Deployment) đã tăng 22 → 57 thẻ để cân với trọng số Deployment.
- Lịch sử các lần thi lưu trong `localStorage` (`dva-exam-history-v1`, 40 lượt gần nhất).

Phím tắt khi thi: `←`/`→` chuyển câu, `1`–`5` chọn đáp án, `F` đánh dấu.

## Crawl lại đề (khi đề được cập nhật)

1. Đăng nhập https://cloudexam.pro trên Chrome.
2. DevTools → **Application** → **Cookies** → `https://cloudexam.pro` → tìm cookie
   `CognitoIdentityServiceProvider.<poolId>.<email>.idToken` → copy value.
   (Hoặc Console: `JSON.parse(localStorage.getItem('auth-store')).state.idToken`)
3. Chạy:

```bash
CEP_TOKEN="<idToken>" node tools/crawl-cloudexam.mjs
```

Token Cognito chỉ sống ~1 giờ nên cần lấy mới mỗi lần crawl.

Crawler gọi 3 endpoint:

| Endpoint | Mục đích |
|---|---|
| `GET /api/courses/3/exams` | danh sách 6 đề |
| `GET /api/exams/{id}/history` | lấy `currentVersionId` + `durationMinutes` + `passThreshold` |
| `POST /api/attempts` `{examVersionId}` | tạo lượt thi → trả về toàn bộ câu hỏi & đáp án |
| `GET /api/attempts/{attemptId}` | bản chi tiết có `correctAnswer` (HTML) + `explanation` |

Header xác thực là `Authorization: <idToken>` — **không** có tiền tố `Bearer`.

Crawler tự chuyển attempt sang `Paused` sau khi lấy xong để không rác lịch sử.
