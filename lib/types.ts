export type DataPoint = {
  t: number; // timestamp in ms
  value: number;
  series?: string;
};

export type Series = {
  id: string;
  color?: string;
};
