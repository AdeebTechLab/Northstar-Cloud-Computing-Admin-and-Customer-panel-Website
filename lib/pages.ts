/**
 * Content for the DigitalOcean-style catalogue pages: /products, /products/[slug],
 * /pricing, /solutions, /customers and /community. Demo copy adapted to Northstar.
 */

export interface CardItem {
  title: string;
  description: string;
  href?: string;
  cta?: string;
  tag?: string;
  bullets?: string[];
  price?: string;
  priceNote?: string;
}

export interface CardSection {
  id: string;
  title: string;
  description?: string;
  learnMore?: string;
  columns: 2 | 3 | 4 | 5;
  variant?: "link" | "button" | "text";
  items: CardItem[];
}

/* ------------------------------------------------------------------ products */
export const productsPage = {
  hero: {
    title: "Every product for production workloads, on one cloud",
    body: "Compute, storage, networking and security that work together. From your first server to thousands, with predictable pricing and one bill.",
  },
  overviewTitle: "From the hardware to your app, Northstar has every layer you need to build and scale.",
  overview: [
    { title: "Cloud Compute", description: "Virtual machines with shared or dedicated CPU, ready in about a minute.", href: "/products/cloud-compute" },
    { title: "High Performance", description: "NVMe-backed servers with dedicated vCPUs for demanding, latency-sensitive apps.", href: "/products/high-performance" },
    { title: "Optimized Compute", description: "Balanced, dedicated resources tuned for specialised workloads and consistent performance.", href: "/products/optimized-compute" },
    { title: "Storage and Backups", description: "SSD block storage, scheduled snapshots and S3-compatible object storage.", href: "/products/block-storage" },
    { title: "Networking", description: "Cloud firewalls, private networking, load balancing and a global edge.", href: "/products/cloud-firewalls" },
    { title: "Infrastructure", description: "30+ regions on hardware we own, with unit economics that improve at scale.", href: "#infrastructure" },
  ] as CardItem[],
  testimonial: {
    logo: "Ace Studio",
    quote: "We needed capacity the hyperscalers did not have, and reliability the local data centres could not promise. Northstar gave us both, at scale.",
    name: "Sean Zhao",
    role: "Co-Founder, Ace Studio",
  },
  categories: [
    {
      id: "compute",
      title: "Compute",
      columns: 4,
      variant: "button",
      items: [
        { title: "Cloud Compute", description: "On-demand Linux virtual machines with shared or dedicated CPU, billed per second.", href: "/products/cloud-compute", cta: "Go to Cloud Compute" },
        { title: "High Performance", description: "Dedicated vCPUs and NVMe storage for e-commerce, SaaS and high-traffic APIs.", href: "/products/high-performance", cta: "Go to High Performance" },
        { title: "Optimized Compute", description: "Memory- and CPU-optimised configurations for databases, caches and batch jobs.", href: "/products/optimized-compute", cta: "Go to Optimized Compute" },
        { title: "Deploy a server", description: "Choose a region, image and plan and launch from the customer panel in about a minute.", href: "/dashboard/servers/new", cta: "Deploy now" },
      ],
    },
    {
      id: "storage",
      title: "Storage and Backups",
      learnMore: "/products/block-storage",
      columns: 3,
      variant: "button",
      items: [
        { title: "Block Storage", description: "Resizable SSD volumes you can attach to any server and move between them.", href: "/products/block-storage", cta: "Go to Block Storage" },
        { title: "Backups", description: "Weekly or daily disk images with one-click restore, priced at 20% of the server cost.", href: "/products/block-storage#backups", cta: "Go to Backups" },
        { title: "Object Storage", description: "S3-compatible storage with a built-in CDN for files, media and archives.", href: "/products/block-storage#object", cta: "Go to Object Storage", tag: "Preview" },
      ],
    },
    {
      id: "networking",
      title: "Networking and Security",
      learnMore: "/products/cloud-firewalls",
      columns: 4,
      variant: "button",
      items: [
        { title: "Cloud Firewalls", description: "Free, stateful firewalls that control which services are exposed to the internet.", href: "/products/cloud-firewalls", cta: "Go to Cloud Firewalls" },
        { title: "Private Networking", description: "Isolated networks per region so internal traffic never touches the public internet.", href: "/products/cloud-firewalls#vpc", cta: "Go to Private Networking" },
        { title: "Load Balancers", description: "Fully managed traffic distribution with health checks and TLS termination.", href: "/products/cloud-firewalls#lb", cta: "Go to Load Balancers" },
        { title: "SSH Keys and Access", description: "Key-based access, two-factor sign-in and a searchable activity log for every account.", href: "/dashboard/ssh-keys", cta: "Go to Access" },
      ],
    },
    {
      id: "management",
      title: "Management and Developer Tools",
      columns: 5,
      variant: "button",
      items: [
        { title: "Customer Panel", description: "Manage servers, billing and support from one place.", href: "/dashboard", cta: "Go to Panel" },
        { title: "API", description: "A typed REST API for everything the panel can do.", href: "/docs#api", cta: "Go to API" },
        { title: "CLI", description: "Provision and manage resources from your terminal.", href: "/docs#quick-start", cta: "Go to CLI" },
        { title: "Monitoring", description: "CPU, memory and bandwidth metrics with alerts, free.", href: "/dashboard", cta: "Go to Monitoring" },
        { title: "Support", description: "Tickets, docs and a team that answers within a business day.", href: "/dashboard/support", cta: "Go to Support" },
      ],
    },
  ] as CardSection[],
  infrastructure: [
    { title: "Global infrastructure", description: "Distributed infrastructure across 30+ regions with redundant 100G fabric and NVMe storage.", href: "/#customers", cta: "Go to Global Infrastructure" },
    { title: "Still have questions?", description: "Talk to our team about setup, migration or pricing for your workload.", href: "/contact", cta: "Contact sales" },
  ] as CardItem[],
};

