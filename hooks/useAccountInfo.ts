// hooks/useAccountInfo.ts
import { useState, useEffect } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import { getAlgoBalance, getAssetBalances } from "../services/balances";

export interface Asset {
  id: number;
  name: string;
  unitName: string;
  amount: number;
  rawAmount: number;
  decimals: number;
}
export interface AccountInfo {
  algoBalance: number;
  assets: Asset[];
}
export function useAccountInfo() {
  const { wallets } = useWallet();
  const address = wallets?.[0]?.accounts?.[0]?.address;
  const [data, setData]       = useState<AccountInfo>({ algoBalance: 0, assets: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<Error | null>(null);

  useEffect(() => {
    if (!address) return;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Fetch ALGO balance
        const algoBalanceObj = await getAlgoBalance(address);
        const algoBalance = Number(algoBalanceObj.amount); // Extract and convert amount to number

        // Fetch asset balances
        const assetBalances = await getAssetBalances(address);
        const assets = assetBalances.map(({ assetId, unitName, rawAmount, ...rest }: any) => ({ id: assetId, unitName, rawAmount: Number(rawAmount), ...rest })); // Map to Asset type

        // Combine balances into account info
        setData({ algoBalance, assets });
      } catch (err: any) {
        console.error("useAccountInfo:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  return { ...data, loading, error };
}
