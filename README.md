# AWS DVA-C02 · Flashcard & Thi thử

Ứng dụng HTML tĩnh: 477 flashcard (16 section) + **6 đề thi thử** (390 câu) crawl từ Cloud Exam Pro.

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
data/s01.js … s16.js  477 flashcard theo 16 section
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

- 6 đề × 65 câu, 150 phút, điểm đạt 72%
- Đồng hồ đếm ngược, đánh dấu câu (phím `F`), bảng điều hướng câu hỏi (thu gọn được trên mobile)
- Câu nhiều đáp án được nhận diện tự động
- Nộp bài → điểm %, đúng/sai/bỏ trống, xem lại từng câu kèm giải thích
- Lịch sử các lần thi lưu trong `localStorage`

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
