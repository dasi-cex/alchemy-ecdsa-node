import Wallet from "./Wallet";
import Signature from "./Signature";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [nonce, setNonce] = useState(0);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        nonce={nonce}
        setNonce={setNonce}
      />
      <Signature
        address={address}
        recipient={recipient}
        sendAmount={sendAmount}
        signature={signature}
        setSignature={setSignature}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        nonce={nonce}
      />
      <Transfer 
        setBalance={setBalance} 
        address={address} 
        sendAmount={sendAmount} 
        setSendAmount={setSendAmount} 
        recipient={recipient} 
        setRecipient={setRecipient}
        signature={signature}
        nonce={nonce}
        setNonce={setNonce}
      />
    </div>
  );
}

export default App;
