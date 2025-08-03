import { useEffect, useState } from "react";
import * as bip39 from "bip39";
import { Buffer } from 'buffer';
import { HDNodeWallet } from "ethers";
import { Wallet } from "ethers";

import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
(window as any).Buffer = Buffer;

type ethWalletType = {
  privateKey: string;
  address: string;
};
type solWalletType = {
  privateKey: string;
  address: string;
};
export default  function App(){
  const [mnemonics,setMnemonics] = useState<string>("");
  const [seed,setSeed] = useState<Buffer | null>(null);
  const [ethIdx,setEthIdx] = useState<number>(0);
  const [solIdx,setSolIdx] = useState<number>(0);
  const [root, setRoot] = useState<HDNodeWallet | null>(null);
  const [ethWallet,setEthWallet] = useState<ethWalletType[]>([]);
  const [solWallet,setSolWallet] = useState<solWalletType[]>([]);




  async function createMnemonics(){
    const mnemonics =  bip39.generateMnemonic();
    setMnemonics(mnemonics);
    const seed = await bip39.mnemonicToSeed(mnemonics);
    console.log("Generated Seed: ", Buffer.from(seed).toString("base64"));
    setSeed(seed);
    setRoot(HDNodeWallet.fromSeed(seed));
  }

function createSolWallet() {
  if (!seed) return alert("Please generate mnemonics first");

  const soldir = `m/44'/501'/${solIdx}'/0'`; // all levels hardened
  const derivedSeed = derivePath(soldir, seed.toString("hex")); // raw seed, not hex

  const keyPair = Keypair.fromSeed(derivedSeed.key.slice(0, 32)); // use only 32 bytes

  const newWallet: solWalletType = {
    privateKey: Buffer.from(keyPair.secretKey).toString("base64"),
    address: keyPair.publicKey.toBase58(),
  };

  console.log("Solana Wallet:", newWallet);
  setSolWallet(prev => [...prev, newWallet]);
  setSolIdx(prev => prev + 1);
}



  function createEthWallet(){
    if(!root) return alert("Please generate mnemonics first");
    const eth = `m/44'/60'/${ethIdx}'/0/0`;
    const ethPath = root.derivePath(eth);
    const ethChild = new Wallet(ethPath.privateKey);
    const newPair : ethWalletType = {
      privateKey: ethChild.privateKey,
      address: ethChild.address,
    };
    console.log(newPair);
    setEthWallet(prev => [...prev, newPair]);
    setEthIdx(prev => prev + 1);
  }
  return (
    <div style = {{color : "#dcc3c3ff",textAlign:"center"  ,backgroundColor:"#000000", padding:"20px",height:"100vh"}}>
      <h1 style={{color:"#dcc3c3ff"}}>My HD WALLET</h1>
      <button style={{padding:"10px 20px", fontSize:"16px"}} onClick={createMnemonics}>Create mnemonics</button>
      {mnemonics && (
        <div style={{ marginTop: "20px" }}>
        <h2>Generated Mnemonics:</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginTop: "10px",
            width : "80%",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          {mnemonics.split(" ").map((word, index) => (
            <div
              key={index}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#1a1a1a",
                textAlign: "center",
                fontWeight: "500",
                color : "#ffffff",
              }}
            >
              <span style={{ marginRight: "6px", color: "#888" }}>{index + 1}.</span>
              {word}
            </div>
          ))}
          </div>
        </div>
      )}
      <div style={{ margin: "20px 0px" , gap: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <button onClick={createEthWallet}>EthWallet</button>
        <button onClick={createSolWallet}>SolWallet</button>
      </div>
    </div>
  )
}