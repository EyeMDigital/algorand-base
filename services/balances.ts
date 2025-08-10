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
  const holdings = (acct?.account?.assets ?? []) as Array<{ assetId: bigint; amount: bigint }>;
  const out: AssetBalance[] = [];
  for (const h of holdings) {
    const id = Number(h.assetId); // Convert assetId from bigint to number
    const amount = Number(h.amount); // Convert amount from bigint to number
    if (onlyAssetIds && !onlyAssetIds.includes(id)) continue;

    // Fetch asset details
    const assetInfo = await indexer.lookupAssetByID(id).do();
    const name = assetInfo?.asset?.params?.name || "Unknown Asset";
    const unitName = assetInfo?.asset?.params?.unitName || "";
    const decimals = assetInfo?.asset?.params?.decimals || 0;

    out.push({
      assetId: id,
      amount: toDisplay(amount, decimals),
      rawAmount: String(amount),
      decimals,
      isAlgo: false,
      name,
      unitName,
    });
  }
  return out;
}
