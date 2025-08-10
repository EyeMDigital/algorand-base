/**
 * Thin Indexer client wrapper.
 */
import algosdk from "algosdk";
import { INDEXER_URL } from "./env";

export const indexer = new algosdk.Indexer("", INDEXER_URL, "");
