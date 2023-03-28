const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const privateKey = secp.utils.randomPrivateKey();

console.log('private key:', toHex(privateKey));

const rawPublicKey = secp.getPublicKey(privateKey);
const keccakPublicAddress = keccak256(rawPublicKey.slice(1)).slice(-20);

console.log('public key:', `0x${toHex(keccakPublicAddress)}`);

