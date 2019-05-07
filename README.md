# Stellar's Horizon API

Exploring Stellar's Horizon API to create accounts on the network and perform transactions.

# Getting Started

Follow the following steps to clone and set up the project:

1. `git clone git@github.com:mukunzidd/stellar-network.git`
2. `cd stellar-network`
3. `yarn install`

### API Routes

1. app.get('/newAccount', creatingAccount)
2. app.get('/accounts', getAccounts)
3. app.post('/faucet',getFromFaucet)
4. app.post('/balance', getBalance)
5. app.post('/payment', makePayment)

### Pushing Changes

1. Open Terminal.
2. `git pull`
3. `git add file_name.py`
4. `git commit -m "type(component): subject line"`
5. `git push origin 123-short-name`

### Commit Messages

_We follow the [Angular commit guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) so that we can generate changelogs and have a clean commit history — see Pushing Changes #3 for an example commit._

- Type, for your commit message commiting you should select a type from this list below:
  - feat: a new features
  - fix: a bug fix
  - docs: documentation only changes
  - style: changes that do not affect the menaing of the code (white-space, formatting, missing semi-colons, etc)
  - refactor: a code change that neither fixes a bug or adds a feature
  - pref: a code change that improves performance
  - test: adding missing tests
  - chore: changes to the build process or auxiliary tools and libraries such as documentation generation
- Components, represent the larger feature / scope of the change
- Subject line, use the imperative form of a verb
  - GOOD "add contributing guidelines"
  - BAD "adding contribuing guidelines"
