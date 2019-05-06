const StellarSdk = require("stellar-sdk");
const fetch = require("node-fetch");

// Gen a keypair && ask friendbot to fund it with XLMs
async function createAccount() {
  const pair = StellarSdk.Keypair.random();
  console.log("Requesting XLMs");

  //   Asking friendbot to give us some lumens on the new a/c
  await fetch(
    `https://horizon-testnet.stellar.org/friendbot?addr=${pair.publicKey()}`
  );

  return pair;
}

async function run() {
  const pair = await createAccount();

  console.log(pair);

  console.log(`
    Success, this is your new account on Stellar Testnet!
    seed: ${pair.secret()}
    id: ${pair.publicKey()}
  `);

  const url = `https://horizon-testnet.stellar.org/accounts/${pair.publicKey()}`;

  console.log(`
    Loading a/c from the test network:
    ${url}
  `);

  const response = await fetch(url);
  const payload = await response.json();
}

run();
