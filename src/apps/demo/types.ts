import type { KText, KMultiLineText, KDropdown, KRecord, KId } from "../../kintoneTypes";

export type DemoFields = {
  $id: KId;
  Text: KText;
  Text_area: KMultiLineText;
};

export type DemoRecord = KRecord<DemoFields>;
