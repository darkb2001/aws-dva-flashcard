/**
 * English flashcards — a translation of data/s08.js, not a slide extract.
 * Same shape as the Vietnamese card: q / a / optional note and tip.
 */
window.DVA_EN_CARDS = window.DVA_EN_CARDS || {};
window.DVA_EN_CARDS["s08"] = [
  {
    q: "What is CloudFormation?",
    a: "A **declarative** way to describe AWS infrastructure for every resource. You say “I want this SG, 2 EC2 instances using it, 2 EIPs, 1 S3 bucket, 1 ELB” → CloudFormation creates them in **exactly the right order** with the exact configuration.",
  },
  {
    q: "What are the benefits of CloudFormation?",
    a: "- **Infrastructure as Code**: version control, review changes through code\n- **Cost**: every resource in a stack has an identifier for pricing, you can estimate cost from the template, and auto-delete at 5PM & recreate at 8AM\n- **Productivity**: destroy & recreate on the fly, auto-generated diagrams, declarative\n- **Separation of concern**: many stacks (VPC, network, app)\n- **Don't reinvent the wheel**: reuse existing templates",
  },
  {
    q: "How is a template uploaded and versioned?",
    a: "The template **must be uploaded to S3** and referenced from CloudFormation. **You never edit an old template** — you **upload a new version**.\nA stack is identified by its **name**. **Deleting a stack deletes every resource** in it.",
  },
  {
    q: "What are the building blocks of a CloudFormation template?",
    a: "**Components**:\n- `AWSTemplateFormatVersion` (`2010-09-09`)\n- `Description`\n- **`Resources` (MANDATORY)**\n- `Parameters`\n- `Mappings`\n- `Outputs`\n- `Conditions`\n\n**Helpers**: References, Functions",
  },
  {
    q: "What format does a resource type identifier use?",
    a: "`service-provider::service-name::data-type-name`\n(e.g. `AWS::EC2::Instance`). There are more than **700 resource types**.\nIf the type you need does not exist → use **Custom Resources**.",
  },
  {
    q: "When do you use Parameters?",
    a: "When a value **might change in the future** or is **not known in advance**.\nBenefits: template reuse, and you **do not have to re-upload** the template to change a value. Parameters have a **type** that helps prevent mistakes.",
  },
  {
    q: "What are the Parameter settings?",
    a: "- **Type**: String, Number, CommaDelimitedList, List<Number>, **AWS-Specific** (validated against the account), List<AWS-Specific>, **SSM Parameter**\n- **Description**, **ConstraintDescription**\n- **Min/MaxLength**, **Min/MaxValue**\n- **Default**, **AllowedValues**, **AllowedPattern (regex)**\n- **NoEcho** (Boolean — hides the value, for secrets)",
  },
  {
    q: "What are Mappings?",
    a: "**Fixed variables** (hardcoded) in the template — very handy for distinguishing **environment (dev/prod)**, **region**, **AMI types**…\nAccessed with `Fn::FindInMap`: `!FindInMap [MapName, TopLevelKey, SecondLevelKey]`.",
  },
  {
    q: "Mappings vs Parameters?",
    a: "**Mappings**: use when **you know every value in advance** and it can be derived from Region, AZ, Account or Environment → keeps the template safer.\n**Parameters**: when the value is **genuinely decided by the user**.",
  },
  {
    q: "What are Outputs for?",
    a: "They declare values to output, which **can be imported into another stack** (if exported). Visible in the Console/CLI.\nVery useful: a network stack outputs **VPC ID, Subnet IDs** → another stack consumes them with `Fn::ImportValue`.\n**The base stack cannot be deleted until every reference to it is gone.**",
  },
  {
    q: "How are Conditions used?",
    a: "They control **whether a resource or output is created** based on a condition: Environment (dev/test/prod), AWS Region, any parameter value.\nEach condition can reference other conditions, parameters and mappings.\nThe Logical ID is yours to choose; functions: **Fn::And, Fn::Equals, Fn::If, Fn::Not, Fn::Or**.",
  },
  {
    q: "Which intrinsic functions matter most?",
    a: "`Ref`, `Fn::GetAtt`, `Fn::FindInMap`, `Fn::ImportValue`, `Fn::Join`, `Fn::Sub`, `Fn::ForEach`, `Fn::ToJsonString`, `Fn::Base64`, `Fn::Cidr`, `Fn::GetAZs`, `Fn::Select`, `Fn::Split`, `Fn::Transform`, `Fn::Length` plus the condition functions.",
  },
  {
    q: "What does Fn::Ref return?",
    a: "- For a **Parameter**: the **parameter value**\n- For a **Resource**: the **physical ID** (e.g. the EC2 instance ID)\n\nYAML shorthand: `!Ref`",
  },
  {
    q: "How do you use Fn::GetAtt?",
    a: "It fetches an **attribute** of a resource, e.g. the AZ of an EC2 instance. Attributes depend on the resource → check that resource's **documentation**. Shorthand: `!GetAtt`.",
  },
  {
    q: "Fn::ImportValue and its limit?",
    a: "Imports a value **exported** by another stack (a cross-stack reference).\n⚠️ You **cannot delete** an exporting stack until every reference to it is removed.",
  },
  {
    q: "What is Fn::Base64 for?",
    a: "Converts a **String → Base64**. The classic example: passing **encoded data into EC2 UserData**.",
  },
  {
    q: "How does CloudFormation rollback work?",
    a: "**Stack creation fails**: by default it **rolls back everything** (deletes it) so you can read the logs; there is an option to **disable rollback** for troubleshooting.\n**Stack update fails**: it **automatically rolls back** to the previous working state.\n**Rollback fails**: fix the resource manually, then call **ContinueUpdateRollback** (Console or `continue-update-rollback` in the CLI).",
  },
  {
    q: "What is a CloudFormation Service Role?",
    a: "An IAM role that lets CloudFormation **create/update/delete** resources on your behalf.\nIt lets a user create a stack **even without direct permissions** on those resources.\nUse case: keep **least privilege** without granting users everything.\nThe user needs **`iam:PassRole`**.",
  },
  {
    q: "What are the three DeletionPolicy values?",
    a: "- **Delete** (default): delete the resource. `Delete` **cannot delete a non-empty S3 bucket**\n- **Retain**: keep the resource when the stack is deleted (any resource type)\n- **Snapshot**: take a **final snapshot** before deleting → EBS Volume, ElastiCache Cluster/ReplicationGroup, RDS DBInstance/DBCluster, Redshift Cluster, Neptune, DocumentDB",
  },
  {
    q: "What is a Stack Policy?",
    a: "A JSON document defining **which update actions are allowed** on a specific resource when the stack is updated.\n- Protects against unintended updates\n- Once a Stack Policy is set, **every resource is protected by default**\n- You must **explicitly ALLOW** a resource you want to update",
  },
  {
    q: "What is Termination Protection?",
    a: "`TerminationProtection` prevents a CloudFormation stack from being **deleted unintentionally**.",
  },
  {
    q: "When do you use Custom Resources?",
    a: "- A resource **CloudFormation does not support yet**\n- Custom provisioning logic (on-premises, third party)\n- Run a custom script on create/update/delete via **Lambda** (e.g. empty an S3 bucket before deleting it)\n\nDeclared as `AWS::CloudFormation::CustomResource` or `Custom::MyCustomResourceTypeName` (recommended). Backed by **Lambda** or **SNS**.\n**`ServiceToken`** is required (the Lambda/SNS ARN, in the same region).",
  },
  {
    q: "What is an example Custom Resource use case?",
    a: "**You cannot delete a non-empty S3 bucket** → use a custom resource that runs a Lambda to **empty the bucket** before CloudFormation deletes it.",
  },
  {
    q: "What are StackSets?",
    a: "They create/update/delete stacks **across many accounts and regions** with **one operation and one template**.\nUpdating a StackSet updates **all** stack instances.\nThey can target an **entire AWS Organization**.\nOnly the **Administrator account** (or a Delegated Admin) can create StackSets.",
  },
  {
    q: "What is CloudFormation drift?",
    a: "**Drift** = a resource's **actual state differs from the template** (someone changed it by hand in the console/CLI after the stack was created).\n- **Detect drift**: run `detect-stack-drift` → reports **DRIFTED / IN_SYNC / NOT_CHECKED** per resource\n- **Resource drift status**: pinpoints exactly which resource has diverged\n⚠️ Drift **does not fix itself** — you must **update the stack** (overwrite) or **import / fix it manually**. Enable **CloudTrail** to see who changed it.\nStackSets has its own **drift detection** across all stack instances.",
  },
  {
    q: "Nested stack vs cross-stack reference?",
    a: "**Nested stack**: a **parent** stack calls a **child** stack via `AWS::CloudFormation::Stack` with a `TemplateURL` (**must be an S3 URL**). Used to **split a large template** into modules, to reuse them, and each child has its **own lifecycle**.\n**Cross-stack reference**: stack A **Exports** (`Outputs` + `Export.Name`) → stack B uses **`Fn::ImportValue`**. Used when the two stacks are **independent**, not nested.\n⚠️ You **cannot delete** a stack whose output is **imported** by another stack — remove the reference first.",
  },
  {
    q: "Change sets and safe stack updates?",
    a: "**Change set**: previews **which resources will change** (Add/Modify/Remove) before you apply it → avoids breaking production.\n**Update behaviors**: **Update requiring no interruption**, **Some interruption**, **Replacement** (create new, then delete old — **loses data** for stateful resources like RDS/EBS without a snapshot).\n**Rollback**: a failed update makes CloudFormation **roll back to the previous state** (unless **rollback is disabled**). Enable **termination protection** on important stacks.",
  },
  {
    q: "CloudFormation: DeletionPolicy & UpdateReplacePolicy?",
    a: "**DeletionPolicy** (when the **stack is deleted**): `Delete` (default), `Retain` (keep the resource), `Snapshot` (only for supported resources: RDS, EBS volume, Redshift, Neptune…).\n**UpdateReplacePolicy** (when a resource is **replaced** by an update): the same three values, deciding the fate of the **old** resource.\n⚠️ Missing `Retain`/`Snapshot` → **data loss** when the stack is deleted. This is a common exam question.",
  },
];
