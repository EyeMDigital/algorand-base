import React from "react";
import BalancesCard from "../components/BalancesCard";
import SendAlgoForm from "../components/SendAlgoForm";
import { useWallet } from "@txnlab/use-wallet-react";
import algosdk from "algosdk";
import { algod } from "../services/algod";

export default function ExamplesPage() {
  // pull everything you need ONCE
  const { activeWallet, activeAccount, signTransactions } = useWallet();

  const address =
    activeAccount?.address ||
    activeWallet?.accounts?.[0]?.address ||
    "";

  if (!address || !activeWallet) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Algorand Examples</h1>
        <p className="text-red-600">Please connect your wallet to proceed.</p>
      </div>
    );
  }

  const signer = async (txnsBase64: string[]): Promise<string> => {
    // decode unsigned txns
    const txnObjs = txnsBase64.map((b64) =>
      algosdk.decodeUnsignedTransaction(Buffer.from(b64, "base64"))
    );

    // sign with use-wallet (returns Uint8Array[] or {blob}[])
    const signed = await signTransactions(txnObjs.map((t) => t.toByte()));
    const blobs = (Array.isArray(signed) ? signed : [signed]).map(
      (s: any) => s?.blob ?? s
    );

    // submit; different algosdk versions type this differently
    const res = await algod.sendRawTransaction(blobs).do();
    const txId = (res as any).txId || (res as any).txid; // handle both
    if (!txId) throw new Error("No txId returned from algod");
    return txId;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Algorand Examples</h1>
      <BalancesCard address={address} />
      <SendAlgoForm from={address} signer={signer} />
    </div>
  );
}
