const ethers = require('ethers');

const config = {
    name: "EIP-4788",
    // Address derived from the pre-signed transaction
    senderAddress: '0x0B799C86a49DEeb90402691F1041aa3AF2d3C875',
    amountToSend: ethers.utils.parseEther('0.25'),
    txData: {
        nonce: 0,
        to: null,
        gasLimit: '0x3d090',
        gasPrice: '0xe8d4a51000',
        value: '0x0',
        data: '0x60618060095f395ff33373fffffffffffffffffffffffffffffffffffffffe14604d57602036146024575f5ffd5b5f35801560495762001fff810690815414603c575f5ffd5b62001fff01545f5260205ff35b5f5ffd5b62001fff42064281555f359062001fff015500'
    },
    signature: {
        v: 27,
        r: ethers.utils.hexZeroPad('0x539', 32),
        s: ethers.utils.hexZeroPad('0x1b9b6eb1f0', 32),
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
            }

            const txResponse = await provider.sendTransaction(rawTx);
            console.log(`${this.name} Raw Tx Hash: ${txResponse.hash}`);
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