"use client";
import { SignAndSendTransaction } from "@/components/sign-and-send-transaction";
import { ConnectToWallet, Disconnect } from "@/components/connect-to-wallet";
import { useWallets } from "@privy-io/react-auth/solana";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConnectWallet } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { wallets, ready } = useWallets();
  const { connectWallet } = useConnectWallet();

  const wallet = useMemo(() => wallets[0], [wallets]);
  function info() {
    console.log(wallet.standardWallet.name);
  }
  return (
    <div className="p-20 flex flex-col ">
      <div className="w-20 h-10">
        {wallets.length == 0 ? (
          <Button
            variant="outline"
            // className="bg-secondary text-primary-foreground"
            onClick={() =>
              connectWallet({
                description: "Use Privy to connect to external wallet.",
              })
            }
          >
            Add wallet
          </Button>
        ) : (
          <div />
        )}
      </div>
      <ConnectToWallet />
      {/*<SignAndSendTransaction />
      <Disconnect /> */}
      <button onClick={info}>Log info</button>
    </div>
  );
}
