// Ensure the page has loaded before executing the script
window.addEventListener('load', async () => {
    // Connect to Ethereum wallet
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    // Smart contract ABI and address
    const contractABI = [
        // Simplified ABI with only the methods we need
        {
            "constant": false,
            "inputs": [],
            "name": "generateRandomNumber",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getRandomNumbers",
            "outputs": [
                {
                    "components": [
                        {
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "name": "randomNumber",
                            "type": "uint256"
                        }
                    ],
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getLeaderboard",
            "outputs": [
                {
                    "components": [
                        {
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "name": "randomNumber",
                            "type": "uint256"
                        }
                    ],
                    "name": "highest",
                    "type": "tuple"
                },
                {
                    "components": [
                        {
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "name": "randomNumber",
                            "type": "uint256"
                        }
                    ],
                    "name": "lowest",
                    "type": "tuple"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
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
