"use client";

import { useEffect, useState } from "react";

/** Reads a query-string value once on the client (used for deep links from site search). */
export function useQueryParam(name: string) {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    setValue(new URLSearchParams(window.location.search).get(name));
  }, [name]);
  return value;
}
