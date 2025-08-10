import dynamic from "next/dynamic";

// Update the import path if the file is located elsewhere, for example:
const ConnectButton = dynamic(() => import("../../components/ConnectButton"), { ssr: false });
const WalletDashboard = dynamic(() => import("../../components/WalletDashboard"), { ssr: false });

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
