import type { NorthcloudApi } from "./contract";
import { mockApi } from "./mock/adapter";

/**
 * Switch point between demo data and the real NestJS API.
 * Keep NEXT_PUBLIC_USE_MOCK_API=true until the NestJS adapter is written;
 * pages only ever import `api` from here.
 */
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const api: NorthcloudApi = mockApi;

export { ApiError } from "./contract";
export type * from "./contract";
