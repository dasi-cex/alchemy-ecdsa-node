import server from "./server";

function Transfer({ 
    setBalance, 
    address, 
    sendAmount, 
    setSendAmount, 
    recipient, 
    setRecipient, 
    signature,
    nonce,
    setNonce
  }) {

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { 
          balance: newBalance, 
          nonce: newNonce 
        },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        nonce,
        signature
      });
      setBalance(newBalance);
      setNonce(newNonce);
      console.log('Successfully sent transaction with this data', address, sendAmount, recipient, newNonce, signature);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      
      <div className="info-field">
        Nonce: {nonce}
      </div>

      <div className="info-field">
        Signature: {signature}
      </div>

      <input type="submit" className="button" value="Transfer" disabled={!signature} />
    </form>
  );
}

export default Transfer;
