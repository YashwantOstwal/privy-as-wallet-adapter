"use client";
import { SignAndSendTransaction } from "@/components/sign-and-send-transaction";
import { ConnectToWallet, Disconnect } from "@/components/connect-to-wallet";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ConnectToWallet />
      <SignAndSendTransaction />
      <Disconnect />
    </div>
  );
}
