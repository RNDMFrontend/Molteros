import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getTokensFromStorage,
  getPicksFromStorage,
  truncateAddress,
  OPERATOR_ADDRESS,
  type Token,
  type TokenPick,
} from "@/lib/tokens";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
} from "recharts";

const ROUND_DURATION = 60;
const SEED_AMOUNT = 1;
const FEE_BPS = 500;
const BET_CHIPS = [0.05, 0.1, 0.25, 1];

interface MarketState {
  symbol: string;
  address: string;
  round: number;
  countdown: number;
  upPool: number;
  downPool: number;
  priceHistory: { t: number; p: number }[];
  pick: "UP" | "DOWN" | null;
  seeded: boolean;
}

function initMarket(token: Token, picks: TokenPick[]): MarketState {
  const pick = picks.find((p) => p.symbol === token.symbol);
  // Generate initial price history
  const basePrice = 0.5 + Math.random() * 2;
  const history: { t: number; p: number }[] = [];
  for (let i = 0; i < 10; i++) {
    history.push({ t: i, p: basePrice + (Math.random() - 0.5) * 0.1 });
  }
  return {
    symbol: token.symbol,
    address: token.address,
    round: 1,
    countdown: ROUND_DURATION,
    upPool: SEED_AMOUNT,
    downPool: SEED_AMOUNT,
    priceHistory: history,
    pick: pick?.pick ?? null,
    seeded: true,
  };
}

