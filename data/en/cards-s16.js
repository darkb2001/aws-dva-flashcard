/**
 * English flashcards — a translation of data/s16.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s16"] = [
  {
    q: "What is AWS STS?",
    a: "**Security Token Service** — issues **limited and temporary** access (up to **1 hour**).\nAPIs: **AssumeRole** (same/cross account), **AssumeRoleWithSAML**, **AssumeRoleWithWebIdentity**, **GetSessionToken** (MFA), **GetFederationToken**, **GetCallerIdentity**, **DecodeAuthorizationMessage**.",
  },
  {
    q: "What is AssumeRole for?",
    a: "1. Define an **IAM Role** in an account or cross-account\n2. Define the **principal** allowed to access the role\n3. Use **STS AssumeRole** to obtain credentials and **impersonate** the role\n\nTemporary credentials are valid for **15 minutes → 1 hour**.",
  },
  {
    q: "STS with MFA: which API, and what IAM condition?",
    a: "Use **GetSessionToken**. The IAM policy needs the **`aws:MultiFactorAuthPresent: true`** condition.\nGetSessionToken returns: **Access ID, Secret Key, Session Token, Expiration date**.",
  },
  {
    q: "AssumeRoleWithWebIdentity and AWS's recommendation?",
    a: "It returns credentials to a user who logged in through an **IdP** (Facebook, Google, OIDC).\n👉 AWS **recommends NOT using** this API — **use Cognito Identity Pools** instead.",
  },
  {
    q: "IAM Best Practices (general & service)?",
    a: "- **Do not use root**, and enable MFA for root\n- **Least privilege**, never grant `*`\n- Monitor API calls in **CloudTrail**, especially **Denied**\n- **Do not store IAM keys** anywhere other than a personal/on-premises machine; on-premises should call **STS** for temporary credentials\n- **A separate service role for each service**: EC2, Lambda, ECS Task, CodeBuild — **1 role per application/function**, never reuse",
  },
  {
    q: "IAM Policies and S3 Bucket Policies: how do they combine?",
    a: "An IAM policy attaches to **users/roles/groups**; an S3 Bucket policy attaches to the **bucket**.\nWhen evaluated, the **union** of both is considered:\n- Role RW, no bucket policy → **allowed**\n- Role RW + bucket **explicit deny** → **not allowed**\n- Role with no permission + bucket **explicit allow** → **allowed**\n- Role **explicit deny** + bucket explicit allow → **not allowed**",
  },
  {
    q: "Dynamic policies with IAM and the /home/<user> problem?",
    a: "Create **one policy** using the **policy variable** `${aws:username}` instead of a policy per user (`/home/georges`, `/home/sarah`…).",
  },
  {
    q: "AWS Managed vs Customer Managed vs Inline policy?",
    a: "- **AWS Managed**: maintained by AWS, good for power users/admins, updated as new services/APIs appear\n- **Customer Managed**: **best practice**, reusable, version control + rollback, central change management\n- **Inline**: a tight **1-1** relationship between policy & principal, **deleted when the principal is deleted**",
  },
  {
    q: "AWS Directory Services: the three options?",
    a: "- **AWS Managed Microsoft AD**: creates AD in AWS, manages local users, supports **MFA** and a **trust** with on-premises AD\n- **AD Connector**: a **proxy/gateway** to on-premises AD, supports MFA, users are managed on-premises\n- **Simple AD**: AD-compatible on AWS, but **CANNOT** join with on-premises AD",
  },
  {
    q: "What are the three kinds of encryption?",
    a: "- **In flight (TLS/SSL)**: encrypted before sending, decrypted on receipt (HTTPS) — protects against **MITM**\n- **Server-side at rest**: the server encrypts on receipt and decrypts before sending; stored encrypted with a **data key**\n- **Client-side**: the client encrypts, **the server cannot decrypt**, using **envelope encryption**",
  },
  {
    q: "What is AWS KMS?",
    a: "**Key Management Service** — whenever you hear “encryption” in AWS, it is almost certainly KMS.\n- **AWS manages the keys** for you, integrated with **IAM**, audited via **CloudTrail**\n- Built into EBS, S3, RDS, SSM…\n- Usable through **API calls** (SDK, CLI)\n- 👉 **Never** store secrets as plaintext in code",
  },
  {
    q: "Symmetric vs Asymmetric KMS key?",
    a: "**Symmetric** (AES-256): **one key** both encrypts and decrypts — AWS services use this, and you **can never retrieve the key unencrypted**.\n**Asymmetric** (RSA & ECC): **public (encrypt) + private (decrypt)**, used to encrypt/decrypt or to **sign/verify**. The public key is **downloadable**; the private key cannot be retrieved unencrypted. Used for users **outside AWS** who cannot call the KMS API.",
  },
  {
    q: "What kinds of KMS key exist, and what do they cost?",
    a: "- **AWS Owned Keys** (free): SSE-S3, SSE-SQS, SSE-DDB\n- **AWS Managed Key** (free): `aws/rds`, `aws/ebs`\n- **Customer managed key** created in KMS: **$1/month**\n- **Customer managed key imported** (must be **symmetric**): **$1/month**\n- **+ $0.03 per 10,000 API calls**",
  },
  {
    q: "Default key rotation per key type?",
    a: "- **AWS-managed**: automatically **every year**\n- **Customer-managed**: automatically **every year** (**you must enable it**)\n- **Imported**: **manual rotation only, via the alias**",
  },
  {
    q: "What is a KMS Key Policy?",
    a: "It controls access to the key, **much like an S3 bucket policy** — but **you cannot control access at all without a policy**.\n- **Default**: full power to the **root user** = **the whole AWS account**\n- **Custom**: define which users/roles have access, who **administers** it, and cross-account usage",
  },
  {
    q: "What is needed to copy a snapshot cross-account?",
    a: "1. Create a **snapshot** encrypted with a **CMK**\n2. Attach a **KMS Key Policy** allowing the cross-account access\n3. **Share** the encrypted snapshot\n4. The destination account **copies the snapshot**, encrypting with **its own CMK**\n5. Create a volume from the snapshot",
  },
  {
    q: "What is Envelope Encryption?",
    a: "The **KMS Encrypt API is limited to 4 KB**. Anything larger uses **Envelope Encryption** with the **GenerateDataKey API**.\n👉 **Any data > 4 KB that needs encrypting → envelope encryption = GenerateDataKey**.",
  },
  {
    q: "How does CloudHSM differ from KMS?",
    a: "**KMS**: AWS manages **software** for encryption.\n**CloudHSM**: AWS provisions **hardware** (an HSM) and **you manage the keys entirely** — tamper resistant, **FIPS 140-2 Level 3**. Symmetric & asymmetric (SSL/TLS keys). **No free tier**, and it requires the **CloudHSM Client Software**. Redshift supports it. **Pairs well with SSE-C**.",
  },
  {
    q: "What is SSM Parameter Store?",
    a: "It stores **configuration & secrets** securely. **Serverless, scalable, durable**, with an easy SDK.\n- **Optional KMS encryption**\n- **Version tracking**\n- Security via **IAM**\n- **Notifications via EventBridge**\n- **CloudFormation** integration",
  },
  {
    q: "SSM Parameter Store: the two tiers?",
    a: "| | **Standard** | **Advanced** |\n|---|---|---|\n| Parameters | 10,000 | 100,000 |\n| Max size | **4 KB** | **8 KB** |\n| Parameter policies | **No** | **Yes** |\n| Cost | Free | **$0.05/parameter/month** |",
  },
  {
    q: "What does Secrets Manager add over SSM?",
    a: "It is purpose-built to **store secrets**:\n- **Force rotation** every X days\n- **Automate generation on rotation** (via Lambda)\n- **RDS** integration (MySQL, PostgreSQL, Aurora)\n- **KMS encryption**\n- **Multi-region secrets**: replicates, keeps read replicas in sync, and can **promote a read replica to standalone**",
  },
  {
    q: "SSM Parameter Store vs Secrets Manager?",
    a: "**Secrets Manager ($$$)**: **automatic rotation** via Lambda (built in for RDS, Redshift, DocumentDB), **KMS mandatory**, CloudFormation integration.\n**SSM ($)**: a simple API, **no built-in rotation** (you can build it with Lambda + EventBridge), **KMS optional**, CloudFormation integration, and it **can read Secrets Manager secrets through the SSM API**.",
  },
  {
    q: "What is Amazon SES?",
    a: "**Simple Email Service** — sends email securely, globally and at scale; handles inbound & outbound.\n- Reputation dashboard, anti-spam feedback, statistics (delivery, bounce, open)\n- **DKIM** & **SPF**\n- IPs: shared, dedicated, customer-owned\n- Send via the Console, **API** or **SMTP**\n- Use cases: transactional, marketing, bulk email",
  },
  {
    q: "When do you use Amazon OpenSearch Service?",
    a: "The successor to **Amazon ElasticSearch**. DynamoDB can only query by **primary key/index**, whereas OpenSearch can **search every field**, including **partial matches**.\n- Usually **complementary** to another database\n- Two modes: a **managed cluster** or **serverless**\n- **No native SQL** (needs a plugin)\n- Ingests from **Kinesis Firehose, AWS IoT, CloudWatch Logs**\n- Security: Cognito & IAM, KMS, TLS; includes **OpenSearch Dashboards**",
  },
  {
    q: "What is Amazon Athena?",
    a: "A **serverless query service** for analysing data in **S3**.\n- Uses **SQL** (built on **Presto**), supporting CSV, JSON, **ORC, Avro, Parquet**\n- **$5 per TB scanned**\n- Usually paired with **QuickSight**\n- Use cases: BI, analytics, querying **VPC Flow Logs, ELB logs, CloudTrail trails**\n👉 Exam tip: **analyse S3 with serverless SQL → Athena**.",
  },
  {
    q: "Athena Federated Query?",
    a: "Runs SQL **across several sources** (relational, non-relational, object stores, custom — AWS or on-premises) using **Data Source Connectors** running on **Lambda**. Results are stored back in **S3**.",
  },
  {
    q: "What is AWS Certificate Manager (ACM)?",
    a: "Provisions, manages and deploys **SSL/TLS certificates** — used for **in-flight encryption (HTTPS)**.\n- Public & private TLS certificates\n- **Public TLS is free**\n- **Auto renewal**\n- Integrates with **ELB, CloudFront, API Gateway**",
  },
  {
    q: "What is AWS Macie?",
    a: "A fully managed **data security & privacy** service that uses **ML + pattern matching** to find and protect sensitive data in AWS. It detects and alerts on **PII**.",
  },
  {
    q: "How does IAM policy inheritance work?",
    a: "Policies do **not** accumulate across levels — they **combine** by scope:\n- An **Identity-based policy** (user/role/group) → grants permissions\n- A **Resource-based policy** (bucket, queue, KMS key) → grants permissions **directly** to a principal\n- A **Permissions boundary** → a **cap** on the maximum permissions of a user/role\n- An **SCP** (Organizations) → a cap for the **whole account**\n**Final result = (identity ∪ resource) ∩ boundary ∩ SCP**. An **explicit Deny** anywhere → **wins over everything**.",
  },
  {
    q: "IAM policy: explicit deny vs implicit deny?",
    a: "**Explicit Deny**: `\"Effect\": \"Deny\"` — **always wins**, even when another policy allows it. Used for **guardrails** (block deleting CloudTrail, block regions outside the allowance).\n**Implicit Deny**: the default — no Allow anywhere → **denied**. No need to write a Deny.\n⚠️ A common exam question: a Allow in the identity policy **and** a Deny in an SCP → the result is **Deny**.",
  },
  {
    q: "When do you use STS AssumeRole?",
    a: "**AssumeRole** returns **temporary credentials** (AccessKey + SecretKey + **SessionToken**) for an **IAM role**.\nUsed for:\n- **Cross-account access**: a role in account B has a **trust policy** allowing account A\n- **Same-account role switching** (least privilege per task)\n- **MFA-protected** APIs (`GetSessionToken` + MFA)\n- **Federation**: **SAML** (AssumeRoleWithSAML), **OIDC/web identity** (AssumeRoleWithWebIdentity — used by Cognito, GitHub Actions)\n\nCredentials **expire** (15 minutes – 12 hours) → no manual rotation needed.",
  },
  {
    q: "STS: trust policy vs permission policy?",
    a: "The **Trust policy** (assume role policy) answers **WHO may assume** this role (`Principal`, `sts:AssumeRole`).\nThe **Permission policy** answers what the role **may do** once assumed (`Action`, `Resource`).\n⚠️ Cross-account failures are usually because **one of the two is missing**: the role in account B needs a **trust policy** for account A, **and** the user in account A needs `sts:AssumeRole` in its identity policy.\nA KMS key policy is also a **resource policy** — it must allow the cross-account principal to **Decrypt**.",
  },
  {
    q: "Which group does AWS AppConfig belong to, and what is it for?",
    a: "It is part of **Systems Manager** (Management & Governance) and is **in scope** for DVA-C02.\nIt **safely deploys dynamic configuration and feature flags**: with **validators**, a **gradual rollout strategy**, and **automatic rollback** driven by **CloudWatch Alarms**.\n→ It lets you **enable or disable a feature for a group of users** **without redeploying code**.",
  },
  {
    q: "AppConfig: what are the main components?",
    a: "**Application** → **Environment** (dev/test/prod) → **Configuration profile** (the config source) → **Deployment strategy** (how it rolls out).\nA **configuration profile** can come from: **hosted configuration**, **SSM Parameter Store**, an **SSM Document**, an **S3 object**, or a **Feature flag**.\n**Deployment strategy**: `AllAtOnce`, `Linear50PercentEvery30Seconds`, `Canary10Percent20Minutes`, or **custom** (step %, duration, **bake time**).",
  },
  {
    q: "AppConfig: how does automatic rollback work?",
    a: "Attach a **CloudWatch Alarm** to the **environment**. During the **deploy** or the **bake time**, if the alarm goes **ALARM** → it **rolls back immediately** to the previous config version.\nThe alarm should measure **business metrics** (error rate, 5xx, latency), not just infrastructure.\nThis is the **core difference** from reading config straight from S3/Parameter Store — there is **a safety net**.",
  },
  {
    q: "AppConfig: validators, and how does an app read config?",
    a: "**Validators** (at most **2** per profile): **JSON Schema** (`JSON_SCHEMA`) checks **syntax**, or a **Lambda validator** checks **semantics**. A failure → **no deploy**.\n**The app reads config** through the **AppConfig Agent**: a **Lambda extension**, an **ECS/EKS sidecar**, or an agent on EC2 → local cache, exposes **`localhost:2772`**, polls and retries itself.\nOr it calls the `appconfig:GetConfiguration` API (handling caching itself).",
  },
  {
    q: "How does AppConfig differ from Parameter Store and Secrets Manager?",
    a: "**Parameter Store**: **simple** key-values with versions, for config that **rarely changes** — **no** validators/rollout/alarm-based rollback.\n**Secrets Manager**: **secrets** (passwords, API keys) with **automatic rotation**.\n**AppConfig**: **dynamic config & feature flags** with **validators + gradual rollout + automatic rollback**.\n→ AppConfig **can read** Parameter Store as a source, but it solves **safe deployment**, not storage.",
  },
  {
    q: "What does AWS Systems Manager (SSM) include?",
    a: "**Parameter Store**: stores config & secrets (Standard is **free**, Advanced costs money).\n**Session Manager**: **SSH into EC2 without a bastion or opening port 22** (via the agent + IAM).\n**Run Command**: runs commands across many instances **without SSH**.\n**Patch Manager**: automates OS patching on a schedule.\n**Automation**: runbooks to automate tasks (e.g. enable S3 versioning).\n**Fleet Manager / Inventory / State Manager**: manage fleet configuration.",
  },
];
