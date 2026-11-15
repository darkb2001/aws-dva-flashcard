/**
 * English flashcards — a translation of data/s11.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s11"] = [
  {
    q: "What does serverless mean?",
    a: "A paradigm where the developer **manages no servers** — you only deploy **code/functions** (FaaS).\nIt also covers managed “database, messaging, storage”.\n👉 It does not mean **there is no server** — it means **you do not provision or see** them.",
  },
  {
    q: "What are the main serverless services in AWS?",
    a: "**Lambda, DynamoDB, Cognito, API Gateway, S3, SNS & SQS, Kinesis Data Firehose, Aurora Serverless, Step Functions, Fargate.**",
  },
  {
    q: "How does Lambda differ from EC2?",
    a: "**EC2**: a virtual server limited by RAM & CPU, **runs continuously**, and scaling needs intervention.\n**Lambda**: a virtual **function**, **no server**, limited **execution time** (short runs), **run on demand**, **automatic scaling**.",
  },
  {
    q: "What are Lambda's benefits and pricing?",
    a: "- **Pay per request + compute time**\n- Free tier: **1,000,000 requests** + **400,000 GB-seconds** per month\n- Integrates with the whole of AWS, many languages, monitored through CloudWatch\n- **More RAM = more CPU & network** (up to **10 GB**)",
  },
  {
    q: "Which languages does Lambda support?",
    a: "**Node.js, Python, Java, C#/.NET Core & Powershell, Ruby**, and the **Custom Runtime API** (Rust, Golang via the community).\nA **Lambda Container Image** must implement the **Lambda Runtime API** — for arbitrary Docker, use **ECS/Fargate** instead.",
  },
  {
    q: "Lambda pricing in detail?",
    a: "**Per call**: the first 1M are **free**, then **$0.20 per 1M requests**.\n**Per duration** (measured in **ms**): **400,000 GB-seconds** per month free = 400,000s at 1GB RAM = **3,200,000s** at 128MB. After that, **$1.00 / 600,000 GB-seconds**.",
  },
  {
    q: "Synchronous invocation: which services, and how are errors handled?",
    a: "**CLI, SDK, API Gateway, ALB** → the result is returned immediately.\n**Error handling must happen in the client** (retries, exponential backoff).\nServices: ELB(ALB), API Gateway, **CloudFront (Lambda@Edge)**, S3 Batch, Cognito, Step Functions, **Lex, Alexa, Kinesis Data Firehose**.",
  },
  {
    q: "Asynchronous invocation: retries & DLQ?",
    a: "**S3, SNS, CloudWatch Events/EventBridge…** → the event goes into an **Event Queue**.\n- Retries **3 times**: **1 minute** after the first failure, then **2 minutes**\n- It **must be idempotent**\n- Duplicate log entries in CloudWatch\n- You can set a **DLQ (SNS or SQS)** for failures (needs the right IAM)",
  },
  {
    q: "What is an S3 Event Notification gotcha?",
    a: "If two writes hit the **same non-versioned object** concurrently, only **one event** may be sent.\n👉 To guarantee an event for **every successful write** → enable **versioning** on the bucket.",
  },
  {
    q: "What is an Event Source Mapping?",
    a: "Used for: **Kinesis Data Streams, SQS & SQS FIFO, DynamoDB Streams**.\nIn common: Lambda **must poll** records from the source. It is invoked **synchronously** (Lambda uses its execution role to read).",
  },
  {
    q: "Event Object and Context Object?",
    a: "**Event**: a JSON document with the data to process and info from the invoking service; the runtime converts it to an object (a dict in Python).\n**Context**: methods/properties about the invocation, function and runtime — `aws_request_id`, `function_name`, `memory_limit_in_mb`…",
  },
  {
    q: "What are Lambda Destinations?",
    a: "Since 2019 you can configure where **results** are sent.\n**Async invocation**: a destination for **success** & **failure** — **SQS, SNS, Lambda, EventBridge bus**.\n👉 AWS recommends **Destinations over DLQ** (you can use both).\n**Event Source Mapping**: a destination for **discarded batches** (SQS, SNS).",
  },
  {
    q: "Lambda Execution Role: which managed policies matter?",
    a: "- **AWSLambdaBasicExecutionRole**: logs → CloudWatch\n- **AWSLambdaKinesisExecutionRole**: read Kinesis\n- **AWSLambdaDynamoDBExecutionRole**: read DynamoDB Streams\n- **AWSLambdaSQSQueueExecutionRole**: read SQS\n- **AWSLambdaVPCAccessExecutionRole**: deploy inside a VPC\n- **AWSXRayDaemonWriteAccess**: send traces to X-Ray\n\nBest practice: **1 execution role per function**.",
  },
  {
    q: "What is a Lambda Resource-based Policy?",
    a: "It gives **another account** and **AWS services** permission to use the Lambda resource (much like an S3 bucket policy).\nAn IAM principal can access it if **the principal's IAM policy** allows it **OR** the **resource-based policy** allows it.\nWhen S3 invokes Lambda → the resource-based policy grants the permission.",
  },
  {
    q: "Environment variables in Lambda?",
    a: "String key/value pairs that change behaviour **without updating code** and are available to the code. Lambda also adds **system env vars**.\nUseful for secrets — encrypted with **KMS** (the Lambda service key or your own CMK). Limit: **4 KB**.",
  },
  {
    q: "Lambda Logging & Metrics?",
    a: "**Logs** → CloudWatch Logs (the execution role needs permission).\n**Metrics**: **Invocations**, **Durations**, **Concurrent Executions**, **Error count**, **Success Rates**, **Throttles**, **Async Delivery Failures**, **Iterator Age** (Kinesis & DynamoDB Streams).",
  },
  {
    q: "Lambda tracing with X-Ray: which env vars?",
    a: "- **`_X_AMZN_TRACE_ID`**: the tracing header\n- **`AWS_XRAY_CONTEXT_MISSING`**: default **LOG_ERROR**\n- **`AWS_XRAY_DAEMON_ADDRESS`**: the daemon's IP:PORT\n\nEnable **Active Tracing**, use the X-Ray SDK, and attach the **AWSXRayDaemonWriteAccess** IAM policy.",
  },
  {
    q: "How are Lambda RAM and CPU related?",
    a: "RAM goes from **128 MB → 10 GB** (1 MB steps). More RAM means more vCPU.\n- **1,792 MB** ≈ **1 full vCPU**\n- Above 1,792 MB you have >1 CPU → **you must use multi-threading** to benefit (up to **6 vCPU**).\nA **CPU-bound** app → increase RAM.",
  },
  {
    q: "Lambda Timeout?",
    a: "Default **3 seconds**, max **900 seconds (15 minutes)**.",
  },
  {
    q: "What is the Lambda Execution Context?",
    a: "A temporary runtime environment that initialises external dependencies (DB connections, HTTP clients, SDK clients).\nIt is kept around for a while → later invocations can **re-use** it → saving init time.\nIt includes the **/tmp** directory.\n👉 Best practice: **initialise outside the handler**.",
  },
  {
    q: "Lambda /tmp space?",
    a: "Use it when you need to **download large files** or need **disk space**. Max **10 GB**.\nContents survive while the execution context is **frozen** → a transient cache (checkpoint).\nTo persist permanently → use **S3**. Encrypting /tmp → Lambda creates a **KMS Data Key** automatically.",
  },
  {
    q: "What are Lambda Layers for?",
    a: "**Custom Runtimes** (C++, Rust) and **externalising dependencies** so they can be re-used across many functions.",
  },
  {
    q: "Can Lambda mount EFS?",
    a: "Yes — but the function must **run inside a VPC**, EFS is mounted to a local dir at **initialization**, and you must use **EFS Access Points**.\n⚠️ Watch the **EFS connection limits** (1 function instance = 1 connection) and the **connection burst limits**.",
  },
  {
    q: "Lambda Concurrency & Throttling?",
    a: "- Concurrency limit: **1,000** concurrent executions per region\n- Set **reserved concurrency** at the function level (= a limit)\n- Exceeding the limit → **Throttle**:\n  - **Sync** → returns **ThrottleError 429**\n  - **Async** → **automatic retry**, then to the DLQ\n- Need more → open a support ticket",
  },
  {
    q: "Concurrency with asynchronous invocation?",
    a: "Without enough concurrency the request is **throttled**.\nOn **429** and **500-series** errors, Lambda **returns the event to the queue** and retries for up to **6 hours**.\nThe retry interval grows **exponentially** from **1 second** to a max of **5 minutes**.",
  },
  {
    q: "Cold Start & Provisioned Concurrency?",
    a: "**Cold start**: a new instance must load the code and run the init outside the handler → **high latency** on the first request (bigger init is slower).\n**Provisioned Concurrency**: concurrency is allocated **before invocation** → **no cold start**, low latency. Application Auto Scaling can manage it (schedule/target).\n(Cold starts inside a VPC have dropped sharply since 2019.)",
  },
  {
    q: "How do you deploy dependencies with Lambda?",
    a: "Install the packages **alongside the code** and zip them:\n- Node.js: `npm` + `node_modules`\n- Python: `pip --target`\n- Java: the `.jar` file\n\nA zip **< 50 MB** → upload directly; larger → **to S3 first**. **Native libraries must be compiled on Amazon Linux**. The **AWS SDK is already available** in every function.",
  },
  {
    q: "Lambda + CloudFormation: inline vs S3?",
    a: "**Inline**: uses `Code.ZipFile`, very simple, but **cannot include dependencies**.\n**S3**: specify `S3Bucket`, `S3Key`, `S3ObjectVersion`.\n⚠️ If the code in S3 changes but S3Bucket/S3Key/S3ObjectVersion do **not**, CloudFormation **will not update** the function.",
  },
  {
    q: "Lambda Container Images?",
    a: "Deploy Lambda as a **container image up to 10 GB from ECR**. Lets you package complex/large dependencies.\nBase images available: **Python, Node.js, Java, .NET, Go, Ruby**. A custom image must implement the **Lambda Runtime API**.\nTest locally with the **Lambda Runtime Interface Emulator**.",
  },
  {
    q: "What is a Lambda Function URL?",
    a: "A dedicated HTTP(S) endpoint for the function: `https://<url-id>.lambda-url.<region>.on.aws` (dual-stack IPv4 & IPv6).\n- Callable from a browser, curl, Postman\n- **Public Internet only** — **no PrivateLink support**\n- Supports **resource-based policies** & **CORS**\n- Applies to an **alias** or **$LATEST** (not other versions)\n- Throttled by **Reserved Concurrency**",
  },
  {
    q: "Function URL AuthType NONE vs AWS_IAM?",
    a: "**NONE**: public, **unauthenticated** — a resource policy **always** applies (you must grant public access).\n**AWS_IAM**: uses IAM auth — needs **`lambda:InvokeFunctionUrl`**.\n- **Same account**: identity-based **OR** resource-based ALLOW\n- **Cross account**: identity-based **AND** resource-based ALLOW",
  },
  {
    q: "Lambda Function URL: public Internet or private?",
    a: "**Public Internet only** — **no PrivateLink support** (regular Lambda functions do support it).",
  },
  {
    q: "CloudFront Functions vs Lambda@Edge: the core difference?",
    a: "**CloudFront Functions**: JavaScript, **sub-ms startup**, **millions of req/s**, only **Viewer Request/Response**, native to CloudFront.\n**Lambda@Edge**: **Node.js or Python**, **1,000 req/s**, all **4 hooks** (Viewer Request, Origin Request, Origin Response, Viewer Response), authored in **us-east-1** and replicated by CloudFront.",
  },
  {
    q: "Which use cases call for CloudFront Functions?",
    a: "- **Cache key normalization** (transform headers, cookies, query strings, URL)\n- **Header manipulation** (insert/modify/delete)\n- **URL rewrites / redirects**\n- **Request authentication & authorization** (create/validate a JWT)",
  },
  {
    q: "Which use cases require Lambda@Edge?",
    a: "- **Longer execution time** (several ms+), with tunable CPU/memory\n- Code needs **third-party libraries** (the AWS SDK to call other services)\n- **Network access** to external services\n- **File system access** or **access to the HTTP request body**",
  },
  {
    q: "Where does Lambda run by default?",
    a: "**Outside your VPC** (in a VPC owned by AWS) → it **cannot reach** resources inside your VPC (RDS, ElastiCache, internal ELB).",
  },
  {
    q: "Lambda inside a VPC: what is needed, and is there internet?",
    a: "You must declare the **VPC ID, Subnets, Security Groups**; Lambda creates an **ENI** in the subnet; it needs **AWSLambdaVPCAccessExecutionRole**.\n- **No internet access** by default\n- A public subnet does **not** give internet or a public IP\n- **Private subnet + NAT Gateway** → internet\n- **VPC endpoints** → reach AWS services **without NAT**\n- CloudWatch Logs **still works**",
  },
  {
    q: "Lambda Versions?",
    a: "You work on **`$LATEST`**; publishing creates a **version**.\n- Versions are **immutable**, numbered incrementally, and have their **own ARN**\n- A version is **code + configuration** (it cannot be changed)",
  },
  {
    q: "Lambda Aliases?",
    a: "- They are **pointers** to a version (`dev`, `test`, `prod`)\n- **Mutable**, with their **own ARN**\n- Enable **canary deployment** by assigning **weights**\n- Keep **stable configuration** for event triggers/destinations\n- ⚠️ An alias **cannot point at another alias**",
  },
  {
    q: "Lambda + CodeDeploy: which deployment types?",
    a: "- **Linear**: `Linear10PercentEvery3Minutes`, `Linear10PercentEvery10Minutes`\n- **Canary**: `Canary10Percent5Minutes`, `Canary10Percent30Minutes`\n- **AllAtOnce**\n\nThere are **pre & post traffic hooks** for health checks.",
  },
  {
    q: "What does AppSpec.yml need for Lambda?",
    a: "**Name** (the function), **Alias**, **CurrentVersion**, **TargetVersion**.",
  },
  {
    q: "Important Lambda limits (per region)?",
    a: "**Execution**: RAM 128 MB–10 GB (1 MB steps), timeout **900s**, env vars **4 KB**, /tmp **512 MB–10 GB**, concurrency **1,000**.\n**Deployment**: zip **50 MB** (compressed), **250 MB** uncompressed (code + deps), env vars **4 KB**.",
  },
  {
    q: "Lambda Best Practices?",
    a: "- Do heavy work **outside the handler** (DB connections, SDK init, loading dependencies)\n- Use **environment variables** for connection strings, buckets… (never hardcode)\n- Encrypt secrets with **KMS**\n- **Shrink the deployment package**, use **Layers**\n- **Do not** write recursive code — **never** let a Lambda invoke itself",
  },
  {
    q: "Lambda + CodeGuru Profiling?",
    a: "It gives insight into **runtime performance**. CodeGuru creates a **Profiler Group** for the function, supports **Java & Python**, and is enabled from the Lambda Console.\nWhen enabled, Lambda adds: the **CodeGuru Profiler layer**, environment variables, and the **AmazonCodeGuruProfilerAgentAccess** policy.",
  },
];
