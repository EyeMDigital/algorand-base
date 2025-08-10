'use client';
import React, { useEffect, useState } from "react";
import { getAlgoBalance, getAssetBalances } from "../services/balances";
import { COMMON_ASSETS } from "../services/assets";

export default function BalancesCard({ address }: { address: string }) {
  // Ensure initial client render matches SSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    if (!mounted || !address) return;
    setLoading(true);
    (async () => {
      try {
        const algo = await getAlgoBalance(address);
        const assets = await getAssetBalances(address, [COMMON_ASSETS.USDC]);
        const newRows = [{ label: "ALGO", value: algo.amount }];
        for (const a of assets) {
          newRows.push({ label: a.assetId === COMMON_ASSETS.USDC ? "USDC" : String(a.assetId), value: a.amount });
        }
        setRows(newRows);
      } catch (e:any) {
        setError(e?.message ?? "Failed to load balances.");
      } finally {
        setLoading(false);
      }
    })();
  }, [mounted, address]);

  // 🔒 Always render the same outer structure for SSR + first client pass
  return (
    <div className="p-4 border rounded-2xl shadow">
      <div className="text-lg font-semibold mb-2">Balances</div>

      {/* Before mount: deterministic skeleton so SSR == first client render */}
      {!mounted && (
        <div className="space-y-1">
          <div className="flex justify-between"><span className="opacity-70">ALGO</span><span className="font-mono">—</span></div>
          <div className="flex justify-between"><span className="opacity-70">USDC</span><span className="font-mono">—</span></div>
        </div>
      )}

      {/* After mount: real content */}
      {mounted && !address && <div className="text-red-600">Connect a wallet to view balances.</div>}
      {mounted && address && loading && <div>Loading balances…</div>}
      {mounted && address && error && <div className="text-red-600">{error}</div>}
      {mounted && address && !loading && !error && rows.length > 0 && (
        <div className="space-y-1">
          {rows.map((r, i) => (
            <div key={`${r.label}-${i}`} className="flex justify-between">
              <span className="opacity-70">{r.label}</span>
              <span className="font-mono">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
