/**
 * English flashcards — a translation of data/s07.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s07"] = [
  {
    q: "What is CloudFront?",
    a: "A **Content Delivery Network (CDN)** — it caches content at the **edge** to improve read performance and the user experience.\n**600+ PoPs** worldwide, protects against **DDoS** (through distribution), and integrates with **Shield** & **AWS WAF**.",
  },
  {
    q: "What are the two types of CloudFront Origin?",
    a: "**S3 bucket**: distributes files, caches at the edge, secured with **OAC** (which replaces OAI), and also usable as an **ingress** for uploading to S3.\n**Custom Origin (HTTP)**: ALB, EC2, an **S3 website** (static website hosting must be enabled), any HTTP backend.",
  },
  {
    q: "What are Origin Groups for?",
    a: "They increase **high availability** and enable failover: one **primary** and one **secondary** origin. If the primary fails → the secondary is used.",
  },
  {
    q: "CloudFront vs S3 Cross Region Replication?",
    a: "**CloudFront**: a global edge network, files cached per **TTL** (potentially a day) → good for **static content** that must be available everywhere.\n**S3 CRR**: must be set up **per region**, updates are **near real-time**, and it is **read only** → good for **dynamic content** in a few regions.",
  },
  {
    q: "What does the default CloudFront Cache Key contain?",
    a: "**Hostname + the resource portion of the URL**. You can add **HTTP headers, cookies, query strings** via **Cache Policies** (when content varies by user/device/language/location).\nGoal: **maximise the cache hit ratio**.",
  },
  {
    q: "What is Cache Invalidation?",
    a: "When the origin changes, CloudFront only refreshes once the **TTL expires**. Invalidation **forces a full or partial refresh** (bypassing the TTL) — `/*` or `/images/*`.",
  },
  {
    q: "How do Cache Behaviors work?",
    a: "Configured per **URL path pattern** (`/images/*`, `/api/*`, `/*`).\nDifferent content types route to different origins or origin groups.\n**The default Cache Behavior `/*` is always evaluated LAST.**",
  },
  {
    q: "CloudFront VPC Origins?",
    a: "Distributes content from an app in a **private subnet** of a VPC **without exposing it to the Internet**.\nSupports private **ALB**, **NLB** and **EC2 instances**.",
  },
  {
    q: "What is Geo Restriction?",
    a: "Limits who can access the distribution:\n- **Allowlist**: only the listed countries\n- **Blocklist**: block the listed countries\n\nThe country is determined by a **third-party Geo-IP database**. Use case: copyright law.",
  },
  {
    q: "Signed URL vs Signed Cookies?",
    a: "Distributing **paid/premium content**. The policy contains: **expiration**, **IP ranges**, **trusted signers**.\n- **Signed URL**: access **one file**\n- **Signed Cookies**: access **many files**\n\nLifetime: shared content (films, music) is **short**; private content **can be years**.",
  },
  {
    q: "What is Field Level Encryption?",
    a: "Protects **sensitive information** across the whole application stack.\n- An extra security layer alongside HTTPS\n- Encrypts at the **edge closest to the user**\n- Uses **asymmetric encryption**\n- You specify up to **10 fields** in the POST request plus a public key",
  },
  {
    q: "What are CloudFront Real Time Logs?",
    a: "Sends requests in real time to **Kinesis Data Streams**. You choose the **sampling rate**, **specific fields**, and **cache behaviors** (path patterns).",
  },
  {
    q: "What are the three CloudFront Price Classes?",
    a: "1. **Price Class All**: every region — best performance\n2. **Price Class 200**: most regions, excluding the **most expensive** ones\n3. **Price Class 100**: **only the cheapest** regions\n\nUsed to reduce the number of edge locations → lower cost.",
  },
  {
    q: "What problems do developers face deploying on AWS?",
    a: "Managing infrastructure, deploying code, configuring the DB/LB, scaling concerns. Most web apps end up with an **ALB + ASG** architecture. Developers just want their **code to run**.",
  },
  {
    q: "What is Elastic Beanstalk?",
    a: "A **developer-centric view** of deploying an app on AWS, reusing **EC2, ASG, ELB, RDS**.\nA managed service: it handles **capacity provisioning, load balancing, scaling, health monitoring, instance configuration**.\nDevelopers only own the **application code**. **Beanstalk is free** — you pay for the underlying resources.",
  },
  {
    q: "What are the Elastic Beanstalk components?",
    a: "- **Application**: a collection of components (environments, versions, configs)\n- **Application Version**: one iteration of the code\n- **Environment**: the set of resources running one app version (only **one version at a time**), with a **Web Server Tier** & **Worker Environment Tier**, and you can create several (dev/test/prod)",
  },
  {
    q: "Which platforms does Elastic Beanstalk support?",
    a: "Go, Java SE, Java with Tomcat, .NET Core on Linux, .NET on Windows Server, **Node.js**, PHP, Python, Ruby, Packer Builder, **Single/Multi-container Docker**, Preconfigured Docker.",
  },
  {
    q: "What are the five Beanstalk deployment modes?",
    a: "1. **All at once**: fastest, **has downtime**, no extra cost\n2. **Rolling**: updates in batches, runs below capacity, no extra cost, slow\n3. **Rolling with additional batches**: runs at full capacity, small extra cost, slower, good for prod\n4. **Immutable**: zero downtime, temporary ASG, **double capacity**, slowest, fast rollback\n5. **Blue/Green**: create a new environment, swap the URL\n6. **Traffic Splitting**: canary, a small % of traffic, automatic rollback",
  },
  {
    q: "What are the pros and cons of Immutable deployment?",
    a: "**Pros**: zero downtime, fast rollback (just terminate the new ASG), good for prod.\n**Cons**: **high cost** (double capacity) and the **slowest** deployment.",
  },
  {
    q: "What is Blue/Green deployment in Beanstalk?",
    a: "It is **not** a direct Beanstalk feature. Create a **new environment** (“green”), deploy v2, validate it independently, then **swap the URLs** (or use Route 53 weighted records to shift traffic gradually).",
  },
  {
    q: "What is Traffic Splitting?",
    a: "**Canary testing**: deploy the new version to a **temporary ASG of the same capacity** and send a **small % of traffic** for a configured period.\nHealth is monitored; **failure → very fast automatic rollback**. **Zero downtime**.",
  },
  {
    q: "Which EB CLI commands matter?",
    a: "`eb create`, `eb status`, `eb health`, `eb events`, `eb logs`, `eb open`, `eb deploy`, `eb config`, `eb terminate`.",
  },
  {
    q: "What is the Beanstalk deployment process?",
    a: "1. Declare dependencies (`requirements.txt`, `package.json`)\n2. **Package the code into a zip** along with dependencies\n3. Upload the zip (console/CLI) → creates an **app version** → deploy\n4. Beanstalk deploys the zip to each EC2 instance, resolves dependencies and starts the app",
  },
  {
    q: "What is the Beanstalk Lifecycle Policy?",
    a: "It stores at most **1000 app versions** — without cleanup you eventually **cannot deploy at all**.\nThe policy is time-based or storage-based.\nThe **version currently in use is never deleted**. There is an option to keep the source bundle in S3.",
  },
  {
    q: "What is `.ebextensions`?",
    a: "A `.ebextensions/` folder in the **root of the source code**, containing **YAML/JSON** files ending in `.config`.\n- `option_settings` to change default settings\n- Add resources (RDS, ElastiCache, DynamoDB…)\n- ⚠️ Resources created by .ebextensions **are deleted when the environment goes away**",
  },
  {
    q: "What does Beanstalk run on underneath?",
    a: "**AWS CloudFormation** — used to provision the other services. You can define CloudFormation resources inside `.ebextensions`.",
  },
  {
    q: "What is Clone environment?",
    a: "Clones an environment with the **same configuration** — useful for creating a test environment.\nIt keeps: LB type/config, RDS type (**data is NOT kept**), environment variables. Settings can be changed after cloning.",
  },
  {
    q: "How do you change the Beanstalk Load Balancer type?",
    a: "It **cannot be changed directly** once the environment is created. You must:\n1. Create a new environment with the same config **except the LB** (cloning will not work)\n2. Deploy the app to the new environment\n3. Do a **CNAME swap** or update **Route 53**",
  },
  {
    q: "RDS with Beanstalk: what should you do for production?",
    a: "Creating RDS together with Beanstalk is fine for **dev/test** but **bad for prod**, because the **DB lifecycle is tied to the environment lifecycle**.\nIn prod: create **RDS separately** and pass the **connection string** to the app.",
  },
  {
    q: "What is the process for decoupling RDS from Beanstalk?",
    a: "1. Snapshot RDS (as insurance)\n2. In the RDS console: **protect from deletion**\n3. Create a new Beanstalk environment **without RDS**, pointing at the existing RDS\n4. **CNAME swap / Route 53** update, then confirm it works\n5. Terminate the old environment (RDS is not deleted)\n6. Delete the **CloudFormation stack** (left in DELETE_FAILED)",
  },
];
