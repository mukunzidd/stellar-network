const express = require("express");
const bodyParser = require("body-parser");
const rp = require("request-promise");
const port = process.env.PORT || 4000;
const app = express();
const fetch = require("node-fetch");
const Stellar = require("stellar-sdk");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// NETWORK_PASSPHRASE and HORIZON_ENDPOINT are bot obtained from setting up the Stellar/Quickstart docker image
// const HORIZON_ENDPOINT = "http://127.0.0.1:8000"
const HORIZON_ENDPOINT = "https://horizon-testnet.stellar.org/";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

// Getting instance of Stellar blockchain
Stellar.Network.use(new Stellar.Network(NETWORK_PASSPHRASE));
var opts = new Stellar.Config.setAllowHttp(true);
var server = new Stellar.Server(HORIZON_ENDPOINT, opts);

let accounts = [];

// Creating a new account
const creatingAccount = async (req, res) => {
  try {
    console.log(`creatingAccount() called`);
    let pair = Stellar.Keypair.random();
    let account = {
      pk: pair.publicKey(),
      sk: pair.secret()
    };

    console.log("Please wait while franBot funds the new account...");
    await fetch(
      `https://horizon-testnet.stellar.org/friendbot?addr=${account.pk}`
    );
    console.log(account);
    accounts.push(account);
    res.send(account);
  } catch (err) {
    res.send({ Msg: "ERROR : " + err });
  }
};

// Fetch all created accounts
const getAccounts = async (req, res) => {
  res.send(accounts);
};

// Get balance of an account
const getBalance = async (req, res) => {
  try {
    const pk = req.body.pk;
    let balance = 0;
    // Load newly created accounts
    account = await server.loadAccount(pk);
    // Check the balances
    account.balances.forEach(bal => {
      balance = balance + bal.balance;
    });
    res.send({ Msg: balance });
  } catch (err) {
    res.send({ Msg: "ERROR : " + err });
  }
};

// Do transactions
const makePayment = async (req, res) => {
  const { from, to, value } = req.body;
  //Let get the secret of the spender
  const spender = accounts.find(acc => {
    if (acc.pk === from) return acc;
  });
  if (spender && spender != null) {
    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the tx fee when the tx fails.
    server
      .loadAccount(to)
      .catch(err => {
        res.send({ Msg: `Error : receiever ${to} not found!` });
      })
      .then(() => {
        // lets load spender account
        return server.loadAccount(from);
      })
      .then(spenderAccount => {
        // Start building the tx.
        const transaction = new Stellar.TransactionBuilder(spenderAccount)
          .addOperation(
            Stellar.Operation.payment({
              destination: to,
              // Because Stellar allows tx in many currencies, the asset type must be specified. "native" asset type represents Lumens.
              asset: Stellar.Asset.native(),
              amount: value
            })
          )
          // A memo allows you to add your own metadata to a tx. It is very optional.
          .addMemo(Stellar.Memo.text("Test Transaction"))
          .build();
        // get the key pair for signing the tx
        const pairA = Stellar.Keypair.fromSecret(spender.sk);
        // Sign the tx to prove you are allowed to make it
        transaction.sign(pairA);
        return server.submitTransaction(transaction);
      })
      .then(result => {
        res.send({ Msg: JSON.stringify(result, null, 2) });
      })
      .catch(err => {
        res.send({
          Msg: `Error : Somethis went wrong : ${JSON.stringify(
            err.response.data.extras
          )}`
        });
      });
  } else {
    res.send({ Msg: `Error : spender  ${to} not found!` });
  }
};

/* CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,content-type"
  );

  next();
});

/* API Routes */
app.get("/register", creatingAccount);
app.get("/accounts", getAccounts);
app.post("/payment", makePayment);
app.post("/balance", getBalance);

/* Serve API */
app.listen(port, () => {
  console.log(`Stellar test app listening on port ${port}!`);
});
