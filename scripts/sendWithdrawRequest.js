const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function sendWithdrawRequest() {

    const pubkey = "0x87f5116e565cc9caa8a4a23a32b2bc211cf9d55ad58a4a7a92f570e71137dca300a663bcdedcdf82c11c81abfc611536";
    const amount = "0000000000000000"; // 0 means exit the validator

    const tx = await wallet.sendTransaction({
        // Withdraw contract address
        to: process.env.WITHDRAW_CONTRACT_ADDRESS,
        // 0x{pubkey}{amount}
        data: `${pubkey}${amount}`,
        gasLimit: 2100000,
        value: ethers.utils.parseEther("0.01")
    });

    console.log("Transaction Hash:", tx.hash);
}
sendWithdrawRequest();
