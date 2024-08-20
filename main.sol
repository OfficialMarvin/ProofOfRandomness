// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProofOfRandomness {
    // Struct to store user-generated random number
    struct UserRandom {
        address user;
        uint256 randomNumber;
    }

    // Array to store all generated random numbers
    UserRandom[] public randomNumbers;

    // Mapping to store user's highest/lowest number
    mapping(address => uint256) public highestNumber;
    mapping(address => uint256) public lowestNumber;

    // Event to log the generated random number
    event RandomNumberGenerated(address indexed user, uint256 randomNumber);

    // Function to generate and store a random number
    function generateRandomNumber() public {
        // Generating random number using keccak256 and block data
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % 1000;

        // Store random number
        randomNumbers.push(UserRandom(msg.sender, random));

        // Update highest and lowest number for the user
        if (random > highestNumber[msg.sender]) {
            highestNumber[msg.sender] = random;
        }
        if (lowestNumber[msg.sender] == 0 || random < lowestNumber[msg.sender]) {
            lowestNumber[msg.sender] = random;
        }

        // Emit event
        emit RandomNumberGenerated(msg.sender, random);
    }

    // Function to get all random numbers generated
    function getRandomNumbers() public view returns (UserRandom[] memory) {
        return randomNumbers;
    }

    // Function to get the leaderboard
    function getLeaderboard() public view returns (UserRandom memory highest, UserRandom memory lowest) {
        uint256 highestIndex;
        uint256 lowestIndex;
        for (uint256 i = 0; i < randomNumbers.length; i++) {
            if (randomNumbers[i].randomNumber > randomNumbers[highestIndex].randomNumber) {
                highestIndex = i;
            }
            if (randomNumbers[i].randomNumber < randomNumbers[lowestIndex].randomNumber) {
                lowestIndex = i;
            }
        }
        return (randomNumbers[highestIndex], randomNumbers[lowestIndex]);
    }
}
