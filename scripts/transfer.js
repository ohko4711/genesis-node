const { ethers } = require("ethers");
require("dotenv").config();



const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function sendTransaction() {
    const tx = await wallet.sendTransaction({
        to: "0x2BB7DcEeB1964D1c2EdbCbB04Cd7893F6619d4c0",
        value: ethers.utils.parseEther("0.01"),
    });
    console.log(`Transaction Hash: ${tx.hash}`);
}

sendTransaction();
