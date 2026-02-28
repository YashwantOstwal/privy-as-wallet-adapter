"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
});

export function SolanaWallet({ children }: { children: React.ReactNode }) {
  // add a button to toggle the state of shouldAutoConnect.
  return (
    <PrivyProvider
      appId="cmjuf6ftn021ml50cszzykcsu"
      config={{
        appearance: {
          walletList: [
            "phantom",
            "solflare",
            "backpack",
            "detected_solana_wallets",
            "wallet_connect_qr_solana",
          ],
          walletChainType: "solana-only",
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
