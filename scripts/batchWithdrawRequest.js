const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// TODO: Replace with your actual list of public keys
const pubkeylist = [
    "0xac6ee7cc99e2e930d885e174f919f4b0fdc29eb2590a3004c071378c3318f68c7d509eff7f12c8950c6954288e126843",
    "0xb086e5bd296eef0fb814e7c217a72ecaf87f5b98d1a0a9007f6e0d1c3eac30cdb05cdb4948a9ab81b4643fb6064a61cc",
    "0x892c677c55fdae8564fca24986bd585ac4014c5f7da8d091dfd43e063354dea1648ef30d280ad0e632833eafd216e242",
    "0xad51d31dbcca998d0e566c0602383a5ce4da9b8ff79e5d1eea65b35e0ad42c304d3699f3f337a5cbb293f6d7ad657e3c",
    "0xaae61a6cf78e2e9460a158c793bc0a7a609be2fceedd34acefed205feac4d7a04b1192888b75f3bed76ff9d8e0c6acdd",
    "0xa58d0b12c9a6ad4c9f507c836dc7df76a4e3fa18dda9ce17972ec5388b92474a4b7227704af6026ba93447898575f264",
    "0x8e27c93f9d2af2962830712d5b9e264271638d0961eceb227e6f8ccccdaebc805064273f163c101e8ac09183ba9b2af3",
    "0x85462b3a6075bb29d661ac839815ede9f27d0a193174ced0df3e744a44fad765fe5b7a9b4b65c0c1204f13bb9f294f4e",
    "0x8a35989c8c9855358c045ab9d0c2b8eb7deb2c67e05f19b0c58ab6251ef831384cf6d3fd9533d68bc1586a222d047fa9",
    "0xa0b72953fcb94d1469bb210023b0a71024b055e0e36b546f24235837b6d55d6607c6289443716acfe2410bb71a3b1b65",
    "0x97a16a090c7e902564bda5e816cd3053ef262aa992321339411c48a2ce24134c7562d9742fb06bf84a6ef06c525a4a39",
    "0xb92a7784ca995b846d5ce7f575809e4f7074bf98481e420934f985ed68c1cecb1af58d1ac4906bb8121647f35f5abe9f",
    "0x95efafdacffe26b0d85f9ad29799a32b6472a661b941485ef46edc055a14c7177b84751c67dfbb50e98e8ba27fae8dfa",
    "0x99a9e8c285d3e253a1f7d5aad69829fc1fcde73a95de1b67d353d0d7ca259410d63008bd3d95235f679930fc34562b7d",
    "0x86798d7343114f3a8d1ae275d8458f83d20a1893cfc7215c05e0c24b5a91075fc470e0fa71df5c04911a95f98e949431",
    "0x85fffe2930fe84bce6152e360d759dd8317d63539165f28e2d224db7f2cb475b02bfc4f28aa8380c4a7b19653c84e3a0",
    "0x8a0380220e9fe4a27286f29a8660283f1566660b67b145b37febc3fe234992f0bee5e590f91a3ef000a17e943e5585e6",
    "0xb4adf60e3fd7ad9b02f875ddaf5e8f7176d52ce6943256b39eafc109a2effa20f561e252b099e3734aed06c22e4566d0",
    "0xa7c5a28450c3cf159bfb681fb0b1539351d9265e28472cc6cb386fc17f2c6a5176e2eeb70996bfd3d7a969fc1e77c4d0",
    "0x86880ee4db8ce05f27202523677cce21d2b011dce1113a8471b456441c8e909e678d28cea30c71b76c991aca953f2d6e",
    "0x8611ba8b149d4f32fd87fbd8ec213cd2936b2b32babbde6aadbf4872929b9c933fa072c4b066e038075ad69faff5c2e0",
    "0xb2a73b0eadf847fda59e2d6f93259f004edc061197a77b88c98f437842e4f32eede87c32ae570fbd779dbcb8a36cd382",
    "0xaa5382c5726d7d79010082169bcd33f2771ad1d2f9e0b329b7d1dfa135ae3eeda012486d76ca7fbb1fef19677192b187",
    "0x855bfa13aed9134f61ea4680ab914a1799bf4e9ee641248c75178fd096669be1682e263e386333b1a06e3ce322320dcf",
    "0x8fc90f4aed0f97a2f1087b9413b6acb96ecb8c62621fb9b3e34aa8c797c03b9d73ff4237ee47da6ac1f66c79812568a4",
    "0xb851174e588460111c7ca2ed4c285f467ebe7af436d7d593a2dca8479c56f12df65328bfa762c40c799b12dea067dea1",
    "0xb8fc90d55d43df18feedebf7adb2c1d52fa3ed219bfadc598fc356de31dad9f5c326470c8dfb45da75108f7f5ee67121",
    "0x9200d68d4ab9faf2701f3e5ed71fa38c9d477f2032a0131030fce1361997c420dee20f53c3a7f641086883820e1ce9d4",
    "0x93a2dd8d1de4b15d373f1f3cb34e5379c054b1ab917d55957bf9559746fc55e6dc8ae87314deb3138cb6982dfecbf747",
    "0xb275acc2328ee5eabbdce264adeb2e5d72f82222ef67bf1b439c05c6d40090918edeced8eef2f661b6da4c21bb9c4df2",
    // Add more public keys here
    // "anotherPublicKey...",
];

// amount=0 means exit the validator
const fixedAmountHex = "0000000000000000";

async function batchWithdrawRequest() {
    console.log(`Starting batch withdrawal for ${pubkeylist.length} public keys...`);

    for (const pubkey of pubkeylist) {
        // Construct the data field: 0x{pubkey}{amount}
        const data = `${pubkey}${fixedAmountHex}`;
        console.log(`Sending withdrawal for pubkey: ...${pubkey.slice(-8)}`);

        try {
            const tx = await wallet.sendTransaction({
                to: process.env.WITHDRAW_CONTRACT_ADDRESS,
                data: data,
                gasLimit: 2100000, // Consider if gas limit needs adjustment per tx or can be estimated
                value: ethers.utils.parseEther("0.01") // Assuming the value sent with tx is fixed, adjust if needed
            });

            console.log(`Transaction sent for ...${pubkey.slice(-8)}. Hash: ${tx.hash}`);

            // Optional: Wait for transaction confirmation
            // console.log(`Waiting for confirmation...`);
            // await tx.wait();
            // console.log(`Transaction confirmed for ...${pubkey.slice(-8)}.`);

            // Optional: Add a delay between transactions to avoid overwhelming the node/network
            // await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay

        } catch (error) {
            console.error(`Failed to send transaction for pubkey ...${pubkey.slice(-8)}:`, error);
            // Decide if you want to stop the whole batch on error or continue
            // continue; // Uncomment to continue with the next key on error
            // break; // Uncomment to stop the batch on the first error
        }
    }

    console.log("Batch withdrawal process finished.");
}

batchWithdrawRequest(); 