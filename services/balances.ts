/**
 * Account balance helpers (ALGO + ASA).
 * NOTE: These are read-only and safe — great for a "view mode" default.
 */
import algosdk from "algosdk";
import { indexer } from "./indexer";
import { toDisplay, getAssetDecimals } from "./assets";

export type AssetBalance = {
  assetId: number;
  amount: string; // decimal string, 6 places
  rawAmount: string; // microunits
  decimals: number;
  isAlgo: boolean;
  name?: string;
  unitName?: string;
};

/** Fetch ALGO balance in microalgos and return a display-ready object. */
export async function getAlgoBalance(address: string): Promise<AssetBalance> {
  const acct = await indexer.lookupAccountByID(address).do();
  const micro = acct?.account?.amount || 0;
  return {
    assetId: 0,
    amount: toDisplay(micro, 6),
    rawAmount: String(micro),
    decimals: 6,
    isAlgo: true,
    name: "Algorand",
    unitName: "ALGO",
  };
}

/** Fetch balances for opted-in assets (optionally filter list of IDs). */
export async function getAssetBalances(address: string, onlyAssetIds?: number[]): Promise<AssetBalance[]> {
  const acct = await indexer.lookupAccountByID(address).do();
  const holdings = (acct?.account?.assets ?? []) as Array<{ assetId: number; amount: number }>;
  const out: AssetBalance[] = [];
  for (const h of holdings) {
    if (onlyAssetIds && !onlyAssetIds.includes(h["asset-id"] ?? h.assetId)) continue;
    const id = (h as any)["asset-id"] ?? h.assetId;
    const decimals = await getAssetDecimals(id);
    out.push({
      assetId: id,
      amount: toDisplay(h.amount, decimals),
      rawAmount: String(h.amount),
      decimals,
      isAlgo: false,
    });
  }
  return out;
}
