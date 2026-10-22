/*
 * Used Oil Tracker frontend.
 * After deploying UsedOilTracker.sol, paste its address below.
 * The address must be deployed on the SAME network selected in MetaMask.
 */
const CONTRACT_ADDRESS = "PASTE_SEPOLIA_CONTRACT_ADDRESS_HERE";

const ABI = [
  "function owner() view returns (address)",
  "function getCollectionCount() view returns (uint256)",
  "function getCollection(uint256 index) view returns (tuple(string restaurantName,uint256 quantityLitres,uint256 timestamp,address collector))",
  "function addCollection(string restaurantName,uint256 quantityLitres)",
  "event CollectionAdded(string restaurantName,uint256 quantityLitres,address collector)"
];

let provider;
let signer;
let contract;

const connectBtn = document.getElementById("connectBtn");
const walletStatus = document.getElementById("walletStatus");
const message = document.getElementById("message");
const recordsBody = document.getElementById("records");
const countDisplay = document.getElementById("count");

function showMessage(text) { message.textContent = text; }

async function connectWallet() {
  try {
    if (!window.ethereum) throw new Error("MetaMask was not found. Install/open the MetaMask extension.");
    if (!ethers.isAddress(CONTRACT_ADDRESS)) {
      throw new Error("First paste your deployed contract address into CONTRACT_ADDRESS in app.js.");
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const network = await provider.getNetwork();
    const account = await signer.getAddress();
    walletStatus.textContent = `Connected wallet: ${account} · Chain ID: ${network.chainId}`;
    showMessage("Wallet connected. Loading blockchain records...");
    await loadRecords();
  } catch (error) {
    showMessage(error.shortMessage || error.reason || error.message || String(error));
  }
}

async function loadRecords() {
  try {
    if (!contract) throw new Error("Connect MetaMask first.");
    const count = await contract.getCollectionCount();
    countDisplay.textContent = `Total records: ${count.toString()}`;
    recordsBody.replaceChildren();

    for (let i = 0n; i < count; i++) {
      const record = await contract.getCollection(i);
      const row = document.createElement("tr");
      const values = [
        i.toString(),
        record.restaurantName,
        record.quantityLitres.toString(),
        new Date(Number(record.timestamp) * 1000).toLocaleString(),
        record.collector
      ];
      for (const value of values) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      }
      recordsBody.appendChild(row);
    }

    if (count === 0n) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.className = "empty";
      cell.textContent = "No collection records yet.";
      row.appendChild(cell);
      recordsBody.appendChild(row);
    }
    showMessage("Blockchain records loaded.");
  } catch (error) {
    showMessage(error.shortMessage || error.reason || error.message || String(error));
  }
}

document.getElementById("collectionForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    if (!contract) throw new Error("Connect MetaMask first.");
    const name = document.getElementById("restaurant").value.trim();
    const quantityText = document.getElementById("quantity").value;
    const quantityNumber = Number(quantityText);

    if (!name) throw new Error("Restaurant name is required.");
    if (!Number.isSafeInteger(quantityNumber) || quantityNumber <= 0) {
      throw new Error("Quantity must be a positive whole number of litres.");
    }

    showMessage("Confirm the transaction in MetaMask...");
    const tx = await contract.addCollection(name, BigInt(quantityNumber));
    showMessage("Transaction submitted. Waiting for confirmation...");
    await tx.wait();
    showMessage("Collection saved successfully.");
    event.target.reset();
    await loadRecords();
  } catch (error) {
    showMessage(error.shortMessage || error.reason || error.message || String(error));
  }
});

connectBtn.addEventListener("click", connectWallet);
document.getElementById("refreshBtn").addEventListener("click", loadRecords);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => window.location.reload());
  window.ethereum.on("chainChanged", () => window.location.reload());
}
