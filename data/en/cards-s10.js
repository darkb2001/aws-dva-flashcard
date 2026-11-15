/**
 * English flashcards — a translation of data/s10.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s10"] = [
  {
    q: "How do CloudWatch, X-Ray and CloudTrail differ?",
    a: "- **CloudWatch**: Metrics, Logs, Events, Alarms — **monitoring**\n- **X-Ray**: troubleshoots performance and errors, **distributed tracing**\n- **CloudTrail**: **audits API calls** — who did what to which resource",
  },
  {
    q: "What are a CloudWatch Metric and Dimension?",
    a: "A **Metric** is a variable you monitor (CPUUtilization, NetworkIn…), belonging to a **namespace** (usually the service name).\nA **Dimension** is an attribute of the metric (instance id, environment…), up to **30 dimensions per metric**. Metrics carry a **timestamp**.",
  },
  {
    q: "What can EC2 standard metrics monitor, and what can they not?",
    a: "**Can**: CPU utilisation, disk performance (IOPS, read/write bytes/s), network…\n**Cannot**: **memory usage (RAM)** and **disk used percentage** → these need a **custom metric** (CloudWatch Agent).",
  },
  {
    q: "EC2 Detailed Monitoring?",
    a: "By default EC2 exports **standard metrics every 5 minutes**. Detailed monitoring → **every 1 minute**.\nUse it when you want **the ASG to scale faster**. The free tier covers **10 detailed monitoring metrics**.",
  },
  {
    q: "What are the two ways to create a custom metric?",
    a: "- **PutMetricData API** (SDK, CLI, API)\n- **CloudWatch Agent** (recommended on EC2)\n\nCustom dimensions: environment name, system name…\n**Resolution**: Standard **60s**; **High Resolution 1/5/10/30s** (more expensive).",
  },
  {
    q: "CloudWatch Logs: what are the concepts?",
    a: "- **Log Group**: a container for log data (per service/app)\n- **Log Stream**: a sequence of log events inside a log group\n- **Expiration policy**: never expire → 1 day → **10 years**\n- Can send to: **S3 (export), Kinesis Data Streams, Firehose, Lambda, OpenSearch**\n- Encrypted by default, and you can use your **own KMS key**",
  },
  {
    q: "What are the log sources for CloudWatch Logs?",
    a: "SDK, CloudWatch Logs Agent, **Unified Agent**, Elastic Beanstalk, ECS, **Lambda**, **VPC Flow Logs**, API Gateway, CloudTrail (via filter), **Route 53 (DNS queries)**.",
  },
  {
    q: "What is Logs Insights?",
    a: "Search and analyse log data with a purpose-built **query language**: auto-discover fields, filter, aggregate, sort, limit. Save queries and add them to a Dashboard. Can query **several Log Groups across accounts**.\n⚠️ It is a **query engine**, **not a real-time engine**.",
  },
  {
    q: "S3 Export vs Logs Subscriptions?",
    a: "**S3 Export**: via **CreateExportTask**; data can take up to **12 hours** to become available → **not** near-real-time.\n**Logs Subscriptions**: **real-time**, sent to **Kinesis Data Streams / Firehose / Lambda** using a **Subscription Filter**. Supports **cross-account**.",
  },
  {
    q: "Does EC2 send logs to CloudWatch by default?",
    a: "**No**. You must run the **CloudWatch agent** on the EC2 instance to push logs, and it needs the right **IAM permissions**. The agent can also be installed **on-premises**.",
  },
  {
    q: "What does the CloudWatch Unified Agent collect?",
    a: "It collects **custom metrics & logs** from EC2/on-premises:\n**CPU** (active, guest, idle, system, user, steal), **Disk** (free/used/total, writes/reads/bytes/iops), **RAM** (free, inactive, used, total, cached), **Netstat** (TCP/UDP connections, packets, bytes), **Processes**, **Swap Space**.\nRequirements: the **CloudWatchAgentServerPolicy** IAM policy, connectivity (internet/VPC endpoint), and a **valid config file**.",
  },
  {
    q: "What is a Metric Filter?",
    a: "Uses a **filter expression** on logs (find an IP, count “ERROR”) → can **trigger an alarm**.\n⚠️ Filters **are not retroactive** — data points are only published for events **after the filter is created**. Up to **3 Dimensions**.",
  },
  {
    q: "CloudWatch Alarms: states & targets?",
    a: "**States**: **OK**, **INSUFFICIENT_DATA**, **ALARM**.\n**Targets**: stop/terminate/reboot/**recover EC2**, an **Auto Scaling action**, an **SNS notification**.\nHigh-resolution custom metrics: **10s, 30s**, or multiples of 60s.",
  },
  {
    q: "What are Composite Alarms?",
    a: "They monitor the **state of several other alarms** with **AND/OR** conditions. They help **reduce alarm noise**.",
  },
  {
    q: "What is EC2 Instance Recovery?",
    a: "A CloudWatch alarm with the **Recovery** action restores the EC2 instance.\n- **Instance status check**: checks the EC2 VM\n- **System status check**: checks the underlying hardware\n- Recovery keeps the **same Private/Public/Elastic IP, metadata and placement group**",
  },
  {
    q: "How do you test an alarm from the CLI?",
    a: "```\naws cloudwatch set-alarm-state --alarm-name \"myalarm\" \\\n  --state-value ALARM --state-reason \"testing purposes\"\n```",
  },
  {
    q: "What is a CloudWatch Synthetics Canary?",
    a: "A configurable script that monitors **APIs, URLs and Websites**. It reproduces customer behaviour to **find problems before customers do**.\n- Checks availability & latency, records load time, **takes UI screenshots**\n- Integrates with CloudWatch Alarms\n- Written in **Node.js** or **Python**\n- Headless **Google Chrome**\n- Runs once or on a schedule",
  },
  {
    q: "How does Amazon EventBridge (CloudWatch Events) work?",
    a: "- **Schedule**: cron jobs / scheduled scripts\n- **Event Pattern**: a rule that reacts when a service does something → trigger **Lambda**, send to **SQS/SNS**\n- An event bus can be reached from another account via a **resource-based policy**\n- **Archive** events (all/filtered) and **Replay** them",
  },
  {
    q: "What is Schema Registry?",
    a: "EventBridge **analyses events**, **infers the schema**, and lets you **generate code** that already knows the data structure. Schemas are **versioned**.",
  },
  {
    q: "What is X-Ray for?",
    a: "It **traces and analyses** requests as they travel through the application. It visualises the request flow, finds **bottlenecks**, and troubleshoots performance in **distributed** apps.\nBenefits: understand microservice dependencies, pinpoint service issues, find errors/exceptions, check SLAs, spot throttling, identify affected users.",
  },
  {
    q: "What does X-Ray work with?",
    a: "**Lambda, Elastic Beanstalk, ECS, ELB, API Gateway, EC2 instances / app servers (including on-premises).**",
  },
  {
    q: "Segments, subsegments, traces, annotations?",
    a: "- **Segments**: sent by each app/service\n- **Subsegments**: finer detail inside a segment\n- **Trace**: segments collected into an end-to-end trace\n- **Sampling**: reduces requests sent to X-Ray, cutting cost\n- **Annotations**: **indexed** key-values, used for filtering\n- **Metadata**: **non-indexed** key-values, not searchable",
  },
  {
    q: "What are the two steps to enable X-Ray?",
    a: "1. **Import the AWS X-Ray SDK in code** (Java, Python, Go, Node.js, .NET) → it automatically captures AWS calls, HTTP/HTTPS, DB calls and SQS calls\n2. **Install the X-Ray daemon**, or enable the AWS integration (Lambda has it built in). The daemon is a **UDP packet interceptor** (Linux/Windows/Mac).\n\nEvery app needs **IAM rights** to write to X-Ray.",
  },
  {
    q: "How do you troubleshoot X-Ray on EC2?",
    a: "1. Does the EC2 IAM Role have the **proper permissions**?\n2. Is the **X-Ray Daemon** running on the instance?\n\nWith **Lambda**: the IAM execution role needs **AWSXRayWriteOnlyAccess**, the code must import the X-Ray SDK, and **Active Tracing** must be enabled.",
  },
  {
    q: "What are the default Sampling Rules?",
    a: "The X-Ray SDK records **the first request each second** (the reservoir) plus **5%** of the remaining requests by default.\nYou can create **custom sampling rules** (reservoir & rate) **without changing code**.",
  },
  {
    q: "Which X-Ray Write APIs does the daemon use?",
    a: "- **PutTraceSegments**: upload segment documents\n- **PutTelemetryRecords**: upload telemetry (SegmentsReceivedCount, SegmentsRejectedCounts, BackendConnectionErrors)\n- **GetSamplingRules**: fetch sampling rules\n- **GetSamplingTargets / GetSamplingStatisticSummaries**: advanced\n\nThe daemon needs an IAM policy covering those API calls.",
  },
  {
    q: "What are the X-Ray Read APIs?",
    a: "- **GetServiceGraph**: the main graph\n- **BatchGetTraces**: fetch traces by ID\n- **GetTraceSummaries**: get IDs + annotations in a time frame, with filters\n- **GetTraceGraph**: the service graph for specific traces",
  },
  {
    q: "X-Ray with Elastic Beanstalk and ECS?",
    a: "**Beanstalk**: the platform ships an X-Ray daemon → run it via a console option or `.ebextensions/xray-daemon.config`; the **instance profile** needs the right IAM; code must be instrumented.\n⚠️ The daemon is **not available** for **Multicontainer Docker**.\n**ECS**: you must set up the X-Ray daemon as a sidecar container.",
  },
  {
    q: "What is the AWS Distro for OpenTelemetry (ADOT)?",
    a: "A **production-ready** distro of **OpenTelemetry** supported by AWS: a set of APIs/libraries/agents/collector.\n- Collects **distributed traces & metrics**\n- **Auto-instrumentation** with no code changes\n- Sends to **many** destinations: X-Ray, CloudWatch, Prometheus…\n- Runs on EC2, ECS, EKS, Fargate, Lambda and on-premises\n- Use it when you want to **standardise on open-source APIs** or send to several places at once",
  },
  {
    q: "What is CloudTrail?",
    a: "**Governance, compliance & audit** for the AWS account. **Enabled by default**.\nIt records the history of **events/API calls** from the **Console, SDK, CLI and AWS Services**.\nLogs can go to **CloudWatch Logs or S3**. A trail can cover **All Regions** (default) or one region.\n👉 **Resource deleted → investigate CloudTrail first.**",
  },
  {
    q: "Management Events vs Data Events?",
    a: "**Management Events**: operations on resources — security config (AttachRolePolicy), routing (CreateSubnet), logging (CreateTrail). **Logged by default**. Split into **Read** (non-mutating) and **Write** (mutating).\n**Data Events**: **NOT logged by default** (high volume) — S3 object-level (GetObject, PutObject, DeleteObject), **Lambda Invoke**.",
  },
  {
    q: "What is CloudTrail Insights?",
    a: "It detects **unusual activity**: misprovisioning, hitting service limits, **bursts of IAM actions**, gaps in maintenance.\nIt analyses management events to build a **baseline**, then analyses **write events** for anomalies.\nAnomalies appear in the console, events are sent to **S3**, and an **EventBridge event** is generated.",
  },
  {
    q: "How long does CloudTrail retain events?",
    a: "**90 days** in CloudTrail. To keep them longer → log to **S3** and query with **Athena**.",
  },
];
