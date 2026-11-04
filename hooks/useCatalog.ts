"use client";

import { useEffect, useState } from "react";
import type { OperatingSystem, Plan, Region } from "@/types";
import { api } from "@/lib/api";

interface Catalog {
  regions: Region[];
  operatingSystems: OperatingSystem[];
  plans: Plan[];
}

let cache: Catalog | null = null;
let inflight: Promise<Catalog> | null = null;

function loadCatalog() {
  if (cache) return Promise.resolve(cache);
  inflight ??= Promise.all([api.catalog.regions(), api.catalog.operatingSystems(), api.catalog.plans()]).then(([regions, operatingSystems, plans]) => {
    cache = { regions, operatingSystems, plans };
    return cache;
  });
  return inflight;
}

/** Regions, operating systems and plans, loaded once and shared. */
export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(cache);
  useEffect(() => {
    let alive = true;
    void loadCatalog().then((c) => alive && setCatalog(c));
    // Plans can change in the admin console — refresh the shared copy when data changes.
    const unsubscribe = api.subscribe(() => {
      cache = null;
      inflight = null;
      void loadCatalog().then((c) => alive && setCatalog(c));
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);
  const region = (id: string) => catalog?.regions.find((r) => r.id === id);
  const plan = (id: string) => catalog?.plans.find((p) => p.id === id);
  const os = (id: string) => catalog?.operatingSystems.find((o) => o.id === id);
  return { catalog, region, plan, os };
}

export const planSpec = (p?: Plan) => (p ? `${p.vcpu} vCPU · ${p.memoryGb} GB` : "—");
