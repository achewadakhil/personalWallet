import type React from "react";
import {FiCopy} from "react-icons/fi";
import {AiOutlineCheck} from "react-icons/ai";
import { useState } from "react";

type WalletProps = {
    wallets: any[];
    creation: () => void;
    type: "eth" | "sol";
};


const MyWallet : React.FC<WalletProps> = ({ wallets, creation, type }) =>{

    const [copied, setCopied] = useState<boolean>(false);

    function shorten(str: string) {
        return str.length > 20 ? str.slice(0, 4) + "..." + str.slice(-4) : str;
    }
    function copyAdd(address: string) {
        navigator.clipboard.writeText(address);
    }
    return (
        <div style={{ width: "80%",border : "1px solid #ccc",borderRadius: "8px",backgroundColor: "#000000ff" ,fontSize: "16px", color: "#ffffff", margin: "20px auto", padding: "20px" }}>
            <div style={{ padding: "12px" ,display : "flex", justifyContent : "space-evenly"}} >
                <h2>{type === "eth" ? "Ethereum" : "Solana"} Wallets</h2>
                <button style={{ padding: "5px 10px", borderRadius: "4px", backgroundColor: "#2f3030ff", color: "#ffffff", border: "1px solid #ccc" , fontSize: "16px" }} onClick={creation}>Create Wallet</button>
            </div>
            <div style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}></div>
            {wallets && wallets.length > 0 ? (
                wallets.map((wallet: any, index: number) => (
                    <div key={index} style={{display :"flex" , justifyContent : "space-between", alignItems: "center", padding: "10px 0px", borderBottom: index < wallets.length - 1 ? "1px solid #ccc" : "none"}}>   
                        <h2>Account {index + 1}</h2>
                        <div style={{ display: "flex", justifyContent : "center" , gap: "10px"}}>
                            <p>Address: {shorten(wallet.address)}</p> 
                            
                            <button onClick={() => copyAdd(wallet.address)} style={{ background: "none", border: "none", cursor: "pointer"  ,color: "#ffffff"}}>
                                <FiCopy size={20} />
                            </button>
                        </div>
                        <div style={{display: "flex", justifyContent : "center" , gap: "10px"}}>
                            <p>Private Key: {shorten(wallet.privateKey)} </p>
                            <button onClick={() => copyAdd(wallet.privateKey)} style={{ background: "none", border: "none", cursor: "pointer" ,color: "#ffffff"}}>
                            <FiCopy size={20} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#ffffff" }}>
                    <p>No {type === "eth" ? "Ethereum" : "Solana"} wallets created yet.</p>
                </div>
            )}
        </div>
    )
}
export default MyWallet;