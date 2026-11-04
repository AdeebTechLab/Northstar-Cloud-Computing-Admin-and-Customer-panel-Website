/**
 * DEMO MODE adapter.
 * Implements NorthcloudApi with an in-memory store (saved to localStorage so the
 * demo survives a page refresh). Long-running operations return "pending" first
 * and only flip to their final state after a simulated provider confirmation.
 */
import type {
  AccountProfile,
  ActivityEvent,
  AdminCustomer,
  FirewallGroup,
  FirewallRule,
  Invoice,
  OperationResult,
  PaymentMethod,
  Plan,
  PlatformSettings,
  Server,
  SessionUser,
  SshKey,
  SupportTicket,
} from "@/types";
import { ApiError, type NorthcloudApi, type ServerAction } from "../contract";
import * as seed from "./seed";
import { DEMO_ACCOUNTS } from "./accounts";

const STORAGE_KEY = "northcloud-demo-db-v1";
const isBrowser = typeof window !== "undefined";

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

function freshDb() {
  return {
    servers: clone(seed.servers),
    sshKeys: clone(seed.sshKeys),
    firewallGroups: clone(seed.firewallGroups),
    firewallRules: clone(seed.firewallRules),
    invoices: clone(seed.invoices),
    paymentMethods: clone(seed.paymentMethods),
    billingProfile: clone(seed.billingProfile),
    billingSummary: clone(seed.billingSummary),
    activity: clone(seed.activity),
    tickets: clone(seed.tickets),
    otherTickets: clone(seed.otherCustomerTickets),
    profile: clone(seed.accountProfile),
    plans: clone(seed.plans),
    adminCustomers: clone(seed.adminCustomers),
    adminServers: clone(seed.adminServers),
    adminTransactions: clone(seed.adminTransactions),
    settings: clone(seed.platformSettings),
    sessions: [
      { id: "s1", device: "Chrome on ChromeOS", location: "Lahore, PK", lastActive: "Active now", current: true },
      { id: "s2", device: "Safari on iPhone", location: "Lahore, PK", lastActive: "2 hours ago", current: false },
      { id: "s3", device: "Firefox on Windows", location: "Karachi, PK", lastActive: "Yesterday", current: false },
    ],
    nextServerNumber: 1292,
    nextTicketNumber: 1052,
  };
}
type Db = ReturnType<typeof freshDb>;

let db: Db | null = null;
const listeners = new Set<() => void>();

function load(): Db {
  if (db) return db;
  db = freshDb();
  if (isBrowser) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Db>;
        db = { ...db, ...saved };
        // Operations that were still pending when the page closed are settled now.
        db.servers = db.servers
          .filter((s) => s.status !== "deleting")
          .map((s) => ({
            ...s,
            status: s.status === "stopping" ? "stopped" : ["provisioning", "restarting", "starting"].includes(s.status) ? "running" : s.status,
          }));
      }
    } catch {
      /* storage unavailable – keep the fresh copy */
    }
  }
  return db;
}

function commit() {
  if (isBrowser && db) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      /* ignore quota / privacy mode errors */
    }
  }
  listeners.forEach((l) => l());
}

/** Clears the demo data back to the original seed. */
export function resetDemoData() {
  db = freshDb();
  commit();
}

const wait = (min = 250, max = 650) =>
  new Promise<void>((r) => setTimeout(r, Math.round(min + Math.random() * (max - min))));

const later = (ms: number, fn: () => void) => {
  if (isBrowser) window.setTimeout(fn, ms);
};

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

function logActivity(e: Omit<ActivityEvent, "id" | "at" | "ip">) {
  const d = load();
  d.activity.unshift({ ...e, id: `a${Date.now()}`, at: nowIso(), ip: "192.0.2.18" });
}

