
import * as bip39 from "bip39";
import { Buffer } from 'buffer';
import { HDNodeWallet } from "ethers";
import { Wallet } from "ethers";

import { Keypair } from "@solana/web3.js";
import { HDKey } from "@scure/bip32";
import { useState } from "react";
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
  const [seed,setSeed] = useState<any>(null);
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
//err
  function createSolWallet(){
    if(!seed) return alert("Please generate mnemonics first");
    const solPath = `m/44'/501'/${solIdx}'/0'`;
    const hd = HDKey.fromMasterSeed(seed).derive(solPath);
    if(!hd.privateKey) return alert("Failed to derive Solana keypair");
    const solChild = Keypair.fromSeed(hd.privateKey.slice(0, 32));
    const newPair : solWalletType = {
      privateKey: Buffer.from(solChild.secretKey).toString('hex'),
      address: solChild.publicKey.toBase58(),
    };
    console.log(newPair);
    setSolWallet(prev => [...prev, newPair]);
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
    <div 
      style = {{
        color : "#f4f4f4ff",
        textAlign:"center"  ,
        backgroundColor:"#000000", 
        padding:"20px",
        height:"100vh"
        }}
      >
        <div style={{ marginBottom: "20px" ,display: "flex", justifyContent: "center", alignItems: "center" ,borderBottom: "1px solid #ccc" }}>
          <h1>OCTOVAULT</h1>
        </div>
        <div style={{ marginBottom: "20px" ,display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <h2>Generate Mnemonics</h2>
          <button onClick={createMnemonics} style={{
            padding:"10px 20px",
            fontSize:"16px",
            backgroundColor:"#000305ff",
            color:"#ffffff",
            border:"1px solid #ccc",
            borderRadius:"8px",
          }}>Cick Here</button>
        </div>
        {mnemonics && (
          <div style={{border: "1px solid #ccc", padding: "20px", borderRadius: "8px", backgroundColor: "#000000ff" , width: "80%", margin: "0 auto" }}>
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
                    backgroundColor: "#000000ff",
                    textAlign: "center",
                    fontWeight: "500",
                    color : "#ffffffff",
                  }}
                >
                  <span style={{ marginRight: "6px", color: "#888" }}>{index + 1}.</span>
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}
        {mnemonics && <div style={{ margin: "30px 0px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <button onClick={createEthWallet}>EthWallet</button>
          <button onClick={createSolWallet}>SolWallet</button>
        </div>}
    </div>
  )
}