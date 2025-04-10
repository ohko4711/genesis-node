const ethers = require('ethers');
const dotenv = require('dotenv');

dotenv.config();

// --- Configuration & Setup ---
// Ensure PRIVATE_KEY and DEVNET_RPC_URL are set in your .env file
if (!process.env.PRIVATE_KEY || !process.env.DEVNET_RPC_URL) {
    console.error("Error: Please set PRIVATE_KEY and DEVNET_RPC_URL in your .env file.");
    process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider(process.env.DEVNET_RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// --- ETH Transfer Data ---
const senderAddress = '0x3462413Af4609098e1E27A490f554f260213D685';
const amountToSend = ethers.utils.parseEther('0.25');

// --- EIP-7251 Raw Transaction Data ---
const txData = {
    nonce: 0,
    to: null,
    gasLimit: '0x3d090',
    gasPrice: '0xe8d4a51000',
    value: '0x0',
    data: '0x60538060095f395ff33373fffffffffffffffffffffffffffffffffffffffe14604657602036036042575f35600143038111604257611fff81430311604257611fff9006545f5260205ff35b5f5ffd5b5f35611fff60014303065500'
};

const signature = {
    v: 27,
    r: ethers.utils.hexZeroPad('0x539', 32),
    s: ethers.utils.hexZeroPad('0xaa12693182426612186309f02cfe8a80a0000', 32),
};

// Serialize the transaction with the signature
const rawTransactionHex = ethers.utils.serializeTransaction(txData, signature);

// --- Function to Send ETH ---
async function sendEth() {
    console.log("--- Sending ETH ---");
    console.log(`Attempting to send ${ethers.utils.formatEther(amountToSend)} ETH to ${senderAddress} from ${wallet.address}`);

    try {
        // Create the transaction object
        const tx = {
            to: senderAddress,
            value: amountToSend,
        };

        // Send the transaction
        const txResponse = await wallet.sendTransaction(tx);
        console.log('ETH Transfer Tx Hash:', txResponse.hash);
        await txResponse.wait();
        return true;

    } catch (error) {
        console.error('Error sending ETH:', error);
        // Log more details if available
        if (error.transaction) {
            console.error("Transaction:", error.transaction);
        }
        if (error.receipt) {
            console.error("Receipt:", error.receipt);
        }
        console.log("--- ETH Send Failed ---");
        return false; // Indicate failure
    }
}

// --- Function to Send EIP-7251 Raw Transaction ---
async function sendRawEip7251Tx() {
    console.log("\n--- Sending Raw EIP-7251 Transaction ---");
    try {
        const parsed = ethers.utils.parseTransaction(rawTransactionHex);
        console.log("Raw Tx Recovered sender address:", parsed.from);

        // Send the raw transaction
        const txResponse = await provider.sendTransaction(rawTransactionHex);
        console.log('Raw Tx Hash:', txResponse.hash);

    } catch (error) {
        console.error('Error sending raw transaction:', error);
        // Log more details if available
        if (error.transaction) {
            console.error("Failed Raw Transaction Details:", error.transaction);
        }
        if (error.code && error.reason) {
            console.error(`Code: ${error.code}, Reason: ${error.reason}`);
        }
        if (error.body) {
            try {
                const errorBody = JSON.parse(error.body);
                console.error("RPC Error:", errorBody.error);
            } catch (parseError) {
                console.error("Failed to parse error body:", error.body);
            }
        }
        console.log("--- Raw EIP-7251 Tx Send Failed ---");
    }
}

// --- Main Execution ---

// ref: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2935.md
async function main() {
    const ethSent = await sendEth();

    // Only proceed if ETH was sent successfully
    if (ethSent) {
        await sendRawEip7251Tx();
    } else {
        console.log("\nSkipping raw transaction sending due to ETH transfer failure.");
    }
}

main();