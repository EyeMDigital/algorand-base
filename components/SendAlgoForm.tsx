import React, { useState } from "react";
import algosdk from "algosdk";
import { buildPaymentTx, txnToBase64 } from "../services/tx";

/**
 * Example "prepare and request signature" form.
 * You provide a `signer` prop that actually signs+submits the txn using your wallet lib.
 * For Pera/Defly, that’s typically a function taking an array of base64-encoded txn blobs.
 */
export default function SendAlgoForm({
  from, signer,
}: { from: string; signer: (txnsBase64: string[]) => Promise<string>; }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("0.1"); // ALGO
  const [txId, setTxId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setTxId(null); setBusy(true);
    try {
      const micro = Math.round(parseFloat(amount || "0") * 1e6);
      const txn = await buildPaymentTx(from, to, micro);
      const b64 = txnToBase64(txn);
      const sentTxId = await signer([b64]); // implement with your wallet connector
      setTxId(sentTxId);
    } catch (e:any) {
      setErr(e?.message ?? "Failed to send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-4 border rounded-2xl shadow space-y-3">
      <div className="text-lg font-semibold">Send ALGO</div>
      <label className="block">
        <span className="text-sm opacity-70">To</span>
        <input value={to} onChange={e=>setTo(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="ALGO address" />
      </label>
      <label className="block">
        <span className="text-sm opacity-70">Amount (ALGO)</span>
        <input value={amount} onChange={e=>setAmount(e.target.value)} className="w-full border rounded px-2 py-1" />
      </label>
     // in components/SendAlgoForm.tsx
<button
  disabled={busy || !from}
  className="px-3 py-1 rounded bg-black text-white"
>
  {busy ? "Sending…" : "Send"}
</button>

      {txId && <div className="text-green-700">✅ Submitted: <span className="font-mono">{txId}</span></div>}
      {err && <div className="text-red-600">{err}</div>}
    </form>
  );
}
