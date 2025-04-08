const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function sendWithdrawRequest() {

    const tx = await wallet.sendTransaction({
        // Withdraw contract address
        to: process.env.WITHDRAW_CONTRACT_ADDRESS,
        // 0x{pubkey}{amount}
        data: "0xb183ffd1e01fb382d78a6757e726ce3d7d4726bb71175718e7badf717e0b78b1c2b4e0e51bb2bb5069a5027074263f6800000002540be400",
        gasLimit: 2100000,
        value: ethers.utils.parseEther("0.01")
    });

    console.log("Transaction Hash:", tx.hash);
}
sendWithdrawRequest();
