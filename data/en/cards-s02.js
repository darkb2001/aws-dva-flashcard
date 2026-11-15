/**
 * English flashcards — a translation of data/s02.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s02"] = [
  {
    q: "What is an EBS Volume? Three important characteristics?",
    a: "**Elastic Block Store** = a network drive attached to an instance while it runs.\n- Data **persists** even after the instance is terminated\n- Can be mounted to **one instance** at a time (except io1/io2 multi-attach)\n- **Locked to a single AZ**\n\nEasy way to remember: a “network USB stick”.",
    tip: "EBS is tied to an AZ → to use it in another AZ you must snapshot it and create a new volume there.",
  },
  {
    q: "What is the Root EBS Volume?",
    a: "The EBS volume that is **attached automatically** when the EC2 instance is created. It holds the **OS and system files**. You can attach additional volumes (e.g. the D: or E: drive on Windows).",
  },
  {
    q: "How does the Delete on Termination attribute behave?",
    a: "- **Root volume**: **deleted** by default (attribute enabled)\n- **Non-root volume**: **not deleted** by default (disabled)\n\nTurn it off when you want to keep the root volume after the instance is terminated.",
  },
  {
    q: "What is an EBS Snapshot?",
    a: "A backup of an EBS volume at a **point in time**.\n- You do not have to detach the volume first (though it is recommended)\n- Can be **copied across AZs and across Regions**\n- A snapshot of an encrypted volume is itself encrypted",
  },
  {
    q: "What is an AMI, and how does it differ from an EBS Snapshot?",
    a: "**AMI = Amazon Machine Image** — a customised EC2 instance (OS + software + config) that boots faster.\n- An AMI is built for **one specific region** (it can be copied to another)\n- An **EBS Snapshot** = a copy of a volume → you **cannot** launch EC2 from it\n- An **AMI** = a backup of the **whole instance**, and it contains EBS snapshots → you **can** launch EC2 from it",
  },
  {
    q: "What is the process for creating an AMI from an EC2 instance?",
    a: "1. Launch the instance and customise it\n2. **Stop the instance** (for data integrity)\n3. **Build the AMI** — this also creates the EBS snapshots\n4. Launch a new instance from the AMI",
  },
  {
    q: "What are the three advanced EBS Snapshot features?",
    a: "- **EBS Snapshot Archive**: moves to an archive tier, **75%** cheaper, takes **24–72 hours** to restore\n- **Recycle Bin**: keeps deleted snapshots so you can recover them, retention **1 day → 1 year**\n- **Fast Snapshot Restore (FSR)**: forces full initialisation so there is **no first-use latency** (expensive)",
  },
  {
    q: "What are the six EBS volume types? Which can be a boot volume?",
    a: "**SSD**: gp2, gp3, io1, io2 Block Express\n**HDD**: st1 (Throughput Optimized), sc1 (Cold)\n\nOnly **gp2/gp3 and io1/io2 Block Express** can be used as a **boot volume**.\nEBS volumes are characterised by **Size | Throughput | IOPS**.",
  },
  {
    q: "How do gp3 and gp2 differ?",
    a: "**gp3**: baseline **3,000 IOPS**, throughput **125 MiB/s**; scale independently up to **16,000 IOPS** and **1,000 MiB/s**.\n**gp2**: IOPS is **tied to size** (3 IOPS/GB), bursting to 3,000, maxing at 16,000 around **5,334 GB**. Throughput cannot be set independently.",
  },
  {
    q: "How do io1 and io2 Block Express differ?",
    a: "- **io1**: 4 GiB–16 TiB, max **64,000 IOPS** (Nitro) / **32,000** (others), provisioned IOPS independent of size\n- **io2 Block Express**: 4 GiB–64 TiB, **sub-millisecond** latency, max **256,000 IOPS** at a **1,000:1 IOPS:GiB** ratio\n- Both support **EBS Multi-Attach**\n- For databases and workloads needing more than 16,000 IOPS",
  },
  {
    q: "When do you use st1 and sc1?",
    a: "- **st1 (Throughput Optimized HDD)**: big data, data warehouses, log processing; max **500 MiB/s**, **500 IOPS**\n- **sc1 (Cold HDD)**: infrequently accessed data, lowest cost; max **250 MiB/s**, **250 IOPS**\n- Both: **no** boot volume, **no** multi-attach, size 125 GiB–16 TiB",
  },
  {
    q: "What are the limits of EBS Multi-Attach?",
    a: "**io1/io2 family only**, attaching one volume to **up to 16 EC2 instances in the same AZ**.\nUse case: clustered Linux applications (Teradata) that need high availability. **The application must manage concurrent writes itself.**",
  },
  {
    q: "What do you get when you enable EBS volume encryption?",
    a: "- Data **at rest** is encrypted\n- Data **in flight** between the instance and the volume is encrypted\n- **All snapshots** and any volume created from a snapshot are encrypted\n- Uses a **KMS key (AES-256)**, with negligible latency impact",
  },
  {
    q: "How do you encrypt an unencrypted EBS volume?",
    a: "1. Take a **snapshot** of the volume\n2. **Copy the snapshot** and choose to encrypt it\n3. Create a **new volume** from the encrypted snapshot\n4. Attach the new volume to the instance\n\n→ You cannot encrypt an existing volume in place.",
  },
  {
    q: "What is an EC2 Instance Store? What is the main risk?",
    a: "**Hardware disk** attached directly to the physical machine → **highest I/O performance**.\n- Data is **lost when the instance stops or terminates** (ephemeral)\n- Good for: buffers, caches, scratch data, temporary content\n- Not every instance type has one",
  },
  {
    q: "What is Amazon EFS? Key characteristics?",
    a: "A **managed NFS** (network file system) that can be mounted on **many EC2 instances** and is **multi-AZ**.\n- **NFSv4.1** protocol, POSIX (~Linux) → **does not support Windows**\n- Highly available and scalable, but **expensive (~3× gp2)**\n- Use cases: content management, web serving, data sharing",
  },
  {
    q: "What are the three EFS storage classes?",
    a: "- **EFS Standard**: active data, **sub-millisecond** latency\n- **EFS IA (Infrequent Access)**: rarely used data (a few times a quarter), latency in the **tens of ms**, minimum billing **128 KiB** per file\n- **EFS Archive**: accessed a few times a year or less, **minimum storage duration 90 days**\n\nDurability 99.999999999% (eleven nines).",
  },
  {
    q: "Vertical vs Horizontal scalability?",
    a: "- **Vertical (scale up/down)**: increase the instance size — common in **non-distributed** systems (databases). RDS and ElastiCache scale vertically.\n- **Horizontal (scale out/in = elasticity)**: increase the **number** of instances — distributed systems and modern web apps.",
  },
  {
    q: "What does High Availability mean?",
    a: "Running the application in **at least two data centers (AZs)** so it survives the loss of one.\n- HA **passive**: e.g. RDS Multi-AZ\n- HA **active**: horizontal scaling\n\nHA usually goes hand in hand with horizontal scaling but is **not** the same thing as scalability.",
  },
  {
    q: "What are six reasons to use a Load Balancer?",
    a: "1. Spread load across many instances\n2. **A single point of access (DNS)**\n3. Handle downstream failures\n4. Periodic **health checks**\n5. **SSL termination (HTTPS)**\n6. Stickiness with cookies, cross-zone HA, and separating public from private traffic",
  },
  {
    q: "How does an ELB health check work?",
    a: "It checks **one port and one route** (e.g. `/health`). If the response is **not 200 (OK)** the instance is marked **unhealthy** and removed from rotation.",
  },
  {
    q: "How do ALB / NLB / GWLB / CLB compare?",
    a: "| LB | Layer | Target | Protocol |\n|---|---|---|---|\n| **ALB** | 7 | IP, Instance, **Lambda** | HTTP, HTTPS, gRPC |\n| **NLB** | 4 | IP, Instance, **ALB** | TCP, UDP, TLS |\n| **GWLB** | 3 + 4 | IP, Instance | IP (GENEVE 6081) |\n| **CLB** | 4/7 | IP, Instance | TCP, SSL/TLS, HTTP, HTTPS |",
  },
  {
    q: "Which routing features does ALB support?",
    a: "- **Path** in the URL (`example.com/users` vs `/posts`)\n- **Hostname** (`one.example.com` vs `other.example.com`)\n- **Query string, headers** (`/users?id=123`)\n- Supports **HTTP/2, WebSocket, redirects** (HTTP→HTTPS)\n- **Port mapping** for ECS dynamic ports\n- Suited to microservices and containers",
  },
  {
    q: "What are the four ALB target group types?",
    a: "- **EC2 instances** (possibly managed by an ASG)\n- **ECS tasks**\n- **Lambda functions** (HTTP request → JSON event)\n- **IP Addresses** — must be **private IPs**\n\nHealth checks operate at the **target group** level.",
  },
  {
    q: "ALB: how does the server learn the client's real IP?",
    a: "ALB has a **fixed hostname** (`XXX.region.elb.amazonaws.com`) and the app server **never sees the client IP directly**. The real IP is in the **`X-Forwarded-For`** header.",
  },
  {
    q: "What makes NLB special?",
    a: "- Layer 4, forwards **TCP & UDP**\n- Handles **millions of requests per second**, latency ~**100 ms** (ALB ~400 ms)\n- **One static IP per AZ**, can be assigned an **Elastic IP** (handy for whitelisting)\n- For extreme performance\n- **Not** available in the free tier",
  },
  {
    q: "What is Gateway Load Balancer used for?",
    a: "Deploying and scaling **third-party virtual appliances** (firewalls, IDS/IPS, deep packet inspection).\n- Operates at **Layer 3** (IP packets)\n- Combines a **Transparent Network Gateway** with a **Load Balancer**\n- Uses the **GENEVE protocol, port 6081**",
  },
  {
    q: "What are Sticky Sessions?",
    a: "The same client is always redirected to the **same instance** behind the LB. Supported by CLB, ALB and NLB.\n- With CLB & ALB: uses a **cookie** whose expiration you control\n- Use case: not losing session data\n- Downside: **it unbalances the load**",
  },
  {
    q: "Cross-Zone Load Balancing: what is the default per LB type?",
    a: "- **ALB**: **on by default** (can be disabled at the target group level), **no inter-AZ data charge**\n- **NLB & GWLB**: **off by default**, and inter-AZ traffic **is charged** if you enable it",
  },
  {
    q: "What is SNI, and which LBs support it?",
    a: "**Server Name Indication** — solves the problem of serving multiple SSL certificates from one server (multiple websites).\nSupported by: **ALB, NLB, CloudFront**. **Not** supported by **CLB**.",
  },
  {
    q: "Connection Draining / Deregistration Delay?",
    a: "- **CLB**: Connection Draining; **ALB/NLB**: Deregistration Delay\n- The time allowed for **in-flight requests** to complete when an instance is deregistered or unhealthy\n- New requests stop being sent\n- **1–3600 seconds**, default **300s**, can be disabled (=0)\n- Short requests → set a low value",
  },
  {
    q: "What problem does an Auto Scaling Group solve?",
    a: "- **Scale out/in** with load\n- Enforces **min/max** instance counts\n- Automatically registers new instances with the LB\n- **Re-creates** terminated or unhealthy instances\n\nASG itself is **free** — you only pay for the EC2 instances behind it.",
  },
  {
    q: "What does a Launch Template contain?",
    a: "AMI + Instance Type, EC2 User Data, EBS Volumes, Security Groups, SSH Key Pair, IAM Roles, Network + Subnets, Load Balancer info.\n(The older Launch Configurations are deprecated.)",
  },
  {
    q: "What are the three ASG scaling policies?",
    a: "- **Target Tracking** (recommended): hold a metric at a target, e.g. average CPU ~40%\n- **Simple / Step Scaling**: react to CloudWatch alarms (CPU>70% → +2, CPU<30% → -1)\n- **Scheduled Scaling**: follow a known pattern (raise min capacity at 5pm Friday)\n- (Bonus) **Predictive Scaling**: uses ML to forecast from historical data",
  },
  {
    q: "Which metrics are good for scaling?",
    a: "- **CPUUtilization**\n- **RequestCountPerTarget** (keeps requests per instance stable)\n- **Average Network In/Out** (when network-bound)\n- **Custom metrics** via CloudWatch",
  },
  {
    q: "What is the Scaling Cooldown?",
    a: "After a scaling activity the ASG enters a **cooldown** (default **300 seconds**) during which it will not launch or terminate more instances, letting metrics settle.\nTip: use a **pre-built AMI** to cut configuration time and shorten the cooldown.",
  },
  {
    q: "What is Instance Refresh for?",
    a: "Update the **launch template**, then **recreate all EC2 instances**.\nYou configure a **minimum healthy percentage** and a **warm-up time** (how long before an instance is ready to serve).",
  },
];
