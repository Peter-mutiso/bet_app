import { createApiClient } from "./client";

const apiClient = createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
    timeout: 30000,
    withCredentials: true,
});

export default apiClient;

export * from "./client";
export * from "./types";
export * from "./endpoints";