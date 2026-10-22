const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UsedOilTracker", function () {
  async function deployTracker() {
    const [owner, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("UsedOilTracker");
    const tracker = await Factory.deploy();
    await tracker.waitForDeployment();
    return { tracker, owner, other };
  }

  it("sets the deployer as owner", async function () {
    const { tracker, owner } = await deployTracker();
    expect(await tracker.owner()).to.equal(owner.address);
  });

  it("records a valid collection and retrieves it", async function () {
    const { tracker, owner } = await deployTracker();
    await expect(tracker.addCollection("Test Restaurant", 20))
      .to.emit(tracker, "CollectionAdded");
    expect(await tracker.getCollectionCount()).to.equal(1);
    const record = await tracker.getCollection(0);
    expect(record.restaurantName).to.equal("Test Restaurant");
    expect(record.quantityLitres).to.equal(20);
    expect(record.collector).to.equal(owner.address);
  });

  it("rejects an empty restaurant name", async function () {
    const { tracker } = await deployTracker();
    await expect(tracker.addCollection("", 10)).to.be.revertedWith("Restaurant name required");
  });

  it("rejects zero quantity", async function () {
    const { tracker } = await deployTracker();
    await expect(tracker.addCollection("Test Restaurant", 0)).to.be.revertedWith("Quantity must be positive");
  });

  it("rejects writes from a non-owner", async function () {
    const { tracker, other } = await deployTracker();
    await expect(tracker.connect(other).addCollection("Test Restaurant", 10)).to.be.revertedWith("Not authorized");
  });

  it("rejects an out-of-range collection index", async function () {
    const { tracker } = await deployTracker();
    await expect(tracker.getCollection(0)).to.be.revertedWith("Invalid record index");
  });
});
