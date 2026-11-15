/**
 * English flashcards — a translation of data/s09.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s09"] = [
  {
    q: "Why do we need to decouple applications?",
    a: "**Synchronous** communication breaks down when traffic **spikes** (e.g. you need to encode 1000 videos instead of 10).\nDecouple with:\n- **SQS**: queue model\n- **SNS**: pub/sub model\n- **Kinesis**: real-time streaming\n\n→ Each service **scales independently**.",
  },
  {
    q: "SQS Standard Queue: what are the main attributes?",
    a: "- **Unlimited throughput & unlimited messages**\n- Retention default **4 days**, max **14 days**\n- Low latency **< 10 ms** for publish and receive\n- **Max 256 KB per message**\n- **At least once delivery** → duplicates possible\n- **Best effort ordering** → out of order possible",
  },
  {
    q: "Producer and consumer in SQS?",
    a: "**Producer**: sends with the **SendMessage API** (SDK); the message persists until a consumer deletes it.\n**Consumer** (EC2, server, Lambda): **polls** (receives up to **10**), processes, then calls **DeleteMessage**.",
  },
  {
    q: "What are the three layers of SQS security?",
    a: "- **Encryption**: in flight over **HTTPS API**, at rest with **KMS**, or client-side\n- **Access Controls**: **IAM policies** for the SQS API\n- **SQS Access Policies** (like an S3 bucket policy): cross-account access, and letting other services (SNS, S3) write to the queue",
  },
  {
    q: "What is the Message Visibility Timeout?",
    a: "After a message is polled it is **invisible** to other consumers.\n- Default **30 seconds**\n- If the timeout expires before processing finishes → the message becomes **visible again** → it gets **processed twice**\n- The consumer can call **ChangeMessageVisibility** to ask for more time\n- Timeout **too high** + consumer crash → slow re-processing; **too low** → duplicates",
  },
  {
    q: "How does a Dead Letter Queue (DLQ) work?",
    a: "When a consumer fails to process a message more than **MaximumReceives** → the message goes to the **DLQ**.\n- Very useful for **debugging**\n- **DLQ FIFO ↔ FIFO queue**, **Standard ↔ Standard**\n- Set the DLQ retention to **14 days** so you have time to investigate",
  },
  {
    q: "What is Redrive to Source?",
    a: "A feature that lets you **consume the messages in the DLQ** to understand the problem. After fixing the code, you **redrive messages from the DLQ back to the source queue** (or another queue) **in batches**, without writing code.",
  },
  {
    q: "What is a Delay Queue?",
    a: "Delays a message by up to **15 minutes** (the consumer does not see it immediately).\n- Default **0 seconds**\n- Set at the **queue level**, or override with **`DelaySeconds`** when sending",
  },
  {
    q: "What is Long Polling?",
    a: "The consumer **waits** for a message if the queue is empty.\n- **Fewer API calls**, better efficiency, lower latency\n- Wait time **1–20 seconds** (**20s recommended**)\n- Better than **Short Polling**\n- Enabled at the queue level, or with **`WaitTimeSeconds`**",
  },
  {
    q: "How do you send a message larger than 256 KB?",
    a: "Use the **SQS Extended Client** (a Java library) — it stores the large payload in **S3**, and the SQS message only holds a reference.",
  },
  {
    q: "Which SQS APIs must you know?",
    a: "- **CreateQueue** (`MessageRetentionPeriod`), **DeleteQueue**\n- **PurgeQueue**: delete every message\n- **SendMessage** (`DelaySeconds`), **ReceiveMessage**, **DeleteMessage**\n- **MaxNumberOfMessages**: default 1, **max 10**\n- **ReceiveMessageWaitTimeSeconds**: long polling\n- **ChangeMessageVisibility**\n- **Batch APIs** (lower cost)",
  },
  {
    q: "SQS FIFO: throughput and characteristics?",
    a: "- **Ordering** of messages\n- Throughput: **300 msg/s** without batching, **3,000 msg/s** with batching\n- **Exactly-once send** (duplicates eliminated)\n- Messages are processed **in order**",
  },
  {
    q: "FIFO Deduplication?",
    a: "A deduplication interval of **5 minutes**. Two ways:\n- **Content-based**: the SHA-256 hash of the body\n- **Explicit Message Deduplication ID**",
  },
  {
    q: "FIFO Message Grouping?",
    a: "The same **MessageGroupID** → only **1 consumer** and messages stay **in order**.\nDifferent GroupIDs → **parallel processing**, but **ordering between groups is not guaranteed**.",
  },
  {
    q: "What is SNS? What are the limits?",
    a: "**Pub/Sub**: a producer sends to **1 SNS topic**, and many subscribers receive it.\n- Up to **12,500,000 subscriptions per topic**\n- **100,000 topics**\n- Subscribers: SQS, Lambda, Kinesis Data Firehose, Email, SMS, HTTP(S)",
  },
  {
    q: "What are the two ways to publish to SNS?",
    a: "**Topic Publish** (SDK): create topic → create subscription(s) → publish.\n**Direct Publish** (mobile SDK): create a platform application → create a platform endpoint → publish. Supports **Google GCM, Apple APNS, Amazon ADM**.",
  },
  {
    q: "What is the SNS + SQS Fan Out pattern?",
    a: "Push **once to SNS** and receive it in **every subscribed SQS queue**.\n- Fully decoupled, **no data loss**\n- SQS gives persistence, delayed processing and retries\n- Adding subscribers is easy\n- Needs an **SQS queue access policy** so SNS can write\n- Supports **cross-region delivery**",
    tip: "An S3 event can only create one rule per (event type + prefix) pair → to send to several queues, use **fan-out**.",
  },
  {
    q: "What is an SNS FIFO Topic?",
    a: "Ordering by **Message Group ID**, deduplication via a **Deduplication ID** or content-based. Subscribers can be **SQS Standard & FIFO**. Throughput is limited the **same way as SQS FIFO**.\n→ Combine **SNS FIFO + SQS FIFO** when you need fan-out + ordering + dedup.",
  },
  {
    q: "What is SNS Message Filtering?",
    a: "A **JSON policy** filters which messages are sent to a subscription.\nA subscription **without a filter policy** receives **every message**.",
  },
  {
    q: "Kinesis Data Streams: characteristics?",
    a: "- Retention **1–365 days**\n- You can **replay** data (consumers re-read it)\n- Data **cannot be deleted** (until it expires)\n- Messages up to **1 MB**\n- Ordering by **Partition ID**\n- KMS at rest, HTTPS in flight\n- **KPL** for producers, **KCL** for consumers",
  },
  {
    q: "What are the two capacity modes of Kinesis Data Streams?",
    a: "**Provisioned**: you choose the shard count — each shard does **1 MB/s in (1,000 records/s)** and **2 MB/s out**; you scale manually and pay per shard-hour.\n**On-demand**: no capacity management, default **4 MB/s in or 4,000 records/s**, auto-scales to the peak of the last 30 days, and you pay per stream-hour + GB in/out.",
  },
  {
    q: "Amazon Data Firehose (formerly Kinesis Data Firehose)?",
    a: "Fully managed, **near real-time**, buffering by size or time.\n- Destinations: **Redshift, S3, OpenSearch**, third parties (Splunk, MongoDB, Datadog, NewRelic), **Custom HTTP**\n- Auto scaling, serverless, pay per use\n- Supports CSV, JSON, Parquet, Avro, raw text, binary\n- Converts to Parquet/ORC, compresses with gzip/snappy\n- Transforms data with **Lambda**",
  },
  {
    q: "Kinesis Data Streams vs Firehose?",
    a: "**Streams**: streaming data collection, **producer & consumer code**, **real-time**, provisioned/on-demand, storage up to **365 days**, **supports replay**.\n**Firehose**: **loads** data into S3/Redshift/OpenSearch/third parties, fully managed, **near real-time**, auto scaling, **no storage**, **no replay**.",
  },
  {
    q: "Amazon Managed Service for Apache Flink?",
    a: "(Formerly Kinesis Data Analytics for Apache Flink) — runs **Apache Flink** (Java, Scala, SQL) on a managed cluster: provisioned compute, parallel computation, auto scaling, **backups (checkpoints & snapshots)**, data transformation.\n⚠️ **Flink does NOT read from Amazon Data Firehose.**",
  },
];
