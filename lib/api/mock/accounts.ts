/**
 * DEMO LOGINS — for checking the frontend only.
 * Real authentication must be done by the NestJS API (never trust browser checks).
 */
import type { SessionUser } from "@/types";

export const DEMO_ACCOUNTS: { user: SessionUser; password: string }[] = [
  {
    user: { id: "u-admin", name: "Admin User", email: "northcloud99@gmail.com", role: "admin", title: "Super Admin", initials: "AU" },
    password: "north111",
  },
  {
    user: { id: "u-customer", name: "John Doe", email: "democustomer2@gmail.com", role: "customer", title: "Account Owner", initials: "JD" },
    password: "customer111",
  },
];
