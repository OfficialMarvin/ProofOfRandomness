window.addEventListener('load', async () => {
    // Initialize web3 with MetaMask or fallback to Infura provider for Sepolia
    let web3;
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected to MetaMask successfully!');
        } catch (error) {
            console.error('User denied account access to MetaMask', error);
        }
    } else {
        // Fallback to Infura provider if MetaMask is not available
        const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/ef929a0b34fa45c6b8758c57145b96b5');
        web3 = new Web3(provider);
        console.log('No MetaMask detected, connected to Sepolia via Infura');
    }

    // Smart contract ABI and address
    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "randomNumber",
                    "type": "uint256"
                }
            ],
            "name": "RandomNumberGenerated",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "generateRandomNumber",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getLeaderboard",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "randomNumber",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct ProofOfRandomness.UserRandom",
                    "name": "highest",
                    "type": "tuple"
                },
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "randomNumber",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct ProofOfRandomness.UserRandom",
                    "name": "lowest",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getRandomNumbers",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "randomNumber",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct ProofOfRandomness.UserRandom[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "highestNumber",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "lowestNumber",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "randomNumbers",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "randomNumber",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const contractAddress = '0xB49580e18e23b14383Bc52E097108ef901fB6661'; // Update with your actual contract address
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Generate random number and update leaderboard
    const generateButton = document.getElementById('generateButton');
    const resultDiv = document.getElementById('result');
    const highestNumberSpan = document.getElementById('highestNumber');
    const lowestNumberSpan = document.getElementById('lowestNumber');

    generateButton.addEventListener('click', async () => {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        resultDiv.innerHTML = 'Generating random number...';

        try {
            await contract.methods.generateRandomNumber().send({ from: account });
            resultDiv.innerHTML = 'Random number generated and stored on the blockchain!';

            // Update the leaderboard
            const leaderboard = await contract.methods.getLeaderboard().call();
            highestNumberSpan.innerHTML = `${leaderboard.highest.randomNumber} (User: ${leaderboard.highest.user})`;
            lowestNumberSpan.innerHTML = `${leaderboard.lowest.randomNumber} (User: ${leaderboard.lowest.user})`;
        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = 'Error generating random number.';
        }
    });

    // Initial load of leaderboard
    try {
        const leaderboard = await contract.methods.getLeaderboard().call();
        highestNumberSpan.innerHTML = `${leaderboard.highest.randomNumber} (User: ${leaderboard.highest.user})`;
        lowestNumberSpan.innerHTML = `${leaderboard.lowest.randomNumber} (User: ${leaderboard.lowest.user})`;
    } catch (error) {
        console.error(error);
        highestNumberSpan.innerHTML = 'Error loading leaderboard.';
        lowestNumberSpan.innerHTML = 'Error loading leaderboard.';
    }
});
