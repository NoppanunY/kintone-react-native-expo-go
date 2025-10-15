import axios from "axios";
import Constants from "expo-constants";

type Extra = {
  KINTONE_SUBDOMAIN?: string;
  KINTONE_DOMAIN?: string;
  KINTONE_APP_ID?: string;
  KINTONE_API_TOKEN?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
const SUB = extra.KINTONE_SUBDOMAIN!;
const DOMAIN = extra.KINTONE_DOMAIN ?? "cybozu.com";
const APP_ID = extra.KINTONE_APP_ID!;
const TOKEN = extra.KINTONE_API_TOKEN!;

const client = axios.create({
  baseURL: `https://${SUB}.${DOMAIN}/k/v1`,
  headers: {
    "X-Cybozu-API-Token": TOKEN,
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export type KintoneId = { value: string };
export type KintoneText = { value: string };
export type DemoRecord = {
  $id: KintoneId;
  Text?: KintoneText;
  Text_area?: KintoneText;
};

export async function listRecords(query = "", fields?: string[]) {
  const params: any = { app: APP_ID };
  if (query) params.query = query;
  if (fields?.length) params.fields = fields;
  const { data } = await client.get("/records.json", { params });
  return data.records as DemoRecord[];
}

export async function getRecord(id: string, fields?: string[]) {
  const params: any = { app: APP_ID, id };
  if (fields?.length) params.fields = fields;
  const { data } = await client.get("/record.json", { params });
  return data.record as DemoRecord;
}

export async function createRecord(record: Record<string, { value: any }>) {
  const { data } = await client.post("/record.json", { app: APP_ID, record });
  return data as { id: string; revision: string };
}

export async function updateRecord(
  id: string,
  record: Record<string, { value: any }>,
  revision?: string
) {
  const payload: any = { app: APP_ID, id, record };
  if (revision) payload.revision = revision;
  const { data } = await client.put("/record.json", payload);
  return data as { revision: string };
}

export async function deleteRecord(id: string) {
  const { data } = await client.request({
    url: "/records.json",
    method: "DELETE",
    data: { app: APP_ID, ids: [Number(id)] },
  });
  return data as {};
}
