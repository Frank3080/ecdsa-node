const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "938188601756283586d737d231008db4afb01edd9db37af1ac1101c8bbb7773d": 100,
  cb6963f67acc03f0f4ae284a1d0148ab7a88c0946f4222b05400cfa13af37e3a: 50,
  cabf19885e93ed26bf42468bf494913c5d71448f36c15199c98db03ff69199f3: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/generate", (req, res) => {
  const {
    body: { amount, ethAddress },
  } = req.body;

  balances[`0x${ethAddr}`] = +amount;
  console.log(balances);
  res.status(200).send({ amount: +amount });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signature, msgHash, publicAddress } = req.body;
  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);
  if (!secp256k1.verify(signature, msgHash, publicAddress))
    return res.status(400).send({ message: "Invalid transaction" });

  const sender = `0x${getEthAddress(hexToBytes(publicAddress))}`;
  if (!balances[sender])
    return res.status(400).send({ message: "Invalid sender" });

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
