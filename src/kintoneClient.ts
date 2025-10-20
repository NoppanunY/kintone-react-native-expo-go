import axios, { AxiosInstance, AxiosError } from "axios";
import Constants from "expo-constants";
import type { FieldsToPayload, KRecord } from "./kintoneTypes";

type Extra = {
  KINTONE_SUBDOMAIN?: string;
  KINTONE_DOMAIN?: string;
  KINTONE_API_TOKEN?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
const SUB = extra.KINTONE_SUBDOMAIN;
const DOMAIN = extra.KINTONE_DOMAIN ?? "cybozu.com";
const TOKEN = extra.KINTONE_API_TOKEN;

type AppErrorKind = "config" | "network" | "http" | "kintone" | "unknown";
export type AppError = {
  kind: AppErrorKind;
  message: string;
  status?: number;
  code?: string;
  url?: string;
  method?: string;
  raw?: any;
};

function ensureConfig() {
  const missing: string[] = [];
  if (!SUB) missing.push("KINTONE_SUBDOMAIN");
  if (!TOKEN) missing.push("KINTONE_API_TOKEN");
  if (missing.length) {
    const msg = `Missing config: ${missing.join(", ")}`;
    const err: AppError = { kind: "config", message: msg };
    throw err;
  }
}

function toAppError(e: unknown): AppError {
  if (axios.isAxiosError(e)) {
    const ax = e as AxiosError<any>;
    if (ax.response) {
      const status = ax.response.status;
      const kd = ax.response.data ?? {};
      const kintoneMsg =
        kd?.message ||
        kd?.error?.message ||
        (typeof kd === "string" ? kd : null);

      const appErr: AppError = {
        kind: "kintone",
        message: kintoneMsg || `HTTP ${status}`,
        status,
        code: kd?.code || kd?.error?.code || ax.code,
        url: ax.config?.url,
        method: ax.config?.method,
        raw: kd,
      };
      if (!kintoneMsg && !kd?.code) appErr.kind = "http";
      return appErr;
    }

    if (ax.request) {
      return {
        kind: "network",
        message:
          ax.code === "ECONNABORTED"
            ? "Request timeout"
            : "Network error (DNS/SSL/blocked/No response)",
        code: ax.code,
        url: ax.config?.url,
        method: ax.config?.method,
        raw: (ax.request as any)?._response,
      };
    }

    return {
      kind: "unknown",
      message: ax.message || "Axios error",
      code: ax.code,
      url: ax.config?.url,
      method: ax.config?.method,
    };
  }

  if (typeof e === "object" && e && "kind" in (e as any)) {
    return e as AppError;
  }

  return { kind: "unknown", message: (e as any)?.message ?? "Unknown error", raw: e };
}

function formatError(err: AppError): string {
  switch (err.kind) {
    case "config":
      return `App config ผิดพลาด: ${err.message}`;
    case "network":
      return `เครือข่ายหรือ SSL มีปัญหา: ${err.message}`;
    case "kintone":
      return `Kintone error: ${err.message}${err.status ? ` (HTTP ${err.status})` : ""}`;
    case "http":
      return `HTTP error: ${err.status ?? ""} ${err.message}`;
    default:
      return `Error: ${err.message}`;
  }
}

function createHttp(): AxiosInstance {
  ensureConfig();

  const http = axios.create({
    baseURL: `https://${SUB!}.${DOMAIN}/k/v1`,
    headers: {
      "X-Cybozu-API-Token": TOKEN!,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

  http.interceptors.response.use(
    (r) => r,
    (err) => {
      const appErr = toAppError(err);
      if (__DEV__) {
        console.log("AXIOS FAIL:", {
          ...appErr,
          headers: (err as any)?.config?.headers,
          params: (err as any)?.config?.params,
          data: (err as any)?.config?.data,
        });
      }
      return Promise.reject(appErr);
    }
  );

  return http;
}

export function makeKintoneApp<Fs extends Record<string, any>>(appId: number) {
  const http = createHttp();

  return {
    async list<T extends KRecord<Fs>>(query = "", fields?: string[]) {
      try {
        console.log("Kintone baseURL:", `https://${SUB}.${DOMAIN}/k/v1`);
        const params: any = { app: appId };
        if (query) params.query = query;
        if (fields?.length) params.fields = fields;
        const { data } = await http.get("/records.json", { params });
        return data.records as T[];
      } catch (e) {
        throw toAppError(e);
      }
    },

    async get<T extends KRecord<Fs>>(id: number, fields?: string[]) {
      try {
        const params: any = { app: appId, id };
        if (fields?.length) params.fields = fields;
        const { data } = await http.get("/record.json", { params });
        return data.record as T;
      } catch (e) {
        throw toAppError(e);
      }
    },

    async create(payload: FieldsToPayload<Fs>) {
      try {
        const { data } = await http.post("/record.json", { app: appId, record: payload });
        return data as { id: string; revision: string };
      } catch (e) {
        throw toAppError(e);
      }
    },

    async update(id: number, payload: FieldsToPayload<Fs>, revision?: string) {
      try {
        const body: any = { app: appId, id, record: payload };
        if (revision) body.revision = revision;
        const { data } = await http.put("/record.json", body);
        return data as { revision: string };
      } catch (e) {
        throw toAppError(e);
      }
    },

    async remove(id: number) {
      try {
        const { data } = await http.request({
          url: "/records.json",
          method: "DELETE",
          data: { app: appId, ids: [Number(id)] },
        });
        return data as {};
      } catch (e) {
        throw toAppError(e);
      }
    },
  };
}

export { formatError };
