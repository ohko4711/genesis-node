const ethers = require('ethers');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import EIP configurations
const eip2935Config = require('./contracts/eip2935');
const eip4788Config = require('./contracts/eip4788');
const eip7002Config = require('./contracts/eip7002');
const eip7251Config = require('./contracts/eip7251');

// --- Configuration & Setup ---
if (!process.env.PRIVATE_KEY || !process.env.MAINNET_RPC_URL) {
    console.error("Error: Please set PRIVATE_KEY and MAINNET_RPC_URL in your .env file.");
    process.exit(1);
}

const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// List of EIPs to deploy
const eipsToDeploy = [
    eip2935Config,
    eip4788Config,
    eip7002Config,
    eip7251Config
];

// --- Generic Function to Send ETH --- 
async function sendEth(recipientAddress, amountToSend, eipName) {
    console.log(`\n--- Funding ${eipName} Deployer ---`);
    console.log(`Attempting to send ${ethers.utils.formatEther(amountToSend)} ETH to ${recipientAddress} from ${wallet.address}`);

    try {
        const currentBalance = await provider.getBalance(recipientAddress);
        console.log(`Current balance of ${recipientAddress}: ${ethers.utils.formatEther(currentBalance)} ETH`);

        if (currentBalance.gte(amountToSend)) {
            console.log(`Sufficient balance already exists. Skipping ETH transfer.`);
            return true;
        }

        const amountNeeded = amountToSend.sub(currentBalance);
        console.log(`Sending ${ethers.utils.formatEther(amountNeeded)} ETH...`);

        const tx = {
            to: recipientAddress,
            value: amountNeeded,
            // Optional: add gas price/limit if needed, though ethers usually handles this well
            // gasPrice: await provider.getGasPrice(),
            // gasLimit: 21000, // Standard ETH transfer gas limit
        };

        const txResponse = await wallet.sendTransaction(tx);
        console.log(`Funding Tx Hash for ${eipName}: ${txResponse.hash}`);
        const receipt = await txResponse.wait();
        console.log(`Funding confirmed in block ${receipt.blockNumber}.`);
        return true;

    } catch (error) {
        console.error(`Error sending ETH to ${recipientAddress} for ${eipName}:`, error.message);
        if (error.transaction) {
            console.error("Transaction:", error.transaction);
        }
        if (error.receipt) {
            console.error("Receipt:", error.receipt);
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
        console.log(`--- ETH Send Failed for ${eipName} ---`);
        return false; // Indicate failure
    }
}

// --- Main Execution --- 
async function main() {
    console.log("Starting deployment process...");
    console.log(`Using deployer wallet: ${wallet.address}`);
    console.log(`Connected to RPC: ${process.env.MAINNET_RPC_URL}`);

    let allSucceeded = true;

    for (const eip of eipsToDeploy) {
        console.log(`\n==================== Processing ${eip.name} ====================`);

        // 1. Fund the sender address derived from the pre-signed transaction
        const ethSent = await sendEth(eip.senderAddress, eip.amountToSend, eip.name);

        // 2. Only proceed if ETH was sent successfully (or balance was sufficient)
        if (ethSent) {
            // 3. Deploy the EIP contract using its specific raw transaction
            const deployed = await eip.deploy(provider);
            if (!deployed) {
                allSucceeded = false;
                console.log(`Deployment failed for ${eip.name}.`);
                // Decide if you want to stop or continue with others
                // break; // Uncomment to stop on first failure
            }
        } else {
            allSucceeded = false;
            console.log(`Skipping deployment of ${eip.name} due to ETH transfer failure.`);
            // Decide if you want to stop or continue with others
            // break; // Uncomment to stop on first failure
        }

        // Add a small delay to prevent RPC rate limiting or nonce issues if deploying rapidly
        // await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    }

    console.log("\n==================== Deployment Summary ====================");
    if (allSucceeded) {
        console.log("All EIP contracts processed successfully.");
    } else {
        console.log("Some EIP contracts failed to process. Check logs above.");
    }
}

main().catch((error) => {
    console.error("Unhandled error in main execution:", error);
    process.exit(1);
}); 