/**
 * Asset helpers: decimals lookup, common IDs, formatting.
 */
import { indexer } from "./indexer";

export const COMMON_ASSETS = {
  // Mainnet IDs
  USDC: 31566704,
  goBTC: 386192725,
};

export async function getAssetDecimals(assetId: number): Promise<number> {
  try {
    const res = await indexer.lookupAssetByID(assetId).do();
    const decimals = res?.asset?.params?.decimals;
    if (typeof decimals === "number") return decimals;
  } catch (_e) {}
  // Default to 6 like ALGO if unknown.
  return 6;
}

/** Convert micro amount to display string with 6 decimals (UI preference). */
export function toDisplay(amountMicro: number | bigint, decimals = 6): string {
  const d = BigInt(10) ** BigInt(decimals);
  const a = BigInt(amountMicro);
  const whole = a // integer division
    // @ts-ignore - BigInt division ok
    / d;
  const frac = (a % d).toString().padStart(decimals, "0");
  // Always show 6 digits even if asset has fewer decimals (consistent UI).
  const frac6 = (decimals >= 6) ? frac.slice(0, 6) : (frac + "0".repeat(6 - decimals));
  return `${whole.toString()}.${frac6}`;
}
