// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UsedOilTracker {
    address public owner;

    struct Collection {
        string restaurantName;
        uint256 quantityLitres;
        uint256 timestamp;
        address collector;
    }

    Collection[] private collections;

    event CollectionAdded(
        string restaurantName,
        uint256 quantityLitres,
        address collector
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function addCollection(
        string memory restaurantName,
        uint256 quantityLitres
    ) public onlyOwner {
        require(bytes(restaurantName).length > 0, "Restaurant name required");
        require(quantityLitres > 0, "Quantity must be positive");

        collections.push(
            Collection({
                restaurantName: restaurantName,
                quantityLitres: quantityLitres,
                timestamp: block.timestamp,
                collector: msg.sender
            })
        );

        emit CollectionAdded(restaurantName, quantityLitres, msg.sender);
    }

    function getCollectionCount() public view returns (uint256) {
        return collections.length;
    }

    function getCollection(uint256 index) public view returns (Collection memory) {
        require(index < collections.length, "Invalid record index");
        return collections[index];
    }
}
