/**
 * English flashcards — a translation of data/s12.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s12"] = [
  {
    q: "What is DynamoDB?",
    a: "**NoSQL**, fully managed, HA with **replication across multiple AZs**, scaling to **millions of requests per second**, **trillions of rows**, **hundreds of TB**.\nFast, stable performance (low latency), **IAM** integration, **DynamoDB Streams**, low cost, auto-scaling, **Standard & IA table classes**.",
  },
  {
    q: "How does NoSQL differ from SQL?",
    a: "NoSQL is **non-relational and distributed**, has **no joins** (or very limited ones), **all data needed for a query lives in one row**, has **no aggregation** (SUM, AVG), and **scales horizontally**.\nThere is no “right or wrong” — just a **different data model and a different way of thinking about queries**.",
  },
  {
    q: "DynamoDB basics: table, item, attributes?",
    a: "- A **Table** has a **Primary Key** that must be decided **at creation**\n- **Infinite items** (rows), and **attributes** can be added later (and can be null)\n- **Max item size: 400 KB**\n- Data types: **Scalar** (String, Number, Binary, Boolean, Null), **Document** (List, Map), **Set** (String/Number/Binary Set)",
  },
  {
    q: "What are the two kinds of Primary Key?",
    a: "1. **Partition Key (HASH)**: must be **unique** per item and **diverse** so data spreads evenly\n2. **Partition Key + Sort Key (HASH + RANGE)**: the **combination** must be unique, and data is **grouped by partition key**",
  },
  {
    q: "For a movie DB, which partition key: movie_id, producer_name, leader_actor_name, movie_language?",
    a: "**movie_id** — it has the **highest cardinality** → the best data distribution.\n**movie_language** is a poor choice: few distinct values, so it will **skew** towards English.",
  },
  {
    q: "What are the two Read/Write Capacity Modes?",
    a: "**Provisioned** (default): you specify reads/writes per second, **plan ahead**, and pay per RCU/WCU.\n**On-demand**: scales with the workload, **no capacity planning**, pay for actual usage, **more expensive ($$$)**.\n👉 You can **switch only once every 24 hours**.",
  },
  {
    q: "How is a WCU calculated?",
    a: "**1 WCU = 1 write/second for an item ≤ 1 KB**. Larger items need more WCUs.\nExample: 10 items/s at **2 KB** each = 10 × (2/1) = **20 WCU**.\n6 items/s at **4.5 KB** (rounds to **5 KB**) = 6 × 5 = **30 WCU**.\n120 items/**minute** at 2 KB = (120/60) × 2 = **4 WCU**.",
  },
  {
    q: "How is an RCU calculated?",
    a: "**1 RCU = 1 strongly consistent read/second** (or **2 eventually consistent reads/second**) for an item **≤ 4 KB**.\nExample: 10 strongly consistent/s at **4 KB** = **10 RCU**.\n16 eventually consistent/s at **12 KB** = (16/2) × (12/4) = **24 RCU**.\n10 strongly consistent/s at **6 KB** (rounds to **8 KB**) = 10 × 2 = **20 RCU**.",
  },
  {
    q: "Strongly Consistent vs Eventually Consistent Read?",
    a: "**Eventually (default)**: a read right after a write may be **stale** because of replication — it costs **1/2 RCU**.\n**Strongly Consistent**: always reads the correct data — set **`ConsistentRead: true`** in GetItem, BatchGetItem, Query, Scan — and it costs **double the RCU**.",
  },
  {
    q: "How is the number of partitions calculated?",
    a: "```\n#partitions by capacity = (Total RCUs / 3000) + (Total WCUs / 1000)\n#partitions by size     = Total Size / 10 GB\n#partitions = ceil(max(capacity, size))\n```\nThe partition key goes through a **hashing algorithm** to pick a partition. RCU/WCU are **spread evenly**.",
  },
  {
    q: "DynamoDB Throttling: causes and fixes?",
    a: "Exceeding RCU/WCU → **`ProvisionedThroughputExceededException`**.\n**Causes**: **hot keys** (one partition key is read too much), **hot partitions**, **items that are too large**.\n**Fixes**: **exponential backoff** (the SDK already does this), **distribute the partition keys**, use **DAX** if RCUs are the problem.",
  },
  {
    q: "Which units does on-demand mode use?",
    a: "**RRU (Read Request Unit)** and **WRU (Write Request Unit)** — the same meaning as RCU/WCU.\n**No throttling**, unlimited, and **~2.5× more expensive** than provisioned. For **unpredictable workloads**.",
  },
  {
    q: "PutItem vs UpdateItem vs Conditional Writes?",
    a: "**PutItem**: creates a new item or **replaces the whole item** with that Primary Key, and costs WCUs.\n**UpdateItem**: modifies attributes or adds them if missing; also usable for **Atomic Counters**.\n**Conditional Writes**: only write if a condition holds, otherwise return an error — this handles **concurrent access** and **does not affect performance**.",
  },
  {
    q: "What should you know about GetItem?",
    a: "It reads by **Primary Key** (HASH or HASH+RANGE), is **eventually consistent by default**, and has an option for **strongly consistent**. Use **`ProjectionExpression`** to fetch only some attributes.",
  },
  {
    q: "How does Query work?",
    a: "- **`KeyConditionExpression`**: Partition Key (**required, `=` only**), Sort Key (=, <, <=, >, >=, Between, **begins_with** — optional)\n- **`FilterExpression`**: filters **after** the query, on **non-key attributes** only\n- Returns at most **1 MB** or the number of items in **Limit**\n- Supports **pagination**\n- Can query the **table, an LSI or a GSI**",
  },
  {
    q: "What is Scan?",
    a: "It reads the **entire table** and then filters — **inefficient**, costing many RCUs, returning at most **1 MB** (pagination).\n**Parallel Scan**: several workers scan several segments → **more throughput & RCUs**.\nUse **Limit** and **ProjectionExpression** to reduce the impact (Projection/Filter **do not change the RCU cost**).",
  },
  {
    q: "DeleteItem vs DeleteTable?",
    a: "**DeleteItem**: deletes one item and supports **conditional delete**.\n**DeleteTable**: deletes the table and its items — **far faster** than calling DeleteItem for each one.",
  },
  {
    q: "BatchWriteItem & BatchGetItem: what are the limits?",
    a: "**BatchWriteItem**: up to **25** PutItem/DeleteItem operations, up to **16 MB**, **400 KB per item**, and it **cannot update** items. `UnprocessedItems` reports failures.\n**BatchGetItem**: up to **100 items**, **16 MB**, read **in parallel**. `UnprocessedKeys` reports failures.",
  },
  {
    q: "What is PartiQL?",
    a: "An **SQL-compatible query language** for DynamoDB: SELECT, INSERT, UPDATE, DELETE. It can query **several tables** and supports **batch operations**.\nRuns from the Console, **NoSQL Workbench**, the API, CLI and SDK.",
  },
  {
    q: "What do condition expressions support?",
    a: "`attribute_exists`, `attribute_not_exists`, `attribute_type`, `contains` (string), `begins_with` (string), `IN`, `between`, `size` (string length).\nUsed with PutItem, UpdateItem, DeleteItem, BatchWriteItem.\n**Conditions are for writes**, **Filters are for reads**.",
  },
  {
    q: "How do you avoid overwriting an item?",
    a: "Use **`attribute_not_exists(partition_key)`**.\nFor a table with a sort key: **`attribute_not_exists(partition_key) AND attribute_not_exists(sort_key)`**.",
  },
  {
    q: "What is an LSI (Local Secondary Index)?",
    a: "An **alternative Sort Key** that shares the **same Partition Key** as the base table, with a single scalar attribute as the sort key.\n- Up to **5 LSIs per table**\n- **Must be defined when the table is created**\n- Projection: **KEYS_ONLY, INCLUDE, ALL**\n- Uses the **base table's RCU/WCU** → it has no throttling of its own",
  },
  {
    q: "What is a GSI (Global Secondary Index)?",
    a: "An **alternative Primary Key** (HASH or HASH+RANGE) different from the base table → fast queries on **non-key attributes**.\n- Up to **20 GSIs** (default)\n- **Requires its own RCU/WCU**\n- **Can be added or changed after the table is created**\n- ⚠️ If a GSI is throttled, the **base table is throttled too**, even when its own WCUs are fine",
  },
  {
    q: "What is Optimistic Locking?",
    a: "Use **Conditional Writes** to ensure the item **has not changed** before updating or deleting it. Each item carries a **version number** attribute.",
  },
  {
    q: "What is DAX?",
    a: "**DynamoDB Accelerator** — a **fully-managed, HA** in-memory cache with **microsecond latency** for cached reads and queries.\n- **No application logic changes** (it is compatible with the DynamoDB API)\n- Solves **hot keys** (too many reads)\n- TTL **5 minutes** by default, up to **10 nodes**, **multi-AZ** (**3 nodes** recommended)\n- KMS at rest, VPC, IAM, CloudTrail",
  },
  {
    q: "DAX vs ElastiCache?",
    a: "**DAX**: a cache **purpose-built for DynamoDB**, drop-in, no app changes, and it even handles **strongly consistent** reads (partly).\n**ElastiCache**: a **general-purpose** cache for any data, needs code changes, and has no built-in DynamoDB integration.",
  },
  {
    q: "DynamoDB Streams: characteristics?",
    a: "An **ordered stream** of item-level modifications (create/update/delete).\n- Can be sent to **Kinesis Data Streams**, read by **Lambda** or **KCL**\n- Retention **24 hours**\n- **Shards** like Kinesis, **managed by AWS**\n- Records are **not retroactive** when you first enable it",
  },
  {
    q: "What are the four Stream view types?",
    a: "- **KEYS_ONLY**: only the key attributes\n- **NEW_IMAGE**: the item after the change\n- **OLD_IMAGE**: the item before the change\n- **NEW_AND_OLD_IMAGES**: both",
  },
  {
    q: "What is TTL in DynamoDB?",
    a: "It deletes items automatically after an expiry timestamp.\n- **Costs no WCUs** and adds no cost\n- The attribute must be a **Number** holding a **Unix Epoch timestamp**\n- Deletion happens within **48 hours** of expiry\n- Items not yet deleted **still show up in reads** (filter them yourself if needed)\n- Deleted from **both LSIs and GSIs**\n- Each delete **writes a record to Streams**",
  },
  {
    q: "Which DynamoDB CLI pagination options exist?",
    a: "- `--projection-expression`, `--filter-expression`\n- **`--page-size`**: the CLI fetches the full list but makes several API calls (default 1000 items)\n- **`--max-items`**: the maximum number of items to display (returns a **NextToken**)\n- **`--starting-token`**: the token to continue from",
  },
  {
    q: "What are DynamoDB Transactions?",
    a: "**All-or-nothing** across multiple items/tables, guaranteeing **ACID**.\n- Read modes: Eventual, Strong, **Transactional**; Write: Standard, **Transactional**\n- Costs **2× WCU & RCU** (prepare + commit)\n- **TransactGetItems**, **TransactWriteItems**\n- Use cases: financial, orders, multiplayer games",
  },
  {
    q: "Transaction capacity: 3 transactional writes/s on a 5 KB item?",
    a: "3 × ceil(5/1) = 15, **×2 for transactional** = **30 WCU**.\n\nSimilarly for reads: 5 transactional reads/s on a 5 KB item → 5 × ceil(5/4)=2 → 10, **×2** = **20 RCU**.",
  },
  {
    q: "DynamoDB as a session state cache compared with the alternatives?",
    a: "- vs **ElastiCache**: in-memory, but DynamoDB is **serverless**\n- vs **EFS**: EFS must be attached like a network drive\n- vs **EBS / Instance Store**: local only, not shared\n- vs **S3**: higher latency, not meant for small objects",
  },
  {
    q: "Table cleanup & copying a table?",
    a: "**Cleanup**: **Scan + DeleteItem** (slow, costly) vs **Drop the table + recreate** (fast, cheap).\n**Copy a table**: **AWS Data Pipeline**, **Backup & restore**, or **Scan + PutItem/BatchWriteItem**.",
  },
  {
    q: "DynamoDB security & other features?",
    a: "- **VPC Endpoints** to access without going over the Internet\n- **IAM** controls access\n- **KMS** at rest, **SSL/TLS** in transit\n- **Backup & Restore**, **Point-in-time Recovery (PITR)** — no performance impact\n- **Global Tables**: multi-region, multi-active, fully replicated\n- **DynamoDB Local**: local dev/test\n- **AWS DMS**: migrate from MongoDB, Oracle, MySQL, S3…",
  },
];
