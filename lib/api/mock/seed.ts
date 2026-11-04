/**
 * DEMO DATA ONLY.
 * Realistic sample records used while the NestJS API is not available.
 * Everything here is served through the typed mock adapter (lib/api/mock/adapter.ts),
 * never imported directly by page components.
 */
import type {
  AccountProfile,
  ActivityEvent,
  AdminCustomer,
  AdminServer,
  AdminTransaction,
  AuditEntry,
  BillingProfile,
  BillingSummary,
  FirewallGroup,
  FirewallRule,
  Invoice,
  OperatingSystem,
  PaymentMethod,
  Plan,
  PlatformSettings,
  Region,
  SecurityEvent,
  Server,
  ServiceCapabilities,
  SshKey,
  SupportTicket,
} from "@/types";

export const regions: Region[] = [
  { id: "nyc", name: "New York, US", area: "North America · US East", continent: "North America", flag: "US" },
  { id: "lon", name: "London, UK", area: "Europe · UK South", continent: "Europe", flag: "UK" },
  { id: "fra", name: "Frankfurt, DE", area: "Europe · Central", continent: "Europe", flag: "DE" },
  { id: "sgp", name: "Singapore", area: "Asia Pacific · Southeast", continent: "Asia Pacific", flag: "SG" },
  { id: "tyo", name: "Tokyo, JP", area: "Asia Pacific · Northeast", continent: "Asia Pacific", flag: "JP" },
  { id: "tor", name: "Toronto, CA", area: "North America · Canada", continent: "North America", flag: "CA" },
];

export const operatingSystems: OperatingSystem[] = [
  { id: "ubuntu", name: "Ubuntu", description: "Popular Linux distribution", versions: ["Ubuntu 24.04 LTS", "Ubuntu 22.04 LTS"] },
  { id: "debian", name: "Debian", description: "Stable and reliable Linux", versions: ["Debian 12 (Bookworm)", "Debian 11 (Bullseye)"] },
  { id: "windows", name: "Windows", description: "Windows Server image", versions: ["Windows Server 2022", "Windows Server 2019"] },
];

/** One catalog for the website, the deploy page and the admin console. */
export const plans: Plan[] = [
  { id: "starter", name: "Starter", tagline: "For personal projects and small applications.", vcpu: 1, memoryGb: 1, storageGb: 25, bandwidthTb: 1, priceMonthly: 5, status: "active", subscribers: 4210 },
  { id: "professional", name: "Professional", tagline: "Balanced performance for growing applications.", vcpu: 2, memoryGb: 4, storageGb: 80, bandwidthTb: 3, priceMonthly: 20, status: "active", subscribers: 4982, featured: true },
  { id: "business", name: "Business", tagline: "High-performance resources for business workloads.", vcpu: 4, memoryGb: 8, storageGb: 160, bandwidthTb: 5, priceMonthly: 48, status: "active", subscribers: 1290 },
  { id: "enterprise", name: "Enterprise", tagline: "Custom resources for large workloads.", vcpu: 8, memoryGb: 16, storageGb: 320, bandwidthTb: 10, priceMonthly: 99, status: "draft", subscribers: 94 },
];

const fullCaps: ServiceCapabilities = { start: true, stop: true, restart: true, resize: true, snapshot: true, delete: true };
/** A third-party provider that does not allow resize or snapshots through its API. */
const providerCaps: ServiceCapabilities = { start: true, stop: true, restart: true, resize: false, snapshot: false, delete: true };

