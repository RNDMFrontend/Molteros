export interface Token {
  symbol: string;
  address: string;
}

export const TRENDING_TOKENS: Token[] = [
  { symbol: "CHOG", address: "0x350035555E10d9AfAF1566AaebfCeD5BA6C27777" },
  { symbol: "emonad", address: "0x81A224F8A62f52BdE942dBF23A56df77A10b7777" },
  { symbol: "Motion", address: "0x91ce820dD39A2B5639251E8c7837998530Fe7777" },
];

export const OPERATOR_ADDRESS = "0xOPERATOR_PLACEHOLDER";

export function saveTokensToStorage(tokens: Token[]) {
  localStorage.setItem("molter_tokens", JSON.stringify(tokens));
}

export function getTokensFromStorage(): Token[] {
  try {
    const raw = localStorage.getItem("molter_tokens");
    if (raw) return JSON.parse(raw);
  } catch {}
  return TRENDING_TOKENS;
}

export interface TokenPick {
  symbol: string;
  pick: "UP" | "DOWN";
  fairUp: number;
  fairDown: number;
  confidence: "Low" | "Med" | "High";
  reason: string;
}

export function savePicksToStorage(picks: TokenPick[]) {
  localStorage.setItem("molter_picks", JSON.stringify(picks));
}

export function getPicksFromStorage(): TokenPick[] {
  try {
    const raw = localStorage.getItem("molter_picks");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
