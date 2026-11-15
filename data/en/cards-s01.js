/**
 * English flashcards — a translation of data/s01.js, not a slide extract.
 *
 * Each entry mirrors the Vietnamese card exactly: same question, same answer,
 * same note and tip. Markdown (**bold**, lists, tables) is preserved because
 * the renderer formats it the same way in both languages.
 *
 * AWS service names and technical terms stay in English in both languages,
 * since that is what the exam and the console use.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s01"] = [
  {
    q: "What are the four main parts of the AWS Global Infrastructure?",
    a: "1. **Regions** (a cluster of data centers)\n2. **Availability Zones** (each region has 3–6 AZs, minimum 3)\n3. **Data Centers** (each AZ contains one or more separate data centers)\n4. **Edge Locations / Points of Presence** (400+ locations, 90+ cities, 48+ countries)",
    note: "AZs are connected to each other with high-bandwidth, ultra-low-latency networking and are isolated from one another so they can survive a disaster.",
  },
  {
    q: "When choosing an AWS Region, which factors do you weigh?",
    a: "- **Compliance / data governance**: data does not leave the region unless you allow it\n- **Proximity to customers**: lower latency\n- **Available services**: not every service or feature exists in every region\n- **Pricing**: prices vary by region",
    tip: "A question like “the company needs data to stay in Germany” → choose the Region for compliance reasons.",
  },
  {
    q: "What are Edge Locations used for?",
    a: "They are the global network for **CloudFront (CDN)** and **Route 53**, delivering content to end users with **lower latency**. There are currently 400+ Edge Locations and 13 Regional Caches.",
  },
  {
    q: "What is IAM, and is it a global or a regional service?",
    a: "**IAM = Identity and Access Management**, a **global service** (you do not pick a region). It manages users, groups, roles and policies.\nThe root account is created by default and **should not be used or shared**.",
  },
  {
    q: "What can an IAM Group contain?",
    a: "A group **contains only users**, never other groups.\n- A user does not have to belong to any group\n- A user can belong to **several groups**",
    tip: "Exam trap: “a group contains groups” → WRONG.",
  },
  {
    q: "What does the least privilege principle mean in IAM?",
    a: "Grant only the **minimum permissions** a user or service needs to do its job — never more than required.",
  },
  {
    q: "Which parts make up an IAM Policy?",
    a: "**Policy level**: Version, Id (optional), Statement (required, one or more).\n**Each Statement** has:\n- **Sid** (optional)\n- **Effect**: Allow / Deny\n- **Principal**: account/user/role (used in resource-based policies)\n- **Action**: the list of APIs allowed or denied\n- **Resource**: the resource it applies to\n- **Condition** (optional)",
    note: "An identity-based policy (attached to a user/group/role) has no Principal; a resource-based policy (S3 bucket policy, SQS policy) does.",
  },
  {
    q: "What is the order of evaluation in the IAM authorization model?",
    a: "1. If there is an **explicit DENY** → deny immediately\n2. If there is an **ALLOW** → allow\n3. Otherwise → **DENY (implicit)**",
    tip: "An explicit Deny always wins — even when an Allow exists elsewhere.",
  },
  {
    q: "What are the three ways a person accesses AWS?",
    a: "- **AWS Management Console**: password + MFA\n- **AWS CLI**: access keys\n- **AWS SDK**: access keys\n\nAccess Key ID ≈ username, Secret Access Key ≈ password — both must stay secret.",
  },
  {
    q: "What is the AWS CLI built on?",
    a: "The AWS CLI is built on the **AWS SDK for Python (Boto3)**. It gives direct access to AWS public APIs and is open source.",
  },
  {
    q: "How does the IAM Credentials Report differ from IAM Access Advisor?",
    a: "- **Credentials Report** (account level): lists every user and the **state of their credentials**\n- **Access Advisor** (user level): shows the **service permissions** granted and **when each was last used** → use it to trim unused permissions",
  },
  {
    q: "When do you use IAM Roles?",
    a: "When an **AWS service** needs to act on your behalf. Examples: EC2 instance roles, Lambda function roles, CloudFormation roles.",
    tip: "Never embed access keys in EC2 — use an IAM Role (instance profile).",
  },
  {
    q: "What are the most important IAM best practices?",
    a: "- Do not use root except to set up the account\n- One real person = one IAM user\n- Grant permissions to **groups**, not to individual users\n- Strong password policy + mandatory **MFA**\n- Use **Roles** for AWS services\n- Use **access keys** for CLI/SDK\n- Audit with the Credentials Report + Access Advisor\n- Never share a user or access key",
  },
  {
    q: "What is MFA in AWS, and which device types exist?",
    a: "MFA = something you **know** (password) + something you **have** (device). It protects the root account and IAM users.\nTypes: **Virtual MFA** (Google Authenticator, Authy — phone only), **U2F Security Key** (YubiKey).",
  },
  {
    q: "How does the Shared Responsibility Model split IAM duties?",
    a: "**AWS**: infrastructure (global network security), configuration and vulnerability analysis, compliance validation.\n**You**: managing users/groups/roles/policies, enabling MFA, rotating keys, using IAM tools to apply the right permissions, analysing access patterns.",
  },
  {
    q: "What is EC2, and what does it let you do?",
    a: "**EC2 = Elastic Compute Cloud = IaaS**. It gives you:\n- Renting virtual machines (EC2)\n- Storing data on virtual drives (**EBS**)\n- Distributing load (**ELB**)\n- Scaling the service (**ASG**)",
  },
  {
    q: "What is EC2 User Data?",
    a: "A **bootstrap** script that runs **exactly once**, at the instance's first boot, as **root**.\nUsed for: installing updates, installing software, downloading files — anything you want automated.",
  },
  {
    q: "What is the instance type naming rule, e.g. m5.2xlarge?",
    a: "- **m**: instance class\n- **5**: generation (AWS improves these over time)\n- **2xlarge**: size within the class\n\nMain families: General Purpose (m, t), Compute Optimized (c), Memory Optimized (r, x), Storage Optimized (i, d, h).",
  },
  {
    q: "What are the four EC2 instance type families and their use cases?",
    a: "- **General Purpose (m, t)**: balanced compute/memory/network → web servers, code repositories\n- **Compute Optimized (c)**: batch processing, media transcoding, HPC, gaming servers\n- **Memory Optimized (r, x)**: relational/NoSQL databases, distributed caches, in-memory BI, real-time big data\n- **Storage Optimized (i, d, h)**: high-frequency OLTP, data warehouses, distributed file systems",
  },
  {
    q: "How do Security Groups work?",
    a: "- They are a **firewall** at the instance level and can be attached to many instances\n- **Inbound: all blocked** by default; **Outbound: all allowed** by default\n- **Allow rules only** — there are no deny rules\n- Rules reference an **IP** or **another security group**\n- **Stateful**: return traffic is allowed automatically",
    tip: "To block one specific IP you must use a NACL (subnet level); a security group cannot do it.",
  },
  {
    q: "Which classic ports must you remember?",
    a: "- **22** = SSH (Linux) / SFTP\n- **21** = FTP\n- **80** = HTTP\n- **443** = HTTPS\n- **3389** = RDP (Windows)",
  },
  {
    q: "What is EC2 Instance Connect?",
    a: "Connecting to EC2 **directly in the browser**, with no key file (.pem).\nRequirements: port **22** must be open, and it only works with **Amazon Linux or Ubuntu**.",
  },
  {
    q: "What are the seven EC2 purchasing options?",
    a: "1. **On-Demand** — pay per second, no commitment\n2. **Reserved** (1 or 3 years) — steady workloads, up to 72% off\n3. **Savings Plans** (1 or 3 years) — commit to a $/hour\n4. **Spot** — up to 90% cheaper, can be reclaimed\n5. **Dedicated Hosts** — an entire physical server\n6. **Dedicated Instances** — dedicated hardware, not shared\n7. **Capacity Reservations** — reserve capacity in one AZ",
  },
  {
    q: "Reserved Instances: term, payment options, scope?",
    a: "- **1 year** (smaller discount) or **3 years** (bigger discount)\n- Payment: **No Upfront / Partial Upfront / All Upfront**\n- Scope: **Regional** or **Zonal** (reserves capacity in one AZ)\n- **Convertible RI**: can change type, family, OS… up to **66%** off\n- For systems running 24/7 with a steady workload",
  },
  {
    q: "How do Savings Plans differ from Reserved Instances?",
    a: "You commit to a **$/hour** amount (e.g. $10/hour) for 1 or 3 years.\nIt is locked to an **instance family + region** (e.g. M5 in us-east-1) but **flexible** on: **instance size, OS, tenancy**.\nUp to **72%** off — good when the workload will need to change instance types over time.",
  },
  {
    q: "Spot Instances: pros, cons and use cases?",
    a: "- Up to **90%** cheaper than On-Demand — the cheapest option in AWS\n- If the spot price exceeds your max price you get **2 minutes** to stop or terminate\n- **Spot Block**: reserved for 1–6 hours without interruption\n- Use for: batch jobs, data analysis, workloads with flexible start and end times\n- **Not** for critical workloads that cannot be interrupted",
  },
  {
    q: "Dedicated Hosts vs Dedicated Instances?",
    a: "- **Dedicated Hosts**: an entire **physical server** to yourself → supports per-socket/core/VM licensing (BYOL)\n- **Dedicated Instances**: dedicated hardware, but it **may be shared with other instances in the same account**, and you do not control placement (hardware can change after Stop/Start)",
  },
  {
    q: "How do Capacity Reservations work?",
    a: "Reserve On-Demand capacity in **one specific AZ**, with no time commitment.\n- No discount — you **pay the On-Demand rate whether or not an instance runs**\n- Suited to short-term, uninterrupted workloads that need that exact AZ",
  },
  {
    q: "What new IPv4 charge did AWS introduce on 1 Feb 2024?",
    a: "A charge of **$0.005/hour per Public IPv4** (~$3.6/month).\nFree tier: 750 hours of Public IPv4 per month for the first 12 months on EC2. Load Balancers and RDS have **no** IPv4 free tier.",
  },
  {
    q: "The “hotel” analogy for purchasing options?",
    a: "- **On-Demand**: check in whenever, pay full price\n- **Reserved**: book long term → discount\n- **Savings Plans**: pay a fixed $/hour, can switch room type\n- **Spot**: bid on empty rooms, can be evicted at any time\n- **Dedicated Hosts**: rent the whole building\n- **Capacity Reservations**: hold the room at full price even if you never stay",
  },
];