export const servers: Server[] = [
  { id: "srv-001284", name: "web-prod-01", hostname: "web-prod-01.northstar.run", source: "OWN_INFRASTRUCTURE", regionId: "nyc", osId: "ubuntu", osVersion: "Ubuntu 24.04 LTS", planId: "professional", status: "running", ipAddresses: ["192.0.2.10"], createdAt: "2026-10-18T09:12:00Z", usage: { cpu: 42, memory: 68, storage: 35, trafficTb: 1.8 }, backups: false, sshKeyId: "key-prod", firewallGroupId: "fw-prod", capabilities: fullCaps, health: "healthy" },
  { id: "srv-001285", name: "api-server-02", hostname: "api.northstar.run", source: "OWN_INFRASTRUCTURE", regionId: "lon", osId: "ubuntu", osVersion: "Ubuntu 24.04 LTS", planId: "business", status: "running", ipAddresses: ["192.0.2.24"], createdAt: "2026-10-12T14:30:00Z", usage: { cpu: 78, memory: 71, storage: 52, trafficTb: 2.1 }, backups: true, sshKeyId: "key-prod", firewallGroupId: "fw-prod", capabilities: fullCaps, health: "warning" },
  { id: "srv-001286", name: "staging-web", source: "THIRD_PARTY_PROVIDER", providerId: "partner-cloud", externalResourceId: "pc-sgp-88213", regionId: "sgp", osId: "debian", osVersion: "Debian 12 (Bookworm)", planId: "starter", status: "running", ipAddresses: ["192.0.2.35"], createdAt: "2026-10-05T08:00:00Z", usage: { cpu: 18, memory: 44, storage: 21, trafficTb: 0.4 }, backups: false, sshKeyId: "key-dev", firewallGroupId: "fw-dev", capabilities: providerCaps, health: "healthy" },
  { id: "srv-001287", name: "backup-node-04", source: "OWN_INFRASTRUCTURE", regionId: "fra", osId: "debian", osVersion: "Debian 12 (Bookworm)", planId: "professional", status: "stopped", ipAddresses: ["192.0.2.48"], createdAt: "2026-09-29T11:45:00Z", usage: { cpu: 0, memory: 0, storage: 61, trafficTb: 0.2 }, backups: true, sshKeyId: "key-backup", firewallGroupId: "fw-db", capabilities: fullCaps, health: "healthy" },
  { id: "srv-001288", name: "dev-instance-05", source: "THIRD_PARTY_PROVIDER", providerId: "partner-cloud", externalResourceId: "pc-tyo-10442", regionId: "tyo", osId: "ubuntu", osVersion: "Ubuntu 22.04 LTS", planId: "starter", status: "running", ipAddresses: ["192.0.2.59"], createdAt: "2026-09-21T16:20:00Z", usage: { cpu: 12, memory: 37, storage: 18, trafficTb: 0.3 }, backups: false, sshKeyId: "key-dev", firewallGroupId: "fw-dev", capabilities: providerCaps, health: "healthy" },
  { id: "srv-001289", name: "db-primary-06", source: "OWN_INFRASTRUCTURE", regionId: "nyc", osId: "ubuntu", osVersion: "Ubuntu 24.04 LTS", planId: "business", status: "running", ipAddresses: ["192.0.2.63"], createdAt: "2026-09-14T10:05:00Z", usage: { cpu: 55, memory: 74, storage: 66, trafficTb: 1.2 }, backups: true, sshKeyId: "key-prod", firewallGroupId: "fw-db", capabilities: fullCaps, health: "healthy" },
  { id: "srv-001290", name: "worker-queue-07", source: "OWN_INFRASTRUCTURE", regionId: "lon", osId: "debian", osVersion: "Debian 12 (Bookworm)", planId: "professional", status: "stopped", ipAddresses: ["192.0.2.71"], createdAt: "2026-09-02T13:10:00Z", usage: { cpu: 0, memory: 0, storage: 29, trafficTb: 0.1 }, backups: false, sshKeyId: "key-dev", firewallGroupId: "fw-dev", capabilities: fullCaps, health: "healthy" },
  { id: "srv-001291", name: "edge-cache-08", source: "THIRD_PARTY_PROVIDER", providerId: "partner-cloud", externalResourceId: "pc-sgp-90127", regionId: "sgp", osId: "ubuntu", osVersion: "Ubuntu 24.04 LTS", planId: "starter", status: "running", ipAddresses: ["192.0.2.84"], createdAt: "2026-08-27T07:40:00Z", usage: { cpu: 24, memory: 41, storage: 33, trafficTb: 0.7 }, backups: false, sshKeyId: "key-prod", firewallGroupId: "fw-prod", capabilities: providerCaps, health: "healthy" },
];

