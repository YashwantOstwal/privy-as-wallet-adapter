"use client";

import { useConnectWallet } from "@privy-io/react-auth";
import bs58 from "bs58";
import {
  useWallets,
  useSignAndSendTransaction,
} from "@privy-io/react-auth/solana";
import {
  pipe,
  createSolanaRpc,
  getTransactionEncoder,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  compileTransaction,
  address,
  createNoopSigner,
  generateKeyPairSigner,
  createSolanaRpcSubscriptions,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
  createKeyPairFromBytes,
  createKeyPairSignerFromBytes,
  getSignersFromTransactionMessage,
  assertIsTransactionWithBlockhashLifetime,
  assertIsSendableTransaction,
  getSignatureFromTransaction,
  partiallySignTransactionMessageWithSigners,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { TransactionMessage } from "@solana/web3.js";
import { ConnectButton } from "./components/connect-button";
const client = {
  rpc: createSolanaRpc("https://api.devnet.solana.com"),
  rpcSubscriptions: createSolanaRpcSubscriptions("wss://api.devnet.solana.com"),
};
export default function App() {
  const { wallets } = useWallets();
  const { connectWallet } = useConnectWallet();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const selectedWallet = wallets[0];

  async function transferSol() {
    if (selectedWallet) {
      const amount = 1;

      const sender = await createKeyPairSignerFromBytes(
        bs58.decode(
          "5jXqHhQwyecRwukxdLVELYfVCcV2h9CR88nCaT2so1B95qphX9F5aq6S26vkgHu2Wjb7wvwP8rLytjPxFS9CmQsC",
        ),
      );
      const receiver = await generateKeyPairSigner();
      const transferInstruction = getTransferSolInstruction({
        amount: BigInt(10000000), // Convert SOL to lamports
        destination: receiver.address,
        source: sender,
      });

      const { value: latestBlockhash } = await client.rpc
        .getLatestBlockhash()
        .send();
      // Create a transaction using @solana/kit
      const transaction = pipe(
        createTransactionMessage({ version: 0 }),
        (tx) =>
          setTransactionMessageFeePayer(address(selectedWallet.address), tx), // Set the message fee payer
        (tx) =>
          setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx), // Set recent blockhash
        (tx) => appendTransactionMessageInstructions([transferInstruction], tx), // Add your instructions to the transaction
        (tx) => compileTransaction(tx), // Compile the transaction
        (tx) => new Uint8Array(getTransactionEncoder().encode(tx)),
      );
      const signature = await signAndSendTransaction({
        transaction: transaction,
        wallet: selectedWallet,
      });

      console.log(signature);
    }
  }
  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center bg-gray-400">
        <ConnectButton />
      </div>
    </>
  );
}
