import axios from "axios";
import { KINTONE_API_TOKEN, KINTONE_APP_ID, KINTONE_BASE_URL } from "./config";
import type { DemoRecord } from "./types";

const client = axios.create({
  baseURL: KINTONE_BASE_URL,
  headers: {
    "X-Cybozu-API-Token": KINTONE_API_TOKEN,
    "Content-Type": "application/json"
  },
  timeout: 15000
});

export async function getRecords(query = "", fields?: string[]) {
  const params: Record<string, any> = { app: KINTONE_APP_ID };
  if (query) params.query = query;
  if (fields?.length) params.fields = fields;
  const { data } = await client.get("/records.json", { params });
  return data.records as DemoRecord[];
}

export async function getRecord(id: string, fields?: string[]) {
  const params: Record<string, any> = { app: KINTONE_APP_ID, id };
  if (fields?.length) params.fields = fields;
  const { data } = await client.get("/record.json", { params });
  return data.record as DemoRecord;
}

export async function createRecord(record: Record<string, { value: any }>) {
  const payload = { app: KINTONE_APP_ID, record: record };
  const { data } = await client.post("/record.json", payload);
  return data as { id: string; revision: string };
}

export async function updateRecord(id: string, record: Record<string, { value: any }>, revision?: string) {
  const payload: any = { app: KINTONE_APP_ID, id: id, record: record };
  if (revision) payload.revision = revision;
  const { data } = await client.put("/record.json", payload);
  return data as { revision: string };
}