/* ---------------------------------------------------------- product details */
export interface ProductDetail {
  slug: string;
  name: string;
  hero: { title: string; body: string };
  banner: { title: string; body: string; cta: string; href: string };
  showcase: { title: string; cards: CardItem[] };
  plans: { title: string; cards: CardItem[]; callout: string; calloutLink: string; promo: string; promoLink: string };
  savings: { title: string; cta: string };
  comparison: { title: string; body: string; cta: string; tabs: string[]; heading: string; rows: { tab: string; memory: string; storage: string; bandwidth: string; us: string; a: string; b: string; c: string }[] };
  tools: { title: string; cards: CardItem[] };
  images: { title: string; tabs: { label: string; logos: string[] }[] };
  testimonials: { company: string; quote: string; name: string; role: string }[];
  faqs: { q: string; a: string }[];
}

const sharedTools: CardItem[] = [
  { title: "Monitoring", description: "Metrics, performance monitoring and alerts at no extra cost.", href: "/dashboard" },
  { title: "Cloud Firewalls", description: "Free firewalls that control which services are exposed.", href: "/dashboard/firewall" },
  { title: "Team management", description: "Unlimited users, two-factor sign-in and one consolidated bill.", href: "/dashboard/settings" },
  { title: "Backups", description: "Weekly automatic disk images, priced at 20% of the server cost.", href: "/products/block-storage#backups" },
  { title: "Snapshots", description: "On-demand disk images kept for as long as you need them.", href: "/products/block-storage" },
  { title: "Block Storage", description: "Scalable SSD block storage attached to any server.", href: "/products/block-storage" },
  { title: "Object Storage", description: "S3-compatible storage with a built-in CDN.", href: "/products/block-storage#object" },
  { title: "Load Balancers", description: "Fully managed traffic distribution for higher availability.", href: "/products/cloud-firewalls#lb" },
  { title: "Reserved IPs", description: "Static IPs for traffic redirection within a region.", href: "/products/cloud-firewalls" },
];

const sharedImages = {
  title: "Deploy your server with any of these available distributions",
  tabs: [
    { label: "Distributions", logos: ["Ubuntu", "Fedora", "Rocky Linux", "CentOS", "Debian", "AlmaLinux"] },
    { label: "Pre-installed apps", logos: ["WordPress", "LAMP", "Docker", "MySQL", "Node.js", "MongoDB"] },
    { label: "Custom images", logos: ["Upload your own", "Snapshots", "Backups", "Cloud-init"] },
  ],
};

