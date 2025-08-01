import { Keypair } from "@solana/web3.js";
import { Buffer } from "buffer";
import nacl from "tweetnacl";


const keyPair = Keypair.generate();//genertion
const publicKey = keyPair.publicKey;

const privateKey = Buffer.from(keyPair.secretKey).toString("base64");

console.log("PublicKey :",publicKey.toString());
console.log("PrivateKey : ", privateKey);

const message = "Hello, Solana!";
const encodedMessage = new TextEncoder().encode(message)

const dup = new TextEncoder().encode("x");
const signature = nacl.sign.detached(encodedMessage , keyPair.secretKey);


console.log("Signature :",Buffer.from(signature).toString("Base64"));

const isValid = nacl.sign.detached.verify(
    dup,
    signature,
    publicKey.toBytes()
)
console.log(isValid);