export const sshKeys: SshKey[] = [
  { id: "key-prod", name: "Production Key", type: "RSA", bits: 4096, fingerprint: "SHA256:a83xQf7Lk2Vn0pR4sT6uW8yZb1Cd3Ef5Gh9kLm", linkedServers: 3, createdAt: "2026-10-18" },
  { id: "key-dev", name: "Development Key", type: "ED25519", fingerprint: "SHA256:pQ7rT2mX9bN4vC6zL1kJ8hG3fD5sA0w2tUv", linkedServers: 1, createdAt: "2026-10-12" },
  { id: "key-backup", name: "Backup Access", type: "ED25519", fingerprint: "SHA256:mN5dE8rT1yU4iO7pA2sD9fG6hJ3kL0z8xYz", linkedServers: 1, createdAt: "2026-09-29" },
  { id: "key-test", name: "Test Key", type: "ED25519", fingerprint: "SHA256:cR4vB7nM2qW5eR8tY1uI4oP7aS0dF3g6wSt", linkedServers: 0, createdAt: "2026-09-21" },
];

export const firewallGroups: FirewallGroup[] = [
  { id: "fw-prod", name: "Production-Web", serversAssigned: 2, status: "active" },
  { id: "fw-dev", name: "Development", serversAssigned: 3, status: "active" },
  { id: "fw-db", name: "Database-Private", serversAssigned: 1, status: "active" },
];

export const firewallRules: FirewallRule[] = [
  { id: "r1", groupId: "fw-prod", direction: "inbound", protocol: "TCP", port: "80", source: "0.0.0.0/0", description: "HTTP Web Traffic", action: "allow" },
  { id: "r2", groupId: "fw-prod", direction: "inbound", protocol: "TCP", port: "443", source: "0.0.0.0/0", description: "HTTPS Secure Traffic", action: "allow" },
  { id: "r3", groupId: "fw-prod", direction: "inbound", protocol: "TCP", port: "22", source: "192.168.1.0/24", description: "SSH Administration", action: "allow" },
  { id: "r4", groupId: "fw-prod", direction: "outbound", protocol: "TCP", port: "443", source: "0.0.0.0/0", description: "Secure Outgoing Traffic", action: "allow" },
  { id: "r5", groupId: "fw-prod", direction: "inbound", protocol: "ICMP", port: "—", source: "10.0.0.0/8", description: "Internal ping monitoring", action: "allow" },
  { id: "r6", groupId: "fw-prod", direction: "outbound", protocol: "UDP", port: "53", source: "0.0.0.0/0", description: "DNS lookups", action: "allow" },
  { id: "r7", groupId: "fw-dev", direction: "inbound", protocol: "TCP", port: "22", source: "203.0.113.0/24", description: "Office SSH access", action: "allow" },
  { id: "r8", groupId: "fw-dev", direction: "inbound", protocol: "TCP", port: "3000-3010", source: "203.0.113.0/24", description: "Dev preview ports", action: "allow" },
  { id: "r9", groupId: "fw-dev", direction: "inbound", protocol: "TCP", port: "80", source: "0.0.0.0/0", description: "HTTP Web Traffic", action: "allow" },
  { id: "r10", groupId: "fw-dev", direction: "outbound", protocol: "TCP", port: "443", source: "0.0.0.0/0", description: "Package downloads", action: "allow" },
  { id: "r11", groupId: "fw-db", direction: "inbound", protocol: "TCP", port: "5432", source: "10.0.1.0/24", description: "PostgreSQL from app subnet", action: "allow" },
  { id: "r12", groupId: "fw-db", direction: "inbound", protocol: "TCP", port: "5432", source: "0.0.0.0/0", description: "Block public database access", action: "deny" },
];

