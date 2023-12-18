// SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MVDbxToken is ERC20Burnable, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    AggregatorV3Interface internal dataFeed;

    event Bridge(address indexed src, uint256 amount, uint256 chainId);

    uint256 private _totalIssued;
    uint256 private _totalAsset;
    uint256 public immutable assetCap;
    mapping(address => uint256) private _totalNodeAsset;
    mapping(address => uint256) private _totalNodeUsd;

    constructor(uint256 assetCap_, address dataFeed_) ERC20("MVDbx Token", "MVDBX") {
        assetCap = assetCap_;
        dataFeed = AggregatorV3Interface(dataFeed_);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function capAsset(
        address account, 
        uint256 asset
    ) public onlyRole(MINTER_ROLE) returns (bool) {
        require(_totalAsset + asset <= assetCap, "MVDbxToken: Asset cap reached");
        _totalAsset += asset;
        _totalNodeAsset[account] += asset;
        _totalNodeUsd[account] += _usdAssetOf(asset);

        return true;
    }

    function mintDbx(
        address account, 
        uint256 amount
    ) public onlyRole(MINTER_ROLE) returns (bool) {
        _mint(account, amount);
        _totalIssued += amount;
        return true;
    }

    function bridge(uint256 amount, uint256 chainId) public {
        _burn(_msgSender(), amount);
        emit Bridge(_msgSender(), amount, chainId);
    }

    function totalIssued() public view returns (uint256) {
        return _totalIssued;
    }

    function totalAsset() public view returns (uint256) {
        return _totalAsset;
    }

    function totalNodeAsset(address node) public view returns (uint256) {
        return _totalNodeAsset[node];
    }

    function totalNodeUsd(address node) public view returns (uint256) {
        return _totalNodeUsd[node];
    }

    function version() public pure returns(uint256) {
        return 10;
    }

    function _usdAssetOf(uint256 asset) internal view returns (uint256 usdAmount) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();

        usdAmount = (asset * uint256(answer)) / 1e8;
    }

}