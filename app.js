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
	}];

    const contractAddress = '0xB49580e18e23b14383Bc52E097108ef901fB6661';
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