const sharedTestimonials = [
  { company: "Validin", quote: "Optimized Compute made our workloads faster and saved us about $2,000 a month. The migration took an afternoon.", name: "Kenneth Kinion", role: "Managing Director, Validin" },
  { company: "Kea", quote: "The setup was easy to understand, so the team could focus on writing code instead of managing infrastructure.", name: "Patrick Wingo", role: "Head of Product, Kea" },
  { company: "Atom Learning", quote: "We use every single one of your products now. One panel, one bill, no surprises.", name: "Tim Osborne", role: "CTO, Atom Learning" },
];

const comparisonRows = [
  { tab: "1 CPU", memory: "1 GB", storage: "25 GB", bandwidth: "1,000 GiB", us: "$5.00", a: "$6.88", b: "$7.59", c: "$8.47" },
  { tab: "2 CPUs", memory: "4 GiB", storage: "80 GiB", bandwidth: "4,000 GiB", us: "$20.00", a: "$27.55", b: "$30.37", c: "$30.37" },
  { tab: "4 CPUs", memory: "8 GiB", storage: "160 GiB", bandwidth: "5,000 GiB", us: "$48.00", a: "$55.09", b: "$60.74", c: "$60.74" },
  { tab: "8 CPUs", memory: "16 GiB", storage: "320 GiB", bandwidth: "6,000 GiB", us: "$99.00", a: "$110.19", b: "$121.19", c: "$121.47" },
];

const planCards: CardItem[] = [
  { title: "Basic", description: "For simple applications", tag: "Premium available", bullets: ["Low-traffic web servers", "Blogs and forums", "Small databases"], href: "/register?plan=starter", cta: "Get started" },
  { title: "General Purpose", description: "For critical apps", tag: "Premium available", bullets: ["SaaS applications", "E-commerce", "High-traffic web servers"], href: "/register?plan=professional", cta: "Get started" },
  { title: "Memory-Optimized", description: "For RAM-intensive apps", tag: "Premium available", bullets: ["High-performance databases", "In-memory caches", "Real-time processing"], href: "/register?plan=business", cta: "Get started" },
  { title: "CPU-Optimized", description: "For CPU-intensive apps", tag: "Premium available", bullets: ["Media streaming", "Data analytics", "Batch processing"], href: "/register?plan=business", cta: "Get started" },
  { title: "Storage-Optimized", description: "For extra large apps", tag: "Premium available", bullets: ["NoSQL databases", "Monitoring software", "Data warehouses"], href: "/register?plan=business", cta: "Get started" },
  { title: "v5", description: "For demanding workloads", bullets: ["Bursty data pipelines", "High-throughput services", "Build farms"], href: "/register?plan=enterprise", cta: "Get started" },
  { title: "GPU", description: "For AI/ML workloads", bullets: ["Model training", "HPC", "Graphics and video rendering"], href: "/contact", cta: "Get started" },
];

