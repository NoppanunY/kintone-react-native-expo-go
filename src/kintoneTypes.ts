export type KId = { value: number };
export type KText = { value: string };
export type KNumber = { value: number };
export type KDate = { value: string };
export type KDateTime = { value: string };
export type KCheckbox = { value: string[] };
export type KDropdown = { value: string };
export type KMultiLineText = { value: string };
export type KRichText = { value: string };

export type KSubtable<Row extends Record<string, any>> = {
  value: Array<{ id?: string; value: Row }>;
};

export type ExtractValue<F> = F extends { value: infer V } ? V : never;

export type FieldsToPayload<Fs extends Record<string, any>> = {
  [K in keyof Fs]?: { value: ExtractValue<Fs[K]> };
};

export type KRecord<Fs extends Record<string, any>> = { $id: KId } & Fs;
