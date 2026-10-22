const hre = require("hardhat");

async function main() {
  const Factory = await hre.ethers.getContractFactory("UsedOilTracker");
  const tracker = await Factory.deploy();
  await tracker.waitForDeployment();
  console.log("UsedOilTracker deployed to:", await tracker.getAddress());
  console.log("Owner:", (await hre.ethers.getSigners())[0].address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
