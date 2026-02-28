import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnectWallet } from "@privy-io/react-auth";
import bs58 from "bs58";
import {
  useWallets,
  useSignAndSendTransaction,
  ConnectedStandardSolanaWallet,
} from "@privy-io/react-auth/solana";

export function ConnectButton() {
  const {
    wallets,
    selectedWallet,
    connectWallet,
    setSelectedWallet,
    disconnectWallet,
  } = usePrivyAsSolanaWallet();
  return (
    <>
      <div className="grid">
        <div>
          {wallets.length == 0 || selectedWallet === null ? (
            <Button
              className=""
              onClick={() =>
                connectWallet({
                  description: "Connect to external wallets with privy.",
                })
              }
            >
              Connect to wallet
            </Button>
          ) : (
            <div className="">{wallets[selectedWallet].address}</div>
          )}
        </div>
      </div>
      <div className="space-y-1">
        {wallets.map((wallet, i) => (
          <Button
            className=""
            onClick={() => {
              // if (
              //   wallet.standardWallet.name !==
              //   wallets[selectedWallet].standardWallet.name
              // ) {
              setSelectedWallet(i);
              // }
            }}
          >
            {wallet.address}
          </Button>
        ))}
      </div>
      <Button
        onClick={() => {
          disconnectWallet(0);
        }}
      >
        Disconnect selected wallet
      </Button>
    </>
  );
}

function usePrivyAsSolanaWallet() {
  const { wallets, ready } = useWallets();
  const { connectWallet } = useConnectWallet();

  const [selectedWallet, setSelectedWallet] = useState<number | null>(null);
  const [connectedWalletNames, setConnectedWalletNames] = useState<string[]>(
    [],
  );
  console.log(wallets.length);
  const disconnectWallet = useCallback(
    (walletIndex: number) => {
      //   if (wallet) {
      //     wallet.disconnect();
      //   } else if (selectedWallet !== null) {
      //     selectedWallet.disconnect();
      //   }
      if (walletIndex < wallets.length) wallets[walletIndex].disconnect();
    },
    [wallets],
  );
  useEffect(() => {
    if (wallets.length === 0) {
      setSelectedWallet(null);
      setConnectedWalletNames([]);
      return;
    }
    if (selectedWallet == null) {
      setSelectedWallet(0);
      setConnectedWalletNames([wallets[0].standardWallet.name]);
      return;
    }
    if (wallets.length > connectedWalletNames.length) {
      const newConnectedWalletIndex = wallets.findIndex(
        (wallet) => !connectedWalletNames.includes(wallet.standardWallet.name),
      )!;
      setSelectedWallet(newConnectedWalletIndex);
      setConnectedWalletNames((prev) => [
        ...prev,
        wallets[newConnectedWalletIndex].standardWallet.name,
      ]);
    } else if (wallets.length < connectedWalletNames.length) {
      const disconnectedWalletIndex = connectedWalletNames.findIndex(
        (prevWalletName) =>
          wallets.find(
            (wallet) => wallet.standardWallet.name === prevWalletName,
          ) === undefined,
      );
      if (
        connectedWalletNames[disconnectedWalletIndex] ===
        wallets[selectedWallet].standardWallet.name
      ) {
        setSelectedWallet(0);
      }
      setConnectedWalletNames((prevConnectedWallets) =>
        prevConnectedWallets.filter(
          (prevConnectedWallet) =>
            prevConnectedWallet !==
            connectedWalletNames[disconnectedWalletIndex],
        ),
      );
    }
  }, [wallets]);
  return {
    wallets,
    selectedWallet,
    ready,
    connectWallet,
    disconnectWallet,
    setSelectedWallet,
  };
}
