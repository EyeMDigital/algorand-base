/**
 * Transaction builders that return UNSIGNED algosdk transactions.
 * You pass these to the connected wallet (Pera/Defly/etc.) for signing.
 */
import algosdk, { SuggestedParams } from "algosdk";
import { algod, getSuggestedParams } from "./algod";

/** Build a payment (ALGO transfer) txn. */
export async function buildPaymentTx(sender: string, receiver: string, microAlgos: number | bigint, note?: Uint8Array) {
  const sp = await getSuggestedParams();
  return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender, receiver, amount: Number(microAlgos), suggestedParams: sp, note
  });
}

/** Build an ASA transfer txn. */
export async function buildAssetTransferTx(sender: string, receiver: string, assetId: number, amount: number | bigint, note?: Uint8Array) {
  const sp = await getSuggestedParams();
  return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender, receiver, assetIndex: assetId, amount: Number(amount), suggestedParams: sp, note
  });
}

/** (Optional) helper to wait on confirmation if you submit from a backend. */
export async function waitForConfirmation(txId: string, timeoutRounds = 10) {
  const result = await algosdk.waitForConfirmation(algod, txId, timeoutRounds);
  return result;
}

/** Serialize tx to base64 for wallet libs that expect it. */
export function txnToBase64(txn: algosdk.Transaction): string {
  return Buffer.from(txn.toByte()).toString("base64");
}
