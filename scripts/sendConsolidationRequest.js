const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function sendConsolidationRequest() {

    const source = "aa4545eae1ffe47cb4e48d1aa640e7994acdc9c976581c4a1bbf4ec34cbf2cad516e58e31e104a6bc26659cb6617674f";
    const target = "aa4545eae1ffe47cb4e48d1aa640e7994acdc9c976581c4a1bbf4ec34cbf2cad516e58e31e104a6bc26659cb6617674f";

    const tx = await wallet.sendTransaction({
        // consolidation contract address
        to: process.env.CONSOLIDATION_CONTRACT_ADDRESS,
        // data format: 0x{source_pubkey}{target_pubkey}
        data: `0x${source}${target}`,
        gasLimit: 2100000,
        // value: dynamic fee, for test, set a fixed value
        value: ethers.utils.parseEther("0.01")
    });

    console.log("Transaction Hash:", tx.hash);
}
sendConsolidationRequest();
