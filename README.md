# Proof of Randomness 🧬

**Proof of Randomness** is a decentralized application (DApp) that allows users to generate a random number, store it on the blockchain, and compete on a global leaderboard. It’s a simple project demonstrating the integration of Solidity smart contracts with a basic web interface.

## 🛠️ Tech Stack

- **Solidity:** Smart contract for random number generation.
- **Web3.js:** JavaScript library for Ethereum interaction.
- **HTML/CSS/JavaScript:** Front-end for user interaction.

## 🚀 Quick Start

### 1. Deploy the Smart Contract

- **Use Remix:** 
  - Copy the Solidity code from `contracts/ProofOfRandomness.sol`.
  - Deploy it on a testnet like Rinkeby or Goerli.
  - Copy the deployed contract address.

### 2. Update the Front-End

- **Edit `app.js`:** 
  - Replace `'YOUR_CONTRACT_ADDRESS_HERE'` with your deployed contract address.

### 3. Serve the Front-End

- **Fork the Repo:**
  - Clone or fork the repository.
  - Open `index.html` in your browser.

### 4. Interact with the DApp

- **Use MetaMask:** Connect to the correct network, generate random numbers, and check the leaderboard.

## 📜 Smart Contract Overview

- **`generateRandomNumber`:** Creates and stores a random number on-chain.
- **`getLeaderboard`:** Retrieves the highest and lowest numbers with their respective users.

## 🌟 Contributions

- Fork, improve, and submit a pull request on GitHub.

## 📝 License

Licensed under the MIT License.

---

Happy coding! 🎉
