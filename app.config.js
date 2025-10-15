// app.config.ts
export default () => ({
  expo: {
    name: "rn-kintone-demo",
    slug: "rn-kintone-demo",
    scheme: "rn-kintone-demo",
    orientation: "portrait",
    ios: { supportsTablet: true },
    android: { adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#ffffff" } },
    web: { bundler: "metro" },
    extra: {
      // ต้องตั้งค่าเหล่านี้ผ่าน .env หรือ environment variables
      KINTONE_SUBDOMAIN: process.env.KINTONE_SUBDOMAIN, // เช่น my-company
      KINTONE_DOMAIN: process.env.KINTONE_DOMAIN ?? "cybozu.com", // "cybozu.com" หรือ "kintone.com" ตาม region/tenant
      KINTONE_APP_ID: process.env.KINTONE_APP_ID, // ตัวเลข app id
      KINTONE_API_TOKEN: process.env.KINTONE_API_TOKEN // token read/write ของแอป
    }
  }
});
