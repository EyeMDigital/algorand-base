"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { useAccountInfo } from "../hooks/useAccountInfo";

export default function WalletDashboard() {
  const { algoBalance, assets, loading, error } = useAccountInfo();

  // If the hook threw an error
  if (error) {
    return (
      <div className="text-red-600">
        Oops—we couldn't load your wallet info. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ALGO Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle>ALGO Balance</CardTitle>
            <CardDescription>Your Algo balance</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              "Loading..."
            ) : (
              <span className="text-2xl font-semibold">
                {algoBalance.toFixed(6)} ALGO
              </span>
            )}
          </CardContent>
        </Card>

        {/* Asset Holdings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Holdings</CardTitle>
            <CardDescription>All non-zero ASA balances</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              "Loading..."
            ) : assets.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {assets.map((asset) => (
                  <li key={asset.id} className="py-2 flex justify-between">
                    <span>{asset.name}</span>
                    <span>
                      {(asset.amount / 10 ** asset.decimals).toFixed(asset.decimals)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No assets found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
