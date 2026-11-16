/** Static marketing content (copy taken from the Figma screens, extended for the DigitalOcean-style layout). */

export const faqs = [
  {
    q: "What is Northstar Cloud?",
    a: "Northstar Cloud is where developers and growing teams build, run, and scale applications. One account covers cloud compute, high-performance servers, storage, networking and firewalls, on one bill.",
  },
  {
    q: "What is cloud computing?",
    a: "Cloud computing lets you access computing resources such as servers, storage, and networking over the internet. With Northstar Cloud, you can deploy infrastructure on demand without managing physical hardware.",
  },
  {
    q: "How do I deploy a cloud server?",
    a: "Choose your server configuration, select an operating system, and configure your preferred location. Once you confirm your settings, you can launch your cloud server and manage it from your cloud dashboard.",
  },
  {
    q: "Can I scale my resources anytime?",
    a: "Yes. You can adjust your cloud resources as your workload changes. Available scaling options depend on your selected server plan and configuration, helping you adapt your infrastructure as your needs grow.",
  },
  {
    q: "How does cloud pricing work?",
    a: "Cloud pricing is based on the resources and services you use. Depending on the plan, charges may include compute capacity, storage, networking, and additional services. Review your selected plan for its exact rates and billing terms.",
  },
  {
    q: "Where should I start?",
    a: "Start with the Cloud Compute plan: create an account, add an SSH key and deploy your first server from the dashboard. When you need more throughput, resize to High Performance without changing your tooling.",
  },
  {
    q: "Can I run everything in one account?",
    a: "Yes. Servers, firewalls, SSH keys, backups and billing live in a single customer panel with a single invoice, and private networking connects resources in the same region.",
  },
  {
    q: "What support options are available?",
    a: "You can access product documentation and troubleshooting resources to help manage your infrastructure. Additional support options may be available depending on your account and service plan.",
  },
];

/** Customer wordmarks shown in the hero logo strip. Demo names only. */
export const customerLogos = ["Ideonix", "Ace Studio", "Falcon AI", "Workflo", "RadixArk", "Traversal", "Hippocrene", "Amplify", "Higgsfield"];

/** Stat cards under the hero (FeatureCardGrid). */
export const heroStats = [
  {
    value: "67%",
    label: "lower cost.",
    body: "Workflo moved 1T+ automation tasks to Northstar High Performance servers at 67% lower cost, with 67% higher throughput on the same workload.",
    company: "Workflo",
    href: "/customers",
  },
  {
    value: "10×",
    label: "serving throughput.",
    body: "RadixArk, the team behind an open-source inference engine, runs its full model fleet on Northstar and tuned it to 10× throughput.",
    company: "RadixArk",
    href: "/customers",
  },
  {
    value: "40%",
    label: "reduction in latency.",
    body: "Hippocrene runs healthcare services on Northstar, powering 20M+ interactions with 40% lower end-to-end P99 latency and 2× higher throughput.",
    company: "Hippocrene",
    href: "/customers",
  },
];

export interface PlatformLayer {
  id: string;
  label: string;
  heading: string;
  body: string;
  products: { label: string; href?: string; note?: string }[];
  integrations: string;
}

/** Vertical tabs in the "Built for every workload. Open at every layer." section. */
export const platformLayers: PlatformLayer[] = [
  {
    id: "compute",
    label: "Cloud Compute",
    heading: "Cloud Compute",
    body: "Power demanding applications with fast, dependable compute resources built for consistent performance. Deploy in about a minute and pay only for what you use.",
    products: [
      { label: "Cloud Compute servers", href: "/#pricing" },
      { label: "High Performance servers", href: "/#pricing", note: "NVMe" },
      { label: "Optimized Compute", href: "/#pricing" },
      { label: "Deploy from the dashboard", href: "/dashboard/servers/new", note: "Live demo" },
    ],
    integrations: "Open images and tooling: Ubuntu, Debian, Rocky Linux, Docker, Terraform, Ansible.",
  },
  {
    id: "storage",
    label: "Storage and Backups",
    heading: "Storage and Backups",
    body: "SSD-backed block storage, scheduled snapshots and durable object storage, all attached to the same account as your compute.",
    products: [
      { label: "SSD block storage", href: "/#platform" },
      { label: "Automated backups", href: "/#platform" },
      { label: "Object storage", href: "/#platform", note: "Preview" },
    ],
    integrations: "Open standards: S3-compatible API, rsync, restic.",
  },
  {
    id: "networking",
    label: "Networking",
    heading: "Networking",
    body: "Connect applications and services with dependable network connectivity designed for modern cloud environments, from private networks to the global edge.",
    products: [
      { label: "Cloud firewalls", href: "/dashboard/firewall" },
      { label: "Private networking", href: "/#platform" },
      { label: "Load balancing", href: "/#platform" },
      { label: "Global edge", href: "/#platform" },
    ],
    integrations: "Open networking: WireGuard, nginx, HAProxy, Cloud-init.",
  },
  {
    id: "security",
    label: "Security",
    heading: "Security",
    body: "Support your security strategy with controlled access, network protection and infrastructure safeguards that follow every server you deploy.",
    products: [
      { label: "SSH keys", href: "/dashboard/ssh-keys" },
      { label: "Firewall groups", href: "/docs#firewall" },
      { label: "Activity log", href: "/dashboard/activity" },
      { label: "Two-factor sign-in", href: "/dashboard/settings" },
    ],
    integrations: "Open security tooling: OpenSSH, fail2ban, Let’s Encrypt.",
  },
  {
    id: "management",
    label: "Management",
    heading: "Easy Management",
    body: "Provision and organize your cloud resources through a streamlined experience designed to simplify daily operations, from one panel, one API and one CLI.",
    products: [
      { label: "Customer panel", href: "/dashboard" },
      { label: "Admin console", href: "/admin" },
      { label: "API reference", href: "/docs#api" },
      { label: "CLI", href: "/docs#quick-start" },
    ],
    integrations: "Open observability: Prometheus, Grafana, OpenTelemetry.",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    heading: "Infrastructure",
    body: "We run the hardware. Your unit economics improve as you scale across more than 30 regions.",
    products: [
      { label: "30+ regions worldwide" },
      { label: "Latest-generation CPUs and NVMe storage" },
      { label: "99.99% target infrastructure uptime" },
      { label: "Redundant 100G network fabric" },
    ],
    integrations: "Open compute: Linux / KVM, Kubernetes, MinIO.",
  },
];