export const invoices: Invoice[] = [
  { id: "INV-2026-010", period: "October 2026", issuedAt: "2026-10-28", amount: 124.8, status: "pending", lines: [{ label: "Compute (8 servers)", amount: 98.4 }, { label: "Backups", amount: 12.0 }, { label: "Extra bandwidth", amount: 6.4 }, { label: "Tax", amount: 8.0 }] },
  { id: "INV-2026-009", period: "September 2026", issuedAt: "2026-09-30", amount: 136.25, status: "paid", lines: [{ label: "Compute (8 servers)", amount: 112.0 }, { label: "Backups", amount: 12.0 }, { label: "Tax", amount: 12.25 }] },
  { id: "INV-2026-008", period: "August 2026", issuedAt: "2026-08-31", amount: 119.4, status: "paid", lines: [{ label: "Compute (7 servers)", amount: 98.0 }, { label: "Backups", amount: 12.0 }, { label: "Tax", amount: 9.4 }] },
  { id: "INV-2026-007", period: "July 2026", issuedAt: "2026-07-31", amount: 121.6, status: "paid", lines: [{ label: "Compute (7 servers)", amount: 100.0 }, { label: "Backups", amount: 12.0 }, { label: "Tax", amount: 9.6 }] },
  { id: "INV-2026-006", period: "June 2026", issuedAt: "2026-06-30", amount: 98.2, status: "paid", lines: [{ label: "Compute (6 servers)", amount: 80.0 }, { label: "Backups", amount: 10.0 }, { label: "Tax", amount: 8.2 }] },
  { id: "INV-2026-005", period: "May 2026", issuedAt: "2026-05-31", amount: 96.4, status: "paid", lines: [{ label: "Compute (6 servers)", amount: 80.0 }, { label: "Backups", amount: 8.0 }, { label: "Tax", amount: 8.4 }] },
  { id: "INV-2026-004", period: "April 2026", issuedAt: "2026-04-30", amount: 84.0, status: "paid", lines: [{ label: "Compute (5 servers)", amount: 72.0 }, { label: "Backups", amount: 5.0 }, { label: "Tax", amount: 7.0 }] },
  { id: "INV-2026-003", period: "March 2026", issuedAt: "2026-03-31", amount: 72.5, status: "paid", lines: [{ label: "Compute (4 servers)", amount: 64.0 }, { label: "Tax", amount: 8.5 }] },
  { id: "INV-2026-002", period: "February 2026", issuedAt: "2026-02-28", amount: 61.0, status: "paid", lines: [{ label: "Compute (4 servers)", amount: 54.0 }, { label: "Tax", amount: 7.0 }] },
  { id: "INV-2026-001", period: "January 2026", issuedAt: "2026-01-31", amount: 45.2, status: "paid", lines: [{ label: "Compute (3 servers)", amount: 40.0 }, { label: "Tax", amount: 5.2 }] },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "pm-visa", brand: "VISA", label: "Visa", last4: "6242", expires: "08/2028", isDefault: true },
  { id: "pm-mc", brand: "MC", label: "Mastercard", last4: "8210", expires: "12/2027", isDefault: false },
];

export const billingProfile: BillingProfile = {
  accountName: "John Doe",
  billingEmail: "billing@example.com",
  country: "United States",
  currency: "USD — US Dollar",
};

export const billingSummary: BillingSummary = {
  balance: 250,
  currentMonthSpend: 124.8,
  spendChangePct: -8.4,
  nextInvoiceEstimate: 138.2,
  nextInvoiceDate: "2026-11-30",
  outstandingInvoices: 1,
};

export const activity: ActivityEvent[] = [
  { id: "a1", title: "Server created", target: "web-server-01", category: "Server", at: "2026-10-29T10:42:00Z", ip: "192.0.2.18", status: "success", icon: "server" },
  { id: "a2", title: "SSH key added", target: "office-laptop-key", category: "Security", at: "2026-10-29T09:18:00Z", ip: "192.0.2.18", status: "success", icon: "key" },
  { id: "a3", title: "Invoice paid", target: "INV-2026-009", category: "Billing", at: "2026-10-28T16:30:00Z", ip: "192.0.2.36", status: "success", icon: "dollar" },
  { id: "a4", title: "Server restarted", target: "api-server-02", category: "Server", at: "2026-10-28T14:15:00Z", ip: "192.0.2.18", status: "success", icon: "restart" },
  { id: "a5", title: "Firewall rule updated", target: "Production-Web", category: "Security", at: "2026-10-27T11:05:00Z", ip: "192.0.2.18", status: "success", icon: "flag" },
  { id: "a6", title: "Login attempt", target: "Account sign-in", category: "Security", at: "2026-10-26T21:12:00Z", ip: "198.51.100.24", status: "review", icon: "login" },
  { id: "a7", title: "Profile updated", target: "Account details", category: "Account", at: "2026-10-25T08:44:00Z", ip: "192.0.2.18", status: "success", icon: "user" },
  { id: "a8", title: "Server stopped", target: "backup-node-04", category: "Server", at: "2026-10-24T19:02:00Z", ip: "192.0.2.18", status: "success", icon: "server" },
  { id: "a9", title: "Payment failed", target: "Card ending 8210", category: "Billing", at: "2026-10-23T06:30:00Z", ip: "—", status: "failed", icon: "dollar" },
  { id: "a10", title: "SSH key removed", target: "old-ci-key", category: "Security", at: "2026-10-22T12:10:00Z", ip: "192.0.2.18", status: "success", icon: "key" },
  { id: "a11", title: "Server created", target: "db-primary-06", category: "Server", at: "2026-10-20T10:05:00Z", ip: "192.0.2.18", status: "success", icon: "server" },
  { id: "a12", title: "Login attempt", target: "Account sign-in", category: "Security", at: "2026-10-19T02:48:00Z", ip: "203.0.113.77", status: "review", icon: "login" },
  { id: "a13", title: "Invoice paid", target: "INV-2026-008", category: "Billing", at: "2026-09-01T09:00:00Z", ip: "192.0.2.36", status: "success", icon: "dollar" },
  { id: "a14", title: "Firewall group created", target: "Database-Private", category: "Security", at: "2026-08-30T15:22:00Z", ip: "192.0.2.18", status: "success", icon: "flag" },
];