function makeProduct(p: Partial<ProductDetail> & Pick<ProductDetail, "slug" | "name" | "hero">): ProductDetail {
  return {
    banner: {
      title: "Private servers are now generally available - no public IP, no rearchitecting, same price",
      body: "Private servers are isolated from the public internet, which helps with firewall drift and security audits.",
      cta: "Learn more",
      href: "/products/cloud-firewalls#vpc",
    },
    showcase: {
      title: "Comprehensive, cost-effective cloud computing",
      cards: [
        { title: "Easily deploy and manage servers", description: "Launch from the panel, the CLI, the API or the Terraform provider.", href: "/docs#quick-start", cta: "Read more" },
        { title: "Reliably scale as demand shifts", description: "Resize in place or scale horizontally across regions with a 99.99% uptime SLA.", href: "/docs#manage-servers", cta: "Learn how" },
        { title: "Build, monitor and secure your apps for less", description: "Free outbound transfer (500 GiB per month), monitoring and firewalls on every server.", href: "/pricing", cta: "View our pricing" },
      ],
    },
    plans: {
      title: "Simple enough for any user, powerful enough for fast-growing businesses",
      cards: planCards,
      callout: "Most users start with Premium servers.",
      calloutLink: "/pricing#compute",
      promo: "Want an even simpler experience?",
      promoLink: "/docs#quick-start",
    },
    savings: { title: "Join the many businesses saving up to 50% or more with Northstar", cta: "Reach out to our cloud experts" },
    comparison: {
      title: "See what you can save",
      body: "Pay-as-you-go or monthly pricing, so bills are predictable.",
      cta: "Calculate your savings",
      tabs: ["1 CPU", "2 CPUs", "4 CPUs", "8 CPUs"],
      heading: "Basic virtual machine costs",
      rows: comparisonRows,
    },
    tools: { title: "Do more with tools to help you save time", cards: sharedTools },
    images: sharedImages,
    testimonials: sharedTestimonials,
    faqs: [
      { q: `What is a Northstar ${p.name} server?`, a: `${p.name} servers are Linux virtual machines that run on top of virtualised hardware. Each server you create is a new instance you can use standalone or as part of a larger, cloud-based infrastructure.` },
      { q: "What is the difference between a server and a VPS?", a: "They are the same thing. A VPS is a virtual private server; Northstar calls them servers and bills them per second with a 60-second minimum." },
      { q: "What operating systems can I run?", a: "Ubuntu, Debian, Fedora, Rocky Linux, AlmaLinux and CentOS images, pre-installed apps such as Docker and WordPress, or your own custom image." },
      { q: "Do servers come with a dedicated IP address?", a: "Yes. Every server gets a dedicated public IPv4 address, and private servers can run without one on an isolated network." },
      { q: "How much bandwidth is included?", a: "Outbound transfer starts at 500 GiB per month and pools across your account. Overage is $0.01 per GiB." },
      { q: "How am I billed?", a: "Per second, with a 60-second minimum and a monthly cap, so you never pay more than the listed monthly price." },
      { q: "Is there a free trial?", a: "New accounts receive a demo credit to try the platform. Resources you destroy stop billing immediately." },
      { q: "Where are the data centres located?", a: "More than 30 regions across North America, Europe and Asia Pacific, with new regions added regularly." },
    ],
    ...p,
  };
}

export const productDetails: ProductDetail[] = [
  makeProduct({
    slug: "cloud-compute",
    name: "Cloud Compute",
    hero: { title: "Virtual machines for every use case", body: "Dependable uptime (99.99% SLA), simple security tools and predictable pricing for Cloud Compute, Northstar virtual machines." },
  }),
  makeProduct({
    slug: "high-performance",
    name: "High Performance",
    hero: { title: "Dedicated vCPUs and NVMe for apps that cannot wait", body: "High Performance servers give demanding applications dedicated compute, fast NVMe storage and consistent latency, with the same predictable pricing." },
  }),
  makeProduct({
    slug: "optimized-compute",
    name: "Optimized Compute",
    hero: { title: "Balanced resources tuned for specialised workloads", body: "Memory-, CPU- and storage-optimised configurations for databases, caches, analytics and batch processing, on dedicated hardware." },
  }),
  makeProduct({
    slug: "block-storage",
    name: "Block Storage",
    hero: { title: "Storage that scales with your servers", body: "Resizable SSD volumes, automated backups and S3-compatible object storage, attached to the same account as your compute." },
    banner: { title: "Daily backups are now available on every plan", body: "Choose weekly, daily or every 12, 6 or 4 hours, with retention from 3 days to 6 months.", cta: "Learn more", href: "/pricing#storage" },
    showcase: {
      title: "Durable, fast and simple storage",
      cards: [
        { title: "Attach volumes in seconds", description: "Add SSD block storage to any server and resize without downtime.", href: "/docs", cta: "Read more" },
        { title: "Back up on a schedule", description: "Automatic disk images with one-click restore, priced at 20% of the server cost.", href: "/pricing#storage", cta: "Learn how" },
        { title: "Serve files from the edge", description: "S3-compatible object storage with a built-in CDN and simple per-GiB pricing.", href: "/pricing#storage", cta: "View our pricing" },
      ],
    },
  }),
  makeProduct({
    slug: "cloud-firewalls",
    name: "Cloud Firewalls",
    hero: { title: "Secure and control traffic to your apps", body: "Free, stateful cloud firewalls, private networking and managed load balancers that follow every server you deploy." },
    banner: { title: "Firewall groups now apply to servers automatically by tag", body: "Tag a server and the matching rule set is applied at boot, so firewall drift is a thing of the past.", cta: "Learn more", href: "/docs#firewall" },
    showcase: {
      title: "Networking built for production",
      cards: [
        { title: "Allow only what you need", description: "Stateful inbound and outbound rules, reusable across your fleet.", href: "/docs#firewall", cta: "Read more" },
        { title: "Keep internal traffic private", description: "Per-region private networks with free intra-network transfer.", href: "/products/cloud-firewalls#vpc", cta: "Learn how" },
        { title: "Balance traffic automatically", description: "Managed load balancers with health checks and TLS termination from $12 per month.", href: "/pricing#networking", cta: "View our pricing" },
      ],
    },
  }),
];

