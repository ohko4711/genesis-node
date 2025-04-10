const ethers = require('ethers');

const config = {
    name: "EIP-2935",
    // Address derived from the pre-signed transaction
    senderAddress: '0x3462413Af4609098e1E27A490f554f260213D685',
    amountToSend: ethers.utils.parseEther('0.25'),
    txData: {
        nonce: 0,
        to: null,
        gasLimit: '0x3d090',
        gasPrice: '0xe8d4a51000',
        value: '0x0',
        data: '0x60538060095f395ff33373fffffffffffffffffffffffffffffffffffffffe14604657602036036042575f35600143038111604257611fff81430311604257611fff9006545f5260205ff35b5f5ffd5b5f35611fff60014303065500'
    },
    signature: {
        v: 27,
        r: ethers.utils.hexZeroPad('0x539', 32),
        s: ethers.utils.hexZeroPad('0xaa12693182426612186309f02cfe8a80a0000', 32),
    },
    get rawTransactionHex() {
        return ethers.utils.serializeTransaction(this.txData, this.signature);
    },
    async deploy(provider) {
        console.log(`\n--- Sending Raw ${this.name} Transaction ---`);
        const rawTx = this.rawTransactionHex;
        try {
            const parsed = ethers.utils.parseTransaction(rawTx);
            console.log(`Raw Tx Recovered sender address: ${parsed.from}`);
            if (parsed.from?.toLowerCase() !== this.senderAddress.toLowerCase()) {
                console.error(`Mismatch: Expected sender ${this.senderAddress}, but recovered ${parsed.from}`);
                // Optionally throw an error or return false
            }

            const txResponse = await provider.sendTransaction(rawTx);
            console.log(`${this.name} Raw Tx Hash: ${txResponse.hash}`);
            // No wait here, as we just need to submit it.
            return true; // Indicate success
        } catch (error) {
            console.error(`Error sending raw ${this.name} transaction:`, error.message);
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
            console.log(`--- Raw ${this.name} Tx Send Failed ---`);
            return false; // Indicate failure
        }
    }
};

module.exports = config; 