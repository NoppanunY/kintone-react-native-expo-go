export type KintoneId = { value: string };
export type KintoneText = { value: string };

export type DemoRecord = {
  $id: KintoneId;
  Text?: KintoneText;
  Text_area?: KintoneText;
};
