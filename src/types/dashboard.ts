export interface SignalToken {
  token: string;
  buys: number;
  sells: number;
  net: number;
  total: number;
  score: number;
  virtualMon: string;
}

export interface StatusData {
  ts: string;
  mon_price_usd: number;
  signals: {
    top10: SignalToken[];
  };
  usdc: {
    human: {
      idle: number;
      lent: number;
      total: number;
    };
  };
  llm: {
    intent: {
      action: string;
      token?: string;
      max_mon?: number;
      amount_usdc?: number;
      reason: string;
    };
  };
  decision: {
    intent: {
      action: string;
      reason: string;
      token?: string;
      max_mon?: number;
    };
    executed: unknown | null;
  };
  decision_summary: string;
  min_virtual_mon: number;
}

export interface NadToken {
  symbol: string;
  tokenAddress: string;
  score: number;
  priceUsd: number | null;
  priceMon: number | null;
  change24h: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  ts: string;
}

export interface NadTopResponse {
  updatedAt: string;
  items: NadToken[];
}

export interface LogItem {
  stage: string;
  reason: string;
  ts: string;
  [key: string]: unknown;
}

export interface LogsResponse {
  items: LogItem[];
}
