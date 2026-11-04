/**
 * Typed API contract used by every page.
 * The mock adapter implements it today; a NestJS adapter implements the same
 * interface later, so page components do not change.
 * Endpoint paths are intentionally NOT defined here — agree them with the API owner.
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
  CustomerStatus,
  FirewallGroup,
  FirewallRule,
  Invoice,
  OperatingSystem,
  OperationResult,
  PaymentMethod,
  Plan,
  PlatformSettings,
  Region,
  SecurityEvent,
  Server,
  SessionUser,
  SshKey,
  SupportTicket,
  TicketStatus,
} from "@/types";

export type ServerAction = "start" | "stop" | "restart" | "delete";

export interface CreateServerInput {
  regionId: string;
  osId: string;
  osVersion: string;
  planId: string;
  storageGb: number;
  backups: boolean;
  sshKeyId?: string;
  firewallGroupId?: string;
  name: string;
  hostname?: string;
}

export interface ContactInput {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface NewTicketInput {
  category: SupportTicket["category"];
  priority: SupportTicket["priority"];
  subject: string;
  serverId?: string;
  description: string;
  attachmentName?: string;
}

export interface CustomerDashboard {
  utilization: { labels: string[]; cpu: number[]; memory: number[] };
  storage: { usedTb: number; allocatedTb: number; blockGb: number; instanceGb: number };
  bandwidthTb: number;
  bandwidthPct: number;
}

export interface AdminOverview {
  kpis: { customers: number; customersChange: number; activeServers: number; serversChange: number; monthlyRevenue: number; revenueChange: number; openTickets: number; ticketsNeedingAttention: number };
  revenue: { label: string; value: number }[];
  infrastructure: { region: string; uptime: number }[];
  operational: { running: number; total: number };
  alerts: { title: string; body: string }[];
}

export interface NorthcloudApi {
  /** Subscribe to data changes (mock: in-memory store; API: no-op or websocket). */
  subscribe(listener: () => void): () => void;

  auth: {
    login(email: string, password: string): Promise<SessionUser>;
    register(input: { name: string; email: string; password: string }): Promise<SessionUser>;
    requestPasswordReset(email: string): Promise<void>;
  };
  catalog: {
    regions(): Promise<Region[]>;
    operatingSystems(): Promise<OperatingSystem[]>;
    plans(): Promise<Plan[]>;
  };
  public: {
    sendContactMessage(input: ContactInput): Promise<{ reference: string }>;
  };
  customer: {
    dashboard(): Promise<CustomerDashboard>;
    servers(): Promise<Server[]>;
    server(id: string): Promise<Server | null>;
    serverCpu(id: string): Promise<number[]>;
    createServer(input: CreateServerInput): Promise<OperationResult<Server>>;
    serverAction(id: string, action: ServerAction): Promise<OperationResult<Server>>;

    sshKeys(): Promise<SshKey[]>;
    addSshKey(input: { name: string; type: SshKey["type"]; publicKey: string }): Promise<SshKey>;
    removeSshKey(id: string): Promise<void>;

    firewallGroups(): Promise<FirewallGroup[]>;
    firewallRules(): Promise<FirewallRule[]>;
    createFirewallGroup(name: string): Promise<FirewallGroup>;
    renameFirewallGroup(id: string, name: string): Promise<void>;
    addFirewallRule(input: Omit<FirewallRule, "id">): Promise<FirewallRule>;
    removeFirewallRule(id: string): Promise<void>;

    billingSummary(): Promise<BillingSummary>;
    invoices(): Promise<Invoice[]>;
    paymentMethods(): Promise<PaymentMethod[]>;
    billingProfile(): Promise<BillingProfile>;
    updateBillingProfile(input: BillingProfile): Promise<BillingProfile>;
    addFunds(amount: number): Promise<OperationResult>;
    addPaymentMethod(input: { holderName: string; label: string }): Promise<OperationResult<PaymentMethod>>;
    setDefaultPaymentMethod(id: string): Promise<void>;
    removePaymentMethod(id: string): Promise<void>;

    activity(): Promise<ActivityEvent[]>;

    tickets(): Promise<SupportTicket[]>;
    createTicket(input: NewTicketInput): Promise<SupportTicket>;

    profile(): Promise<AccountProfile>;
    updateProfile(input: Partial<AccountProfile>): Promise<AccountProfile>;
    changePassword(currentPassword: string, newPassword: string): Promise<void>;
    sessions(): Promise<{ id: string; device: string; location: string; lastActive: string; current: boolean }[]>;
    revokeSession(id: string): Promise<void>;
    requestAccountClosure(): Promise<OperationResult>;
  };
  admin: {
    overview(): Promise<AdminOverview>;
    customers(): Promise<AdminCustomer[]>;
    addCustomer(input: { name: string; email: string; planId: string }): Promise<AdminCustomer>;
    setCustomerStatus(id: string, status: CustomerStatus): Promise<void>;
    servers(): Promise<AdminServer[]>;
    serverAction(id: string, action: "start" | "stop" | "restart"): Promise<OperationResult>;
    plans(): Promise<Plan[]>;
    savePlan(plan: Plan): Promise<Plan>;
    transactions(): Promise<AdminTransaction[]>;
    tickets(): Promise<SupportTicket[]>;
    updateTicketStatus(id: string, status: TicketStatus): Promise<void>;
    securityEvents(): Promise<SecurityEvent[]>;
    audit(): Promise<AuditEntry[]>;
    settings(): Promise<PlatformSettings>;
    saveSettings(settings: PlatformSettings): Promise<PlatformSettings>;
    resetSettings(): Promise<PlatformSettings>;
  };
}

/** Error thrown by adapters. `field` points the form at the input that failed. */
export class ApiError extends Error {
  field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.name = "ApiError";
    this.field = field;
  }
}
