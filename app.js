window.addEventListener('load', async () => {
    let web3;
    let isMetaMaskConnected = false;

    // Check for Web3 support and initialize
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        isMetaMaskConnected = true;
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected to MetaMask successfully!');
        } catch (error) {
            console.error('User denied account access to MetaMask', error);
            isMetaMaskConnected = false;
        }
    } else {
        // Fallback to Infura provider if MetaMask is not available
        const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/ef929a0b34fa45c6b8758c57145b96b5');
        web3 = new Web3(provider);
        console.log('No MetaMask detected, connected to Sepolia via Infura');
    }

    // Smart contract ABI and address
    const contractABI = abi.json;
    const contractAddress = '0xB49580e18e23b14383Bc52E097108ef901fB6661';
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Elements
    const generateButton = document.getElementById('generateButton');
    const resultDiv = document.getElementById('result');
    const highestNumberSpan = document.getElementById('highestNumber');
    const lowestNumberSpan = document.getElementById('lowestNumber');

    // Function to load leaderboard data
    const loadLeaderboard = async () => {
        try {
            const leaderboard = await contract.methods.getLeaderboard().call();
            highestNumberSpan.innerHTML = `${leaderboard.highest.randomNumber} (User: ${leaderboard.highest.user})`;
            lowestNumberSpan.innerHTML = `${leaderboard.lowest.randomNumber} (User: ${leaderboard.lowest.user})`;
        } catch (error) {
            console.error('Error loading leaderboard', error);
            highestNumberSpan.innerHTML = 'Error loading leaderboard.';
            lowestNumberSpan.innerHTML = 'Error loading leaderboard.';
        }
    };

    // Load leaderboard data on page load
    await loadLeaderboard();

    // Add event listener to the button if MetaMask is connected
    if (isMetaMaskConnected) {
        generateButton.addEventListener('click', async () => {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            resultDiv.innerHTML = 'Generating random number...';

            try {
                await contract.methods.generateRandomNumber().send({ from: account });
                resultDiv.innerHTML = 'Random number generated and stored on the blockchain!';

                // Update the leaderboard
                await loadLeaderboard();
            } catch (error) {
                console.error('Error generating random number', error);
                resultDiv.innerHTML = 'Error generating random number.';
            }
        });
    } else {
        resultDiv.innerHTML = 'Web3 wallet not connected. Please connect a wallet to interact.';
        generateButton.disabled = true;
    }
});
