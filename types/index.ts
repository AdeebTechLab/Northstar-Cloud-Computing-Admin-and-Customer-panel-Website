/**
 * Frontend view models. These are NOT the final database schema —
 * adapt them to the NestJS API responses once the contract is agreed.
 */

export type Role = "customer" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  initials: string;
}

/** Every service keeps its source (brief §5). */
export type ServiceSource = "OWN_INFRASTRUCTURE" | "THIRD_PARTY_PROVIDER";

export type ServerStatus =
  | "running"
  | "stopped"
  | "provisioning"
  | "restarting"
  | "stopping"
  | "starting"
  | "deleting"
  | "failed";

/** What the API says this service supports. The UI only shows these actions. */
export interface ServiceCapabilities {
  start: boolean;
  stop: boolean;
  restart: boolean;
  resize: boolean;
  snapshot: boolean;
  delete: boolean;
}

export interface Region {
  id: string;
  name: string; // "New York, US"
  area: string; // "North America · US East"
  continent: "North America" | "Europe" | "Asia Pacific";
  flag: string;
}

export interface OperatingSystem {
  id: string;
  name: string;
  description: string;
  versions: string[];
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  vcpu: number;
  memoryGb: number;
  storageGb: number;
  bandwidthTb: number;
  priceMonthly: number;
  status: "active" | "draft";
  subscribers: number;
  featured?: boolean;
}

export interface Server {
  id: string; // srv-001284
  name: string;
  hostname?: string;
  source: ServiceSource;
  providerId?: string;
  externalResourceId?: string;
  regionId: string;
  osId: string;
  osVersion: string;
  planId: string;
  status: ServerStatus;
  ipAddresses: string[];
  createdAt: string; // ISO
  usage: { cpu: number; memory: number; storage: number; trafficTb: number };
  backups: boolean;
  sshKeyId?: string;
  firewallGroupId?: string;
  capabilities: ServiceCapabilities;
  health: "healthy" | "warning";
}

export interface SshKey {
  id: string;
  name: string;
  type: "RSA" | "ED25519" | "ECDSA";
  bits?: number;
  fingerprint: string;
  linkedServers: number;
  createdAt: string;
}

export type RuleDirection = "inbound" | "outbound";
export interface FirewallRule {
  id: string;
  groupId: string;
  direction: RuleDirection;
  protocol: "TCP" | "UDP" | "ICMP";
  port: string;
  source: string;
  description: string;
  action: "allow" | "deny";
}
export interface FirewallGroup {
  id: string;
  name: string;
  serversAssigned: number;
  status: "active" | "inactive";
}

export type InvoiceStatus = "paid" | "pending" | "failed" | "refunded";
export interface Invoice {
  id: string;
  period: string;
  issuedAt: string;
  amount: number;
  status: InvoiceStatus;
  lines: { label: string; amount: number }[];
}
export interface PaymentMethod {
  id: string;
  brand: "VISA" | "MC";
  label: string;
  last4: string;
  expires: string;
  isDefault: boolean;
}
export interface BillingProfile {
  accountName: string;
  billingEmail: string;
  country: string;
  currency: string;
}
export interface BillingSummary {
  balance: number;
  currentMonthSpend: number;
  spendChangePct: number;
  nextInvoiceEstimate: number;
  nextInvoiceDate: string;
  outstandingInvoices: number;
}

export type ActivityCategory = "Server" | "Security" | "Billing" | "Account";
export type ActivityStatus = "success" | "review" | "failed";
export interface ActivityEvent {
  id: string;
  title: string;
  target: string;
  category: ActivityCategory;
  at: string;
  ip: string;
  status: ActivityStatus;
  icon: "server" | "key" | "dollar" | "restart" | "flag" | "login" | "user";
}

export type TicketStatus = "open" | "in_progress" | "resolved";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export interface SupportTicket {
  id: string; // #NS-1048
  subject: string;
  context: string;
  category: "Technical" | "Billing" | "Security" | "Account";
  updatedAt: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerName?: string;
  customerEmail?: string;
  description?: string;
  serverId?: string;
}

export interface AccountProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  description: string;
  twoFactor: boolean;
  passwordChangedDaysAgo: number;
  notifications: { serverAlerts: boolean; billing: boolean; security: boolean; product: boolean };
  regional: { language: string; timezone: string; dateFormat: string; currency: string };
}

/* ------------------------------ Admin ------------------------------ */

export type CustomerStatus = "active" | "pending" | "suspended";
export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  planId: string;
  activeServers: number;
  joinedAt: string;
  status: CustomerStatus;
}

export interface AdminServer {
  id: string; // NS-2048
  name: string;
  ip: string;
  customer: string;
  regionCode: string;
  regionName: string;
  planId: string;
  cpu: number;
  ram: number;
  status: "running" | "warning" | "stopped" | "restarting";
  source: ServiceSource;
}

export interface AdminTransaction {
  id: string; // INV-2026-1048
  transactionId: string;
  customer: string;
  email: string;
  date: string;
  method: string;
  amount: number;
  status: InvoiceStatus;
}

export type Severity = "critical" | "warning" | "info";
export interface SecurityEvent {
  id: string;
  title: string;
  category: string;
  actor: string;
  ip: string;
  at: string;
  severity: Severity;
  status: "review" | "verified" | "success" | "logged" | "investigate";
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  at: string;
  area: string;
  color: "blue" | "green" | "amber" | "purple";
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  defaultRegion: string;
  defaultCurrency: string;
  timezone: string;
  language: string;
  security: { adminTwoFactor: boolean; loginAlerts: boolean; autoSessionTimeout: boolean; sessionTimeoutMinutes: number };
  notifications: { serverHealth: boolean; paymentFailures: boolean; newTickets: boolean; weeklySummary: boolean };
  email: { senderName: string; senderEmail: string; smtpHost: string; smtpPort: string };
  integrations: { apiAccess: boolean; webhooks: boolean; thirdParty: boolean };
  maintenance: { enabled: boolean; notice: string };
}

/** Result of an operation that the backend/provider must confirm. */
export interface OperationResult<T = unknown> {
  status: "pending" | "confirmed" | "failed";
  message: string;
  data?: T;
}
