window.DVA_SECTIONS = window.DVA_SECTIONS || [];
window.DVA_SECTIONS.push({
  id: "s15", num: 15,
  title: "AWS CICD: CodeCommit, CodePipeline, CodeBuild, CodeDeploy",
  chapters: ["CICD Concepts", "CodeCommit", "CodePipeline", "CodeBuild", "CodeDeploy", "CodeArtifact & CodeGuru"],
  cards: [
    { chapter: "CICD", q: "CI (Continuous Integration) là gì?",
      a: "Dev **push code thường xuyên** lên repo (GitHub, CodeCommit, Bitbucket). **Build/test server** kiểm tra ngay khi push (**CodeBuild**, Jenkins).\nDev nhận feedback pass/fail → **tìm bug sớm**, deliver nhanh hơn, deploy thường xuyên." },
    { chapter: "CICD", q: "CD (Continuous Delivery) là gì?",
      a: "Đảm bảo software **release tin cậy bất cứ khi nào cần**, deploy **thường xuyên & nhanh**. Chuyển từ '3 tháng 1 release' sang '**5 release/ngày**' — thường là **automated deployment** (CodeDeploy, Jenkins CD, Spinnaker)." },
    { chapter: "CICD", q: "5 service chính trong AWS CICD?",
      a: "- **CodeCommit**: lưu code\n- **CodePipeline**: tự động hoá pipeline\n- **CodeBuild**: build & test\n- **CodeDeploy**: deploy lên EC2 (không qua Beanstalk)\n- **CodeArtifact**: lưu & chia sẻ packages\n- **CodeGuru**: code review tự động bằng ML" },

    { chapter: "CodeCommit", q: "CodeCommit có ưu điểm gì?",
      a: "**Private Git repositories**, **không giới hạn size**, fully managed, highly available.\nCode **chỉ trong AWS account** → tăng security & compliance. Encrypted, access control.\nTích hợp Jenkins, CodeBuild, CI tools khác." },
    { chapter: "CodeCommit", q: "CodeCommit Security: authentication, authorization, encryption?",
      a: "**Authentication**: **SSH keys** (cấu hình trong IAM console), **HTTPS** (AWS CLI credential helper hoặc Git credentials cho IAM user).\n**Authorization**: IAM policies cho repositories.\n**Encryption**: at-rest bằng **KMS** tự động, in-transit **HTTPS hoặc SSH**.\n**Cross-account**: dùng **IAM Role + STS (AssumeRole)** — không chia sẻ SSH key/credentials." },

    { chapter: "CodePipeline", q: "CodePipeline stages & providers?",
      a: "**Source**: CodeCommit, ECR, S3, Bitbucket, GitHub\n**Build**: CodeBuild, Jenkins, CloudBees, TeamCity\n**Test**: CodeBuild, AWS Device Farm, 3rd-party\n**Deploy**: CodeDeploy, Elastic Beanstalk, CloudFormation, ECS, S3\n**Invoke**: Lambda, Step Functions\n\nMỗi stage có thể có **sequential & parallel actions**, **manual approval** ở bất kỳ stage." },
    { chapter: "CodePipeline", q: "CodePipeline Artifacts?",
      a: "Mỗi stage tạo **artifacts**, lưu trong **S3 bucket** và **truyền sang stage tiếp theo**." },
    { chapter: "CodePipeline", q: "Troubleshoot CodePipeline thế nào?",
      a: "- Dùng **CloudWatch Events / EventBridge** cho **Pipeline/Action/Stage execution state changes** (failed pipeline, cancelled stage)\n- Stage fail → pipeline **dừng**, xem thông tin ở console\n- Không thực hiện được action → check **IAM Service Role** có đủ quyền policy\n- **CloudTrail** để **audit AWS API calls**" },

    { chapter: "CodeBuild", q: "CodeBuild là gì?",
      a: "**Fully managed CI service**: continuous scaling (**không server**, **không build queue**), compile code, chạy test, produce packages.\n- Trả **theo phút** compute\n- Dùng **Docker** bên dưới để **reproducible build**\n- Dùng prepackaged Docker image hoặc image riêng\n- **KMS** mã hoá artifacts, **IAM** permissions, **VPC** network, **CloudTrail** logs" },
    { chapter: "CodeBuild", q: "CodeBuild: source, buildspec, logs?",
      a: "**Source**: CodeCommit, S3, Bitbucket, GitHub.\n**Build instructions**: **`buildspec.yml`** ở **root code** (hoặc nhập console).\n**Logs**: **S3 & CloudWatch Logs**. **CloudWatch Metrics** monitor build stats, **EventBridge** cho failed builds, **CloudWatch Alarms** cho thresholds." },
    { chapter: "CodeBuild", q: "buildspec.yml có các section gì?",
      a: "- **`env`**: environment variables — `variables` (plaintext), **`parameter-store`** (SSM), **`secrets-manager`**\n- **`phases`**: **install** (dependencies), **pre_build** (commands trước build), **build** (lệnh build), **post_build** (finishing touches, zip output)\n- **`artifacts`**: upload lên **S3** (mã hoá KMS)\n- **`cache`**: files để cache (dependencies) → **S3** → build nhanh hơn" },
    { chapter: "CodeBuild", q: "Environment hỗ trợ của CodeBuild?",
      a: "Java, Ruby, Python, Go, Node.js, Android, .NET Core, PHP, **Docker** (extend bất kỳ môi trường nào)." },

    { chapter: "CodeDeploy", q: "CodeDeploy là gì?",
      a: "Deployment service tự động hoá app deployment lên **EC2, on-premises, Lambda, ECS**.\n- **Automated Rollback** khi deploy fail hoặc theo **CloudWatch Alarm**\n- **Gradual deployment control**\n- File **`appspec.yml`** định nghĩa cách deployment xảy ra" },
    { chapter: "CodeDeploy", q: "CodeDeploy EC2/On-premises: platform & deployment speed?",
      a: "In-place hoặc blue/green. **Phải chạy CodeDeploy Agent** trên target.\nDeployment speed:\n- **AllAtOnce**: all instances — downtime nhiều nhất, nhanh nhất\n- **HalfAtATime**: giảm capacity 50%\n- **OneAtATime**: chậm nhất, ít ảnh hưởng nhất\n- **Custom**: % tuỳ chỉnh" },
    { chapter: "CodeDeploy", q: "CodeDeploy Agent: yêu cầu gì?",
      a: "Phải **chạy trên EC2 instances**. Cài & update tự động được nếu dùng **Systems Manager**.\nEC2 cần **quyền đủ để truy cập S3** lấy deployment bundles." },
    { chapter: "CodeDeploy", q: "CodeDeploy cho Lambda: các config?",
      a: "Tự động **traffic shift cho Lambda aliases**, tích hợp **SAM**:\n- **Linear**: `LambdaLinear10PercentEvery3Minutes`, `...Every10Minutes`\n- **Canary**: `LambdaCanary10Percent5Minutes`, `LambdaCanary10Percent30Minutes`\n- **AllAtOnce**" },
    { chapter: "CodeDeploy", q: "CodeDeploy cho ECS?",
      a: "Tự động deploy **Task Definition** mới. **Chỉ Blue/Green**.\nConfig: `ECSLinear10PercentEvery3Minutes`, `ECSLinear10PercentEvery10Minutes`, `ECSCanary10Percent5Minutes`, `ECSCanary10Percent30Minutes`, `ECSAllAtOnce`." },
    { chapter: "CodeDeploy", q: "Deploy to ASG: In-place vs Blue/Green?",
      a: "**In-place**: update EC2 hiện có, EC2 mới do ASG tạo cũng **được deploy tự động**.\n**Blue/Green**: tạo **ASG mới** (copy settings), chọn thời gian giữ EC2 cũ, **phải dùng ELB**." },
    { chapter: "CodeDeploy", q: "Redeploy & Rollback?",
      a: "Rollback = **redeploy revision trước đó**.\n- **Automatic**: khi deploy fail hoặc **CloudWatch Alarm** đạt ngưỡng\n- **Manual**\n- **Disable Rollbacks**\n\n⚠️ Rollback **redeploy bản last known good như một deployment mới** (không phải restore)." },

    { chapter: "CodeArtifact", q: "CodeArtifact là gì?",
      a: "**Artifact management** secure, scalable, cost-effective cho software development.\nHỗ trợ **Maven, Gradle, npm, yarn, twine, pip, NuGet**. Dev & CodeBuild lấy dependencies trực tiếp từ CodeArtifact.\n**Resource policy** để authorize account khác (**read tất cả hoặc không có gì**)." },
    { chapter: "CodeGuru", q: "CodeGuru Reviewer vs Profiler?",
      a: "**Reviewer**: code review tự động cho **static code analysis** (lúc development) — tìm critical issues, security vulnerabilities, bugs khó. Dùng **ML**, hỗ trợ **Java & Python**, tích hợp GitHub, Bitbucket, CodeCommit.\n**Profiler**: visibility/recommendation về **runtime performance** (production) — tìm code inefficiencies, giảm CPU, giảm cost, heap summary, anomaly detection, hỗ trợ **Java & Python**." },
    { chapter: "CodeGuru", q: "CodeGuru Profiler agent config?",
      a: "- **MaxStackDepth**: độ sâu stack tối đa trong profile (A→B→C→D = depth 4 → set 2 thì chỉ evaluate A, B)\n- **MemoryUsageLimitPercent**\n- **MinimumTimeForReportingInMilliseconds**\n- **ReportingIntervalInMilliseconds**\n- **SamplingIntervalInMilliseconds** (giảm = sampling rate cao hơn)" }
  ]
});
