/**
 * English flashcards — a translation of data/s03.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s03"] = [
  {
    q: "What is RDS, and which engines does it support?",
    a: "**Relational Database Service** — a managed database using SQL.\nEngines: **Postgres, MySQL, MariaDB, Oracle, MS SQL Server, IBM DB2, Aurora** (AWS proprietary).",
  },
  {
    q: "What are the benefits of RDS over running a database yourself on EC2?",
    a: "- Automated provisioning, **OS patching**\n- **Continuous backup + Point in Time Restore**\n- Monitoring dashboards\n- **Read replicas** to improve read performance\n- **Multi-AZ** for disaster recovery\n- Maintenance windows, scaling (vertical & horizontal)\n- Storage backed by EBS (gp2/io1)",
  },
  {
    q: "When does RDS Storage Auto Scaling grow the volume?",
    a: "Once you set a **Maximum Storage Threshold**, RDS grows storage automatically when:\n- Free storage < **10%**\n- The condition persists for **≥ 5 minutes**\n- It has been **6 hours** since the last modification\n\nSupported on all engines — good for unpredictable workloads.",
  },
  {
    q: "How many RDS Read Replicas can you have, and how does replication work?",
    a: "- Up to **15 read replicas**\n- Can be **within AZ, cross AZ, or cross Region**\n- Replication is **ASYNC** → reads are **eventually consistent**\n- Can be **promoted** to a standalone database\n- The app must **update its connection string** to use a replica",
  },
  {
    q: "What is a Read Replica used for, and does network traffic cost anything?",
    a: "Offload **SELECT** workload (reporting/analytics) from the production database so the production app is unaffected.\nA read replica **does not** accept INSERT/UPDATE/DELETE.\n**No network charge** while the replica is in the **same region** (cross-AZ is still free for RDS read replicas).",
  },
  {
    q: "How does RDS Multi-AZ differ from a Read Replica?",
    a: "**Multi-AZ**: **SYNC** replication, **one DNS name**, automatic failover, increases **availability** — **not** used for scaling.\n**Read Replica**: **ASYNC**, scales reads.\n\nA read replica **can** itself be set up as Multi-AZ for DR.",
  },
  {
    q: "Does moving RDS from Single-AZ to Multi-AZ require downtime?",
    a: "**No** — zero downtime, just click **Modify**.\nUnder the hood: take a **snapshot** → restore a new DB in another AZ from that snapshot → establish **synchronisation**.",
  },
  {
    q: "Which layers of RDS & Aurora security exist?",
    a: "- **At rest**: KMS, must be defined **at launch**; an unencrypted master cannot have encrypted replicas. To encrypt an existing unencrypted DB: **snapshot + restore as encrypted**\n- **In flight**: TLS available out of the box, using AWS TLS root certificates\n- **IAM Authentication**: use an IAM role instead of username/password\n- **Security Groups** control network access\n- **No SSH**, except on **RDS Custom**\n- **Audit Logs** → CloudWatch Logs",
  },
  {
    q: "What problem does Amazon RDS Proxy solve?",
    a: "A managed proxy for RDS that **pools and shares database connections**.\n- Reduces CPU/RAM pressure, fewer open connections and timeouts\n- **Serverless, autoscaling, multi-AZ**\n- Cuts failover time by up to **66%**\n- Supports RDS (MySQL, PostgreSQL, MariaDB, MS SQL) and Aurora (MySQL, PostgreSQL)\n- Requires almost **no code change**, enforces **IAM Auth**, stores credentials in **Secrets Manager**\n- **Never public** — must be reached from inside the VPC",
  },
  {
    q: "What advantages does Aurora have over RDS?",
    a: "- AWS proprietary, supports **Postgres & MySQL**\n- **5×** the performance of MySQL on RDS, **3×** that of Postgres\n- Storage grows in **10 GB** steps, up to **128 TB**\n- Up to **15 replicas**, replica lag **< 10 ms**\n- **Instant** failover (native HA)\n- About **20%** more expensive than RDS but more efficient",
  },
  {
    q: "How does Aurora guarantee HA and read scaling?",
    a: "- **6 copies** of the data across **3 AZs**\n- **4/6** copies needed for **writes**, **3/6** for **reads**\n- **Self healing** with peer-to-peer replication, storage striped across hundreds of volumes\n- **One master** takes writes, failover in **< 30 seconds**\n- The master plus up to **15 Aurora Read Replicas** serves reads\n- Supports **Cross Region Replication**",
  },
  {
    q: "What are Aurora's features?",
    a: "Automatic failover, backup & recovery, isolation & security, industry compliance, push-button scaling, **automated patching with zero downtime**, advanced monitoring, routine maintenance, **Backtrack** (restore data to any point in time without needing a backup).",
  },
  {
    q: "What is ElastiCache, and what is it for?",
    a: "Managed **Redis or Memcached** — a high-performance in-memory database with extremely low latency.\n- Takes load off the database for read-intensive workloads\n- Helps make the app **stateless**\n- AWS handles OS maintenance, patching, setup, monitoring, failure recovery and backups\n- **Requires significant code changes** in the application",
  },
  {
    q: "Redis vs Memcached?",
    a: "**Redis**: Multi-AZ + **Auto-Failover**, **Read Replicas**, **durability (AOF)**, **backup/restore**, Sets & Sorted Sets.\n**Memcached**: multi-node **sharding/partitioning**, **no HA**, **not persistent**, **no backup**, **multi-threaded**.",
  },
  {
    q: "Lazy Loading (Cache-Aside): pros and cons?",
    a: "**Pros**: only data that is requested gets cached (no wasted memory); a node failure is not fatal (it just adds latency while the cache warms up).\n**Cons**: the **cache miss penalty** = 3 round trips; **stale data** (the DB was updated, the cache was not).",
  },
  {
    q: "Write-Through: pros and cons?",
    a: "**Pros**: the cache is **never stale**, reads are fast.\n**Cons**: **write penalty** (every write = 2 calls); **missing data** until it is added or updated (fix by combining with Lazy Loading); **cache churn** (much of the data is never read).",
  },
  {
    q: "In which three ways does cache eviction happen?",
    a: "1. Delete the item from the cache **explicitly**\n2. It is evicted because **memory is full** and it was not recently used (**LRU**)\n3. Set a **TTL** on the item\n\nIf eviction happens a lot because memory is full → **scale up or out**.",
  },
  {
    q: "What is DNS? How is it structured?",
    a: "**Domain Name System** — translates friendly hostnames into IPs (`www.google.com` → `172.217.18.36`).\nHierarchy: `.com` → `example.com` → `www.example.com` / `api.example.com`.\nDNS is the **backbone of the Internet**.",
  },
  {
    q: "Which DNS terms should you know?",
    a: "- **Domain Registrar**: Route 53, GoDaddy…\n- **DNS Records**: A, AAAA, CNAME, NS…\n- **Zone File**: holds the DNS records\n- **Name Server**: resolves DNS queries (authoritative / non-authoritative)\n- **TLD**: .com, .us, .gov\n- **SLD**: amazon.com, google.com",
  },
  {
    q: "What makes Route 53 special compared with other DNS providers?",
    a: "- Highly available, scalable, fully managed, **Authoritative** DNS (you can update the records)\n- Also a **Domain Registrar**\n- Provides **health checks** for your resources\n- **The only service with a 100% availability SLA**",
    tip: "A question like “which service has a 100% availability SLA?” → Route 53.",
  },
  {
    q: "What does a Route 53 record contain?",
    a: "- **Name** (domain/subdomain)\n- **Type** (A, AAAA, CNAME, NS…)\n- **Value** (12.34.56.78)\n- **Routing Policy**\n- **TTL** (how long resolvers cache it)\n\nMust know: **A, AAAA, CNAME, NS**. Advanced: CAA, DS, MX, NAPTR, PTR, SOA, TXT, SPF, SRV.",
  },
  {
    q: "A vs AAAA vs CNAME vs NS?",
    a: "- **A**: hostname → **IPv4**\n- **AAAA**: hostname → **IPv6**\n- **CNAME**: hostname → **another hostname** (the target must have an A/AAAA). **Cannot** be created at the **Zone Apex** (`example.com`), only on `www.example.com`\n- **NS**: Name Servers for the Hosted Zone — decides which organisation manages the domain",
  },
  {
    q: "Public Hosted Zone vs Private Hosted Zone?",
    a: "- **Public**: routes traffic on the Internet (public domain names)\n- **Private**: routes traffic **inside the VPC** (private domain names, e.g. `app.company.internal`)\n- Cost: **$0.50/month per hosted zone**",
  },
  {
    q: "High vs low TTL?",
    a: "- **High TTL (24h)**: less traffic to Route 53 (cheaper), but records can be **outdated**\n- **Low TTL (60s)**: more traffic ($$), records go stale less often, **easy to change a record**\n- **Except for Alias records**, TTL is **mandatory**",
  },
  {
    q: "CNAME vs Alias record?",
    a: "**CNAME**: points a hostname → any hostname, **non-root domains only**.\n**Alias**: points a hostname → **an AWS Resource**, works on the **root domain** (`mydomain.com`), **free**, has **native health checks**, is always type **A/AAAA** for AWS resources, and **you cannot set a TTL**.",
  },
  {
    q: "What are the seven Route 53 routing policies?",
    a: "1. **Simple**\n2. **Weighted**\n3. **Failover**\n4. **Latency-based**\n5. **Geolocation**\n6. **Multi-Value Answer**\n7. **Geoproximity** (requires Traffic Flow)\n\n(Bonus: **IP-based routing**)",
  },
  {
    q: "Does Simple routing support health checks?",
    a: "**No**. It routes traffic to **one resource** (or several values in the same record, and the client picks at random).\nWith an Alias you can specify **only one** AWS resource.",
  },
  {
    q: "How does Weighted routing work?",
    a: "Controls the **% of requests** sent to each resource; records share the **same name and type**.\n- Set weight **0** to stop traffic\n- If **all weights are 0** → responses are **evenly split**\n- Supports health checks\n- Use cases: load balancing between regions, testing a new version",
  },
  {
    q: "Latency-based vs Geolocation routing?",
    a: "**Latency-based**: picks the resource with the **lowest latency** for the user (based on traffic between the user and the AWS Region), supports health checks + failover.\n**Geolocation**: based on the **user's location** (Country or US State), so you should have a **Default record**; used for localisation and restricting content.",
  },
  {
    q: "What is Geoproximity routing, and what is bias?",
    a: "Routes based on the location of **both the user and the resource**. **Bias** changes the size of the geographic area:\n- **1 → 99**: expand (more traffic)\n- **-1 → -99**: shrink\n\nResources can be AWS (a region) or non-AWS (lat/long). **Requires Route 53 Traffic Flow.**",
  },
  {
    q: "What is Failover routing?",
    a: "**Active-Passive**: one primary resource and one secondary (standby). When the primary's health check fails → Route 53 returns the secondary.",
  },
  {
    q: "What is Multi-Value Answer routing?",
    a: "Routes to **several resources**, returning up to **8 healthy records** per query.\nLike Simple, but: it routes to multiple resources and it **does** support health checks.",
  },
  {
    q: "What is IP-based routing?",
    a: "Routes based on the **client's IP**. You supply a list of **CIDRs** and their matching endpoints.\nUse cases: optimise performance, reduce network cost, send one ISP's users to a dedicated endpoint.",
  },
  {
    q: "What are the three types of Route 53 Health Check?",
    a: "1. Monitor an **endpoint** (app, server, AWS resource)\n2. Monitor **other health checks** (Calculated Health Check)\n3. Monitor **CloudWatch Alarms** (used for **private resources**)\n\nHTTP health checks work **only for public resources**.",
  },
  {
    q: "How do you health check a private resource inside a VPC?",
    a: "Route 53 health checkers live **outside the VPC** and cannot reach a private endpoint.\nSolution: create a **CloudWatch Metric + Alarm**, then create a **Health Check that monitors that alarm**.",
  },
  {
    q: "How does a Domain Registrar differ from a DNS Service?",
    a: "A **Registrar** (GoDaddy, Amazon Registrar) is where you buy/register the domain. A **DNS Service** is where you manage the records — it can be a different provider.\nExample: buy the domain at GoDaddy, create a **Hosted Zone** in Route 53, then **update the NS records** at GoDaddy to point at Route 53's name servers.",
  },
];
