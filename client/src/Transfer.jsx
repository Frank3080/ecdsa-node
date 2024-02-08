import { useState } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import * as secp from "ethereum-cryptography/secp256k1";

import server from "./server";

function Transfer({ setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (e) => setter(e.target.value);

  async function transfer(e) {
    e.preventDefault();

    if (!privateKey) {
      alert("Missing wallet!");
      return;
    }

    if (confirm("Sign message")) {
      const body = {
        amount: parseInt(sendAmount),
        recipient,
      };
      const msgHash = hashMessage(body);
      const signature = secp256k1.sign(msgHash, privateKey);
      const publicAddress = signature.recoverPublicKey(msgHash).toHex();
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          ...body,
          signature: JSON.parse(
            JSON.stringify(signature, (key, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
          ),
          msgHash,
          publicAddress,
        });
        setBalance(balance);
      } catch (ex) {
        alert(ex.response.data.message);
      }
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

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