export const tickets: SupportTicket[] = [
  { id: "#NS-1048", subject: "Server deployment issue", context: "web-server-01", category: "Technical", updatedAt: "2026-10-29", status: "in_progress", priority: "medium", customerName: "John Doe", customerEmail: "democustomer2@gmail.com", description: "Deployment stays in provisioning for more than 10 minutes." },
  { id: "#NS-1045", subject: "Invoice clarification", context: "October invoice", category: "Billing", updatedAt: "2026-10-28", status: "open", priority: "low", customerName: "John Doe", customerEmail: "democustomer2@gmail.com", description: "Please explain the extra bandwidth line." },
  { id: "#NS-1039", subject: "SSH key configuration", context: "Authentication setup", category: "Technical", updatedAt: "2026-10-25", status: "resolved", priority: "low", customerName: "John Doe", customerEmail: "democustomer2@gmail.com" },
  { id: "#NS-1032", subject: "Firewall configuration", context: "Production-Web group", category: "Security", updatedAt: "2026-10-22", status: "resolved", priority: "low", customerName: "John Doe", customerEmail: "democustomer2@gmail.com" },
  { id: "#NS-1027", subject: "Resize request", context: "api-server-02", category: "Technical", updatedAt: "2026-10-18", status: "resolved", priority: "medium", customerName: "John Doe", customerEmail: "democustomer2@gmail.com" },
  { id: "#NS-1019", subject: "Refund for duplicate charge", context: "INV-2026-006", category: "Billing", updatedAt: "2026-10-09", status: "resolved", priority: "high", customerName: "John Doe", customerEmail: "democustomer2@gmail.com" },
];

/** Tickets from other customers – only visible in the admin console. */
export const otherCustomerTickets: SupportTicket[] = [
  { id: "#NS-1051", subject: "Cannot reach server over SSH", context: "production-web-01", category: "Technical", updatedAt: "2026-10-30", status: "open", priority: "urgent", customerName: "Olivia Martin", customerEmail: "olivia@example.com" },
  { id: "#NS-1050", subject: "Upgrade to Business plan", context: "Plan change", category: "Billing", updatedAt: "2026-10-30", status: "open", priority: "medium", customerName: "James Wilson", customerEmail: "james@example.com" },
  { id: "#NS-1049", subject: "High CPU alerts", context: "database-primary", category: "Technical", updatedAt: "2026-10-29", status: "in_progress", priority: "high", customerName: "Noah Williams", customerEmail: "noah@example.com" },
  { id: "#NS-1047", subject: "Account verification", context: "Pending verification", category: "Account", updatedAt: "2026-10-29", status: "open", priority: "medium", customerName: "Sophia Chen", customerEmail: "sophia@example.com" },
  { id: "#NS-1046", subject: "Suspended account appeal", context: "Account access", category: "Account", updatedAt: "2026-10-28", status: "in_progress", priority: "high", customerName: "Emma Miller", customerEmail: "emma@example.com" },
  { id: "#NS-1044", subject: "Snapshot restore failed", context: "app-backend-02", category: "Technical", updatedAt: "2026-10-27", status: "resolved", priority: "medium", customerName: "Lucas Brown", customerEmail: "lucas@example.com" },
];

