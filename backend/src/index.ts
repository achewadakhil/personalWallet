import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { HDNodeWallet , Wallet} from "ethers"
(async ()=>{
    //generating the mnemonics
    const mnemonics = bip39.generateMnemonic(128);

    console.log(mnemonics);

    //making seed from the mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonics);

    console.log("Seed : ",Buffer.from(seed).toString("base64"));

    //lets make a HD WALLET NOW no ethereum chain

    //create a root HDNode from the seed it is a generic root not depended on any chain
    const root = HDNodeWallet.fromSeed(seed);

    //generating 3 accounts for sample
    const ethereum = `m/44'/60'/0'/0/`;
    console.log("Ethereum: ");
    const ethPath = root.derivePath(ethereum+"0");
    const ethChild = new Wallet(ethPath.privateKey);
    console.log(ethChild.privateKey);
    console.log(ethChild.address);
    const solana = `m/44'/501'/0'/0'`;
    console.log("Solana : ")
    const derivedSeed = derivePath(solana,seed.toString("hex"));

    const keypair = Keypair.fromSeed(derivedSeed.key);

    console.log(Buffer.from(keypair.secretKey).toString("base64"));
    console.log("Public key : ",keypair.publicKey.toBase58())

})();

