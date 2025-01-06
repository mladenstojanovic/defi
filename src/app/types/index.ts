export interface CDP {
  id: number;
  ilk?: string;
  success: boolean;
  collateral: string | number;
  debt: string | number;
}

export interface CDPInfo {
  owner: string;
  ilk: string;
  collateral: string;
  debt: string;
}
