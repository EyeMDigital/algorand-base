// pages/wallet.tsx
import dynamic from "next/dynamic";

// only load ConnectButton on the client
const ConnectButton = dynamic(
  () => import("../../components/ConnectButton"),
  { ssr: false }
);

// you already did this for WalletDashboard
const WalletDashboard = dynamic(
  () => import("../../components/WalletDashboard"),
  { ssr: false }
);

export default function WalletPage() {
  return (
    <main className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <ConnectButton />
      </header>
      <WalletDashboard />
    </main>
  );
}
