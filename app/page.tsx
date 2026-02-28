"use client";
import { SignAndSendTransaction } from "@/components/sign-and-send-transaction";
import { ConnectToWallet, Disconnect } from "@/components/connect-to-wallet";
import {
  ConnectedStandardSolanaWallet,
  useWallets,
} from "@privy-io/react-auth/solana";
import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, Trash2Icon, CircleCheckIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useConnectWallet } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { truncateAddress } from "@/utils";
import { cn } from "@/lib/utils";

export default function Home() {
  const { wallets, ready } = useWallets();
  const { connectWallet } = useConnectWallet();
  const [selectedWallet, setSelectedWallet] =
    useState<null | ConnectedStandardSolanaWallet>(null);

  const connectToWallet = () =>
    connectWallet({
      description: "Use Privy to connect to external wallet.",
    });
  console.log(selectedWallet);
  //write connection logic.
  useEffect(() => {
    if (wallets.length == 0) {
      setSelectedWallet(null);
    } else {
      setSelectedWallet((prevWallet) => {
        if (prevWallet == null) return wallets[0];

        const wallet = wallets.find(
          (wallet) =>
            wallet.standardWallet.name === prevWallet.standardWallet.name,
        );
        if (wallet) return wallet;
        return wallets[0];
      });
    }
  }, [wallets]);
  return (
    <div className="flex flex-col p-40">
      <div className="w-20 h-15">
        {selectedWallet != null ? (
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center text-sm gap-2"
              >
                <img
                  src={selectedWallet.standardWallet.icon}
                  alt={selectedWallet.standardWallet.name + "icon"}
                  className="size-5"
                />
                <div className="font-mono font-medium">
                  {truncateAddress(selectedWallet.address)}
                </div>
                <ChevronDownIcon className="shrink-0 size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-3 space-y-2">
              <PopoverHeader>
                <PopoverTitle>Connected wallets</PopoverTitle>
              </PopoverHeader>
              <ButtonGroup
                orientation="vertical"
                className=" w-full space-y-0.5"
              >
                {wallets.map((wallet) => (
                  <Button
                    onClick={() => setSelectedWallet(wallet)}
                    variant="ghost"
                    className={cn(
                      "w-full flex justify-between",
                      selectedWallet.address == wallet.address &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    <img
                      src={wallet.standardWallet.icon}
                      alt={wallet.standardWallet.name + "icon"}
                      className="size-5"
                    />
                    <div className="font-medium font-mono flex-1 text-left flex gap-1.5 items-center">
                      {truncateAddress(wallet.address)}
                    </div>
                    <Button
                      variant="outline"
                      className="hover:text-destructive "
                      size="icon-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        wallet.disconnect();
                      }}
                    >
                      <Trash2Icon />
                    </Button>
                  </Button>
                ))}
              </ButtonGroup>
              <Button
                onClick={connectToWallet}
                className="w-full "
                size="lg"
                variant="secondary"
              >
                Connect to new wallet.
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Button variant="outline" size="lg" onClick={connectToWallet}>
            Connect to wallet.
          </Button>
        )}
      </div>
      <ConnectToWallet />
      {/*<SignAndSendTransaction />
      <Disconnect /> */}
    </div>
  );
}
