import algosdk from "algosdk";
export const algodClient = new algosdk.Algodv2(
  "",
  process.env.NEXT_PUBLIC_ALGOD_URL || "https://nodely.io",
  ""
);