/* ------------------------------------------------------------------ pricing */
export const pricingPage = {
  hero: { title: "Simple, predictable pricing", body: "Monthly caps and flat pricing on every product. Pay for what you use, never more than the listed monthly price." },
  intro: { title: "Choose the cloud solutions you need, or get an assist from our experts", cta: "Get help from our sales team" },
  categories: [
    {
      id: "compute",
      title: "Compute",
      items: [
        { title: "Cloud Compute", price: "$5/month", priceNote: "Per-second billing, 60-second minimum", description: "Shared and dedicated CPU virtual machines.", bullets: ["1 vCPU, 1 GB memory, 25 GB SSD", "1 TB outbound transfer", "Free monitoring and firewalls"], href: "/products/cloud-compute", cta: "View Cloud Compute pricing" },
        { title: "High Performance", price: "$48/month", description: "Dedicated vCPUs with NVMe storage.", bullets: ["4 vCPU, 8 GB memory, 160 GB NVMe", "5 TB outbound transfer", "Premium Intel and AMD CPUs"], href: "/products/high-performance", cta: "View High Performance pricing" },
        { title: "Optimized Compute", price: "$20/month", description: "Memory-, CPU- and storage-optimised plans.", bullets: ["2 vCPU, 4 GB memory, 80 GB SSD", "4 TB outbound transfer", "Resize in place"], href: "/products/optimized-compute", cta: "View Optimized Compute pricing" },
        { title: "Enterprise", price: "$99/month", description: "Custom configurations and dedicated support.", bullets: ["8 vCPU, 16 GB memory, 320 GB NVMe", "Private networking included", "Priority support"], href: "/contact", cta: "Talk to sales" },
      ],
    },
    {
      id: "storage",
      title: "Storage and Backups",
      items: [
        { title: "Backups", price: "20% of server cost", priceNote: "Weekly. Daily backups at 30%.", description: "Automatic disk images with one-click restore.", bullets: ["Weekly, daily or every 4 hours", "Retention from 3 days to 6 months", "Restore to any server"], href: "/products/block-storage#backups", cta: "View Backups pricing" },
        { title: "Block Storage", price: "$10/month", priceNote: "$0.10 per GiB", description: "Resizable SSD volumes.", bullets: ["Attach to any server", "Resize without downtime", "Snapshots at $0.06 per GiB"], href: "/products/block-storage", cta: "View Block Storage pricing" },
        { title: "Object Storage", price: "$5/month", priceNote: "250 GiB storage and 1 TiB transfer included", description: "S3-compatible storage with a built-in CDN.", bullets: ["S3-compatible API", "Built-in CDN", "$0.02 per additional GiB"], href: "/products/block-storage#object", cta: "View Object Storage pricing" },
      ],
    },
    {
      id: "networking",
      title: "Networking",
      items: [
        { title: "Cloud Firewalls", price: "$0/month", description: "Free stateful firewalls for every server.", bullets: ["Unlimited rules", "Apply by tag", "Inbound and outbound"], href: "/products/cloud-firewalls", cta: "View pricing" },
        { title: "Load Balancers", price: "$12/month", description: "Managed traffic distribution.", bullets: ["Health checks", "TLS termination", "Scale nodes any time"], href: "/products/cloud-firewalls#lb", cta: "View Load Balancers pricing" },
        { title: "Private Networking", price: "$0/month", priceNote: "NAT gateway $40 per node", description: "Isolated networks per region.", bullets: ["Unlimited private networks", "Free intra-network transfer", "Peering at $0.01 per GiB"], href: "/products/cloud-firewalls#vpc", cta: "View pricing" },
        { title: "Support Plans", price: "$0/month", description: "Community support included on every account.", bullets: ["Tickets within one business day", "Developer plan from $24", "Business plan from $99"], href: "/dashboard/support", cta: "View Support pricing" },
      ],
    },
    {
      id: "security",
      title: "Security",
      items: [
        { title: "Two-factor sign-in", price: "$0/month", description: "Protect every account with a second step.", bullets: ["Authenticator apps", "Backup codes", "Enforced for teams"], href: "/dashboard/settings", cta: "View pricing" },
        { title: "Secrets Manager", price: "$0.40 per secret-month", priceNote: "25 secret-months and 100K retrievals included", description: "Store and rotate credentials for your apps.", bullets: ["$0.05 per 10K retrievals", "Audit log included", "API and CLI access"], href: "/docs#api", cta: "View pricing" },
      ],
    },
  ],
  benefits: [
    "3 free static sites on every account",
    "Free ingress and free transfer inside a private network",
    "Egress overage at $0.01 per GiB",
    "Free reserved IPs when attached to a server",
    "Outbound transfer quotas starting at 500 GiB per month",
    "Free DNS hosting",
    "Free cloud firewalls",
    "Free monitoring and alerts",
    "Free weekly uptime checks",
  ],
  faqs: [
    { q: "What payment methods do you accept?", a: "Visa, Mastercard, American Express and PayPal. Enterprise customers can pay by invoice." },
    { q: "When is my card charged?", a: "Usage is invoiced on the first day of each month. You can also prepay to keep a credit balance." },
    { q: "Does entering a card trigger a charge?", a: "A small temporary pre-authorisation verifies the card and is released within a few days." },
    { q: "Are taxes included?", a: "Taxes are calculated at invoice time based on your billing address and shown as a separate line." },
    { q: "How do I stop being billed for a resource?", a: "Destroy the resource from the panel or API. Billing stops the second it is destroyed; powered-off servers still bill." },
    { q: "Can I set billing alerts?", a: "Yes. Set a monthly threshold in Billing and Payments and we email you when usage crosses it." },
    { q: "How does the demo credit work?", a: "New accounts receive a demo credit that is applied to your first invoice automatically." },
    { q: "Can I remove a saved card?", a: "Yes, as long as another payment method or a credit balance covers your current usage." },
    { q: "Can I prepay?", a: "Add funds at any time from Billing and Payments. Prepaid balance is used before your card is charged." },
    { q: "What is the refund policy?", a: "Unused prepaid balance is refundable on request. Usage charges are not refundable." },
  ],
};

