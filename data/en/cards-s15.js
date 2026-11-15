/**
 * English flashcards — a translation of data/s15.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s15"] = [
  {
    q: "What is CI (Continuous Integration)?",
    a: "Developers **push code frequently** to a repo (GitHub, CodeCommit, Bitbucket). A **build/test server** checks it as soon as it is pushed (**CodeBuild**, Jenkins).\nDevelopers get pass/fail feedback → **bugs found early**, faster delivery, more frequent deploys.",
  },
  {
    q: "What is CD (Continuous Delivery)?",
    a: "Ensures software can be **released reliably whenever needed**, deploying **often and fast**. It is the shift from “one release every 3 months” to “**5 releases a day**” — usually **automated deployment** (CodeDeploy, Jenkins CD, Spinnaker).",
  },
  {
    q: "What are the five main services in AWS CICD?",
    a: "- **CodeCommit**: stores the code\n- **CodePipeline**: automates the pipeline\n- **CodeBuild**: build & test\n- **CodeDeploy**: deploy to EC2 (without Beanstalk)\n- **CodeArtifact**: store & share packages\n- **CodeGuru**: automated code review using ML",
  },
  {
    q: "What advantages does CodeCommit have?",
    a: "**Private Git repositories**, **no size limit**, fully managed, highly available.\nCode stays **inside the AWS account** → better security & compliance. Encrypted, with access control.\nIntegrates with Jenkins, CodeBuild and other CI tools.",
  },
  {
    q: "CodeCommit Security: authentication, authorization, encryption?",
    a: "**Authentication**: **SSH keys** (configured in the IAM console), **HTTPS** (AWS CLI credential helper or Git credentials for an IAM user).\n**Authorization**: IAM policies for repositories.\n**Encryption**: at rest with **KMS** automatically, in transit over **HTTPS or SSH**.\n**Cross-account**: use an **IAM Role + STS (AssumeRole)** — never share SSH keys or credentials.",
  },
  {
    q: "CodePipeline stages & providers?",
    a: "**Source**: CodeCommit, ECR, S3, Bitbucket, GitHub\n**Build**: CodeBuild, Jenkins, CloudBees, TeamCity\n**Test**: CodeBuild, AWS Device Farm, third parties\n**Deploy**: CodeDeploy, Elastic Beanstalk, CloudFormation, ECS, S3\n**Invoke**: Lambda, Step Functions\n\nEach stage can have **sequential & parallel actions**, plus **manual approval** at any stage.",
  },
  {
    q: "What are CodePipeline Artifacts?",
    a: "Each stage produces **artifacts**, stored in an **S3 bucket** and **passed to the next stage**.",
  },
  {
    q: "How do you troubleshoot CodePipeline?",
    a: "- Use **CloudWatch Events / EventBridge** for **Pipeline/Action/Stage execution state changes** (failed pipeline, cancelled stage)\n- A failed stage makes the pipeline **stop**; details are in the console\n- An action cannot run → check that the **IAM Service Role** has sufficient permissions\n- **CloudTrail** to **audit AWS API calls**",
  },
  {
    q: "What is CodeBuild?",
    a: "A **fully managed CI service**: continuous scaling (**no servers**, **no build queue**), compiling code, running tests, producing packages.\n- Billed **per minute** of compute\n- Uses **Docker** underneath for **reproducible builds**\n- Uses prepackaged Docker images or your own\n- **KMS** encrypts artifacts, **IAM** permissions, **VPC** networking, **CloudTrail** logs",
  },
  {
    q: "CodeBuild: source, buildspec, logs?",
    a: "**Source**: CodeCommit, S3, Bitbucket, GitHub.\n**Build instructions**: **`buildspec.yml`** at the **root of the code** (or entered in the console).\n**Logs**: **S3 & CloudWatch Logs**. **CloudWatch Metrics** monitor build stats, **EventBridge** for failed builds, **CloudWatch Alarms** for thresholds.",
  },
  {
    q: "Which sections does buildspec.yml have?",
    a: "- **`env`**: environment variables — `variables` (plaintext), **`parameter-store`** (SSM), **`secrets-manager`**\n- **`phases`**: **install** (dependencies), **pre_build** (commands before the build), **build** (build commands), **post_build** (finishing touches, zip the output)\n- **`artifacts`**: uploaded to **S3** (KMS encrypted)\n- **`cache`**: files to cache (dependencies) → **S3** → faster builds",
  },
  {
    q: "Which environments does CodeBuild support?",
    a: "Java, Ruby, Python, Go, Node.js, Android, .NET Core, PHP, **Docker** (to extend any environment).",
  },
  {
    q: "What is CodeDeploy?",
    a: "A deployment service that automates app deployment to **EC2, on-premises, Lambda and ECS**.\n- **Automated Rollback** when a deployment fails or on a **CloudWatch Alarm**\n- **Gradual deployment control**\n- The **`appspec.yml`** file defines how the deployment happens",
  },
  {
    q: "CodeDeploy EC2/On-premises: platform & deployment speed?",
    a: "In-place or blue/green. The **CodeDeploy Agent must run** on the target.\nDeployment speed:\n- **AllAtOnce**: all instances — most downtime, fastest\n- **HalfAtATime**: capacity drops by 50%\n- **OneAtATime**: slowest, least impact\n- **Custom**: any percentage",
  },
  {
    q: "What does the CodeDeploy Agent require?",
    a: "It must **run on the EC2 instances**. It can be installed and updated automatically via **Systems Manager**.\nThe EC2 instance needs **enough permission to access S3** for the deployment bundles.",
  },
  {
    q: "CodeDeploy for Lambda: which configurations?",
    a: "It automatically **shifts traffic for Lambda aliases** and integrates with **SAM**:\n- **Linear**: `LambdaLinear10PercentEvery3Minutes`, `…Every10Minutes`\n- **Canary**: `LambdaCanary10Percent5Minutes`, `LambdaCanary10Percent30Minutes`\n- **AllAtOnce**",
  },
  {
    q: "CodeDeploy for ECS?",
    a: "It deploys a new **Task Definition** automatically. **Blue/Green only**.\nConfigs: `ECSLinear10PercentEvery3Minutes`, `ECSLinear10PercentEvery10Minutes`, `ECSCanary10Percent5Minutes`, `ECSCanary10Percent30Minutes`, `ECSAllAtOnce`.",
  },
  {
    q: "Deploy to ASG: In-place vs Blue/Green?",
    a: "**In-place**: updates the existing EC2 instances, and new instances created by the ASG **are deployed automatically too**.\n**Blue/Green**: creates a **new ASG** (copying the settings), you choose how long to keep the old EC2 instances, and it **requires an ELB**.",
  },
  {
    q: "Redeploy & Rollback?",
    a: "A rollback is **redeploying the previous revision**.\n- **Automatic**: when a deployment fails or a **CloudWatch Alarm** thresholds\n- **Manual**\n- **Disable Rollbacks**\n\n⚠️ A rollback **redeploys the last known good version as a new deployment** (it is not a restore).",
  },
  {
    q: "What is CodeArtifact?",
    a: "Secure, scalable, cost-effective **artifact management** for software development.\nSupports **Maven, Gradle, npm, yarn, twine, pip, NuGet**. Developers and CodeBuild pull dependencies directly from CodeArtifact.\nA **resource policy** authorises other accounts (**read everything or nothing**).",
  },
  {
    q: "CodeGuru Reviewer vs Profiler?",
    a: "**Reviewer**: automated code review for **static code analysis** (during development) — finds critical issues, security vulnerabilities and hard-to-spot bugs. Uses **ML**, supports **Java & Python**, integrates with GitHub, Bitbucket and CodeCommit.\n**Profiler**: visibility and recommendations on **runtime performance** (production) — finds code inefficiencies, reduces CPU and cost, heap summary, anomaly detection, supports **Java & Python**.",
  },
  {
    q: "How is the CodeGuru Profiler agent configured?",
    a: "- **MaxStackDepth**: the maximum stack depth in a profile (A→B→C→D = depth 4 → setting 2 evaluates only A and B)\n- **MemoryUsageLimitPercent**\n- **MinimumTimeForReportingInMilliseconds**\n- **ReportingIntervalInMilliseconds**\n- **SamplingIntervalInMilliseconds** (lower = higher sampling rate)",
  },
  {
    q: "CodeCommit: branches, pull requests & notifications?",
    a: "The default **branch** is **main**; each repo has a **default branch**. A **pull request** is used to **review code** before merging — with **approval rules** (minimum approvers, IAM policy `CodeCommit:CreatePullRequestApprovalRule`).\n**Notifications**: **SNS** (topic + CloudWatch Events/EventBridge) for **branch/repository, pull request and approval status** events → email/Slack.\nA **CodeCommit trigger** sends to **EventBridge** or **SNS/Lambda** on **push** → starts the pipeline.",
  },
  {
    q: "CodeCommit: migrating repos & limits to know?",
    a: "Migrating from another Git: **`git clone --mirror`** → **`git push --mirror`** to CodeCommit (keeping the full history).\n- A repo has **no size limit**, files up to **2 GB**, and **1 repo per region** (no cross-region)\n- **No** GitHub-style **webhooks** — use **EventBridge/SNS**\n- **Cross-account**: use an **IAM Role + STS AssumeRole**, never share credentials",
  },
  {
    q: "CodeCommit vs GitHub — when do you pick which?",
    a: "**CodeCommit**: a **private repo inside the AWS account**, integrated with IAM/KMS/CloudTrail, no external account needed — suits enterprise **compliance**.\n**GitHub**: a huge ecosystem (Actions, marketplace, community) and free public repos.\nBoth work as a **Source** for CodePipeline (**CodeStar Connections** for GitHub).",
  },
  {
    q: "CodePipeline structure: stage, action, action group?",
    a: "**Stage**: a sequential group (Source → Build → Test → Deploy). The first stage is **mandatory and must be Source**, and a pipeline needs at least **2 stages**.\n**Action**: the unit of work in a stage (provider + configuration + input/output artifacts).\n**Action group / run order**: actions with the **same run order run in parallel**; different run orders run **sequentially**.\n**Transition**: the move between stages — can be **disabled** to pause, or have **manual approval** inserted.",
  },
  {
    q: "How does the Manual approval action work?",
    a: "It goes on the **transition between two stages** (not inside a stage). When it is reached the pipeline **pauses** and sends an **SNS notification**.\nSomeone with permission (`codepipeline:PutApprovalResult`) **Approves** or **Rejects** with a comment.\n- Not approving within **7 days** → the pipeline **fails**\n- A specific **role can be blocked** from approving its own deployment (separating deployer from reviewer)",
  },
  {
    q: "CodePipeline cross-region & cross-account?",
    a: "**Artifacts** always live in the **S3 bucket of the pipeline's region**.\n**Cross-region**: declare a `region` for the action → the pipeline **replicates artifacts** into that region's bucket.\n**Cross-account**: a pipeline in account A **assumes a role** in account B to deploy; the artifact bucket's **KMS key policy** must allow account B to **decrypt**.\n⚠️ A common failure: missing **KMS Decrypt** permission → `Access Denied` when reading artifacts.",
  },
  {
    q: "CodePipeline trigger: polling vs event?",
    a: "**Event-based (recommended)**: **EventBridge/CloudWatch Events** — CodeCommit/ECR/S3/GitHub send an event → the pipeline runs **almost immediately**.\n**Polling**: CodePipeline **checks the source itself** about every **1 minute** (the older default, costing API calls).\n**Webhook**: for **GitHub** via **CodeStar Connections** (no more personal access tokens).\nEnable **CloudTrail** to audit and **EventBridge** to catch `Pipeline execution state change` and alert.",
  },
  {
    q: "CodePipeline: cost & artifact retention?",
    a: "You pay **per active pipeline/month** (a pipeline **inactive for >30 days** may not be charged) plus the **S3** cost of artifacts.\n**Artifacts** are **deleted automatically** after the run (configurable). Enable **versioning** on the artifact bucket and a **lifecycle rule** to tidy up.\n**Re-run** a stage with **Retry stage** (reruns from the failed stage) — earlier stages are **not** rebuilt if the artifacts still exist.",
  },
  {
    q: "buildspec.yml: phases and their order?",
    a: "`version` → `env` (variables, parameter-store, secrets-manager) → `phases`:\n1. **install** (runtime, package manager)\n2. **pre_build** (registry login, install dependencies)\n3. **build** (run build/test commands)\n4. **post_build** (package, push image)\n→ `artifacts` (files, base-directory) → `cache` → `reports`.\nCommands in one phase run **sequentially**; if any phase fails the build **fails immediately**.",
  },
  {
    q: "CodeBuild: environment variables & secrets?",
    a: "**env.variables**: **plaintext** values in the buildspec.\n**env.parameter-store**: from **SSM Parameter Store** (safer).\n**env.secrets-manager**: from **Secrets Manager** (`secret-id`, `json-key`, `version-stage`) — **never printed to the log**.\nBuilt-in variables: `CODEBUILD_BUILD_ID`, `CODEBUILD_SOURCE_VERSION`, `CODEBUILD_SRC_DIR`, `AWS_REGION`.\n⚠️ Never hardcode credentials in the buildspec — use the project's **IAM service role**.",
  },
  {
    q: "CodeBuild cache: S3 vs local?",
    a: "**S3 cache**: caches dependencies (npm, pip, Maven) into an **S3 bucket** → reused across builds, **slower** than local but **durable** and shared between builds.\n**Local cache**: cached on the **build instance** — fastest, but **lost** when the instance is recycled; you choose **source, docker layer or a custom path**.\nEnabling cache sharply reduces build time → lowering the **per-minute cost**.",
  },
  {
    q: "CodeBuild inside a VPC & private registries?",
    a: "CodeBuild **runs outside your VPC by default** (with internet).\nTo reach **RDS/ElastiCache/private endpoints**, configure the **VPC, subnet and security group** on the project. Inside a VPC:\n- You need a **NAT Gateway** to keep internet access\n- You need **VPC Endpoints** for **S3, ECR, CloudWatch Logs, CodeBuild** (if using private subnets)\n**Private registry**: for ECR, grant `ecr:GetAuthorizationToken` to the **service role** and log in during **pre_build**.",
  },
  {
    q: "CodeBuild: test & coverage reports?",
    a: "Declare `reports` in the buildspec (`report-group-name`, `files`, `base-directory`) → CodeBuild shows **test reports**, **code coverage** and **pass/fail trends** in the console.\nSupports **JUnit XML, Cucumber JSON, TestNG XML, Clover/JaCoCo/Cobertura** formats.\nCombine **CloudWatch Metrics** (build duration, failed builds) with an **EventBridge rule** for `CodeBuild Build State Change` → alert.",
  },
  {
    q: "CodeDeploy deployment configuration for EC2/ASG?",
    a: "**OneAtATime**: one instance at a time — safest, **slowest**, **only 1 instance** affected.\n**HalfAtATime**: 50% at a time.\n**AllAtOnce**: everything at once — **fastest**, highest **downtime** risk.\n**Custom**: set `minimumHealthyHosts` by **count** or **%**.\n⚠️ If the deployment **fails** past the threshold, CodeDeploy **stops** and (if enabled) **rolls back**.",
  },
  {
    q: "Deployment configuration for Lambda?",
    a: "**AllAtOnce**: all traffic moves **immediately**.\n**Canary**: `Canary10Percent5Minutes` = **10% of traffic** for **5 minutes**, then **100%**.\n**Linear**: `Linear10PercentEvery1Minute` = **+10% every minute**.\n⚠️ Use a **CloudWatch Alarm** as a **Hook** → if it alarms during the traffic shift, it **rolls back automatically** to the old version.",
  },
  {
    q: "AppSpec: structure for EC2 vs Lambda vs ECS?",
    a: "**EC2/On-premises** (`appspec.yml`): `version`, `os`, `files` (source → destination), `permissions`, `hooks` per **lifecycle event**.\n**Lambda** (`appspec.yaml`): `version`, `Resources` → `myFunction` with `Type: AWS::Lambda::Function`, `Properties` (`Alias`, `CurrentVersion`, `TargetVersion`), `Hooks` = **BeforeAllowTraffic / AfterAllowTraffic**.\n**ECS**: `Resources` → `TaskDefinition`, `LoadBalancerInfo` (container name, port), `Hooks`.\n⚠️ AppSpec **differs per platform** — a wrong schema fails the deployment immediately.",
  },
  {
    q: "CodeDeploy lifecycle event hooks (EC2/On-prem)?",
    a: "Order: **BeforeInstall** → **AfterInstall** → **ApplicationStart** → **ValidateService** (the most important — verifies the app runs correctly).\nWith an **ELB**, add **BeforeBlockTraffic → BlockTraffic → AfterBlockTraffic** and **BeforeAllowTraffic → AllowTraffic → AfterAllowTraffic**.\nEach hook is a script (`.sh`) or a Lambda — if a hook **fails** the deployment **stops and rolls back**.\nA failing `ValidateService` is the most common cause of an app that is not healthy.",
  },
  {
    q: "CodeDeploy agent & deployment group?",
    a: "The **agent** must be **installed and running** on **every** EC2 instance (without it the instance is **skipped** and cannot be deployed). Install it via **SSM** or user data.\nA **deployment group** is a set of instances selected by **tag** or **ASG name**, with a **service role**, **deployment config**, **rollback settings** and a **CloudWatch alarm**.\n**Blue/Green**: creates a **new ASG** (copying the source ASG settings) → you **must use an ELB/ALB** to shift traffic, and old instances are kept for a configured time.",
  },
  {
    q: "CodeDeploy Blue/Green for ECS?",
    a: "CodeDeploy manages **2 target groups** on an **ALB/NLB**: **blue** (the current task set) and **green** (the new one).\n- Requires **2 listeners** (production + test) pointing at the two target groups\n- Traffic moves using **CodeDeployDefault.ECSLinear10PercentEvery1Minutes** / **Canary** / **AllAtOnce**\n- **Rollback** = shift traffic back to blue, with no image rebuild\n⚠️ The new task definition must be **healthy** before traffic moves.",
  },
  {
    q: "CodeArtifact: domain, repository, upstream?",
    a: "**Domain**: groups repositories and **shares packages** across accounts/repos. **Repository**: holds packages (npm, pip, Maven, NuGet).\n**Upstream repository**: repo **A** points its upstream at repo **B** → when A lacks a package it **fetches it from B** (and from the **public** npm/maven central repos if configured).\nAn **external connection** to a **public repo** caches external packages → builds no longer depend on direct internet access.",
  },
  {
    q: "CodeArtifact auth: token & CodeBuild?",
    a: "Get an **auth token** with `aws codeartifact get-authorization-token` — the token **expires after 12 hours** (default) and is used for `npm login` / `pip config`.\nWith **CodeBuild**: give the service role `codeartifact:GetAuthorizationToken`, `GetRepositoryEndpoint`, `ReadFromRepository` → log in during **pre_build** (`aws codeartifact login --tool npm`).\nThe repo/domain **resource policy** gives other accounts **read** or **read+write**.",
  },
  {
    q: "CodeArtifact vs an S3 artifact bucket?",
    a: "**CodeArtifact**: manages **packages** (npm/pip/Maven/NuGet) with awareness of **dependencies + versions**, supports **upstreams**, and `login` lets the package manager use it directly.\n**S3 artifact bucket**: **raw files** (zip, jar, image layer) — CodePipeline uses it to pass artifacts between stages, and it does not resolve dependencies.\n→ Smart dependency caching: **CodeArtifact**. Passing pipeline artifacts: **S3**.",
  },
  {
    q: "What is AWS AppConfig, and what problem does it solve?",
    a: "A service (part of **Systems Manager**) for **deploying application configuration** and **feature flags** **safely** — with **validation, monitoring and automatic rollback**.\nThe problem: changing config then redeploying the app is **risky**; hard-coded config **cannot change at runtime**.\nAppConfig lets you **toggle a feature** or change a parameter **without deploying code**, and **rolls back automatically** if something breaks.",
  },
  {
    q: "AppConfig: application, environment, configuration profile?",
    a: "**Application**: the container for the logic (per app/service).\n**Environment**: separates **dev / test / prod** — each env has its own **deployment strategy** and **monitoring**.\n**Configuration profile**: where the config and its **source** are declared. The source can be:\n- **Hosted configuration** (freeform, stored in AppConfig)\n- An **SSM Parameter Store** parameter\n- An **SSM Document**\n- An **S3 object**\n- **Feature flag** (a separate profile type)",
  },
  {
    q: "What is an AppConfig deployment strategy?",
    a: "It defines **how the config is rolled out**: **speed** + **bake time**.\n**Predefined**:\n- `AppConfig.AllAtOnce` — immediately\n- `AppConfig.Linear50PercentEvery30Seconds`\n- `AppConfig.Canary10Percent20Minutes`\n**Custom**: set the **step percentage**, **deployment duration** and **bake time**.\n**Bake time**: the period **after the deploy completes** during which AppConfig **keeps watching** CloudWatch alarms before considering it done → this is when a rollback can still happen.",
  },
  {
    q: "How does AppConfig rollback work?",
    a: "Attach a **CloudWatch Alarm** to the **environment**. During the deployment or the **bake time**, if the alarm goes **ALARM** → AppConfig **rolls back immediately** to the previous configuration version.\nThe alarm should measure the app's **business metrics** (error rate, latency, 5xx), not just infrastructure.\nThis is the core difference from reading config from S3/Parameter Store yourself: **it is a safety net**.",
  },
  {
    q: "AppConfig: validators (config checks)?",
    a: "Two kinds:\n- A **JSON Schema validator** (`JSON_SCHEMA`) — checks **syntax/structure** (syntactic)\n- A **Lambda validator** — runs a **Lambda function** to check **semantics**, e.g. the port must be in an allowed range, the DB host must exist\nValidators run **before** the config is deployed. A failure → **no deploy**, and an error is reported.\n⚠️ You can attach **at most 2 validators** to one configuration profile.",
  },
  {
    q: "What is a feature flag in AppConfig?",
    a: "A **Feature flag**-type **configuration profile** holding **flags** (on/off) with **attributes**.\nIt lets you **enable a feature for a group of users** (e.g. **premium customers**) with **no code deploy**, and **turn it off instantly** if something breaks.\nCombined with a **deployment strategy** → gradual rollout (**canary/linear**) instead of enabling it for everyone at once.",
  },
  {
    q: "How does an app read config from AppConfig?",
    a: "The **AppConfig Agent** (recommended): a **Lambda extension**, a **sidecar for ECS/EKS**, or running on **EC2** — the agent **caches config locally** and exposes an **HTTP endpoint** (`localhost:2772`).\nThe app calls the local endpoint → **fast**, no network dependency, and the agent **polls for updates** and **retries** itself.\nAlternatively call the **API** `appconfig:GetConfiguration` directly (needs IAM permission and manual caching).\n⚠️ With **Lambda**, the agent runs as an **extension** so config is ready as soon as the function starts.",
  },
  {
    q: "How does AppConfig differ from Parameter Store / Secrets Manager?",
    a: "**Parameter Store**: stores simple **key-values** with versions, suited to **static/rarely changing** config; **no** validation, deployment strategy or alarm-based rollback.\n**Secrets Manager**: purpose-built for **secrets** (passwords, API keys) with **automatic rotation**.\n**AppConfig**: for **dynamic config & feature flags** with **validators + gradual rollout + automatic rollback**.\n→ AppConfig **can read** Parameter Store as a source, but it exists to solve **safe deployment**.",
  },
  {
    q: "Which services does AppConfig integrate with?",
    a: "**Compute**: **Lambda** (extension), **ECS/EKS** (sidecar), **EC2** (agent).\n**Pipeline**: **CodePipeline** has an **AppConfig** action to deploy config as a stage.\n**IaC**: **CloudFormation** `AWS::AppConfig::*` resources.\n**Monitoring**: **CloudWatch Alarms** for rollback, **EventBridge** for deployment events, **CloudTrail** to audit who changed config.",
  },
  {
    q: "What is AWS CloudShell?",
    a: "A **browser-based shell** running inside the **AWS Console**, **already signed in** with the current console user's credentials.\n**Nothing to install**: **AWS CLI, SDKs, git, npm, pip, docker CLI…** are all available.\n→ Use it to run CLI commands, test APIs or scripts quickly without configuring a local machine.",
  },
  {
    q: "CloudShell: limits and storage?",
    a: "**1 GB of persistent storage** per **region** — files in `$HOME` **persist** between sessions **in the same region**; another region is **separate storage**.\nA session **expires after ~20–30 minutes of inactivity** (the compute environment is recycled, but `$HOME` survives).\nIt runs in the **region's AZ** with **internet**; it **cannot** reach your **private subnets/VPC**.\n**Free** (you only pay for resources you create). It cannot be used with the **root user** in some cases.",
  },
  {
    q: "What is Amazon Q Developer?",
    a: "AWS's **AI coding companion** (the successor to **CodeWhisperer** + **Amazon Q**).\nFeatures: **inline completion**, **chat in the IDE/console**, **generating code & tests**, **security scanning**, **code transformation** (Java version upgrades), **explaining & debugging errors**.\nSupports many languages (Python, Java, JS/TS, C#, Go…), integrates with **VS Code, JetBrains, the CLI and the AWS Console**.\n→ Part of the **Developer Tools** domain in the DVA-C02 guide.",
  },
  {
    q: "How does Amazon Q Developer differ from CodeGuru?",
    a: "**Amazon Q Developer**: an **interactive AI assistant** — suggests code as you write, chats, generates tests, scans for security issues, **transforms** code; used **while developing**.\n**CodeGuru Reviewer**: **automated review** on **pull requests** (static analysis, ML) — finds bugs and vulnerabilities in existing code.\n**CodeGuru Profiler**: analyses **runtime performance** in **production** (CPU, heap, latency).\n→ Q Developer **writes code with you**; CodeGuru **inspects your code & runtime**.",
  },
];
