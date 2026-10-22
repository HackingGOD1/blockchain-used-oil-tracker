# Used Oil Tracker — Blockchain Technology Assignment 2

## Problem and solution
Restaurants generate used cooking oil that should be collected and routed to appropriate recycling or biodiesel partners rather than returned to the food chain. This educational DApp records collection entries on an Ethereum-compatible blockchain so that the history can be queried and independently inspected.

## Features
- Solidity contract with an owner, constructor, validation, collection records and event emission.
- HTML/CSS/JavaScript frontend.
- MetaMask connection with Ethers.js.
- Write collection transactions and read collection history from the chain.
- Validation and authorization checks.

## Repository layout
- `contracts/UsedOilTracker.sol` — smart contract.
- `frontend/index.html` — user interface.
- `frontend/style.css` — responsive styles.
- `frontend/app.js` — MetaMask/Ethers.js integration.
- `test/UsedOilTracker.test.js` — automated contract tests.
- `TEST_PLAN.md` — manual testing and screenshot checklist.
- `scripts/deploy.js` — Hardhat deployment helper.

## Run locally
1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Run `npx hardhat compile` and `npx hardhat test`.
4. To run the frontend, use `npm run serve`, then open `http://localhost:8080`.

## Deploy using Remix (assignment workflow)
1. Open Remix IDE and create `UsedOilTracker.sol`.
2. Paste the source from `contracts/UsedOilTracker.sol` and compile with Solidity 0.8.20 or compatible 0.8.x.
3. Under Deploy & Run Transactions, choose Remix VM for a local demo, or Injected Provider - MetaMask with Sepolia for frontend integration.
4. Deploy the contract and copy the deployed address.
5. In `frontend/app.js`, replace `PASTE_SEPOLIA_CONTRACT_ADDRESS_HERE` with the address of the contract deployed on the same network MetaMask is using.
6. Open the frontend, connect MetaMask, submit a valid collection and refresh the records.

**Network warning:** a Remix VM contract is isolated from MetaMask. For the separate frontend, deploy to Sepolia (or another network accessible to MetaMask) and select that same network in MetaMask.

## Contract functions
- `owner()` — address that deployed the contract.
- `addCollection(string restaurantName, uint256 quantityLitres)` — records a collection; owner only.
- `getCollectionCount()` — number of saved entries.
- `getCollection(uint256 index)` — returns name, quantity, timestamp and collector.

## Test cases
| Type | Input/action | Expected result |
|---|---|---|
| Valid | Owner records `Test Restaurant`, 20 litres | Transaction succeeds; count increments |
| Invalid | Empty restaurant name | Reverts: `Restaurant name required` |
| Invalid | Quantity is zero | Reverts: `Quantity must be positive` |
| Unauthorized | Non-owner records a collection | Reverts: `Not authorized` |
| Read | Call `getCollectionCount()` | Returns number of records |
| Read | Call `getCollection(0)` after adding a record | Returns stored collection fields |
| Invalid read | Call `getCollection(0)` before any record exists | Reverts: `Invalid record index` |

Automated tests are included but must be run locally before reporting their observed status. The deployment address, transaction hashes, and screenshots must be filled in only after your own successful deployment and test run.

## Evidence checklist for submission
- [ ] Solidity compiler success in Remix.
- [ ] Deployed contract and visible network/address.
- [ ] MetaMask connected to frontend.
- [ ] Successful collection transaction.
- [ ] Failed invalid-input transaction.
- [ ] Failed unauthorized transaction.
- [ ] Blockchain data displayed through the UI.
- [ ] Add real deployment address, test results and screenshots before uploading to GitHub.

## Security and limitations
This is an academic prototype, not a regulatory compliance certificate. Data written to a public blockchain is visible and generally immutable. The contract records what an authorized user submits; it does not independently verify that a physical collection occurred. Never commit API keys, private keys, seed phrases or `.env` files.
