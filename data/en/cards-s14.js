/**
 * English flashcards — a translation of data/s14.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s14"] = [
  {
    q: "What is AWS SAM?",
    a: "**Serverless Application Model** — a framework for developing and deploying serverless apps, configured entirely in **YAML**.\n- Generates **complex CloudFormation** from simple SAM YAML\n- Supports everything in CloudFormation (Outputs, Mappings, Parameters, Resources)\n- Uses **CodeDeploy** to deploy Lambda\n- Runs **Lambda, API Gateway and DynamoDB locally**",
  },
  {
    q: "SAM recipe: Transform header & resource types?",
    a: "`Transform: 'AWS::Serverless-2016-10-31'`\nResources: `AWS::Serverless::Function`, `AWS::Serverless::Api`, `AWS::Serverless::SimpleTable`.\nDeploy: **`sam deploy`** (optionally `sam package` first).\nFast sync: **`sam sync --watch`**.",
  },
  {
    q: "SAM Accelerate / sam sync options?",
    a: "- `sam sync`: syncs **code + infrastructure**\n- `sam sync --code`: syncs code **without touching infra** (bypasses CloudFormation, seconds)\n- `sam sync --code --resource AWS::Serverless::Function`: Lambda functions only\n- `sam sync --code --resource-id HelloWorldLambdaFunction`: one specific resource\n- `sam sync --watch`: monitors file changes; a config change → `sam sync`, a code change → `sam sync --code`",
  },
  {
    q: "How do you debug with the SAM CLI?",
    a: "It builds, tests and debugs **locally** in a **lambda-like** environment. **SAM CLI + AWS Toolkits** → step-through debugging.\nIDEs: Cloud9, **VS Code**, JetBrains, PyCharm, IntelliJ. AWS Toolkits are plugins to build/test/debug/deploy/invoke Lambda.",
  },
  {
    q: "What are examples of SAM Policy Templates?",
    a: "- **S3ReadPolicy**: read-only access to S3 objects\n- **SQSPollerPolicy**: poll an SQS queue\n- **DynamoDBCrudPolicy**: create/read/update/delete\n\nThey are templates that grant a Lambda function permissions (generating the IAM policy for you).",
  },
  {
    q: "SAM + CodeDeploy: traffic shifting?",
    a: "SAM **natively uses CodeDeploy** to update Lambda.\n- **Traffic Shifting**, **Pre/Post traffic hooks**, automatic rollback via **CloudWatch Alarms**\n- **AutoPublishAlias**: detects new code → publishes a version → points the alias at it\n- **DeploymentPreference**: **Canary, Linear, AllAtOnce**\n- **Alarms**, **Hooks**",
  },
  {
    q: "What are the SAM local commands?",
    a: "- **`sam local start-lambda`**: an endpoint that emulates Lambda (for automated tests)\n- **`sam local invoke`**: invoke once with a payload\n- **`sam local start-api`**: a local HTTP server hosting all functions (auto reload)\n- **`sam local generate-event`**: generates sample payloads for S3, API Gateway, SNS, Kinesis, DynamoDB…",
  },
  {
    q: "What is the AWS CDK?",
    a: "**Cloud Development Kit** — defines cloud infrastructure in **familiar programming languages**: JavaScript/TypeScript, **Python**, Java, .NET.\n- Provides high-level components called **constructs**\n- Code is **“compiled” into a CloudFormation template** (JSON/YAML)\n- Deploys **infrastructure + runtime code** together (Lambda, Docker ECS/EKS)",
  },
  {
    q: "CDK vs SAM?",
    a: "**SAM**: focused on **serverless**, **declarative JSON/YAML** templates, quick to start with Lambda, uses CloudFormation.\n**CDK**: **every AWS service**, written in **programming languages**, also uses CloudFormation.\n\n✅ You **can use the SAM CLI to test a CDK app locally** — but run `cdk synth` first.",
  },
  {
    q: "What is CDK Bootstrapping?",
    a: "It provisions resources for CDK **before deploying**. An environment = **account + region**.\nIt creates the **`CDKToolkit`** CloudFormation stack containing an **S3 bucket** (for files) and **IAM roles** (for deployment).\nCommand: **`cdk bootstrap aws://<account>/<region>`** for each new environment.\nWithout bootstrapping you get the error *“Policy contains a statement with one or more invalid principal”*.",
  },
  {
    q: "How do you test a CDK app?",
    a: "Use the **CDK Assertions Module** plus a test framework (**Jest** for JS, **Pytest** for Python).\nTwo kinds of test:\n- **Fine-grained Assertions** (most common): verify a specific resource/property\n- **Snapshot Tests**: compare the template against a baseline\n\nImport: `Template.fromStack(MyStack)` or `Template.fromString(mystring)`.",
  },
  {
    q: "Cognito User Pools vs Identity Pools?",
    a: "**User Pools** = **authentication** (verify identity) — a user database for web/mobile apps.\n**Identity Pools (Federated Identity)** = **authorization** (control access) — issue **temporary AWS credentials** to access AWS resources directly.\n👉 **CUP + CIP = authentication + authorization**.",
  },
  {
    q: "Which user features does a Cognito User Pool have?",
    a: "- A **serverless user database** for web & mobile apps\n- Login with **username (or email) / password**\n- **Password reset**, **email & phone verification**\n- **MFA**\n- **Federated identities**: Facebook, Google, SAML…\n- Blocks a user if their credentials leak elsewhere\n- Login returns a **JWT (JSON Web Token)**",
  },
  {
    q: "Which services integrate with a User Pool?",
    a: "**API Gateway** and **Application Load Balancer** (ALB authenticates via a Cognito User Pool).\nThere are **Lambda triggers** that run **synchronously** in the authentication flow.\nThere is a **Hosted Authentication UI** (sign-up/sign-in) supporting social login, OIDC, SAML, and custom logo & CSS.",
  },
  {
    q: "What does ALB + Cognito User Pool require?",
    a: "1. Create the User Pool, a **Client** and a **Domain**\n2. Ensure it returns the **ID token**\n3. Add social/corporate IdPs if needed\n4. Configure the redirect URL (the Cognito domain + `/oauth2/idpresponse`)\n5. Allow the Cognito domain on the IdP's callback URL",
  },
  {
    q: "Where does an Identity Pool get identity from?",
    a: "**Public providers** (Login with Amazon, Facebook, Google, Apple), **Cognito User Pool**, **OIDC**, **SAML**, **Developer Authenticated Identities** (a custom login server).\nIt supports **unauthenticated (guest) access**.\nUsers are mapped to **IAM roles & policies**, customisable by **user_id** (fine-grained).",
  },
  {
    q: "What is AWS Step Functions?",
    a: "It models a workflow as **state machines** (one per workflow), written in **JSON**.\n- Visualises the workflow, executions & history\n- Started via an SDK call, **API Gateway**, **EventBridge**\n- Use cases: order fulfilment, data processing, web apps…",
  },
  {
    q: "What can a Task State do?",
    a: "- Invoke **Lambda**\n- Run an **AWS Batch job**\n- Run an **ECS task** and wait for it to finish\n- Insert an item into **DynamoDB**\n- Publish to **SNS / SQS**\n- Launch another **Step Function**\n- Run an **Activity** (EC2, ECS, on-premises) — the Activity **polls** Step Functions for work and sends back the result",
  },
  {
    q: "Which State types matter?",
    a: "- **Choice**: test conditions → branch (or default)\n- **Fail / Succeed**: stop with failure/success\n- **Pass**: pass input → output, or inject data\n- **Wait**: delay for a period or until a timestamp\n- **Map**: dynamically iterate steps\n- **Parallel**: run branches concurrently",
  },
  {
    q: "Error Handling: Retry & Catch?",
    a: "Handle **Retry** and **Catch** inside the **state machine** instead of in application code.\nPredefined error codes:\n- **States.ALL**: any error\n- **States.Timeout**: ran past TimeoutSeconds, or no heartbeat\n- **States.TaskFailed**: execution failure\n- **States.Permissions**: missing permissions",
  },
  {
    q: "What are the Retry parameters?",
    a: "Evaluated **top → bottom**:\n- **ErrorEquals**: the error type\n- **IntervalSeconds**: the initial delay\n- **BackoffRate**: the multiplier applied after each retry\n- **MaxAttempts**: default **3**, set **0** to never retry\n\nReaching max attempts → **Catch** fires.",
  },
  {
    q: "Wait for Task Token?",
    a: "Pauses Step Functions inside a Task until a **Task Token** is returned.\n- For **human approval**, third parties, legacy systems\n- Add **`.waitForTaskToken`** to `Resource`\n- The task stays paused until the token arrives via **SendTaskSuccess / SendTaskFailure**",
  },
  {
    q: "Activity Tasks & heartbeat?",
    a: "An Activity Worker (EC2, Lambda, mobile) **polls** with **`GetActivityTask`** and sends results with **SendTaskSuccess/SendTaskFailure**.\n- **TimeoutSeconds**: how long the task waits\n- **SendTaskHeartBeat** within **HeartBeatSeconds** keeps the task active\n- A long timeout plus regular heartbeats → the task can wait up to **1 year**",
  },
  {
    q: "What is AWS AppSync?",
    a: "A managed service using **GraphQL** — the app fetches **exactly the data it needs** and **combines data from several sources** (NoSQL, relational, HTTP API, Lambda).\n- Integrates with **DynamoDB, Aurora, OpenSearch**\n- **Real-time** over **WebSocket** or **MQTT on WebSocket**\n- Mobile: local data access + sync\n- You start by **uploading a GraphQL schema**",
  },
  {
    q: "What are the four ways to authorize AppSync?",
    a: "- **API_KEY**\n- **AWS_IAM** (IAM users/roles, cross-account)\n- **OPENID_CONNECT** (OIDC provider / JWT)\n- **AMAZON_COGNITO_USER_POOLS**\n\nFor a custom domain & HTTPS → put **CloudFront** in front of AppSync.",
  },
  {
    q: "What is AWS Amplify?",
    a: "A toolset for building **mobile & web apps** — “**Elastic Beanstalk for mobile/web**”.\n- Features: data storage, authentication, storage, machine learning (powered by AWS)\n- **Front-end libraries** for React, Vue, JS, iOS, Android, Flutter\n- **Amplify CLI** or **Amplify Studio**",
  },
  {
    q: "What do Amplify Authentication & DataStore use?",
    a: "**Authentication** → **Amazon Cognito**: registration, auth, account recovery, **MFA**, social sign-in, pre-built UI, fine-grained authorization.\n**DataStore** → **AppSync + DynamoDB**: work with local data, auto-sync to the cloud, **GraphQL**, offline & real-time, visual data modelling with Amplify Studio.",
  },
  {
    q: "Amplify Hosting & E2E Testing?",
    a: "**Hosting**: builds and hosts modern web apps, CICD (build/test/deploy), **PR previews**, custom domains, monitoring, redirects & custom headers, password protection.\n**E2E Testing**: runs in the **test phase** of the build (amplify.yml), integrates **Cypress**, and generates a UI report.",
  },
];
