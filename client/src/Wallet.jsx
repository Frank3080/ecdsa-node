import { toHex } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";

import server from "./server";
import { useState } from "react";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState(0);

  function getEthAddress(publicKey) {
    const hash = keccak256(publicKey.slice(1, publicKey.length));
    return toHex(hash.slice(-20));
  }

  const handleGenerateWallet = async () => {
    const priv = secp256k1.utils.randomPrivateKey();
    const ethAddr = getEthAddress(secp256k1.getPublicKey(priv));
    setAddress(`0x${ethAddr}`);
    setPrivateKey(priv);
    const {
      data: { balance },
    } = await server.post(`generate`, { body: { amount: amount, ethAddr } });
    setBalance(balance);
  };

  async function onChange(evt) {
    const address = evt.target.value;
    setWallet(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Generate a wallet below"
          value={wallet}
          onChange={onChange}
        />
      </label>

      <div className="balance">Balance: {balance}</div>

      {!address && (
        <>
          <label>
            Amount
            <input
              type="number"
              placeholder="Type an amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>

          <button onClick={handleGenerateWallet}>Generate wallet</button>
        </>
      )}

      {address && (
        <>
          <div>Ethereum address: {address}</div>
          <div>Private key: {privateKey}</div>
        </>
      )}
    </div>
  );
}

export default Wallet;
