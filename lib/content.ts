/** Static marketing content (copy taken from the Figma screens). */

export const faqs = [
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
    q: "What support options are available?",
    a: "You can access product documentation and troubleshooting resources to help manage your infrastructure. Additional support options may be available depending on your account and service plan.",
  },
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
