// SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MockDataFeed is AggregatorV3Interface {
    int256 private _latestAnswer;
    uint256 private _latestTimestamp;
    uint80 private _latestRound;

    // Event to log updates for observation
    event AnswerUpdated(int256 indexed answer, uint256 indexed timestamp, uint80 indexed round);

    constructor(int256 initialAnswer) {
        _latestAnswer = initialAnswer;
        _latestTimestamp = block.timestamp;
        _latestRound = 1;
    }

    function setLatestAnswer(int256 answer) public {
        _latestAnswer = answer;
        _latestTimestamp = block.timestamp;
        _latestRound++;
        emit AnswerUpdated(answer, _latestTimestamp, _latestRound);
    }

    // Mock implementation of latestRoundData from AggregatorV3Interface
    function latestRoundData()
        public
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_latestRound, _latestAnswer, _latestTimestamp, _latestTimestamp, _latestRound);
    }

    // Additional required functions from the AggregatorV3Interface
    function decimals() external pure override returns (uint8) {
        return 8; // Chainlink typically uses 8 decimal places
    }

    function description() external pure override returns (string memory) {
        return "Mock Data Feed";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function getRoundData(uint80 _roundId)
        public
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        require(_roundId <= _latestRound, "Round not complete");
        return (_roundId, _latestAnswer, _latestTimestamp, _latestTimestamp, _roundId);
    }
}
