/**
 * Centralized environment accessors with sensible defaults.
 * Prefers ALGOD_URL (your standard) and INDEXER_URL.
 * NETWORK is 'mainnet' or 'testnet' (used for asset IDs and safety checks).
 */
export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK ?? "mainnet").toLowerCase();

// You can point these at nodely.io or algonode; no token required.
export const ALGOD_URL = process.env.NEXT_PUBLIC_ALGOD_URL ?? (
  NETWORK === "mainnet"
    ? "https://mainnet-api.algonode.cloud"
    : "https://testnet-api.algonode.cloud"
);

export const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL ?? (
  NETWORK === "mainnet"
    ? "https://mainnet-idx.algonode.cloud"
    : "https://testnet-idx.algonode.cloud"
);

// Folks, Tinyman, Pact, etc. can go here if/when needed.
