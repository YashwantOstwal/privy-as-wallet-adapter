"use client";
import { useConnectWallet } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth/solana";
import { useMemo } from "react";

export function ConnectToWallet() {
  const { connectWallet } = useConnectWallet();

  return (
    <button
      className=""
      onClick={() => {
        connectWallet({
          description: "Use Privy to connect to external wallet.",
        });
      }}
    >
      Connect to wallet
    </button>
  );
}

export function Disconnect() {
  const { wallets, ready } = useWallets();

  const wallet = useMemo(() => wallets[0], [wallets]);
  return (
    <button
      className=""
      onClick={async () => {
        await wallet.disconnect();
      }}
    >
      Disconnect.
    </button>
  );
}
