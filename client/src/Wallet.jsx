import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, nonce, setNonce }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      // Get and set balance
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      
      // Get and set nonce
      const {
        data: { nonce },
      } = await server.get(`nonce/${address}`);
      setNonce(nonce);

    } else {
      setBalance(0)
      setNonce(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Public Key
        <input placeholder="Type in a public key" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <div className="balance">Nonce: {nonce}</div>
    </div>
  );
}

export default Wallet;
