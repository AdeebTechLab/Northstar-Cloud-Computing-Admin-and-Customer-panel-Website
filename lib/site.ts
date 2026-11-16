/** Shown in the footer, docs and FAQ. Update when content changes. */
export const SITE_LAST_UPDATED = "2026-11-16";

export const BRAND = {
  name: "Northstar Cloud",
  short: "Northstar",
  supportEmail: "support@northstar.cloud",
};

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavCategory {
  title: string;
  description?: string;
  links: NavLink[];
}

/** A top-level header item. Entries with `categories` open a mega menu. */
export interface NavEntry {
  label: string;
  href: string;
  categories?: NavCategory[];
  cta?: NavLink;
}

/** Utility links in the thin bar above the header. */
export const topBarLinks: NavLink[] = [
  { label: "Blog", href: "/community" },
  { label: "Docs", href: "/docs" },
  { label: "Careers", href: "/contact" },
  { label: "Get Support", href: "/contact" },
  { label: "Contact Sales", href: "/contact" },
];

export const marketingNav: NavEntry[] = [
  {
    label: "Products",
    href: "/products",
    cta: { label: "Browse all products", href: "/products" },
    categories: [
      {
        title: "Compute",
        description: "Build, deploy, and scale cloud compute resources",
        links: [
          { label: "Cloud Compute", href: "/products/cloud-compute", description: "Flexible virtual machines for everyday workloads" },
          { label: "High Performance", href: "/products/high-performance", description: "NVMe-backed servers for demanding applications" },
          { label: "Optimized Compute", href: "/products/optimized-compute", description: "Balanced, dedicated resources for specialised workloads" },
          { label: "Deploy a server", href: "/dashboard/servers/new", description: "Launch a new instance in about a minute" },
        ],
      },
      {
        title: "Storage and Backups",
        description: "Safely store and manage data, snapshots and backups",
        links: [
          { label: "SSD block storage", href: "/products/block-storage", description: "Fast, resizable volumes attached to any server" },
          { label: "Automated backups", href: "/#platform", description: "Scheduled snapshots with one-click restore" },
          { label: "Object storage", href: "/#platform", description: "Durable storage for files, media and archives" },
        ],
      },
      {
        title: "Networking",
        description: "Secure and control traffic to apps",
        links: [
          { label: "Cloud firewalls", href: "/products/cloud-firewalls", description: "Allow only the traffic your application needs" },
          { label: "Private networking", href: "/#platform", description: "Keep internal traffic off the public internet" },
          { label: "Load balancing", href: "/#platform", description: "Distribute traffic across healthy servers" },
          { label: "Global edge", href: "/#platform", description: "Serve users from the closest region" },
        ],
      },
      {
        title: "Security",
        description: "Help protect your account and resources",
        links: [
          { label: "SSH keys", href: "/dashboard/ssh-keys", description: "Key-based access for every server" },
          { label: "Firewall groups", href: "/docs#firewall", description: "Reusable rule sets for your fleet" },
          { label: "Activity log", href: "/dashboard/activity", description: "Every action, recorded and searchable" },
          { label: "Account security", href: "/dashboard/settings", description: "Two-factor sign-in and API tokens" },
        ],
      },
      {
        title: "Management and Dev Tools",
        description: "Control infrastructure and gather insights",
        links: [
          { label: "Customer panel", href: "/dashboard", description: "Manage servers, billing and support in one place" },
          { label: "API", href: "/docs#api", description: "Automate everything with a typed REST API" },
          { label: "CLI", href: "/docs#quick-start", description: "Provision from your terminal" },
          { label: "Monitoring", href: "/dashboard", description: "CPU, memory and traffic at a glance" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    cta: { label: "See all solutions", href: "/solutions" },
    categories: [
      {
        title: "Startups and SMBs",
        description: "Launch fast and grow without surprises",
        links: [
          { label: "Starter infrastructure", href: "/#pricing", description: "Predictable monthly pricing from $5" },
          { label: "Scale as you grow", href: "/#platform", description: "Resize compute and storage at any time" },
          { label: "Talk to sales", href: "/contact", description: "Get help planning your deployment" },
        ],
      },
      {
        title: "Web and App Platforms",
        description: "Host websites, APIs and mobile back ends",
        links: [
          { label: "Website hosting", href: "/#pricing", description: "SSD-backed servers in every region" },
          { label: "Node.js hosting", href: "/docs#quick-start", description: "Deploy JavaScript services in minutes" },
          { label: "Docker hosting", href: "/docs#quick-start", description: "Run containers on dedicated compute" },
          { label: "WordPress hosting", href: "/#pricing", description: "Fast, managed stacks for content sites" },
        ],
      },
      {
        title: "Hosting",
        description: "VPS and virtual machines for any stack",
        links: [
          { label: "VPS hosting", href: "/#pricing", description: "Root access on a virtual private server" },
          { label: "Virtual machines", href: "/#pricing", description: "Linux images, ready in seconds" },
          { label: "VPN", href: "/docs#firewall", description: "Private, encrypted access to your network" },
        ],
      },
      {
        title: "Data and IoT",
        description: "Collect, store and analyse data close to users",
        links: [
          { label: "Data pipelines", href: "/#platform", description: "Ingest and process events at scale" },
          { label: "Edge devices", href: "/#platform", description: "Regional endpoints for connected hardware" },
        ],
      },
      {
        title: "Developer Tools",
        description: "Automate your workflow end to end",
        links: [
          { label: "Infrastructure as code", href: "/docs#api", description: "Repeatable environments from the API" },
          { label: "CI/CD runners", href: "/docs#quick-start", description: "Ephemeral servers for build jobs" },
        ],
      },
      {
        title: "Security and Networking",
        description: "Lock down access and shape traffic",
        links: [
          { label: "Cloud firewalls", href: "/dashboard/firewall", description: "Rules that follow your servers" },
          { label: "Private networking", href: "/#platform", description: "Isolated traffic between resources" },
        ],
      },
    ],
  },
  {
    label: "Developers",
    href: "/docs",
    cta: { label: "Explore the docs", href: "/docs" },
    categories: [
      {
        title: "Documentation",
        description: "Guides for every product",
        links: [
          { label: "Quick start", href: "/docs#quick-start", description: "Your first server in about a minute" },
          { label: "SSH keys", href: "/docs#ssh-keys", description: "Connect securely from your machine" },
          { label: "Firewall rules", href: "/docs#firewall", description: "Allow only the traffic you need" },
          { label: "API reference", href: "/docs#api", description: "Authenticate and automate" },
        ],
      },
      {
        title: "Community",
        description: "Tutorials, questions and answers",
        links: [
          { label: "Tutorials", href: "/community", description: "Step-by-step guides from the team" },
          { label: "FAQ", href: "/#faq", description: "Answers to the most common questions" },
        ],
      },
      {
        title: "Developer Tools",
        description: "Build with the tools you already use",
        links: [
          { label: "CLI", href: "/docs#quick-start", description: "northstar compute create …" },
          { label: "API tokens", href: "/dashboard/settings", description: "Create and rotate access tokens" },
        ],
      },
      {
        title: "Utilities and Help",
        description: "Status, support and release notes",
        links: [
          { label: "Support center", href: "/dashboard/support", description: "Open and track tickets" },
          { label: "Contact support", href: "/contact", description: "Reach the team directly" },
        ],
      },
    ],
  },
  {
    label: "Company",
    href: "/customers",
    cta: { label: "Contact us", href: "/contact" },
    categories: [
      {
        title: "About Northstar",
        description: "Cloud infrastructure without compromise",
        links: [
          { label: "Our platform", href: "/#platform", description: "Open at every layer" },
          { label: "Customers", href: "/customers", description: "Teams that build on Northstar" },
          { label: "Careers", href: "/contact", description: "Join the team" },
        ],
      },
      {
        title: "Trust",
        description: "Security, privacy and terms",
        links: [
          { label: "Privacy policy", href: "/legal#privacy", description: "How we handle your data" },
          { label: "Terms of service", href: "/legal#terms", description: "The rules of the platform" },
          { label: "Status", href: "/#customers", description: "Live platform status" },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];
