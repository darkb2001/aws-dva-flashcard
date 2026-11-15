/**
 * English flashcards — a translation of data/s04.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s04"] = [
  {
    q: "What is S3, and what are its main benefits?",
    a: "Storage that scales **“infinitely”** — one of the core AWS building blocks.\nBenefits: scalability, **the highest durability**, secure/private/encrypted by default, many storage classes, and unlimited resiliency & throughput.",
    note: "Use cases: backup, DR, archive, hybrid cloud, app hosting, media hosting, data lake, software delivery, static websites.",
  },
  {
    q: "What are the S3 bucket naming rules?",
    a: "- **Globally unique** (across all regions and accounts)\n- Defined at the **region level**\n- **No uppercase, no underscores**\n- **3–63 characters**\n- **Cannot look like an IP**\n- Must start with a **lowercase letter or a number**\n- **Cannot** start with the `xn--` prefix\n- **Cannot** end with the `-s3alias` suffix",
  },
  {
    q: "What does an S3 object consist of?",
    a: "- **Key** = the full path (`my_folder/another/my_file.txt`), made of a **prefix + object name**\n- **Max size 5 TB**\n- **Metadata**: name-value pairs\n- **Tags**: up to 10 unicode key/value pairs\n- **Version ID** (if versioning is enabled)",
  },
  {
    q: "What are the two groups of ways to control S3 access?",
    a: "**User-Based**: IAM Policies (for a specific user).\n**Resource-Based**:\n- **Bucket Policies** (bucket-wide, supports cross-account)\n- **Object ACL** (finer grained, can be disabled)\n- **Bucket ACL** (rarely used, can be disabled)",
  },
  {
    q: "What is required for an IAM principal to access an S3 object?",
    a: "An **IAM permission ALLOW** *or* a **Resource policy ALLOW**, **AND no explicit DENY**.",
  },
  {
    q: "What structure does a Bucket Policy have, and what is it used for?",
    a: "JSON: **Effect, Principal, Action, Resource**.\nUsed to: grant **public access**, **force encryption** on upload, **cross-account access**.",
  },
  {
    q: "What is Block Public Access for?",
    a: "Preventing company data leaks. If a bucket **should never be public** → leave it **on**. It can be set at the **account level**.",
  },
  {
    q: "S3 Static Website Hosting: what is the URL and the common error?",
    a: "URL: `http://bucket-name.s3-website-aws-region.amazonaws.com`\n**403 Forbidden** → the bucket policy **does not allow public read**; you must turn off **Block all Public Access** and add a bucket policy allowing `s3:GetObject`.",
  },
  {
    q: "How does S3 Versioning work?",
    a: "Enabled at the **bucket level**. Overwriting the same key → version 1, 2, 3…\n- Best practice: **preserve, retrieve, restore** every version\n- Files uploaded before versioning was enabled have the version **“null”**\n- **Suspending versioning does not delete** existing versions\n- Lets you recover from accidental delete or overwrite",
  },
  {
    q: "S3 Replication: CRR vs SRR, and what is required?",
    a: "- **Versioning** must be enabled on both source and destination\n- **CRR** = Cross-Region, **SRR** = Same-Region\n- The buckets can be in **different accounts**, and copying is **async**\n- Requires the right **IAM permissions**\n- CRR: compliance, low latency, cross-account. SRR: log aggregation, prod→test",
  },
  {
    q: "What are three important things to know about S3 Replication?",
    a: "1. Only **new objects** are replicated after you enable it → use **S3 Batch Replication** for existing objects and failed ones\n2. **Delete**: delete markers can be replicated (optional); a delete **with a version ID is not** replicated\n3. **No chaining**: with bucket1→bucket2→bucket3, an object in bucket1 **does not** reach bucket3",
  },
  {
    q: "What are the S3 storage classes?",
    a: "- S3 **Standard**\n- S3 **Standard-IA**\n- S3 **One Zone-IA**\n- S3 **Glacier Instant Retrieval**\n- S3 **Glacier Flexible Retrieval**\n- S3 **Glacier Deep Archive**\n- S3 **Intelligent-Tiering**\n\nMove between classes manually or with **Lifecycle** rules.",
  },
  {
    q: "Durability vs Availability in S3?",
    a: "**Durability**: eleven nines (99.999999999%) across multiple AZs — **the same for every storage class**.\n**Availability**: varies by class. S3 Standard at 99.99% = unavailable for about **53 minutes/year**.",
  },
  {
    q: "S3 Standard: characteristics?",
    a: "99.99% availability, for **frequently accessed** data, low latency and high throughput, survives **2 concurrent facility failures**.\nUse cases: big data analytics, mobile & gaming, content distribution.",
  },
  {
    q: "S3 Standard-IA vs One Zone-IA?",
    a: "- **Standard-IA**: 99.9% availability, ≥3 AZs, minimum 30 days, minimum object 128 KB → **DR, backups**\n- **One Zone-IA**: **1 AZ** (lose the AZ, lose the data), 99.5% availability, 30 days → **secondary backup copies, reproducible data**",
  },
  {
    q: "How do the three Glacier classes differ?",
    a: "- **Instant Retrieval**: milliseconds, data accessed **once a quarter**, minimum **90 days**\n- **Flexible Retrieval**: Expedited **1–5 minutes**, Standard **3–5 hours**, Bulk **5–12 hours** (free), minimum **90 days**\n- **Deep Archive**: Standard **12 hours**, Bulk **48 hours**, minimum **180 days**",
  },
  {
    q: "How does S3 Intelligent-Tiering work?",
    a: "A small monthly monitoring and auto-tiering fee, with **no retrieval charge**.\nTiers: **Frequent** (default), **Infrequent** (after 30 days), **Archive Instant** (90 days), **Archive Access** (90–700+ days, optional), **Deep Archive Access** (180–700+ days, optional).",
  },
  {
    q: "What are the two kinds of S3 Lifecycle Rule action?",
    a: "- **Transition Actions**: move to another storage class (e.g. Standard IA after 60 days, Glacier after 6 months)\n- **Expiration Actions**: delete after a period (expire logs after 365 days, delete old versions, abort incomplete multipart uploads)\n\nApplied by **prefix** or **object tags**.",
  },
  {
    q: "Scenario: keep thumbnails for 60 days, and source images must be retrievable immediately for 60 days then wait up to 6 hours?",
    a: "- **Source images**: S3 Standard + a lifecycle rule to **transition to Glacier after 60 days**\n- **Thumbnails** (reproducible): **S3 One Zone-IA** + a lifecycle rule to **expire after 60 days**",
  },
  {
    q: "Scenario: recover deleted objects instantly for 30 days, then within 48 hours for up to 365 days?",
    a: "- Enable **S3 Versioning** so a “delete” is only a **delete marker**\n- Transition **noncurrent versions** to **Standard IA**\n- Then transition **noncurrent versions** to **Glacier Deep Archive**",
  },
  {
    q: "S3 Analytics – Storage Class Analysis?",
    a: "Helps you decide when to transition objects.\n- Only recommends for **Standard** and **Standard IA**\n- **Does not** work with One Zone-IA or Glacier\n- The report is updated **daily**, and needs **24–48h** before data appears",
  },
  {
    q: "S3 Event Notifications: event types and characteristics?",
    a: "`S3:ObjectCreated`, `S3:ObjectRemoved`, `S3:ObjectRestore`, `S3:Replication`…\n- **Filter by object name** (`*.jpg`)\n- Delivered within **seconds**, sometimes **a minute+**\n- With EventBridge (optional): advanced JSON filtering, **many destinations**, archiving and **replay**",
  },
  {
    q: "S3 baseline performance?",
    a: "- Scales automatically, latency **100–200 ms**\n- **3,500** PUT/COPY/POST/DELETE per second **per prefix**\n- **5,500** GET/HEAD per second **per prefix**\n- No limit on the number of prefixes → spread across 4 prefixes = **22,000 GET/s**",
  },
  {
    q: "Multi-Part Upload and Transfer Acceleration?",
    a: "**Multi-Part**: recommended for files **>100 MB**, **required** for files **>5 GB**, and it parallelises uploads.\n**Transfer Acceleration**: upload to the nearest **edge location**, which forwards to the bucket's region — works with multi-part.",
  },
  {
    q: "What are the four ways to encrypt an S3 object?",
    a: "**Server-Side (SSE)**:\n- **SSE-S3**: key managed by AWS, **on by default**\n- **SSE-KMS**: uses a KMS key\n- **SSE-C**: key supplied by the customer, S3 **does not store it**\n**Client-Side**: the client encrypts/decrypts and manages keys itself",
  },
  {
    q: "SSE-S3 in detail?",
    a: "The key is **handled, managed and owned by AWS**. Server-side, **AES-256**. Header: `\"x-amz-server-side-encryption\": \"AES256\"`. **On by default** for new buckets and objects.",
  },
  {
    q: "What benefits and limits does SSE-KMS have?",
    a: "Benefits: **user control** + **key usage audited via CloudTrail**. Header: `\"x-amz-server-side-encryption\": \"aws:kms\"`.\nLimits: uploads call **GenerateDataKey** and downloads call **Decrypt** → this counts against the **KMS quota** (5,500 / 10,000 / 30,000 req/s depending on region).",
  },
  {
    q: "What does SSE-C require?",
    a: "The key is **managed entirely by the customer outside AWS**, and S3 **does not store it**.\n- **HTTPS is mandatory**\n- The key must be sent in the **HTTP headers of every request**",
  },
  {
    q: "Encryption in transit on S3?",
    a: "S3 has two endpoints: **HTTP** (unencrypted) and **HTTPS** (encrypted in flight).\nHTTPS is recommended; **mandatory with SSE-C**. You can **force** it with a bucket policy that requires the **`aws:SecureTransport`** condition.",
  },
  {
    q: "Default Encryption vs a Bucket Policy forcing encryption: which wins?",
    a: "**Bucket Policies are evaluated BEFORE Default Encryption**.\nYou can force encryption with a bucket policy that denies any PUT missing encryption headers (SSE-KMS or SSE-C).",
  },
  {
    q: "What is CORS?",
    a: "**Cross-Origin Resource Sharing**. An origin = **scheme + host + port**.\nIt is the browser mechanism that permits a request to another origin, and it needs **CORS headers** (e.g. `Access-Control-Allow-Origin`).\nOn S3: enable CORS on the bucket, allowing a specific origin or `*`.",
    tip: "A very common exam question — remember: different origin means you need CORS.",
  },
  {
    q: "S3 MFA Delete: which actions need MFA, and which do not?",
    a: "**Needs MFA**: permanently deleting an **object version**, and **suspending versioning**.\n**Does not need MFA**: **enabling versioning**, listing deleted versions.\nVersioning must be enabled, and only the **bucket owner (root)** can turn it on or off.",
  },
  {
    q: "S3 Access Logs: what should you watch out for?",
    a: "Every request to S3 (any account, authorised or denied) is logged to **another bucket in the same region**.\n⚠️ **Never** set the logging bucket to the monitored bucket → **logging loop**, and the bucket grows exponentially.",
  },
  {
    q: "S3 Pre-Signed URL: expiration and permissions?",
    a: "Created via Console, CLI or SDK.\n- **Console**: 1 minute → **720 minutes (12h)**\n- **CLI**: `--expires-in` in seconds, default **3600**, max **604800** (~168h)\n- Whoever uses the URL **inherits the permissions of the person who created it** for GET/PUT",
  },
  {
    q: "S3 Object Lock: the two retention modes?",
    a: "**WORM** (Write Once Read Many); **versioning is mandatory**.\n- **Compliance**: nobody (not even root) can overwrite/delete; the mode and duration cannot be changed\n- **Governance**: ordinary users cannot delete or change it; a user with special permissions can\n- **Legal Hold**: held indefinitely, independent of retention, via `s3:PutObjectLegalHold`",
  },
  {
    q: "What are S3 Access Points?",
    a: "They simplify security management for buckets at scale.\nEach Access Point has: its own **DNS name** (Internet or VPC Origin) + an **access point policy**.\n**VPC Origin**: reachable only from inside the VPC, and requires a **VPC Endpoint** (Gateway/Interface) plus an allowing policy.",
  },
  {
    q: "S3 Object Lambda?",
    a: "Uses a **Lambda function** to **transform an object before returning it** to the caller.\nUse cases: **redact PII**, convert formats (XML→JSON), resize and watermark images.",
  },
];
