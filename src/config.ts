import Constants from "expo-constants";

type Extra = {
  KINTONE_SUBDOMAIN?: string;
  KINTONE_DOMAIN?: string;
  KINTONE_APP_ID?: string;
  KINTONE_API_TOKEN?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function required(name: keyof Extra) {
  const val = extra[name];
  if (!val || String(val).trim() === "") {
    throw new Error(`Missing ${name}. Please set it in .env and app.config.ts`);
  }
  return String(val);
}

export const KINTONE_SUBDOMAIN = required("KINTONE_SUBDOMAIN");
export const KINTONE_DOMAIN = extra.KINTONE_DOMAIN ?? "cybozu.com";
export const KINTONE_APP_ID = required("KINTONE_APP_ID");
export const KINTONE_API_TOKEN = required("KINTONE_API_TOKEN");

export const KINTONE_BASE_URL = `https://${KINTONE_SUBDOMAIN}.${KINTONE_DOMAIN}/k/v1`;
