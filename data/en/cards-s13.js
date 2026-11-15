/**
 * English flashcards — a translation of data/s13.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s13"] = [
  {
    q: "What does API Gateway provide?",
    a: "- Lambda + API Gateway: **no infrastructure to manage**\n- **WebSocket** support\n- **API versioning** (v1, v2), multiple **environments** (dev/test/prod)\n- **Security** (authentication & authorization)\n- **API keys**, **request throttling**\n- Import **Swagger/OpenAPI**, transform & validate requests and responses\n- **Generate SDKs**, **cache API responses**",
  },
  {
    q: "HTTP API vs REST API?",
    a: "**HTTP API**: low-latency, cost-effective, Lambda proxy / HTTP proxy / private integration (**no data mapping**), supports **OIDC & OAuth 2.0**, **CORS built in**. **No usage plans or API keys**.\n**REST API**: the **full feature set** (apart from native OIDC/OAuth2).",
  },
  {
    q: "What are the three API Gateway integration groups?",
    a: "- **Lambda Function**: expose a REST API backed by Lambda\n- **HTTP**: expose an HTTP backend (on-prem, ALB) — adds rate limiting, caching, auth, API keys\n- **AWS Service**: expose any AWS API (Step Functions, SQS…) — adds auth and rate control",
  },
  {
    q: "What are the three Endpoint Types?",
    a: "- **Edge-Optimized** (default): for global clients; requests go through the **CloudFront edge**, but the API still lives in **one region**\n- **Regional**: for clients in the same region; you can put CloudFront in front yourself\n- **Private**: reachable only from a **VPC via an interface VPC endpoint (ENI)**, using a **resource policy**",
  },
  {
    q: "How important are Deployment Stages?",
    a: "Changes in API Gateway **do not take effect** until you **deploy** → into a **Stage** (dev/test/prod).\nEach stage **has its own configuration** and can be **rolled back** (deployment history is kept).\n👉 This is a **very common source of exam confusion**.",
  },
  {
    q: "What are Stage Variables?",
    a: "Like **environment variables** for API Gateway, used in:\n- **Lambda function ARN**\n- **HTTP Endpoint**\n- **Parameter mapping templates**\n\nFormat **`${stageVariables.variableName}`**, and they are passed into the Lambda **`context` object**.\nUse cases: point stages at different backends, pass config to Lambda.",
  },
  {
    q: "What is Canary Deployment in API Gateway?",
    a: "Enable a canary on any stage (usually **prod**) and choose the **% of traffic** the canary receives.\n- **Metrics & Logs are separate**\n- **Stage variables** can be overridden for the canary\n- This is **blue/green** with Lambda + API Gateway",
  },
  {
    q: "What are the four Integration Types?",
    a: "- **MOCK**: returns a response **without calling a backend**\n- **HTTP / AWS**: you must configure the integration request & response, and mapping templates\n- **AWS_PROXY (Lambda Proxy)**: the request is Lambda's input and Lambda handles request/response logic itself — **no mapping template**\n- **HTTP_PROXY**: the request goes straight to the backend and the response is forwarded back — HTTP headers can be added",
  },
  {
    q: "What do Mapping Templates use, and what can they do?",
    a: "They use **Velocity Template Language (VTL)** (for, if…).\nThey can: rename/modify query string params, change the body, add headers, **filter the output**, set the Content-Type (**application/json** or **application/xml**).\nExample: converting JSON ↔ **XML for a SOAP service**.",
  },
  {
    q: "What is the OpenAPI spec in API Gateway?",
    a: "It defines the REST API **as code** (YAML/JSON). Importing OpenAPI 3.0 creates Methods, Method Requests, Integration Requests, Method Responses plus **AWS extensions**. You can export the current API to OpenAPI and **generate SDKs**.",
  },
  {
    q: "What is Request Validation?",
    a: "It validates the request **before** calling the integration — failing immediately with **400**. It reduces unnecessary backend calls.\nIt checks: required request params (URI, query string, headers) are present and **not blank**; the payload matches the **JSON Schema request model**.",
  },
  {
    q: "How does API Gateway Caching work?",
    a: "It reduces calls to the backend. **TTL default 300s** (min 0, max **3600s**), cached **per stage**, and overridable per method.\n- **Cache encryption** available\n- Capacity **0.5 GB → 237 GB**\n- **Expensive** → suited to production, not dev/test",
  },
  {
    q: "What is Cache Invalidation?",
    a: "It flushes the entire cache immediately. A client can invalidate with the header **`Cache-Control: max-age=0`** (IAM authorization required).\n⚠️ If you **do not** set an **InvalidateCache policy** (or do not tick “Require authorization”) → **any client** can invalidate it.",
  },
  {
    q: "What are Usage Plans & API Keys?",
    a: "For selling the API to customers.\n**Usage Plan**: who can access which stage/method, **how much and how fast** (throttling limits & quota limits per client).\n**API Keys**: alphanumeric strings issued to customers, used with a usage plan; throttling applies to the API key, and quota = the maximum total requests.",
  },
  {
    q: "What is the correct order for setting up API keys?",
    a: "1. Create the API, configure the method to **require an API key**, deploy to a stage\n2. **Generate/import API keys** to hand out\n3. Create a **usage plan** with throttling & quota\n4. **Associate** the stage and API key with the usage plan\n\nThe caller must send the key in the **`x-api-key`** header.",
  },
  {
    q: "Which authentication options does API Gateway have?",
    a: "- **IAM Roles**: for internal applications (Sig v4, credentials in headers)\n- **Cognito User Pools**: identity for external/mobile users\n- **Custom / Lambda Authorizer**: your own logic\n- (plus **Resource Policies** for cross-account/IP/VPC endpoints)",
  },
  {
    q: "What does a Custom Domain Name with HTTPS need?",
    a: "**ACM** integration:\n- **Edge-Optimized** → the certificate must be in **us-east-1**\n- **Regional** → the certificate must be in the **API Gateway's region**\n\nYou must set up a **CNAME or A-alias** in Route 53.",
  },
  {
    q: "How does IAM authorization work in API Gateway?",
    a: "Create an **IAM policy** and attach it to a User/Role. **Authentication = IAM**, **Authorization = IAM Policy**. Good for access inside AWS (EC2, Lambda, IAM users). Uses **Sig v4** with credentials in headers.",
  },
  {
    q: "What are API Gateway Resource Policies?",
    a: "Like a **Lambda Resource Policy**: allow **cross-account access** (combined with IAM), allow **specific source IPs**, and allow a **VPC Endpoint**.",
  },
  {
    q: "Cognito User Pools with API Gateway?",
    a: "Cognito manages the user lifecycle and tokens **expire automatically**; API Gateway **verifies identity against Cognito automatically** — **no custom code needed**.\n**Authentication = Cognito User Pools**, **Authorization = API Gateway Methods**.",
  },
  {
    q: "What is a Lambda Authorizer (Custom Authorizer)?",
    a: "- **Token-based**: bearer token (JWT, OAuth)\n- **Request parameter-based**: headers, query string, stage vars\n- Lambda **must return an IAM policy** for the user; the **result is cached**\n- **Authentication = External**, **Authorization = Lambda function**\n- Billed **per Lambda invocation**",
  },
  {
    q: "When do you choose IAM / Custom Authorizer / Cognito?",
    a: "- **IAM**: users/roles **inside the AWS account**, when you need cross-account resource policies, using Sig v4\n- **Custom Authorizer**: **third-party tokens**, very flexible in the IAM policy it returns, billed per invocation\n- **Cognito User Pool**: your own user pool (Facebook, Google…), **no custom code needed**, but **you must implement authorization** in the backend",
  },
  {
    q: "How do Logging & Tracing work in API Gateway?",
    a: "**CloudWatch Logs**: logs request/response bodies; enabled at the **Stage level** (log level **ERROR / DEBUG / INFO**), with per-API overrides.\n**X-Ray**: enable tracing to see requests pass through API Gateway — combine X-Ray + Lambda for the **full picture**.",
  },
  {
    q: "Which CloudWatch Metrics matter for API Gateway?",
    a: "- **CacheHitCount / CacheMissCount**: cache effectiveness\n- **Count**: total requests\n- **IntegrationLatency**: backend time\n- **Latency**: the total time API Gateway sees (integration latency + overhead)\n- **4XXError** (client) & **5XXError** (server)",
  },
  {
    q: "API Gateway Throttling?",
    a: "- **Account limit**: **10,000 rps** across all APIs (a soft limit that can be raised)\n- Exceeding it → **429 Too Many Requests** (retriable)\n- Set **stage limits & method limits**\n- Or **Usage Plans** to throttle per customer\n- ⚠️ One API overloaded **with no limit** → **the other APIs get throttled too**",
  },
  {
    q: "Which API Gateway error codes must you remember?",
    a: "**4xx (client)**: **400** Bad Request, **403** Access Denied / WAF filtered, **429** Quota exceeded / Throttle.\n**5xx (server)**: **502** Bad Gateway (incompatible output from a Lambda proxy), **503** Service Unavailable, **504** Integration Failure / Endpoint Request Timed-out.\n⚠️ API Gateway **times out at 29 seconds** maximum.",
  },
  {
    q: "CORS on API Gateway?",
    a: "Enable it when accepting API calls from a **different domain**. The **OPTIONS pre-flight** must return:\n- **Access-Control-Allow-Methods**\n- **Access-Control-Allow-Headers**\n- **Access-Control-Allow-Origin**\n\nIt can be enabled from the console.",
  },
];
