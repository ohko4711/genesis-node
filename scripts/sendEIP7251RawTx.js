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
const recipientAddress = '0x13d1913d623E6a9D8811736359E50fD31Fe54fCA';
const amountToSend = ethers.utils.parseEther('0.25');

// --- EIP-7251 Raw Transaction Data ---
const txData = {
    nonce: 0,
    to: null,
    gasLimit: '0x3d090',
    gasPrice: '0xe8d4a51000',
    value: '0x0',
    data: '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5f5561019e80602d5f395ff33373fffffffffffffffffffffffffffffffffffffffe1460d35760115f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1461019a57600182026001905f5b5f82111560685781019083028483029004916001019190604d565b9093900492505050366060146088573661019a573461019a575f5260205ff35b341061019a57600154600101600155600354806004026004013381556001015f358155600101602035815560010160403590553360601b5f5260605f60143760745fa0600101600355005b6003546002548082038060021160e7575060025b5f5b8181146101295782810160040260040181607402815460601b815260140181600101548152602001816002015481526020019060030154905260010160e9565b910180921461013b5790600255610146565b90505f6002555f6003555b5f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff141561017357505f5b6001546001828201116101885750505f61018e565b01600190035b5f555f6001556074025ff35b5f5ffd'
};

const signature = {
    v: 27,
    r: ethers.utils.hexZeroPad('0x539', 32),
    s: ethers.utils.hexZeroPad('0xc0730f92dc275b663d377a7cbb141b6600052', 32),
};

// Serialize the transaction with the signature
const rawTransactionHex = ethers.utils.serializeTransaction(txData, signature);

// --- Function to Send ETH ---
async function sendEth() {
    console.log("--- Sending ETH ---");
    console.log(`Attempting to send ${ethers.utils.formatEther(amountToSend)} ETH to ${recipientAddress} from ${wallet.address}`);

    try {
        // Create the transaction object
        const tx = {
            to: recipientAddress,
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

// ref: https://eips.ethereum.org/EIPS/eip-7251 for deployment of Consolidation Contract
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