function MarketCard({
  market,
  onBet,
  walletConnected,
}: {
  market: MarketState;
  onBet: (symbol: string, side: "UP" | "DOWN", amount: number) => void;
  walletConnected: boolean;
}) {
  const [selectedSide, setSelectedSide] = useState<"UP" | "DOWN" | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const totalPool = market.upPool + market.downPool;
  const upPct = totalPool > 0 ? ((market.upPool / totalPool) * 100).toFixed(1) : "50.0";
  const downPct = totalPool > 0 ? ((market.downPool / totalPool) * 100).toFixed(1) : "50.0";

  // Payout preview
  let payoutPreview: string | null = null;
  if (selectedSide && selectedAmount) {
    const sidePool =
      selectedSide === "UP"
        ? market.upPool + selectedAmount
        : market.downPool + selectedAmount;
    const total = totalPool + selectedAmount;
    const payout = (selectedAmount / sidePool) * total * (1 - FEE_BPS / 10000);
    payoutPreview = payout.toFixed(3);
  }

  const handleBet = () => {
    if (selectedSide && selectedAmount) {
      onBet(market.symbol, selectedSide, selectedAmount);
      setSelectedSide(null);
      setSelectedAmount(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-card/60 backdrop-blur p-4 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-foreground text-lg">{market.symbol}</span>
          <span className="ml-2 text-[10px] text-muted-foreground font-mono">
            {truncateAddress(market.address)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground">Round #{market.round}</div>
          <div
            className={`text-sm font-mono font-bold ${
              market.countdown <= 10 ? "text-primary" : "text-foreground"
            }`}
          >
            {market.countdown}s
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={market.priceHistory}>
            <YAxis domain={["auto", "auto"]} hide />
            <Line
              type="monotone"
              dataKey="p"
              stroke="hsl(350, 80%, 55%)"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pools */}
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-green-400" />
          <span className="text-green-400">{market.upPool.toFixed(2)} MON</span>
          <span className="text-muted-foreground">({upPct}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingDown className="w-3 h-3 text-red-400" />
          <span className="text-red-400">{market.downPool.toFixed(2)} MON</span>
          <span className="text-muted-foreground">({downPct}%)</span>
        </div>
      </div>

      {/* Pi Pick badge */}
      {market.pick && (
        <div className="flex justify-center">
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
              market.pick === "UP"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            Pi Pick: {market.pick}
          </span>
        </div>
      )}

      {/* Bet chips */}
      {walletConnected && (
        <>
          <div className="flex gap-2 justify-center flex-wrap">
            {BET_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedAmount(chip)}
                className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                  selectedAmount === chip
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border text-muted-foreground hover:border-muted"
                }`}
              >
                {chip} MON
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedSide === "UP" ? "default" : "outline"}
              className={`flex-1 text-xs ${
                selectedSide === "UP" ? "bg-green-600 hover:bg-green-700 border-green-600" : ""
              }`}
              onClick={() => setSelectedSide("UP")}
            >
              <TrendingUp className="w-3 h-3 mr-1" /> Bet UP
            </Button>
            <Button
              size="sm"
              variant={selectedSide === "DOWN" ? "default" : "outline"}
              className={`flex-1 text-xs ${
                selectedSide === "DOWN" ? "bg-red-600 hover:bg-red-700 border-red-600" : ""
              }`}
              onClick={() => setSelectedSide("DOWN")}
            >
              <TrendingDown className="w-3 h-3 mr-1" /> Bet DOWN
            </Button>
          </div>

          {/* Payout preview */}
          {payoutPreview && (
            <div className="text-center text-[11px] text-muted-foreground">
              Est. payout if {selectedSide} wins:{" "}
              <span className="text-foreground font-semibold">{payoutPreview} MON</span>
            </div>
          )}

          {selectedSide && selectedAmount && (
            <Button size="sm" onClick={handleBet} className="w-full text-xs">
              Confirm {selectedAmount} MON on {selectedSide}
            </Button>
          )}
        </>
      )}

      {/* Seed info */}
      <div className="text-[10px] text-muted-foreground text-center space-y-0.5">
        <div>Seeded by Agent: 1 MON UP + 1 MON DOWN</div>
        <div>Settles automatically · Fee: 5%</div>
      </div>
    </motion.div>
  );
}

export default function Play() {
  const [tokens] = useState(getTokensFromStorage());
  const [picks] = useState(getPicksFromStorage());
  const [markets, setMarkets] = useState<MarketState[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showOperator, setShowOperator] = useState(false);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  // Initialize markets
  useEffect(() => {
    const initial = tokens.map((t) => initMarket(t, picks));
    setMarkets(initial);
  }, [tokens, picks]);

  // Countdown + price tick
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((m) => {
          const newCountdown = m.countdown <= 1 ? ROUND_DURATION : m.countdown - 1;
          const newRound = m.countdown <= 1 ? m.round + 1 : m.round;
          const resetPools = m.countdown <= 1;

          // Append price point
          const lastPrice = m.priceHistory[m.priceHistory.length - 1]?.p ?? 1;
          const newPrice = lastPrice + (Math.random() - 0.48) * 0.02;
          const newHistory = [
            ...m.priceHistory.slice(-30),
            { t: m.priceHistory.length, p: Math.max(0.01, newPrice) },
          ];

          return {
            ...m,
            countdown: newCountdown,
            round: newRound,
            upPool: resetPools ? SEED_AMOUNT : m.upPool,
            downPool: resetPools ? SEED_AMOUNT : m.downPool,
            priceHistory: newHistory,
          };
        })
      );
    }, 1000);
    intervalsRef.current.push(interval);
    return () => clearInterval(interval);
  }, []);

  const handleBet = useCallback(
    (symbol: string, side: "UP" | "DOWN", amount: number) => {
      setMarkets((prev) =>
        prev.map((m) => {
          if (m.symbol !== symbol) return m;
          return {
            ...m,
            upPool: side === "UP" ? m.upPool + amount : m.upPool,
            downPool: side === "DOWN" ? m.downPool + amount : m.downPool,
          };
        })
      );
    },
    []
  );

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">
            Molter<span className="text-primary"> OS</span>
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
            In-Play
          </span>
        </div>
        <div className="flex items-center gap-2">
          {walletConnected && (
            <button
              onClick={() => setShowOperator(!showOperator)}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          <Button
            size="sm"
            variant={walletConnected ? "outline" : "default"}
            onClick={() => setWalletConnected(!walletConnected)}
            className="gap-1.5 text-xs"
          >
            <Wallet className="w-3.5 h-3.5" />
            {walletConnected ? "0x1a…f4e2" : "Connect Wallet"}
          </Button>
        </div>
      </div>

      {/* Economics bar */}
      <div className="flex items-center justify-center gap-4 py-2 border-b border-border/50">
        <span className="text-[10px] text-muted-foreground">
          Seeded: 1 MON/side · Fee: 5% · Settlement: permissionless
        </span>
      </div>

      {/* Market grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {markets.map((m) => (
          <MarketCard
            key={m.symbol}
            market={m}
            onBet={handleBet}
            walletConnected={walletConnected}
          />
        ))}
      </div>

      {/* Operator console */}
      {showOperator && walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 pb-6"
        >
          <div className="rounded-xl border border-primary/30 bg-card/60 backdrop-blur p-4">
            <h3 className="text-sm font-bold text-primary mb-3">Operator Console</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {markets.map((m) => (
                <div key={m.symbol} className="text-xs space-y-1">
                  <div className="font-semibold text-foreground">{m.symbol}</div>
                  <div className="text-muted-foreground">
                    Round #{m.round} · {m.countdown}s remaining
                  </div>
                  <div className="text-muted-foreground">
                    UP: {m.upPool.toFixed(2)} · DOWN: {m.downPool.toFixed(2)}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-7 w-full"
                    onClick={() =>
                      setMarkets((prev) =>
                        prev.map((market) =>
                          market.symbol === m.symbol
                            ? { ...market, round: market.round + 1, countdown: ROUND_DURATION, upPool: SEED_AMOUNT, downPool: SEED_AMOUNT }
                            : market
                        )
                      )
                    }
                  >
                    Force New Round + Seed
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
