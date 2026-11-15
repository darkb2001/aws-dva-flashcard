/**
 * English flashcards — a translation of data/s06.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s06"] = [
  {
    q: "What problem does Docker solve?",
    a: "It packages an app into a **container** that runs on **any OS or machine**: no compatibility issues, predictable behaviour, easy to maintain and deploy. Use cases: microservices, lift-and-shift.",
  },
  {
    q: "Where are Docker images stored?",
    a: "- **Docker Hub**: public repository\n- **Amazon ECR** (Elastic Container Registry): a **private** repo plus the **public** repo (ECR Public Gallery — gallery.ecr.aws)",
  },
  {
    q: "Docker vs Virtual Machine?",
    a: "Docker **shares resources with the host** → many containers on one server, lighter than a VM. A VM virtualises the hardware, and each VM has its own OS.",
  },
  {
    q: "What are the four container platform choices on AWS?",
    a: "- **ECS**: Amazon's own container platform\n- **EKS**: managed Kubernetes (open source)\n- **Fargate**: serverless container platform (runs with ECS & EKS)\n- **ECR**: stores container images",
  },
  {
    q: "What are the core ECS concepts?",
    a: "- **Cluster**: a group of services & tasks — must be created first\n- **Task**: the basic unit of work, holding one or more containers\n- **Task Definition**: JSON metadata describing how to run the container\n- **Service**: monitors tasks, keeps them running, and exposes them externally",
  },
  {
    q: "What does a Task Definition contain?",
    a: "**Image name**, port binding (container & host), **memory & CPU**, environment variables, networking, **IAM Role**, logging config (CloudWatch).\nUp to **10 containers** per Task Definition.",
  },
  {
    q: "How does the ECS EC2 Launch Type work?",
    a: "Tasks run on **your own EC2 instances** — you **provision and maintain** the infrastructure.\nEvery EC2 instance must run the **ECS Agent** to register with the cluster. AWS handles starting and stopping containers.",
  },
  {
    q: "What does the ECS Agent do?",
    a: "It is installed on each **EC2 container instance** (included by default in the ECS AMI).\nIt handles container deploy requests, manages container **lifecycle**, and talks to ECS, ECR, CloudWatch Logs, S3 and DynamoDB.",
  },
  {
    q: "EC2 Instance Profile vs ECS Task Role?",
    a: "**EC2 Instance Profile** (EC2 launch type only): for the **ECS Agent** — to call the ECS API, send logs to CloudWatch, pull images from ECR, and read secrets from Secrets Manager/SSM.\n**ECS Task Role**: for **each individual task** — every service should have its own role, declared in the task definition.",
  },
  {
    q: "How does the Fargate launch type differ from the EC2 launch type?",
    a: "Tasks run on **Fargate** (managed by AWS) — **no EC2 to provision**, fully **serverless**.\nYou only create a task definition and AWS runs it with the CPU/RAM required. Scaling = more tasks.",
  },
  {
    q: "Which load balancers can ECS integrate with?",
    a: "- **ALB**: supported and suited to most use cases\n- **NLB**: recommended for **high throughput** or together with **PrivateLink**\n- **CLB**: supported but **not recommended** (no advanced features, **no Fargate**)",
  },
  {
    q: "ECS data volumes: EFS vs Bind Mounts?",
    a: "**EFS**: mounted into tasks, works on both EC2 & Fargate, and tasks in any AZ **share data** → Fargate + EFS = serverless. **S3 cannot be mounted as a file system**.\n**Bind Mounts**: share between containers **in the same Task Definition**. EC2 uses instance storage; Fargate uses ephemeral storage of **20–200 GiB** (default 20).",
  },
  {
    q: "Which metrics does ECS Service Auto Scaling use?",
    a: "**AWS Application Auto Scaling**:\n- ECS Service **Average CPU**\n- ECS Service **Average Memory**\n- **ALB Request Count Per Target**\n\nPolicies: Target Tracking, Step Scaling, Scheduled Scaling.\n**Task-level scaling is not the same as EC2 instance-level scaling.**",
  },
  {
    q: "How do you auto scale EC2 with the EC2 launch type?",
    a: "- **ASG Scaling**: scale the ASG on CPU utilisation, adding instances\n- **ECS Cluster Capacity Provider**: automatically provisions/scales infrastructure for tasks, paired with an ASG, adding EC2 when capacity runs short (CPU, RAM)",
  },
  {
    q: "ECS Rolling Update: Min 50% Max 100% vs Min 100% Max 150%?",
    a: "Starting from 4 tasks:\n- **Min 50%, Max 100%**: can stop 2 old tasks and start 2 new ones → temporarily runs below capacity\n- **Min 100%, Max 150%**: start 2 new tasks first (6 total), and only stop the old ones once they are healthy → **no capacity loss**",
  },
  {
    q: "What is Dynamic Host Port Mapping (EC2 launch type)?",
    a: "You define only the **container port** in the task definition → the host port is assigned **dynamically**. The ALB finds the right port on the EC2 instance itself.\n→ The EC2 instance's SG must allow any port **from the ALB's SG**.",
  },
  {
    q: "How does load balancing differ on Fargate?",
    a: "Each task has its **own private IP**, and you define only the **container port** (there is no host port).\nThe ECS ENI's SG: allow port 80 from the ALB; the ALB's SG: allow 80/443 from the web.",
  },
  {
    q: "What are the three ways to inject environment variables into ECS?",
    a: "- **Hardcoded** (URLs…)\n- **SSM Parameter Store** (API keys, shared config)\n- **Secrets Manager** (database passwords)\n- **Environment Files (bulk)** from **Amazon S3**",
  },
  {
    q: "What is Amazon ECR?",
    a: "**Elastic Container Registry** — stores and manages Docker images on AWS.\nPrivate and public repos, ECS integration, **backed by S3**, access via **IAM**. Supports **vulnerability scanning**, versioning, image tags and lifecycle policies.",
  },
  {
    q: "Which CLI v2 commands log in and push to ECR?",
    a: "```\naws ecr get-login-password --region region | docker login --username AWS \\\n  --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com\ndocker push aws_account_id.dkr.ecr.region.amazonaws.com/demo:latest\n```\n**Cannot pull the image → check IAM permissions.**",
  },
  {
    q: "What is AWS Copilot?",
    a: "A CLI for building, releasing and operating production-ready **containerized apps**.\nRuns on **AppRunner, ECS, Fargate**. It provisions infrastructure automatically (ECS, VPC, ELB, ECR), deploys with one command via CodePipeline, and provides multiple environments plus logs and health.",
  },
  {
    q: "What is Amazon EKS, and when do you choose it?",
    a: "**Elastic Kubernetes Service** — a managed Kubernetes cluster on AWS.\nChoose it when the company **already runs Kubernetes** on-premises or in another cloud and wants to migrate. Kubernetes is **cloud-agnostic**.\nSupports **EC2 worker nodes** or **Fargate**. One cluster per region.",
  },
  {
    q: "What are the three types of EKS node?",
    a: "- **Managed Node Groups**: EKS creates and manages the nodes (EC2); they belong to an **ASG managed by EKS**, supporting On-Demand & Spot\n- **Self-Managed Nodes**: you create the nodes, register them with the cluster and manage them with an ASG, using the **EKS Optimized AMI**\n- **AWS Fargate**: **no nodes**, no maintenance",
  },
  {
    q: "Which data volumes does EKS support?",
    a: "It needs a **Storage Class manifest** and uses a **CSI driver**:\n- **Amazon EBS**\n- **Amazon EFS** (works with Fargate)\n- **Amazon FSx for Lustre**\n- **Amazon FSx for NetApp ONTAP**",
  },
  {
    q: "How do you collect logs and metrics for EKS?",
    a: "**CloudWatch Container Insights**.",
  },
];
