// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Open Source Software Token (OSST)
/// @author [Your Name]
/// @notice ERC20 token to reward OSS contributors
contract OSST is ERC20, Ownable {
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensRewarded(address indexed contributor, uint256 amount);
    event EtherWithdrawn(address indexed to, uint256 amount);

    constructor(uint256 initialSupply) ERC20("Open Source Software Token", "OSST") Ownable(msg.sender) {
        require(initialSupply > 0, "Initial supply must be greater than 0");
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /// Maybe we can make this open so that, even contributors can reward each other in the future
    function rewardContributor(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, to, amount);
        emit TokensRewarded(to, amount);
    }

    function withdrawEther(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(amount <= address(this).balance, "Insufficient balance");

        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");
        
        emit EtherWithdrawn(to, amount);
    }

    receive() external payable {
        emit EtherReceived(msg.value);
    }

    fallback() external payable virtual {}

    event EtherReceived(uint256 amount);
}