/* ---------------------------------------------------------------- solutions */
export const solutionsPage = {
  hero: { title: "Northstar cloud solutions", body: "From virtual machines and website hosting to data pipelines and gaming servers, find the right starting point for your workload." },
  categories: [
    { id: "ai-ml", title: "AI/ML", description: "Dedicated compute for every use case, secure streaming and managed inference.", variant: "text", items: ["AI knowledge assistant", "Model training", "Recommendation engine", "Multimodal AI", "GPU clusters", "GPU inference"] },
    { id: "cms", title: "CMS and framework hosting", description: "Simple CMS options, including WordPress hosting.", variant: "logo", items: ["WordPress hosting", "Laravel hosting", "Content hosting", "Magento hosting", "Drupal hosting", "Ghost hosting", "Joomla hosting"] },
    { id: "data", title: "Data and IoT", description: "Data pipelines, streaming and infrastructure for connected devices.", variant: "text", items: ["Data analytics", "Data streaming cloud", "Managed Kafka", "Big data", "IoT cloud", "AdTech and MarTech"] },
    { id: "developer-tools", title: "Developer tools", description: "Deploy apps without changing your workflow, including CI/CD pipelines.", variant: "icon", items: ["Developer tools", "CI/CD pipelines", "Git hosting", "GitLab hosting"] },
    { id: "gaming", title: "Gaming and media", description: "Host your own gaming servers and more.", variant: "icon", items: ["Game development", "Minecraft server hosting", "Streaming on Northstar"] },
    { id: "hosting", title: "Hosting", description: "Reliable infrastructure, website hosting and VPS hosting.", variant: "icon", items: ["VPS hosting", "Website hosting", "Virtual machines", "Linux hosting"] },
    { id: "security", title: "Security and networking", description: "Reliable, secure infrastructure with cloud security solutions.", variant: "icon", items: ["VPN", "Web hosting security", "FTP hosting"] },
    { id: "startups", title: "Startups and SMBs", variant: "text", items: ["Startups", "Small business website hosting", "Digital marketing agencies", "Freelancer website hosting", "IT consulting"] },
    { id: "web", title: "Web and app platforms", description: "Build apps with familiar tools, including container orchestration.", variant: "text", items: ["Docker hosting", "Node.js hosting", "cPanel hosting", "Next.js hosting", "Web and mobile apps", "LAMP hosting"] },
  ] as { id: string; title: string; description?: string; variant: "text" | "icon" | "logo"; items: string[] }[],
};

