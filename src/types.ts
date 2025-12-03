export interface Store {
  id: string;
  name: string;
  distance?: number;
  note?: string;
}

export interface Department {
  name: string;
  r: number;
  c: number;
  h: number;
  w: number;
}

export interface Product {
  name: string;
  dept: string;
}
