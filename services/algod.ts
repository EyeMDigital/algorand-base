/**
 * Thin Algod client wrapper.
 * Uses algosdk without the legacy `future` module.
 */
import algosdk from "algosdk";
import { ALGOD_URL } from "./env";

export const algod = new algosdk.Algodv2("", ALGOD_URL, "");

/** Fetch suggested params with a sane fallback. */
export async function getSuggestedParams() {
  try {
    return await algod.getTransactionParams().do();
  } catch (e) {
    // Fallback if node blips; these get replaced by the network at send time anyway.
    return {
      fee: 1000,
      flatFee: false,
      firstRound: 1,
      lastRound: 1000,
      genesisHash: "",
      genesisID: "",
    } as unknown as algosdk.SuggestedParams;
  }
}