/* ---------------------------------------------------------------- customers */
export const customersPage = {
  hero: { title: "Behind every great product, there is a team that chose to own their stack", body: "From first deploy to global scale, the Northstar cloud is open at every layer with predictable economics.", cta: "Meet the builders" },
  logos: ["Falcon AI", "Hippocrene", "Ideonix", "Ace Studio"],
  featured: [
    { company: "Hippocrene", headline: "2X production throughput", stat: "2X throughput", products: ["High Performance", "Block Storage", "Object Storage"] },
    { company: "Workflo", quote: "With the hyperscalers, we would probably still be waiting in a queue.", attribution: "Oscar Wu, Founder, Workflo Research Lab", products: ["High Performance", "Cloud Compute", "Load Balancers"] },
    { company: "LawVo", quote: "As we scaled, private networking became a key part of our architecture.", attribution: "Hovsep Seraydarian, Co-founder and CTO", stat: "Over 40% lower infrastructure costs", products: ["Cloud Compute", "Backups", "Block Storage", "Cloud Firewalls"] },
    { company: "Ace Studio", quote: "We were looking for a provider which had availability but also reliability at scale.", attribution: "Sean Zhao, Co-Founder", products: ["High Performance", "Optimized Compute"] },
  ],
  chips: ["All", "AI Native", "Digital Native Enterprise", "Startup"],
  grid: [
    { company: "Traversal", summary: "Observability tool that cuts through noisy data to find causes and fixes.", products: ["Optimized Compute", "High Performance"], tag: "AI Native" },
    { company: "Hippocrene", summary: "Healthcare services for patient calls, recovery plans and chronic-care check-ins.", products: ["High Performance", "Block Storage"], tag: "AI Native" },
    { company: "Consumable", summary: "Adtech platform handling up to one million queries per second at peak.", stat: "1M queries/sec peak", products: ["Cloud Compute", "Load Balancers", "Private Networking"], tag: "Digital Native Enterprise" },
    { company: "NoBid", summary: "Ad-tech startup founded in 2019 running about 200 billion auctions per month.", stat: "~200B auctions/month", products: ["Private Networking", "Load Balancers", "Object Storage"], tag: "Digital Native Enterprise" },
    { company: "RadixArk", summary: "Open-source infrastructure layer for running frontier workloads at scale.", products: ["High Performance", "Optimized Compute"], tag: "Startup" },
    { company: "Probably", summary: "Decision engine built for outputs users can trust to drive critical decisions.", products: ["Cloud Compute", "Backups"], tag: "Startup" },
  ],
  proof: [
    { category: "Compute", company: "Qencode", quote: "It has been a huge force-multiplier for our team.", attribution: "Murad Mordukhay, CEO and co-founder", href: "/products/cloud-compute" },
    { category: "Storage", company: "Traject Data", quote: "Scalability, support and pricing made it a no-brainer for us to stay.", attribution: "Fernando Marrero, Lead DevOps Engineer", href: "/products/block-storage" },
    { category: "Networking", company: "Consumable", quote: "We want the most throughput per dollar, and this is where we found it.", attribution: "Travis Beale, CTO", href: "/products/cloud-firewalls" },
    { category: "Management", company: "Probably", quote: "You can start simple and then scale up complexity.", attribution: "Peter Elias, Founder", href: "/dashboard" },
    { category: "Infrastructure", company: "Workflo", quote: "With the hyperscalers, we would probably still be waiting in a queue.", attribution: "Oscar Wu", href: "/#customers" },
  ],
  strip: { text: "Learn how customers are building with Northstar", cta: "All customer stories" },
};

