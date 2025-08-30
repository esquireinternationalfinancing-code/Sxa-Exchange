
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  countryCode: string;
}

export interface HistoricalDataPoint {
  date: string;
  rate: number;
}
