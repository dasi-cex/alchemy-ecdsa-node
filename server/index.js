const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');

app.use(cors());
app.use(express.json());

const balances = {
  "0xce1529cf724103b30e27c274b12dcf165801627c": 100, // PK: af22172ef7a7785b494d8b55fbd716cfdd2478c08fc339beda65499c98ceaea3
  "0x570dd50380ab6c53aec06eedfa7c524ba8cbf629": 50, // PK: 09a79afd41426905113630596e70677e26c4e8dd0309b0e9c223d1713e849bea
  "0xd3edebf4ed8d7e9a2e4c7d07a21c84be0f02a7df": 75, // PK: fcb441b6afd4190b375165c6e2dc97fae7a22cca359fc622bd37891b85b681ae
};

const nonces = {
  "0xce1529cf724103b30e27c274b12dcf165801627c": 0, 
  "0x570dd50380ab6c53aec06eedfa7c524ba8cbf629": 0, 
  "0xd3edebf4ed8d7e9a2e4c7d07a21c84be0f02a7df": 0, 
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/nonce/:address", (req, res) => {
  const { address } = req.params;
  const nonce = nonces[address] || 0;
  res.send({ nonce });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, nonce, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  setInitialNonce(sender);
  setInitialNonce(recipient);
  
  const messageHash = generateMessageHash(sender, recipient, amount, nonce); // Reconstruct message hash
  console.log('Generated this message hash', toHex(messageHash));
  const [signatureData, recoveryBit] = signature;
  const formattedSignature = Uint8Array.from(Object.values(signatureData)); // Express converts the signature Uint8Array to object, must convert back to Uint8Array
  const recoveredPublicKey = secp.recoverPublicKey(messageHash, formattedSignature, recoveryBit);
  const recoveredPublicAddress = convertRawPublicKeyToPublicAddress(recoveredPublicKey);
  console.log('Recovered public address', recoveredPublicAddress);
  const validSender = recoveredPublicAddress === sender;
  const isSigned = secp.verify(formattedSignature, messageHash, recoveredPublicKey);

  if (!validSender) {
    res.status(400).send({message: "Invalid sender"});
  } else if (!isSigned) {
    res.status(400).send({message: "Invalid signature"});
  } else if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    nonces[sender] += 1;
    res.send({ 
      balance: balances[sender],
      nonce: nonces[sender]
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function setInitialNonce(address) {
  if (!nonces[address]) {
    nonces[address] = 0;
  }
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

function convertRawPublicKeyToPublicAddress(rawPublicKey) {
  const keccakPublicAddress = keccak256(rawPublicKey.slice(1)).slice(-20);
  const publicAddress = `0x${toHex(keccakPublicAddress)}`;
  return publicAddress
}
