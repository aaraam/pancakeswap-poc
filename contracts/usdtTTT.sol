// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract USDTContract is ERC20, ERC20Permit {
    constructor() ERC20("SHIBAContract", "SHIBA INDINU") ERC20Permit("USDTContract") {
        _mint(msg.sender, 10000000000 * 10 ** decimals());
    }
}