export const accountProfile: AccountProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "democustomer2@gmail.com",
  phone: "+1 (555) 012-3456",
  company: "Acme Technologies",
  jobTitle: "System Administrator",
  description: "",
  twoFactor: true,
  passwordChangedDaysAgo: 45,
  notifications: { serverAlerts: true, billing: true, security: true, product: false },
  regional: { language: "English (United States)", timezone: "UTC+05:00 — Karachi", dateFormat: "MMM DD, YYYY", currency: "USD — US Dollar" },
};

/* ------------------------------ Admin ------------------------------ */

export const adminCustomers: AdminCustomer[] = [
  { id: "c1", name: "Olivia Martin", email: "olivia@example.com", planId: "business", activeServers: 8, joinedAt: "2026-10-29", status: "active" },
  { id: "c2", name: "James Wilson", email: "james@example.com", planId: "starter", activeServers: 2, joinedAt: "2026-10-29", status: "active" },
  { id: "c3", name: "Sophia Chen", email: "sophia@example.com", planId: "professional", activeServers: 0, joinedAt: "2026-10-28", status: "pending" },
  { id: "c4", name: "Noah Williams", email: "noah@example.com", planId: "business", activeServers: 12, joinedAt: "2026-10-27", status: "active" },
  { id: "c5", name: "Emma Miller", email: "emma@example.com", planId: "professional", activeServers: 4, joinedAt: "2026-10-25", status: "suspended" },
  { id: "c6", name: "Lucas Brown", email: "lucas@example.com", planId: "starter", activeServers: 1, joinedAt: "2026-10-24", status: "active" },
  { id: "c7", name: "John Doe", email: "democustomer2@gmail.com", planId: "professional", activeServers: 6, joinedAt: "2026-01-12", status: "active" },
  { id: "c8", name: "Ava Thompson", email: "ava@example.com", planId: "business", activeServers: 5, joinedAt: "2026-10-22", status: "active" },
  { id: "c9", name: "Liam Johnson", email: "liam@example.com", planId: "starter", activeServers: 1, joinedAt: "2026-10-21", status: "pending" },
  { id: "c10", name: "Mia Garcia", email: "mia@example.com", planId: "professional", activeServers: 3, joinedAt: "2026-10-19", status: "active" },
  { id: "c11", name: "Ethan Clark", email: "ethan@example.com", planId: "business", activeServers: 9, joinedAt: "2026-10-17", status: "active" },
  { id: "c12", name: "Isabella Lee", email: "isabella@example.com", planId: "starter", activeServers: 0, joinedAt: "2026-10-15", status: "suspended" },
  { id: "c13", name: "Ali Raza", email: "ali.raza@example.com", planId: "professional", activeServers: 2, joinedAt: "2026-10-12", status: "active" },
  { id: "c14", name: "Fatima Khan", email: "fatima@example.com", planId: "business", activeServers: 7, joinedAt: "2026-10-10", status: "active" },
];

