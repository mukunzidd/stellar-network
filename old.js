const StellarSdk = require("stellar-sdk");
const fetch = require("node-fetch");

// Gen a keypair && ask friendbot to fund it with XLMs
async function createAccount() {
  try {
    const pair = StellarSdk.Keypair.random();
    console.log("Requesting XLMs");

    // Asking friendbot to give us some lumens on the new a/c
    await fetch(
      `https://horizon-testnet.stellar.org/friendbot?addr=${pair.publicKey()}`
    );

    return pair;
  } catch (e) {
    console.error("ERROR!", e);
  }
}

async function run() {
  const pair = await createAccount();

  console.log(pair);

  console.log(`
    Success, this is your new account on Stellar Testnet!
    seed: ${pair.secret()}
    id: ${pair.publicKey()}
  `);

  const url = `http://localhost:8000/accounts/${pair.publicKey()}`;

  console.log(`
    Loading a/c from the test network:
    ${url}
  `);

  const response = await fetch(url);
  const payload = await response.json();

  // create server
  try {
    console.log(`Attempting to get balances...`);
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    const account = await server.loadAccount(pair.publicKey());
    console.log(`Balance for account: ${pair.publicKey()}`);
    account.balances.map(balance => {
      console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    });
  } catch (e) {
    console.log("ERROR getting the a/c balances");
  }
}

run();
