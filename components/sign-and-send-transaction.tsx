import {
  useWallets,
  //   type UseWallets,
  //   type ConnectedStandardSolanaWallet,
} from "@privy-io/react-auth/solana";
import bs58 from "bs58";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useMemo } from "react";
const connection = new Connection(clusterApiUrl("devnet"));
export function SignAndSendTransaction() {
  const { wallets, ready } = useWallets();

  const wallet = useMemo(() => wallets[0], [wallets]);
  console.log(wallets, wallets.length);
  async function handleSignMessage() {
    const message = "Hello world";
    const { signature: signatureInBytes } = await wallet.signMessage({
      message: new TextEncoder().encode(message),
    });
    const signature = bs58.encode(signatureInBytes);
    console.log(signature);
  }
  async function handleSignTransaction() {
    const newAccount = new Keypair();
    console.log(newAccount.publicKey.toBase58());
    const createAccountIx = SystemProgram.createAccount({
      fromPubkey: new PublicKey(wallet.address),
      newAccountPubkey: newAccount.publicKey,
      space: 0,
      lamports: LAMPORTS_PER_SOL * 0.001,
      programId: SystemProgram.programId,
    });
    const tx = new Transaction().add(createAccountIx);

    // Set fee payer
    tx.feePayer = new PublicKey(wallet.address);

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.partialSign(newAccount);
    try {
      const { signedTransaction } = await wallet.signTransaction!({
        chain: "solana:devnet",
        transaction: new Uint8Array(
          tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          }),
        ),
      });

      // const asciiString = String.fromCharCode(...signedTransaction)
      // const base64String = btoa(asciiString);
      // const signature = await connection.sendEncodedTransaction( );
      // await connection.confirmTransaction(signature);
    } catch (err) {
      console.error(err);
    }
  }
  async function handleSignAndSendTransaction() {
    // console.log(wallet);
    const newAccount = new Keypair();
    console.log(newAccount.publicKey.toBase58());
    const createAccountIx = SystemProgram.createAccount({
      fromPubkey: new PublicKey(wallet.address),
      newAccountPubkey: newAccount.publicKey,
      space: 0,
      lamports: LAMPORTS_PER_SOL * 0.0001,
      programId: SystemProgram.programId,
    });
    const tx = new Transaction().add(createAccountIx);

    // Set fee payer
    tx.feePayer = new PublicKey(wallet.address);

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.partialSign(newAccount);
    try {
      const { signature } = await wallet.signAndSendTransaction!({
        chain: "solana:devnet",
        transaction: new Uint8Array(
          tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          }),
        ),
      });
      console.log(bs58.encode(signature));
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <button
        className="disabled:opacity-50"
        disabled={!ready || wallets.length == 0}
        onClick={handleSignAndSendTransaction}
      >
        Sign and send transaction.
      </button>
      <button
        className="disabled:opacity-50"
        disabled={!ready || wallets.length == 0}
        onClick={handleSignTransaction}
      >
        Sign transaction.
      </button>
      <button
        className="disabled:opacity-50"
        disabled={!ready || wallets.length == 0}
        onClick={handleSignMessage}
      >
        Sign Message.
      </button>
    </>
  );
}
