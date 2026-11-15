/**
 * English text for the DVA-C03 material the DVA-C02 course PDF does not cover.
 *
 * Sections 17 (AI-assisted development) and 18 (troubleshooting) were written
 * for this deck from the DVA-C03 exam guide, so there is no slide text to
 * extract — the English below is a direct translation, same structure and same
 * facts, written to be read as exam review rather than as prose.
 *
 * Keyed by section then card index, matching data/s17.js and data/s18.js.
 */
window.DVA_EN_MANUAL = {
  s17: [
    {
      eq: "What does DVA-C03 add over C02 on the AI side?",
      en: "**DVA-C03** (effective **01/12/2026**) adds three groups of AI topics:\n• **AI-assisted development** — using AI tools to **generate code, review, refactor, optimise** and **generate tests**\n• **Managed AI** — integrating AWS AI services (**Bedrock**) into an application\n• **AI Security** — controlling access to AI services, protecting sensitive data, blocking **prompt injection**, scoping **AI agent** permissions\n⚠️ AWS does **not** require deep **RAG** design or **prompt engineering** — only understanding and applying it correctly.",
    },
    {
      eq: "Which AWS AI tools generate and review code?",
      en: "**Amazon Q Developer**: **inline completion**, **chat in the IDE/console**, code and test generation, **security scanning**, **code transformation** (Java version upgrades), explaining and debugging errors. Integrates with **VS Code, JetBrains, CLI, AWS Console**.\n**Kiro**: AWS's **spec-driven** IDE — generates code from a **specification**, supports **agentic workflows** and **automated testing**.\n**CodeGuru Reviewer**: automated review on **pull requests** (static analysis, ML) — complementary, not a replacement for Q Developer.\n**CodeGuru Profiler**: **runtime performance** analysis in production.",
    },
    {
      eq: "What does AI-assisted testing cover?",
      en: "• **Generating unit and integration tests** from existing code\n• **Generating mocks** for external APIs/services\n• **Analysing test results**, suggesting why something failed\n• **Automated regression testing** when code changes\n• **Measuring and improving test coverage**\n→ Runs in **CI/CD** as a step inside **CodeBuild**, with results pushed to **CodeBuild reports**.",
    },
    {
      eq: "How do AI tools fit into a CI/CD pipeline?",
      en: "• **Automated code review** on **pull requests** (CodeGuru Reviewer / Q Developer) before merge\n• **Generating and running tests** in **CodeBuild** (buildspec `reports`)\n• **Analysing build/deploy failures**, suggesting the cause\n• **Optimisation suggestions** for performance and cost from CloudWatch logs/metrics, without reading them by hand\n• **Security scanning** of code before deploy\n⚠️ Important changes still need **human review** — AI **assists**, it does not decide.",
    },
    {
      eq: "What are the risks of AI-generated code?",
      en: "• **Plausible-looking but wrong code** (hallucination) → tests and review are mandatory\n• **Leaking sensitive data** if code or secrets are pasted into a prompt\n• **Licence/attribution** of generated code\n• **Missing business context** → syntactically valid but semantically wrong\n• **Over-reliance**: the team's debugging skill erodes\n→ Mitigate by **keeping secrets/PII out of prompts**, always **reviewing and testing**, and using tools that **do not train on your data**.",
    },
    {
      eq: "What is Amazon Bedrock?",
      en: "A **fully managed** service for calling **foundation models (FMs)** from many providers through **one API** — **Anthropic Claude, Amazon Titan, Meta Llama, Mistral, Stability AI, Cohere**…\n• **No infrastructure to manage**, serverless\n• **Bedrock Knowledge Bases**: built-in RAG (vector store + ingestion)\n• **Bedrock Agents**: an agent calls **APIs/tools** to complete a task\n• **Guardrails**: content filtering, denied topics, **PII** masking\n• **Model evaluation**, and **Provisioned Throughput** for steady workloads",
    },
    {
      eq: "Which permissions does an app need to call Bedrock?",
      en: "Grant the calling principal **IAM permissions**:\n• `bedrock:InvokeModel` (and `InvokeModelWithResponseStream`)\n• `bedrock:Converse` / `ConverseStream` (unified API across models)\n• `bedrock:Retrieve` / `RetrieveAndGenerate` for **Knowledge Bases**\n• `bedrock:InvokeAgent` for **Agents**\nUse an **IAM role** — never hard-code keys. For **cross-account** access the model must be **enabled in that region**; Bedrock requires **requesting model access** before use.",
    },
    {
      eq: "How do Bedrock Agents work?",
      en: "An **agent** = FM + **instructions** + **action group** (APIs to call, described by an **OpenAPI schema**) + optional **knowledge base**.\nFlow: user asks → the agent **plans** → calls **Lambda/API** through the action group → composes the answer.\n⚠️ The agent runs with an **execution role** — grant **least privilege** for exactly the APIs it needs, never `*`.\nEnable **human-in-the-loop**: the agent **proposes** a sensitive action and a person **approves** it before execution.",
    },
    {
      eq: "What is Bedrock AgentCore?",
      en: "Building blocks for running **AI agents in production**: **runtime** (serverless agent execution with session isolation), **memory** (long-term context), **identity & permissions** (each agent has its own identity), **gateway** (standardised tools/APIs), **observability** (agent traces and logs).\n→ It solves the operational problems of agents — **session isolation, permission management, monitoring** — instead of you building that infrastructure.\n⚠️ The exam focus is **concepts and access control**, not detailed code.",
    },
    {
      eq: "What are Bedrock Guardrails for?",
      en: "Controlling the **input and output** of an FM:\n• **Content filters**: block harmful, violent or inappropriate content\n• **Denied topics**: block forbidden subjects (e.g. investment advice)\n• **Word/phrase filters**: block specific terms\n• **PII detection & masking**: hide emails, phone numbers, ID numbers in prompt and response\n• **Contextual grounding check**: detect answers **not grounded in the provided documents** (reduces hallucination)\n→ Attach a **guardrail** to a model/agent to **protect sensitive data** going to and coming from the AI.",
    },
    {
      eq: "When should you use Provisioned Throughput for Bedrock?",
      en: "**On-demand**: pay per **token**, suited to **unpredictable** or light workloads.\n**Provisioned Throughput**: buy a fixed **model unit** → **steady throughput**, less **throttling**, suited to high, even production load; committed for **1 or 6 months**.\n⚠️ On-demand has a **quota per model/region** → you get `ThrottlingException` beyond it; handle with **exponential backoff retries**, a quota increase, or moving to Provisioned.",
    },
    {
      eq: "What does AI Security cover in DVA-C03?",
      en: "Four areas to know:\n1. **Access control**: the app calls AI services through an **IAM role** with **least privilege** — never embed API keys in the client\n2. **Data protection**: **no PII/secrets in prompts**, use **Guardrails masking**, encrypt **in transit (TLS)** and **at rest (KMS)**\n3. **Prompt injection**: block **injected instructions** — validate input, keep the **system prompt** separate from user input, limit what the agent can do\n4. **AI agent permissions**: the agent may only call **permitted tools/APIs**, and sensitive actions need **human-in-the-loop**",
    },
    {
      eq: "What is prompt injection and how do you prevent it?",
      en: "**Prompt injection** = an attacker embeds malicious instructions in the **input** (user message, document, web page) so the model **ignores its system prompt** and does something it should not.\nPrevention:\n• **Separate** system instructions from user content; treat outside data as **untrusted**\n• **Validate and sanitise** input, cap its length\n• **Guardrails** to filter content and block topics\n• **Least privilege** on the agent's tools; never grant broad write/delete\n• **Human approval** for sensitive actions\n⚠️ There is no absolute defence — use **defence in depth**.",
    },
    {
      eq: "How do you protect sensitive data when calling an AI service?",
      en: "• **Keep secrets/PII out of prompts** — tokenise or mask before sending\n• **Bedrock Guardrails** to **detect and mask PII** on both input and output\n• **Encryption**: **TLS** for the API call, **KMS** for stored data (logs, knowledge base, S3)\n• **Do not log prompts/responses** containing sensitive data; mask if logging is required\n• **VPC Endpoint (PrivateLink)** so Bedrock calls **never traverse the public internet**\n• Check the model provider's **data retention policy**\n⚠️ This is a very likely Security-domain exam question.",
    },
    {
      eq: "What is human-in-the-loop for an AI agent?",
      en: "The agent **does not execute** risky actions itself — it **proposes** them and a person **approves** before they run.\nApplies to: **deleting data, transferring money, emailing customers, changing production infrastructure**.\nImplementation: **Step Functions** with a **wait for callback** state (`waitForTaskToken`) → a person approves through a UI or email → `SendTaskSuccess` lets the agent continue.\n→ This is the standard **control pattern** for agents, and a common troubleshooting question.",
    },
    {
      eq: "How do you control an AI agent's permissions?",
      en: "• A **separate execution role** per agent — never a shared, broad role\n• **Least privilege**: grant only the APIs/tools the agent needs\n• **Resource-based policies** and **permission boundaries** to cap the ceiling\n• **Audit** with **CloudTrail** (who called what, when) and **CloudWatch Logs**\n• **Secrets Manager** for tool credentials — never in the prompt or code\n⚠️ With **Bedrock AgentCore identity**, each agent has its own identity with permissions scoped **per session**.",
    },
  ],

  s18: [
    {
      eq: "How do you handle Lambda throttling?",
      en: "Cause: exceeding the **concurrency limit** (default **1000** per region, shared across functions).\nSymptoms: `TooManyRequestsException` (HTTP **429**), rising **Throttles** metric.\nFix:\n• **Reserved concurrency** for critical functions (caps and protects them)\n• Raise the **account limit** through support\n• **Retry** with **exponential backoff** on the client\n• Put **SQS** in front of Lambda (SQS → Lambda scales with the queue)\n⚠️ **Reserved concurrency** reduces the account's remaining concurrency — setting it on too many functions throttles everything else.",
    },
    {
      eq: "How do you optimise Lambda cold start?",
      en: "• Raise **memory** → more **CPU** → faster initialisation (memory and CPU scale together)\n• Shrink the **package** (drop unused dependencies) and use **Lambda layers** sensibly\n• Pick a **fast runtime** (Python/Node start faster than Java/.NET)\n• **Provisioned Concurrency** for functions that need stable latency\n• Create SDK clients **outside the handler**, at **global** scope\n• **SnapStart** for **Java** (and .NET) — a large cold-start reduction\n⚠️ **Provisioned Concurrency** bills **continuously**, even when idle — reserve it for functions that truly need it.",
    },
    {
      eq: "How do you choose Lambda timeout and memory?",
      en: "**Timeout**: maximum **900 seconds (15 minutes)**. Set it **shorter than the caller's** timeout (API Gateway **29s**, ALB **~60s**) to avoid confusing 502/504 errors.\n**Memory**: **128 MB – 10 240 MB**, with CPU proportional to memory. More memory runs faster and is **possibly cheaper** overall despite the higher per-GB-second price.\n**Optimise properly**: use **Lambda Power Tuning** (Step Functions) to find the best **cost/latency** point.\n⚠️ There is no “correct memory size” — measure **actual duration** in CloudWatch.",
    },
    {
      eq: "What commonly breaks when Lambda runs in a VPC?",
      en: "• **No internet**: a private subnet needs a **NAT Gateway** to reach the outside\n• **Cannot call AWS services**: needs a **VPC Endpoint** (S3 gateway endpoint, DynamoDB, interface endpoints for SQS/SNS/Secrets Manager…)\n• **ENI limits**: ENI provisioning used to slow cold starts (mitigated today by **Hyperplane ENIs**)\n• **Security group** blocking traffic\n⚠️ A Lambda in a private subnet has **no public IP** — do not expect internet access without NAT.",
    },
    {
      eq: "Which Lambda + SQS settings affect throughput?",
      en: "• **Batch size** (default 10, up to **10,000** for standard queues) and **batch window** (up to **300 seconds**)\n• The queue's **visibility timeout** must be **≥ the Lambda timeout** (otherwise messages are processed twice)\n• **Maximum concurrency** on the event source mapping (caps scaling)\n• **Partial batch response** (`ReportBatchItemFailures`) to retry only failed messages, not the whole batch\n• **DLQ / on-failure destination** for messages that fail past `maxReceiveCount`\n⚠️ A large batch plus one bad message means the **whole batch is retried** unless partial batch response is on.",
    },
    {
      eq: "How do you handle Lambda asynchronous invocation failures?",
      en: "For **asynchronous** invocation (S3 events, SNS, EventBridge):\n• **2 automatic retries** (**3 attempts** total), then the message goes to the **DLQ** or an **on-failure destination**\n• **Destinations** are preferred over DLQ: they support **SQS, SNS, S3, EventBridge, Lambda**\n• Configure **only one of the two** (DLQ **or** destination), never both\n⚠️ **Synchronous** invocation is **not** retried — the error returns to the caller, who retries.",
    },
    {
      eq: "Lambda returns 502/504 through API Gateway — how do you find the cause?",
      en: "**502 Bad Gateway**: the Lambda returned a **malformed response** (missing `statusCode`/`body` under **Lambda proxy integration**), or the function **crashed** (uncaught exception / OOM).\n**504 Gateway Timeout**: the Lambda ran **longer than 29 seconds** (the API Gateway limit) — even though Lambda allows up to 900s.\n**503**: service unavailable or throttling.\nDiagnose with the function's **CloudWatch Logs**, **API Gateway execution logs**, and an **X-Ray trace** showing time per step.\n⚠️ For long tasks, go **async** (SQS/Step Functions) instead of extending the timeout.",
    },
    {
      eq: "SQS: visibility timeout and duplicates?",
      en: "**Visibility timeout**: after a consumer receives a message it is **hidden** from other consumers for this long (default **30s**, max **12 hours**). Delete it with `DeleteMessage` when done; if the timeout lapses the message **reappears**.\nSet it **≥ the real processing time**, or you will process messages twice.\n**Duplicates** happen (SQS is **at-least-once**) → consumers need **idempotency**.\nA **receive count** above `maxReceiveCount` sends the message to the **DLQ**.\n⚠️ **FIFO** deduplicates using `MessageDeduplicationId` over a **5-minute** window.",
    },
    {
      eq: "SQS: how do long polling and batching cut cost?",
      en: "**Short polling** (default) returns immediately **even when the queue is empty** → wasted requests → **wasted money**.\n**Long polling** (`WaitTimeSeconds` up to **20s**) waits for a message → **fewer empty responses**, lower **cost** and lower latency.\n**Batching** (`MaxNumberOfMessages` up to **10**): one request fetches 10 messages → fewer **requests** (billing is per request).\n**`DeleteMessageBatch`** reduces delete requests the same way.\n⚠️ A very common cost-optimisation question in the Troubleshooting/Optimization domain.",
    },
    {
      eq: "SQS has a backlog — how do you scale?",
      en: "**CloudWatch metrics**: `ApproximateNumberOfMessagesVisible` (backlog), `ApproximateAgeOfOldestMessage` (age of the oldest message), `NumberOfMessagesReceived`.\nScale consumers: with **Lambda**, raise the event source mapping's **maximum concurrency**; with **EC2/ECS**, use **target tracking** on `ApproximateNumberOfMessagesVisible`.\n⚠️ **Do not** scale SQS consumers on **CPU** — they sit **idle waiting** on messages, so CPU stays low even with a large backlog.\nAlarm on `ApproximateAgeOfOldestMessage` to catch slow processing.",
    },
    {
      eq: "Kinesis: shards, hot shards, and how to fix them?",
      en: "Each **shard**: **1 MB/s or 1,000 records/s** in, **2 MB/s** out. Shard count sets throughput.\nA **hot shard** comes from a **skewed partition key** → one shard overloads → `ProvisionedThroughputExceededException`.\nFix:\n• Choose a **well-distributed partition key** (avoid keys with few distinct values)\n• **Reshard** (add shards) or use **enhanced fan-out**\n• In **on-demand mode**, Kinesis scales itself\n⚠️ **Kinesis Data Firehose** is different from Kinesis Data Streams — Firehose handles throughput for you, no shard management.",
    },
    {
      eq: "SNS vs SQS vs EventBridge: which one?",
      en: "**SNS**: **pub/sub fan-out** — one message to **many subscribers** (SQS, Lambda, HTTP, email). No storage.\n**SQS**: a **queue** — holds messages until a consumer processes them, **decouples** producer from consumer, has **DLQ**.\n**EventBridge**: an **event bus** — routing by **rule/content**, integrates many **SaaS and AWS services**, has a **schema registry** and **archive & replay**.\nCommon pattern: SNS → several SQS queues (**fan-out**) so each consumer works independently.\n⚠️ Complex **content filtering** → **EventBridge**. Simple fan-out → **SNS**.",
    },
    {
      eq: "How do EventBridge retries and DLQ work?",
      en: "EventBridge **retries** a failed target up to **185 times in 24 hours** with **exponential backoff** by default.\nAfter retries are exhausted the event goes to the **DLQ** (standard SQS) if configured.\n**Archive & replay**: store events (archives up to **90 days**) → **replay** them after fixing a bug.\n⚠️ The DLQ must be in the **same region** as the event bus, and needs a **resource policy** allowing EventBridge to write to SQS.\n**Idempotency**: events can be delivered **more than once** → consumers must handle duplicates safely.",
    },
    {
      eq: "DynamoDB is throttling — what do you check?",
      en: "Symptoms: `ProvisionedThroughputExceededException`, rising **ThrottledRequests**.\nCheck:\n• **Hot partition**: skewed partition key → use **CloudWatch Contributor Insights**\n• **Capacity mode**: is provisioned capacity enough, or should you move to **on-demand**?\n• **Large items** (one item costs many RCU/WCU)\n• **Scan** instead of **Query** (a scan reads the whole table)\n• A **GSI** throttling on its own even while the base table is fine\nFix: **retry with exponential backoff**, raise capacity, pick a **more evenly spread partition key**, add **DAX** for read-heavy workloads.",
    },
    {
      eq: "DynamoDB: eventual vs strongly consistent reads?",
      en: "**Eventually consistent** (default): costs **0.5 RCU** per 4 KB and may return **stale data** for a few seconds.\n**Strongly consistent** (`ConsistentRead=true`): costs **1 RCU** per 4 KB, **always correct**, but **twice the cost** and **not available on GSIs**.\n→ Use strong consistency only when you **must read the latest value** (e.g. checking a balance).\n⚠️ **GSIs** support **eventual consistency only** — a classic exam question.",
    },
    {
      eq: "Does DAX fix slow writes?",
      en: "**DAX** (DynamoDB Accelerator) is an **in-memory** cache for DynamoDB, cutting read latency from **milliseconds to microseconds**.\nIt **only speeds up reads** — it does not help writes.\n• Caches **items** (GetItem, Query, Scan) with a **TTL** (default 5 minutes)\n• **Write-through**: writes go through DAX, which updates the cache and DynamoDB\n• Unsuitable for workloads needing **strong read consistency** (DAX is eventually consistent)\n⚠️ If the question is “writes are slow”, DAX is **not** the answer — look at capacity and hot partitions.",
    },
    {
      eq: "ElastiCache: lazy loading vs write-through?",
      en: "**Lazy loading (cache-aside)**: read from the DB only on a **cache miss**, then populate the cache.\n• Pro: caches only what is **actually used**\n• Con: the first read is **slow** (miss), and data can go **stale** → needs a **TTL**\n**Write-through**: write to the **cache and the DB at the same time**.\n• Pro: the cache is **never stale**, no first-read miss\n• Con: **slower writes**, and the cache fills with data that is **never read**\n→ In practice, combine them: write-through plus a TTL to stop the cache growing without bound.",
    },
    {
      eq: "CloudFront keeps serving old content — why?",
      en: "• **TTL too long**: default **24 hours** for static content — check the origin's `Cache-Control`/`Expires`\n• **Invalidation** not run yet, or still propagating (takes **a few minutes**)\n• The **cache key** omits a header or query string you assumed it included → different variants share one cached copy\n• **Origin shield** holding the old copy\n• **Versioned filenames** are the best fix: rename the file (`app.v2.js`) instead of invalidating\n⚠️ Invalidation **costs money** after **1,000 paths/month**; prefer **versioning**.",
    },
    {
      eq: "CloudWatch: how do metrics, logs and alarms differ?",
      en: "**Metrics**: **time-series** numbers (CPU, Invocations, Throttles) kept **15 months** at **1-minute** resolution (custom metrics can be **1 second** with high resolution). They carry no detailed content.\n**Logs**: **text content** from applications and services, stored per **log group**, queried with **Logs Insights**.\n**Alarms**: watch one metric and move between **OK/ALARM/INSUFFICIENT_DATA** → notify **SNS**, trigger **Auto Scaling** or a **CodeDeploy rollback**.\n⚠️ An alarm watches a **metric**, never log content directly — for that you need a **metric filter**.",
    },
    {
      eq: "When do you use metric filters vs Logs Insights?",
      en: "**Metric filters** turn a **log pattern** into a **custom metric** (e.g. counting `ERROR` or `OutOfMemory`) → alarm on that metric.\n**Logs Insights** is a query language for **analysis** (`fields`, `filter`, `stats`, `sort`) — find errors, aggregate over time.\n**Structured logging (JSON)** makes both far more effective than free-form text logs.\n⚠️ Logs must be in the **same region**, and the default **retention is never expire** → set retention or **costs grow without limit**.",
    },
    {
      eq: "X-Ray: how do you trace a request across services?",
      en: "A **trace** is the whole request; a **segment** is one service; a **subsegment** is one call inside a service.\n• The **service map** shows which service is **slow or failing**\n• **Annotations** (indexed, used for **filtering**) vs **metadata** (not indexed) add context\n• **Sampling** controls cost (default **1 req/s + 5%**)\n• **Tracing** must be enabled on every service along the path (Lambda: `TracingConfig: Active`)\n⚠️ **X-Ray** is not **CloudWatch Logs**: X-Ray gives **distributed latency**, not detailed log lines.",
    },
    {
      eq: "Finding why an app is slow — what is the right process?",
      en: "1. **Measure first**: locate the slow step with the **X-Ray service map** — do not guess\n2. Check **p50/p99 latency** in CloudWatch (p99 is usually the real problem)\n3. Check **throttling** (DynamoDB, Lambda, API Gateway) and **concurrency**\n4. Check the **database**: slow queries (RDS Performance Insights), hot partitions (DynamoDB)\n5. Check **cold start** if it is Lambda\n6. Check **network hops**: VPC, NAT, cross-region, DNS\n→ Fix the **bottleneck you measured**, not a guessed one.",
    },
  ],
};