export interface Resource {
  type: "Tutorials" | "Articles" | "Blog";
  title: string;
  href: string;
}

/** Cards in the Resources carousel. */
export const resources: Resource[] = [
  { type: "Tutorials", title: "Quick start: launch your first server in about a minute", href: "/docs#quick-start" },
  { type: "Articles", title: "When does High Performance compute beat standard servers? A break-even guide", href: "/#pricing" },
  { type: "Tutorials", title: "Connect to a server with SSH keys and lock down password access", href: "/docs#ssh-keys" },
  { type: "Blog", title: "Firewall groups: allow only the traffic your application needs", href: "/docs#firewall" },
  { type: "Tutorials", title: "Start, stop and restart servers safely from the panel", href: "/docs#manage-servers" },
  { type: "Articles", title: "Understanding invoices, credit balance and payment methods", href: "/docs#billing" },
  { type: "Blog", title: "Automate everything with the Northstar API", href: "/docs#api" },
];

export interface DocArticle {
  id: string;
  title: string;
  summary: string;
  category: "Getting started" | "Servers" | "Security" | "Billing" | "API";
  steps: string[];
  code?: string;
  updated: string;
}

export const docs: DocArticle[] = [
  {
    id: "quick-start",
    title: "Quick start: your first server",
    summary: "Create an account, pick a plan and launch a server in about a minute.",
    category: "Getting started",
    steps: ["Create your account and sign in.", "Open Deploy New Server from the dashboard.", "Choose a location, an operating system and a plan.", "Add an SSH key, name the server and press Deploy Server."],
    code: "northstar compute create \\\n  --region us-central \\\n  --plan standard \\\n  --image ubuntu-24-04",
    updated: "2026-10-30",
  },
  {
    id: "ssh-keys",
    title: "Connect with SSH keys",
    summary: "Generate a key pair on your computer and add only the public key.",
    category: "Security",
    steps: ["Generate a key on your computer.", "Copy the public key (the .pub file).", "Paste it in SSH Keys → Add a New SSH Key.", "Attach the key when you deploy a server."],
    code: 'ssh-keygen -t ed25519 -C "you@company.com"\ncat ~/.ssh/id_ed25519.pub',
    updated: "2026-10-22",
  },
  {
    id: "firewall",
    title: "Firewall groups and rules",
    summary: "Allow only the traffic your application needs.",
    category: "Security",
    steps: ["Create a firewall group.", "Add inbound rules for ports such as 80, 443 and 22.", "Limit SSH to trusted IP ranges.", "Assign the group to your servers."],
    code: "northstar firewall rule add \\\n  --group production-web \\\n  --direction inbound --protocol tcp --port 443",
    updated: "2026-10-18",
  },
  {
    id: "manage-servers",
    title: "Start, stop and restart servers",
    summary: "Power actions are confirmed by the infrastructure before they show as done.",
    category: "Servers",
    steps: ["Open My Services and choose a server.", "Use Restart, Stop or More Actions.", "Confirm the action in the dialog.", "Wait for the status to change from pending to confirmed."],
    code: "northstar compute restart web-prod-01",
    updated: "2026-10-26",
  },
  {
    id: "billing",
    title: "Invoices, balance and payment methods",
    summary: "How monthly invoices, credit balance and payment methods work.",
    category: "Billing",
    steps: ["Open Billing & Payments.", "Add funds to keep a credit balance.", "Download or print any invoice.", "Set a default payment method for renewals."],
    updated: "2026-10-12",
  },
  {
    id: "api",
    title: "API reference overview",
    summary: "Authenticate with an API token and manage resources programmatically.",
    category: "API",
    steps: ["Create an API token in Account Settings → API Access.", "Send it in the Authorization header.", "Keep tokens on your server — never in browser code."],
    code: '# Endpoint paths will be published with the API\ncurl -H "Authorization: Bearer $NORTHSTAR_TOKEN" \\\n  "$NORTHSTAR_API_URL/<endpoint>"',
    updated: "2026-10-08",
  },
];
