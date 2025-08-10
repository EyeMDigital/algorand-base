// hooks/useAccountInfo.ts
import { useState, useEffect } from "react";
import { useWallet } from "@txnlab/use-wallet-react";

export interface Asset {
  id: number;
  name: string;
  amount: number;
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
        const res = await fetch(`/api/account/${address}`);
        if (!res.ok) throw new Error(await res.text());
        const info = await res.json();

        // 1) Algo balance
        const algoBalance = Number(info.amount) / 1e6;

        // 2) Map assets directly from info.assets
        const assets: Asset[] = (info.assets || [])
          .filter((a: any) => Number(a.amount) > 0)
          .map((a: any) => {
            const params   = a.params || {};
            const id       = typeof a["asset-id"] === "string"
              ? parseInt(a["asset-id"], 10)
              : a["asset-id"];
            const decimals = typeof params.decimals === "string"
              ? parseInt(params.decimals, 10)
              : params.decimals || 0;
            const name     = params["unit-name"] || params.name || `ASA ${id}`;
            const rawAmt   = typeof a.amount === "string"
              ? parseInt(a.amount, 10)
              : a.amount;
            const amount   = rawAmt / 10 ** decimals;

            return { id, name, amount, decimals };
          });

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