export const adminServers: AdminServer[] = [
  { id: "NS-2048", name: "production-web-01", ip: "192.0.2.10", customer: "Olivia Martin", regionCode: "US", regionName: "New York", planId: "business", cpu: 42, ram: 68, status: "running", source: "OWN_INFRASTRUCTURE" },
  { id: "NS-2049", name: "api-server-east", ip: "192.0.2.21", customer: "James Wilson", regionCode: "US", regionName: "Chicago", planId: "starter", cpu: 28, ram: 39, status: "running", source: "OWN_INFRASTRUCTURE" },
  { id: "NS-2050", name: "database-primary", ip: "192.0.2.32", customer: "Noah Williams", regionCode: "DE", regionName: "Frankfurt", planId: "business", cpu: 91, ram: 84, status: "warning", source: "OWN_INFRASTRUCTURE" },
  { id: "NS-2051", name: "staging-environment", ip: "192.0.2.43", customer: "Emma Miller", regionCode: "SG", regionName: "Singapore", planId: "professional", cpu: 0, ram: 0, status: "stopped", source: "THIRD_PARTY_PROVIDER" },
  { id: "NS-2052", name: "app-backend-02", ip: "192.0.2.14", customer: "Lucas Brown", regionCode: "UK", regionName: "London", planId: "professional", cpu: 37, ram: 51, status: "running", source: "OWN_INFRASTRUCTURE" },
  { id: "NS-2053", name: "web-prod-01", ip: "192.0.2.10", customer: "John Doe", regionCode: "US", regionName: "New York", planId: "professional", cpu: 42, ram: 68, status: "running", source: "OWN_INFRASTRUCTURE" },
  { id: "NS-2054", name: "staging-web", ip: "192.0.2.35", customer: "John Doe", regionCode: "SG", regionName: "Singapore", planId: "starter", cpu: 18, ram: 44, status: "running", source: "THIRD_PARTY_PROVIDER" },
  { id: "NS-2055", name: "analytics-worker", ip: "192.0.2.77", customer: "Ava Thompson", regionCode: "JP", regionName: "Tokyo", planId: "business", cpu: 63, ram: 70, status: "running", source: "THIRD_PARTY_PROVIDER" },
  { id: "NS-2056", name: "media-store-01", ip: "192.0.2.92", customer: "Ethan Clark", regionCode: "CA", regionName: "Toronto", planId: "business", cpu: 22, ram: 35, status: "running", source: "OWN_INFRASTRUCTURE" },
  { id: "NS-2057", name: "shop-frontend", ip: "192.0.2.101", customer: "Fatima Khan", regionCode: "UK", regionName: "London", planId: "professional", cpu: 47, ram: 58, status: "running", source: "OWN_INFRASTRUCTURE" },
  { id: "NS-2058", name: "ci-runner-03", ip: "192.0.2.115", customer: "Ali Raza", regionCode: "DE", regionName: "Frankfurt", planId: "starter", cpu: 0, ram: 0, status: "stopped", source: "OWN_INFRASTRUCTURE" },
];

export const adminTransactions: AdminTransaction[] = [
  { id: "INV-2026-1048", transactionId: "Transaction #TX84652", customer: "Olivia Martin", email: "olivia@example.com", date: "2026-10-29", method: "Visa •••• 4242", amount: 48, status: "paid" },
  { id: "INV-2026-1047", transactionId: "Transaction #TX84651", customer: "James Wilson", email: "james@example.com", date: "2026-10-29", method: "Mastercard •••• 8210", amount: 20, status: "paid" },
  { id: "INV-2026-1046", transactionId: "Transaction #TX84649", customer: "Sophia Chen", email: "sophia@example.com", date: "2026-10-28", method: "Visa •••• 1183", amount: 96, status: "pending" },
  { id: "INV-2026-1045", transactionId: "Transaction #TX84647", customer: "Noah Williams", email: "noah@example.com", date: "2026-10-28", method: "PayPal", amount: 48, status: "failed" },
  { id: "INV-2026-1044", transactionId: "Transaction #TX84645", customer: "Emma Miller", email: "emma@example.com", date: "2026-10-27", method: "Visa •••• 9061", amount: 20, status: "paid" },
  { id: "INV-2026-1043", transactionId: "Transaction #TX84641", customer: "John Doe", email: "democustomer2@gmail.com", date: "2026-10-27", method: "Visa •••• 6242", amount: 124.8, status: "pending" },
  { id: "INV-2026-1042", transactionId: "Transaction #TX84638", customer: "Ava Thompson", email: "ava@example.com", date: "2026-10-26", method: "Mastercard •••• 5531", amount: 48, status: "paid" },
  { id: "INV-2026-1041", transactionId: "Transaction #TX84632", customer: "Ethan Clark", email: "ethan@example.com", date: "2026-10-25", method: "Visa •••• 7310", amount: 96, status: "refunded" },
  { id: "INV-2026-1040", transactionId: "Transaction #TX84630", customer: "Fatima Khan", email: "fatima@example.com", date: "2026-10-25", method: "PayPal", amount: 48, status: "paid" },
  { id: "INV-2026-1039", transactionId: "Transaction #TX84627", customer: "Ali Raza", email: "ali.raza@example.com", date: "2026-10-24", method: "Visa •••• 2290", amount: 20, status: "paid" },
];

