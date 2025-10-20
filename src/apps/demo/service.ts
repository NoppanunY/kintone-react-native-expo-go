import { makeKintoneApp } from "../../kintoneClient";
import type { DemoFields, DemoRecord } from "./types";
import Constants from "expo-constants";

type Extra = {
    KINTONE_APP_ID?: number;
}

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
const APP_ID = extra.KINTONE_APP_ID!;

const app = makeKintoneApp<DemoFields>(APP_ID);

export const DemoService = {
  list(query = "", fields: Array<keyof DemoFields | "$id"> = []) {
    return app.list<DemoRecord>(query, fields as string[]);
  },
  get(id: number, fields: Array<keyof DemoFields | "$id"> = []) {
    return app.get<DemoRecord>(id, fields as string[]);
  },
  create(input: Partial<{ [K in keyof DemoFields]: DemoFields[K]["value"] }>) {
    const record: any = {};
    for (const k in input) record[k] = { value: (input as any)[k] };
    return app.create(record);
  },
  update(id: number, input: Partial<{ [K in keyof DemoFields]: DemoFields[K]["value"] }>) {
    const record: any = {};
    for (const k in input) record[k] = { value: (input as any)[k] };
    return app.update(id, record);
  },
  remove(id: number) {
    return app.remove(id);
  }
};
