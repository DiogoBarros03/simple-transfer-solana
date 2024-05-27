import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
} from "@solana/web3.js";
import dotenv from "dotenv";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
dotenv.config()

function isNumber(value?: string | number): boolean
{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}
async function airdropSol(sender: PublicKey, LAMPORTS_PER_SOL: number) {
    const airdropSignature = await connection.requestAirdrop(
      sender,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
}
  

const suppliedToPubkey = process.argv[2] || null;
const LAMPORTS_TO_SEND = process.argv[3] || null;
if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}
if (!LAMPORTS_TO_SEND)  {
    console.log(`Please provide lamports to send`);
    process.exit(1);
}

if (!isNumber(LAMPORTS_TO_SEND))  {
    console.log(`Send a valid lamport to send`);
    process.exit(1);
}


const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");



const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

console.log(
  `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);

//await airdropSol(senderKeypair.publicKey,parseInt(LAMPORTS_TO_SEND))

const transaction = new Transaction();

const startTime = Date.now();
const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: parseInt(LAMPORTS_TO_SEND),
});
transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
]);
const endTime = Date.now();

  
const timeTaken = endTime - startTime;
console.log(
`💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `
);
console.log(`Transaction signature is ${signature}!`);
console.log(`Time taken for transfer: ${timeTaken} ms`);