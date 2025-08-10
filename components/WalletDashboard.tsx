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
                {Number(algoBalance).toFixed(6)} ALGO
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
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">Unit Name</th>
                    <th className="py-2">ASA Name</th>
                    <th className="py-2">ASA ID</th>
                    <th className="py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-b">
                      <td className="py-2">{asset.unitName}</td>
                      <td className="py-2">{asset.name}</td>
                      <td className="py-2">{asset.id}</td>
                      <td className="py-2">
                        {Number(asset.rawAmount / 10 ** asset.decimals).toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: asset.decimals,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No assets found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
