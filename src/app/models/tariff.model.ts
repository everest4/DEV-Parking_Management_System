export interface Tariff {
  id: number;
  label: string;   // "0-10 min", "1hr", "3hr"
  price: number;   // 0, 100, 200, ...
}
