# Test Plan and Evidence Checklist

Use the actual results from your own Remix/browser run; do not mark a test as passed until you have observed it.

| ID | Test | Steps | Expected result |
|---|---|---|---|
| T1 | Valid collection | Owner submits `Test Restaurant`, quantity `20` | Transaction succeeds; count increments |
| T2 | Zero quantity | Owner submits quantity `0` | Reverts with `Quantity must be positive` |
| T3 | Empty name | Owner submits an empty restaurant name with positive quantity | Reverts with `Restaurant name required` |
| T4 | Unauthorized account | Switch to a different account and submit a valid record | Reverts with `Not authorized` |
| T5 | Retrieve count | Call `getCollectionCount()` | Returns number of saved records |
| T6 | Retrieve record | Call `getCollection(0)` when at least one record exists | Returns name, quantity, timestamp, collector |
| T7 | Frontend reads | Connect MetaMask and refresh records on matching network | Records appear in table |
| T8 | Frontend writes | Owner submits a valid collection from the UI | MetaMask confirms; record appears after refresh |

## Screenshot checklist
- [ ] Solidity compiler success
- [ ] Contract deployed (show address/network)
- [ ] MetaMask connected to frontend
- [ ] Successful valid transaction
- [ ] Invalid quantity rejected
- [ ] Unauthorized transaction rejected
- [ ] Record displayed in frontend
