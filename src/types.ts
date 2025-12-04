export interface Store {
  id: string;
  name: string;
  distance?: number;
  note?: string;
}

export type Box = {
  r: number;
  c: number;
  h: number;
  w: number;
};

export type Department = {
  name: string;
  boxes: Box[];
};


export interface Product {
  name: string;
  dept: string;
}