/* ---------------------------------------------------------------- community */
export interface Post {
  type: "Tutorial" | "Article" | "Blog";
  title: string;
  date: string;
  read: string;
  href: string;
}

export const communityPage = {
  intro: { title: "Explore the latest from the Northstar community and learning materials.", body: "Guides, insights and tools to help you build and scale smarter." },
  featured: { tag: "Blog", title: "Introducing Northstar Compass: get more done with servers on the go", date: "Nov 14, 2026", read: "4 min", href: "/docs" },
  types: ["Tutorials", "Docs", "Articles", "Blogs", "Videos"],
  latest: [
    { type: "Tutorial", title: "When does High Performance compute beat standard servers? A break-even guide", date: "Nov 16, 2026", read: "9 min", href: "/pricing" },
    { type: "Article", title: "What is infrastructure as code? (2027)", date: "Nov 16, 2026", read: "6 min", href: "/docs#api" },
    { type: "Tutorial", title: "Lock down SSH access and rotate keys without downtime", date: "Nov 13, 2026", read: "7 min", href: "/docs#ssh-keys" },
    { type: "Tutorial", title: "Create servers automatically from GitHub pull requests", date: "Nov 13, 2026", read: "8 min", href: "/docs#api" },
    { type: "Tutorial", title: "How to build an audit trail for infrastructure changes", date: "Nov 12, 2026", read: "5 min", href: "/dashboard/activity" },
    { type: "Tutorial", title: "How to set spending limits and budget alerts", date: "Nov 11, 2026", read: "4 min", href: "/docs#billing" },
  ] as Post[],
  startHere: [
    { tab: "Explainer content", links: ["How to choose a cloud server for your project", "What is a VPS?", "What is cloud as a service?", "Top 12 open source tools to add to your stack", "Cloud providers: how to choose yours"] },
    { tab: "Beginner tutorials", links: ["Quick start: your first server", "Connect with SSH keys", "Firewall groups and rules", "Start, stop and restart servers", "Invoices, balance and payment methods"] },
    { tab: "Advanced tutorials", links: ["Infrastructure as code with the API", "Zero-downtime deploys behind a load balancer", "Private networking across regions", "Automated backups and restore drills", "Observability with Prometheus and Grafana"] },
  ],
  topics: [
    {
      title: "Compute",
      posts: [
        { type: "Tutorial", title: "Resize a server in place without losing data", date: "Nov 10, 2026", read: "6 min", href: "/docs#manage-servers" },
        { type: "Article", title: "Shared vs dedicated vCPU: which one do you need?", date: "Nov 8, 2026", read: "5 min", href: "/products/cloud-compute" },
        { type: "Tutorial", title: "Deploy Docker on a fresh Ubuntu server", date: "Nov 6, 2026", read: "10 min", href: "/docs#quick-start" },
      ] as Post[],
    },
    {
      title: "Networking",
      posts: [
        { type: "Tutorial", title: "Allow only the traffic your app needs with firewall groups", date: "Nov 5, 2026", read: "7 min", href: "/docs#firewall" },
        { type: "Tutorial", title: "Put two servers behind a managed load balancer", date: "Nov 3, 2026", read: "8 min", href: "/products/cloud-firewalls#lb" },
        { type: "Article", title: "Private networking explained", date: "Nov 1, 2026", read: "4 min", href: "/products/cloud-firewalls#vpc" },
      ] as Post[],
    },
  ],
  extras: [
    { title: "Northstar Wavemaker Program", description: "Write tutorials, speak at events and earn credits with other builders.", href: "/contact", cta: "Join our community" },
    { title: "Questions and answers", description: "Ask the community and the Northstar team anything about your setup.", href: "/#faq", cta: "Go to Q&A" },
    { title: "Join our Discord", description: "Real-time help, release news and a place to share what you are building.", href: "https://discord.com", cta: "Join the conversation" },
  ] as CardItem[],
  developerCloud: { title: "The developer cloud", body: "Scale up as you grow, whether you are running one virtual machine or ten thousand.", cta: "View all products" },
  deployBand: { title: "Start deploying today", body: "Sign up for Northstar to explore our virtual machines, storage, networking and more.", cta: "Sign up" },
};