export const securityEvents: SecurityEvent[] = [
  { id: "e1", title: "Multiple failed login attempts", category: "Authentication", actor: "unknown_user", ip: "192.168.1.84", at: "2026-11-03T10:42:00Z", severity: "critical", status: "review" },
  { id: "e2", title: "Admin permission updated", category: "Access control", actor: "admin@northstar.cloud", ip: "10.0.0.12", at: "2026-11-03T10:18:00Z", severity: "warning", status: "verified" },
  { id: "e3", title: "New customer login", category: "Authentication", actor: "j.smith@example.com", ip: "203.0.113.42", at: "2026-11-03T09:56:00Z", severity: "info", status: "success" },
  { id: "e4", title: "Server configuration changed", category: "Infrastructure", actor: "ops@northstar.cloud", ip: "10.0.0.25", at: "2026-11-03T09:31:00Z", severity: "warning", status: "logged" },
  { id: "e5", title: "API key created", category: "API security", actor: "maria@example.com", ip: "198.51.100.16", at: "2026-11-03T08:47:00Z", severity: "info", status: "success" },
  { id: "e6", title: "Unusual access pattern detected", category: "Threat detection", actor: "system_monitor", ip: "198.51.100.91", at: "2026-11-03T08:22:00Z", severity: "critical", status: "investigate" },
  { id: "e7", title: "Password reset requested", category: "Authentication", actor: "lucas@example.com", ip: "203.0.113.9", at: "2026-11-03T07:58:00Z", severity: "info", status: "success" },
  { id: "e8", title: "Firewall policy updated", category: "Infrastructure", actor: "ops@northstar.cloud", ip: "10.0.0.25", at: "2026-11-03T07:20:00Z", severity: "warning", status: "logged" },
  { id: "e9", title: "Session revoked", category: "Access control", actor: "admin@northstar.cloud", ip: "10.0.0.12", at: "2026-11-03T06:44:00Z", severity: "info", status: "verified" },
  { id: "e10", title: "Brute-force attempt blocked", category: "Threat detection", actor: "system_monitor", ip: "192.0.2.201", at: "2026-11-03T05:12:00Z", severity: "critical", status: "review" },
];

export const auditEntries: AuditEntry[] = [
  { id: "au1", actor: "Admin User", action: "reviewed a security alert.", at: "2026-11-03T10:45:00Z", area: "Security", color: "blue" },
  { id: "au2", actor: "System Monitor", action: "completed routine checks.", at: "2026-11-03T10:32:00Z", area: "System", color: "green" },
  { id: "au3", actor: "Operations Team", action: "updated server permissions.", at: "2026-11-03T09:01:00Z", area: "Infrastructure", color: "amber" },
  { id: "au4", actor: "Admin User", action: "exported an audit report.", at: "2026-11-03T08:05:00Z", area: "Audit", color: "purple" },
];

export const platformSettings: PlatformSettings = {
  platformName: "Northstar Cloud",
  supportEmail: "support@northstar.cloud",
  defaultRegion: "US East (New Jersey)",
  defaultCurrency: "USD — US Dollar",
  timezone: "UTC (Coordinated Universal Time)",
  language: "English (United States)",
  security: { adminTwoFactor: true, loginAlerts: true, autoSessionTimeout: true, sessionTimeoutMinutes: 30 },
  notifications: { serverHealth: true, paymentFailures: true, newTickets: true, weeklySummary: false },
  email: { senderName: "Northstar Cloud", senderEmail: "no-reply@northstar.cloud", smtpHost: "smtp.northstar.cloud", smtpPort: "587" },
  integrations: { apiAccess: true, webhooks: true, thirdParty: false },
  maintenance: { enabled: false, notice: "" },
};

/* Chart series (illustrative sample data) */
export const customerUtilization = {
  labels: ["Oct 01", "Oct 06", "Oct 11", "Oct 16", "Oct 21", "Oct 26"],
  cpu: [32, 38, 36, 44, 47, 52, 49, 57, 55, 63, 66, 61, 72, 69, 74, 78],
  memory: [22, 24, 26, 30, 31, 33, 31, 36, 40, 42, 45, 43, 48, 52, 50, 56],
};

export const serverCpu24h = [32, 36, 33, 47, 41, 52, 49, 45, 54, 50, 56, 50, 53, 48, 55];

export const revenueByMonth = [
  { label: "Apr", value: 41200 },
  { label: "May", value: 53800 },
  { label: "Jun", value: 49600 },
  { label: "Jul", value: 63100 },
  { label: "Aug", value: 70400 },
  { label: "Sep", value: 76900 },
  { label: "Oct", value: 84290 },
];
