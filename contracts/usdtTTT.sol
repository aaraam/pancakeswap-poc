// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract USDTContract is ERC20, ERC20Permit {
    constructor() ERC20("USDTContract", "USDTTT") ERC20Permit("USDTContract") {
        _mint(msg.sender, 500 * 10 ** decimals());
    }
}

