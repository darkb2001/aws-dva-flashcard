/**
 * English flashcards — a translation of data/s05.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s05"] = [
  {
    q: "What is a VPC? What are the CIDR limits?",
    a: "**Virtual Private Cloud** — a private virtual network inside AWS.\n- Up to **5 VPCs per region** (soft limit)\n- Up to **5 CIDRs per VPC**\n- Each CIDR: minimum **/28** (16 IPs), maximum **/16** (65,536 IPs)\n- Prefer a **private IPv4 range (RFC 1918)**\n- It must **not overlap** another network (e.g. corporate)",
  },
  {
    q: "What are the characteristics of the Default VPC?",
    a: "Every new account has a **default VPC**. An EC2 instance launched without picking a subnet lands here. The default VPC **has Internet connectivity**, and instances get a **public IPv4**.",
  },
  {
    q: "How many IPs does AWS reserve in each subnet?",
    a: "**5 IPs** (four at the start, one at the end) that cannot be assigned to EC2. For `10.0.0.0/24`:\n- `10.0.0.0` network address\n- `10.0.0.1` VPC router\n- `10.0.0.2` Amazon-provided DNS\n- `10.0.0.3` future use\n- `10.0.0.255` network broadcast (AWS does not support broadcast)",
    tip: "Need 29 IPs → a /27 only has 27 usable (not enough), so use /26 = 59.",
  },
  {
    q: "What is a Subnet?",
    a: "It splits the VPC by **AZ** (a subnet belongs to exactly one AZ), and each subnet has its **own CIDR**. Whether it is a public or private subnet depends on the route table.",
  },
  {
    q: "How does an Internet Gateway (IGW) work?",
    a: "- Lets resources in the VPC **reach the Internet**\n- Created **separately** from the VPC\n- **1 VPC ↔ 1 IGW** (and vice versa)\n- **It is not enough on its own**: you must edit the **Route Table** to route `0.0.0.0/0` to the IGW",
  },
  {
    q: "NAT Gateway: characteristics?",
    a: "An AWS-managed NAT with high bandwidth, HA, and no administration.\n- Billed by the **hour + bandwidth**\n- Created in **one specific AZ**, uses an **Elastic IP**\n- Needs an **IGW**: Private Subnet → NATGW → IGW\n- **5 Gbps**, auto-scaling to **100 Gbps**\n- **No Security Group needed**",
  },
  {
    q: "What is a Bastion Host?",
    a: "An EC2 instance in a **public subnet** used to **SSH into private instances**.\n- The bastion's SG: allow **port 22** from a **restricted CIDR** (e.g. the company's CIDR)\n- The private instance's SG: allow traffic from the **bastion's SG** (or the bastion's private IP)",
  },
  {
    q: "What is a NACL?",
    a: "**Network Access Control List** — a firewall at the **subnet level**.\n- **1 NACL per subnet**, and a new subnet gets the **Default NACL**\n- Has both **ALLOW and DENY**\n- Rules are **by IP only**\n- Very useful for **blocking a single IP** at the subnet level",
  },
  {
    q: "How do Security Groups differ from NACLs?",
    a: "| | Security Group | NACL |\n|---|---|---|\n| Level | **instance** | **subnet** |\n| Rules | **allow only** | allow + **deny** |\n| Stateful | **Stateful** | **Stateless** (needs ephemeral ports) |\n| Evaluation | all rules before deciding | **in order**, first match wins |\n| Applied | when specified | **automatically** to every EC2 in the subnet |",
  },
  {
    q: "How does the Default NACL behave?",
    a: "It allows **everything inbound and outbound** for the associated subnet. Recommendation: **do not modify the Default NACL** — create a **custom NACL** instead.",
  },
  {
    q: "VPC Peering: three things to remember?",
    a: "1. Connects two VPCs **privately**, behaving as one network\n2. **CIDRs must not overlap**\n3. It is **NOT transitive** — A↔B and B↔C does **not** give A↔C\n\nYou must **update the route tables** on both sides.",
  },
  {
    q: "What problem do VPC Endpoints solve?",
    a: "Every AWS service is exposed through a **public URL**. A VPC Endpoint (powered by **PrivateLink**) lets you reach it **over the private network**, removing the need for an IGW/NAT.\nIt is redundant and scales horizontally. When it fails: check **DNS resolution** and **route tables**.",
  },
  {
    q: "Interface Endpoint vs Gateway Endpoint?",
    a: "**Interface** (PrivateLink): creates an **ENI (private IP)**, **requires a Security Group**, supports **most** AWS services, charged **$/hour + $/GB**.\n**Gateway**: creates a gateway used as a **route table target**, **no Security Group**, supports **only S3 & DynamoDB**, and is **free**.",
  },
  {
    q: "VPC Flow Logs: scope and destinations?",
    a: "Captures IP traffic at the **VPC / Subnet / ENI** level. Helps you **monitor and troubleshoot connectivity**.\nDestinations: **S3, CloudWatch Logs, Kinesis Data Firehose**. It also captures ELB, RDS, ElastiCache, Redshift, NATGW and Transit Gateway.",
  },
  {
    q: "VPC Flow Logs: which fields matter?",
    a: "- **srcaddr / dstaddr**: identifies the IP with the problem\n- **srcport / dstport**: the port with the problem\n- **Action**: whether success/failure came from an SG or a NACL\n\nQuery with **Athena over S3** or **CloudWatch Logs Insights**.",
  },
  {
    q: "Site-to-Site VPN vs Direct Connect?",
    a: "**Site-to-Site VPN**: connects on-premises to AWS over the **public internet**, **encrypted automatically**, fast to set up.\n**Direct Connect (DX)**: a dedicated **physical connection**, private/secure/fast, travels over a **private network**, and takes **at least a month** to provision.",
  },
  {
    q: "How do you provide redundancy when Direct Connect fails?",
    a: "Use a **backup DX connection** (expensive) or a **Site-to-Site VPN** as the backup.",
  },
];
