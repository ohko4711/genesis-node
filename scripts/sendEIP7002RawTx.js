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
const recipientAddress = '0x8646861A7cF453dDD086874d622b0696dE5b9674';
const amountToSend = ethers.utils.parseEther('0.25');

// --- EIP-7002 Raw Transaction Data ---
const txData = {
    nonce: 0, // Note: This nonce might conflict if sendEth uses the same nonce. Consider fetching the current nonce.
    to: null,
    gasLimit: '0x3d090',
    gasPrice: '0xe8d4a51000',
    value: '0x0',
    data: '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5f556101f880602d5f395ff33373fffffffffffffffffffffffffffffffffffffffe1460cb5760115f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff146101f457600182026001905f5b5f82111560685781019083028483029004916001019190604d565b909390049250505036603814608857366101f457346101f4575f5260205ff35b34106101f457600154600101600155600354806003026004013381556001015f35815560010160203590553360601b5f5260385f601437604c5fa0600101600355005b6003546002548082038060101160df575060105b5f5b8181146101835782810160030260040181604c02815460601b8152601401816001015481526020019060020154807fffffffffffffffffffffffffffffffff00000000000000000000000000000000168252906010019060401c908160381c81600701538160301c81600601538160281c81600501538160201c81600401538160181c81600301538160101c81600201538160081c81600101535360010160e1565b910180921461019557906002556101a0565b90505f6002555f6003555b5f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14156101cd57505f5b6001546002828201116101e25750505f6101e8565b01600290035b5f555f600155604c025ff35b5f5ffd'
};

const signature = {
    v: 27,
    r: ethers.utils.hexZeroPad('0x539', 32),
    s: ethers.utils.hexZeroPad('0x5feeb084551e4e03a3581e269bc2ea2f8d0008', 32),
};

// Serialize the transaction with the signature
const rawTransactionHex = ethers.utils.serializeTransaction(txData, signature);


// --- Function to Send ETH ---
async function sendEth() {
    console.log("--- Sending ETH ---");
    console.log(`Attempting to send ${ethers.utils.formatEther(amountToSend)} ETH to ${recipientAddress} from ${wallet.address}`);

    try {
        // Get the current nonce for the wallet
        // const nonce = await wallet.getTransactionCount("pending");
        // console.log(`Using nonce ${nonce} for ETH transfer`);

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

// --- Function to Send EIP-7002 Raw Transaction ---
async function sendRawEip7002Tx() {
    console.log("\n--- Sending Raw EIP-7002 Transaction ---");
    try {
        // Note: The hardcoded nonce (0) in txData might be incorrect
        // if the sending account has already made transactions.
        // It's usually better to fetch the nonce dynamically before sending.
        // Example: const currentNonce = await provider.getTransactionCount(parsed.from, "pending");
        //          txData.nonce = currentNonce; // Then re-serialize if necessary
        // However, this script uses a pre-signed raw tx, so the nonce is fixed.

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
        console.log("--- Raw EIP-7002 Tx Send Failed ---");
    }
}


// --- Main Execution ---

// ref:https://eips.ethereum.org/EIPS/eip-7002#execution-layer for deployment Withdrawal Request Contract
async function main() {
    const ethSent = await sendEth();

    // Only proceed if ETH was sent successfully
    if (ethSent) {
        await sendRawEip7002Tx();
    } else {
        console.log("\nSkipping raw transaction sending due to ETH transfer failure.");
    }
}

main();