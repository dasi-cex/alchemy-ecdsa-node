import { useState } from "react";
import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

function Signature({ 
    address, 
    recipient, 
    sendAmount, 
    setSignature, 
    privateKey, 
    setPrivateKey, 
    nonce 
  }) {
  
  const [publicAddress, setPublicAddress] = useState("");

  async function onGenerateSignature() {
    const messageHash = generateMessageHash(address, recipient, parseInt(sendAmount), nonce);
    console.log('Generated this message hash', toHex(messageHash));
    const signOptions = {
      recovered: true
    };
    const signature = await secp.sign(messageHash, privateKey, signOptions);
    const [signatureData, recoveryBit] = signature;
    console.log('Signature hash hex', toHex(signatureData));
    setSignature(signature);
  }

  function generateMessageHash(sender, recipient, amount, nonce) {
    const message = {
      amount,
      nonce,
      recipient,
      sender,
    };
    console.log('Message to be hashed', message);
    const messageInBytes = utf8ToBytes(JSON.stringify(message));
    const messageHash = keccak256(messageInBytes);
    return messageHash;
  }

  async function onChange(evt) {
    const privateKey = evt.target.value
    setPrivateKey(privateKey);
    const rawPublicKey = secp.getPublicKey(privateKey);
    const keccakPublicAddress = keccak256(rawPublicKey.slice(1)).slice(-20);
    const publicAddress = `0x${toHex(keccakPublicAddress)}`;
    setPublicAddress(publicAddress); // Used to verify the pk matches the public address
  }

  return (
    <div className="container signature">
      <h1>Generate a Signature</h1>

      <label>
        Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="info-field">
        From Address: {address}
      </div>

      <div className="info-field">
        Recipient: {recipient}
      </div>

      <div className="info-field">
        Send Amount: {sendAmount}
      </div>

      <div className="info-field">
        Nonce: {nonce}
      </div>

      <button 
        type="button" 
        className="button" 
        value="Signature" 
        disabled={!privateKey || !address || !recipient || !sendAmount || address !== publicAddress}
        onClick={onGenerateSignature}
      >
        Generate Signature
      </button>

    </div>
  );
}

export default Signature;