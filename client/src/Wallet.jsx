import { toHex } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";

import server from "./server";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(e) {
    const privateKey = e.target.value;
    setPrivateKey(address);
    const address = toHex(secp.secp256k1.getPublicKey(privateKey));
    setAddress(address);
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
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        ></input>
      </label>
      <div>Address: {address.slice(1, 10) + "..."}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