function requireServer(id: string): Server {
  const s = load().servers.find((x) => x.id === id);
  if (!s) throw new ApiError("Server not found.");
  return s;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "U";

/** Accounts created from the sign-up page live only in memory (never stored). */
const registeredAccounts: { user: SessionUser; password: string }[] = [];

export const mockApi: NorthcloudApi = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /* ------------------------------ auth ------------------------------ */
  auth: {
    async login(email, password) {
      await wait(500, 900);
      const e = email.trim().toLowerCase();
      const account =
        DEMO_ACCOUNTS.find((a) => a.user.email === e) ?? registeredAccounts.find((a) => a.user.email === e);
      if (!account || account.password !== password) {
        throw new ApiError("Incorrect email or password. Please check the demo credentials and try again.");
      }
      return clone(account.user);
    },
    async register({ name, email, password }) {
      await wait(600, 1000);
      const e = email.trim().toLowerCase();
      if (DEMO_ACCOUNTS.some((a) => a.user.email === e) || registeredAccounts.some((a) => a.user.email === e)) {
        throw new ApiError("An account with this email already exists. Try logging in instead.", "email");
      }
      const user: SessionUser = { id: `u-${Date.now()}`, name: name.trim(), email: e, role: "customer", title: "Workspace owner", initials: initialsOf(name) };
      registeredAccounts.push({ user, password });
      return clone(user);
    },
    async requestPasswordReset() {
      await wait(500, 900);
    },
  },

  /* ----------------------------- catalog ---------------------------- */
  catalog: {
    async regions() {
      await wait(120, 260);
      return clone(seed.regions);
    },
    async operatingSystems() {
      await wait(120, 260);
      return clone(seed.operatingSystems);
    },
    async plans() {
      await wait(150, 300);
      return clone(load().plans);
    },
  },

  public: {
    async sendContactMessage(input) {
      await wait(700, 1100);
      if (/\bfail\b/i.test(input.message)) {
        throw new ApiError("We couldn't send your message right now. Please try again in a moment.");
      }
      return { reference: `NS-${Math.floor(10000 + Math.random() * 89999)}` };
    },
  },

  /* ----------------------------- customer --------------------------- */
  customer: {
    async dashboard() {
      await wait();
      return {
        utilization: clone(seed.customerUtilization),
        storage: { usedTb: 1.28, allocatedTb: 2.0, blockGb: 720, instanceGb: 560 },
        bandwidthTb: 6.8,
        bandwidthPct: 68,
      };
    },
    async servers() {
      await wait();
      return clone(load().servers);
    },
    async server(id) {
      await wait(200, 450);
      const s = load().servers.find((x) => x.id === id);
      return s ? clone(s) : null;
    },
    async serverCpu(id) {
      await wait(150, 300);
      const s = load().servers.find((x) => x.id === id);
      if (!s || s.status === "stopped") return seed.serverCpu24h.map(() => 0);
      const shift = (s.usage.cpu - 42) * 0.8;
      return seed.serverCpu24h.map((v) => Math.max(2, Math.min(98, Math.round(v + shift))));
    },
    async createServer(input) {
      await wait(800, 1200);
      const d = load();
      if (d.servers.some((s) => s.name.toLowerCase() === input.name.trim().toLowerCase())) {
        throw new ApiError("A server with this name already exists.", "name");
      }
      const id = `srv-00${d.nextServerNumber++}`;
      const server: Server = {
        id,
        name: input.name.trim(),
        hostname: input.hostname?.trim() || undefined,
        source: "OWN_INFRASTRUCTURE",
        regionId: input.regionId,
        osId: input.osId,
        osVersion: input.osVersion,
        planId: input.planId,
        status: "provisioning",
        ipAddresses: [`192.0.2.${100 + (d.nextServerNumber % 150)}`],
        createdAt: nowIso(),
        usage: { cpu: 0, memory: 0, storage: 2, trafficTb: 0 },
        backups: input.backups,
        sshKeyId: input.sshKeyId,
        firewallGroupId: input.firewallGroupId,
        capabilities: { start: true, stop: true, restart: true, resize: true, snapshot: true, delete: true },
        health: "healthy",
      };
      d.servers.unshift(server);
      commit();
      later(4500, () => {
        const s = load().servers.find((x) => x.id === id);
        if (s && s.status === "provisioning") {
          s.status = "running";
          s.usage = { cpu: 6, memory: 18, storage: 4, trafficTb: 0 };
          logActivity({ title: "Server created", target: s.name, category: "Server", status: "success", icon: "server" });
          commit();
        }
      });
      return { status: "pending", message: "Order accepted. Provisioning has started and is waiting for confirmation.", data: clone(server) };
    },
    async serverAction(id, action: ServerAction) {
      await wait(400, 700);
      const s = requireServer(id);
      if (!s.capabilities[action]) {
        throw new ApiError(`This provider does not support "${action}" for this server.`);
      }
      const transitions: Record<ServerAction, { during: Server["status"]; after: Server["status"] | null; ms: number; label: string }> = {
        restart: { during: "restarting", after: "running", ms: 3200, label: "Server restarted" },
        stop: { during: "stopping", after: "stopped", ms: 2600, label: "Server stopped" },
        start: { during: "starting", after: "running", ms: 2600, label: "Server started" },
        delete: { during: "deleting", after: null, ms: 2600, label: "Server deleted" },
      };
      const t = transitions[action];
      if (action === "restart" && s.status !== "running") throw new ApiError("Only running servers can be restarted.");
      if (action === "stop" && s.status !== "running") throw new ApiError("This server is not running.");
      if (action === "start" && s.status !== "stopped") throw new ApiError("This server is already running.");
      s.status = t.during;
      commit();
      later(t.ms, () => {
        const d = load();
        const cur = d.servers.find((x) => x.id === id);
        if (!cur) return;
        if (t.after === null) {
          d.servers = d.servers.filter((x) => x.id !== id);
        } else {
          cur.status = t.after;
          if (t.after === "stopped") cur.usage = { ...cur.usage, cpu: 0, memory: 0 };
          if (t.after === "running" && cur.usage.cpu === 0) cur.usage = { ...cur.usage, cpu: 9, memory: 22 };
        }
        logActivity({ title: t.label, target: cur.name, category: "Server", status: "success", icon: action === "restart" ? "restart" : "server" });
        commit();
      });
      return { status: "pending", message: `${t.label.replace("Server ", "")} requested — waiting for the provider to confirm.`, data: clone(s) };
    },

    async sshKeys() {
      await wait();
      return clone(load().sshKeys);
    },
    async addSshKey({ name, type, publicKey }) {
      await wait(600, 900);
      const d = load();
      if (d.sshKeys.some((k) => k.name.toLowerCase() === name.trim().toLowerCase())) {
        throw new ApiError("You already have a key with this name.", "name");
      }
      const body = publicKey.trim().split(/\s+/)[1] ?? "";
      const key: SshKey = {
        id: `key-${Date.now()}`,
        name: name.trim(),
        type,
        bits: type === "RSA" ? 4096 : undefined,
        fingerprint: `SHA256:${(body.slice(4, 40) || Math.random().toString(36).slice(2)).padEnd(36, "x")}`,
        linkedServers: 0,
        createdAt: today(),
      };
      d.sshKeys.unshift(key);
      logActivity({ title: "SSH key added", target: key.name, category: "Security", status: "success", icon: "key" });
      commit();
      return clone(key);
    },
    async removeSshKey(id) {
      await wait(500, 800);
      const d = load();
      const key = d.sshKeys.find((k) => k.id === id);
      if (key && key.linkedServers > 0) throw new ApiError("Detach this key from its servers before deleting it.");
      d.sshKeys = d.sshKeys.filter((k) => k.id !== id);
      if (key) logActivity({ title: "SSH key removed", target: key.name, category: "Security", status: "success", icon: "key" });
      commit();
    },

    async firewallGroups() {
      await wait();
      return clone(load().firewallGroups);
    },
    async firewallRules() {
      await wait(200, 400);
      return clone(load().firewallRules);
    },
    async createFirewallGroup(name) {
      await wait(500, 800);
      const d = load();
      if (d.firewallGroups.some((g) => g.name.toLowerCase() === name.trim().toLowerCase())) {
        throw new ApiError("A firewall group with this name already exists.", "name");
      }
      const g: FirewallGroup = { id: `fw-${Date.now()}`, name: name.trim(), serversAssigned: 0, status: "active" };
      d.firewallGroups.push(g);
      logActivity({ title: "Firewall group created", target: g.name, category: "Security", status: "success", icon: "flag" });
      commit();
      return clone(g);
    },
    async renameFirewallGroup(id, name) {
      await wait(400, 700);
      const g = load().firewallGroups.find((x) => x.id === id);
      if (g) g.name = name.trim();
      commit();
    },
    async addFirewallRule(input) {
      await wait(500, 800);
      const rule: FirewallRule = { ...input, id: `r${Date.now()}` };
      load().firewallRules.push(rule);
      const g = load().firewallGroups.find((x) => x.id === input.groupId);
      logActivity({ title: "Firewall rule updated", target: g?.name ?? "Firewall", category: "Security", status: "success", icon: "flag" });
      commit();
      return clone(rule);
    },
    async removeFirewallRule(id) {
      await wait(400, 700);
      const d = load();
      d.firewallRules = d.firewallRules.filter((r) => r.id !== id);
      commit();
    },

    async billingSummary() {
      await wait();
      return clone(load().billingSummary);
    },
    async invoices() {
      await wait();
      return clone(load().invoices) as Invoice[];
    },
    async paymentMethods() {
      await wait(200, 400);
      return clone(load().paymentMethods);
    },
    async billingProfile() {
      await wait(150, 300);
      return clone(load().billingProfile);
    },
    async updateBillingProfile(input) {
      await wait(500, 800);
      const d = load();
      d.billingProfile = { ...input };
      commit();
      return clone(d.billingProfile);
    },
    async addFunds(amount) {
      await wait(700, 1000);
      if (amount < 5) throw new ApiError("The minimum top-up is $5.00.", "amount");
      if (amount > 5000) throw new ApiError("The maximum top-up is $5,000.00.", "amount");
      later(3500, () => {
        const d = load();
        d.billingSummary.balance = Math.round((d.billingSummary.balance + amount) * 100) / 100;
        logActivity({ title: "Funds added", target: `$${amount.toFixed(2)}`, category: "Billing", status: "success", icon: "dollar" });
        commit();
      });
      return { status: "pending", message: "Payment submitted. Your balance updates once the payment provider confirms it." };
    },
    async addPaymentMethod({ holderName, label }) {
      await wait(800, 1100);
      const pm: PaymentMethod = {
        id: `pm-${Date.now()}`,
        brand: label.toLowerCase().includes("master") ? "MC" : "VISA",
        label,
        last4: String(Math.floor(1000 + Math.random() * 8999)),
        expires: "10/2030",
        isDefault: false,
      };
      later(2500, () => {
        load().paymentMethods.push(pm);
        commit();
      });
      return { status: "pending", message: `Card for ${holderName} sent to the payment provider for verification.`, data: pm };
    },
    async setDefaultPaymentMethod(id) {
      await wait(400, 700);
      load().paymentMethods.forEach((p) => (p.isDefault = p.id === id));
      commit();
    },
    async removePaymentMethod(id) {
      await wait(400, 700);
      const d = load();
      const pm = d.paymentMethods.find((p) => p.id === id);
      if (pm?.isDefault) throw new ApiError("Choose another default method before removing this one.");
      d.paymentMethods = d.paymentMethods.filter((p) => p.id !== id);
      commit();
    },

    async activity() {
      await wait();
      return clone(load().activity);
    },

    async tickets() {
      await wait();
      return clone(load().tickets);
    },
    async createTicket(input) {
      await wait(700, 1000);
      const d = load();
      const server = input.serverId ? d.servers.find((s) => s.id === input.serverId) : undefined;
      const t: SupportTicket = {
        id: `#NS-${d.nextTicketNumber++}`,
        subject: input.subject.trim(),
        context: server?.name ?? input.category,
        category: input.category,
        updatedAt: today(),
        status: "open",
        priority: input.priority,
        customerName: `${d.profile.firstName} ${d.profile.lastName}`,
        customerEmail: d.profile.email,
        description: input.description,
        serverId: input.serverId,
      };
      d.tickets.unshift(t);
      commit();
      return clone(t);
    },

    async profile() {
      await wait();
      return clone(load().profile);
    },
    async updateProfile(input) {
      await wait(500, 800);
      const d = load();
      d.profile = { ...d.profile, ...input } as AccountProfile;
      logActivity({ title: "Profile updated", target: "Account details", category: "Account", status: "success", icon: "user" });
      commit();
      return clone(d.profile);
    },
    async changePassword(currentPassword, newPassword) {
      await wait(600, 900);
      const demo = DEMO_ACCOUNTS.find((a) => a.user.role === "customer")!;
      if (currentPassword !== demo.password) throw new ApiError("Your current password is incorrect.", "current");
      if (newPassword.length < 8) throw new ApiError("Use at least 8 characters.", "next");
      load().profile.passwordChangedDaysAgo = 0;
      commit();
    },
    async sessions() {
      await wait(200, 400);
      return clone(load().sessions);
    },
    async revokeSession(id) {
      await wait(400, 700);
      const d = load();
      d.sessions = d.sessions.filter((s) => s.id !== id || s.current);
      commit();
    },
    async requestAccountClosure() {
      await wait(700, 1000);
      return { status: "pending", message: "Closure request received. Our team will confirm by email before anything is removed." };
    },
  },

  /* ------------------------------ admin ----------------------------- */
  admin: {
    async overview() {
      await wait();
      const d = load();
      const open = [...d.tickets, ...d.otherTickets].filter((t) => t.status !== "resolved").length;
      return {
        kpis: { customers: 12846, customersChange: 8.2, activeServers: 8492, serversChange: 5.4, monthlyRevenue: 84290, revenueChange: 12.6, openTickets: 20 + open, ticketsNeedingAttention: 9 },
        revenue: clone(seed.revenueByMonth),
        infrastructure: [
          { region: "North America", uptime: 99.98 },
          { region: "Europe", uptime: 99.95 },
          { region: "Asia Pacific", uptime: 99.91 },
        ],
        operational: { running: 8492, total: 8520 },
        alerts: [
          { title: "Support backlog", body: "9 support tickets have been waiting for a response for more than 24 hours." },
          { title: "Storage capacity", body: "One infrastructure region has reached 82% storage utilization." },
        ],
      };
    },
    async customers() {
      await wait();
      return clone(load().adminCustomers);
    },
    async addCustomer({ name, email, planId }) {
      await wait(600, 900);
      const d = load();
      const e = email.trim().toLowerCase();
      if (d.adminCustomers.some((c) => c.email === e)) throw new ApiError("A customer with this email already exists.", "email");
      const c: AdminCustomer = { id: `c${Date.now()}`, name: name.trim(), email: e, planId, activeServers: 0, joinedAt: today(), status: "pending" };
      d.adminCustomers.unshift(c);
      commit();
      return clone(c);
    },
    async setCustomerStatus(id, status) {
      await wait(500, 800);
      const c = load().adminCustomers.find((x) => x.id === id);
      if (c) c.status = status;
      commit();
    },
    async servers() {
      await wait();
      return clone(load().adminServers);
    },
    async serverAction(id, action) {
      await wait(400, 700);
      const s = load().adminServers.find((x) => x.id === id);
      if (!s) throw new ApiError("Server not found.");
      const before = s.status;
      s.status = "restarting";
      commit();
      later(3000, () => {
        const cur = load().adminServers.find((x) => x.id === id);
        if (!cur) return;
        cur.status = action === "stop" ? "stopped" : before === "warning" && action === "restart" ? "running" : "running";
        if (action === "stop") {
          cur.cpu = 0;
          cur.ram = 0;
        } else if (cur.cpu === 0) {
          cur.cpu = 8;
          cur.ram = 20;
        } else if (before === "warning") {
          cur.cpu = 46;
          cur.ram = 58;
        }
        commit();
      });
      return { status: "pending", message: `${action[0]!.toUpperCase()}${action.slice(1)} sent to the infrastructure — waiting for confirmation.` };
    },
    async plans() {
      await wait();
      return clone(load().plans);
    },
    async savePlan(plan: Plan) {
      await wait(600, 900);
      const d = load();
      const idx = d.plans.findIndex((p) => p.id === plan.id);
      if (idx >= 0) d.plans[idx] = { ...plan };
      else d.plans.push({ ...plan });
      commit();
      return clone(plan);
    },
    async transactions() {
      await wait();
      return clone(load().adminTransactions);
    },
    async tickets() {
      await wait();
      const d = load();
      return clone([...d.tickets, ...d.otherTickets]).sort((a, b) => b.id.localeCompare(a.id));
    },
    async updateTicketStatus(id, status) {
      await wait(400, 700);
      const d = load();
      const t = d.tickets.find((x) => x.id === id) ?? d.otherTickets.find((x) => x.id === id);
      if (t) {
        t.status = status;
        t.updatedAt = today();
      }
      commit();
    },
    async securityEvents() {
      await wait();
      return clone(seed.securityEvents);
    },
    async audit() {
      await wait(200, 400);
      return clone(seed.auditEntries);
    },
    async settings() {
      await wait();
      return clone(load().settings);
    },
    async saveSettings(settings: PlatformSettings) {
      await wait(700, 1000);
      if (!/^\S+@\S+\.\S+$/.test(settings.supportEmail)) throw new ApiError("Enter a valid support email address.", "supportEmail");
      load().settings = clone(settings);
      commit();
      return clone(settings);
    },
    async resetSettings() {
      await wait(700, 1000);
      load().settings = clone(seed.platformSettings);
      commit();
      return clone(seed.platformSettings);
    },
  },
};
