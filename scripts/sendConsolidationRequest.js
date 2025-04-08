const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function sendConsolidationRequest() {

    const tx = await wallet.sendTransaction({
        // consolidation contract address
        to: process.env.CONSOLIDATION_CONTRACT_ADDRESS,
        // data format: 0x{source_pubkey}{target_pubkey}
        data: "0xaa4545eae1ffe47cb4e48d1aa640e7994acdc9c976581c4a1bbf4ec34cbf2cad516e58e31e104a6bc26659cb6617674fb183ffd1e01fb382d78a6757e726ce3d7d4726bb71175718e7badf717e0b78b1c2b4e0e51bb2bb5069a5027074263f68",
        gasLimit: 2100000,
        // value: dynamic fee, for test, set a fixed value
        value: ethers.utils.parseEther("0.01")
    });

    console.log("Transaction Hash:", tx.hash);
}
sendConsolidationRequest();
