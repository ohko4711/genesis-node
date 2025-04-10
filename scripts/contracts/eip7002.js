const ethers = require('ethers');

const config = {
    name: "EIP-7002",
    // Address derived from the pre-signed transaction
    senderAddress: '0x8646861A7cF453dDD086874d622b0696dE5b9674',
    amountToSend: ethers.utils.parseEther('0.25'),
    txData: {
        nonce: 0,
        to: null,
        gasLimit: '0x3d090',
        gasPrice: '0xe8d4a51000',
        value: '0x0',
        data: '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5f556101f880602d5f395ff33373fffffffffffffffffffffffffffffffffffffffe1460cb5760115f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff146101f457600182026001905f5b5f82111560685781019083028483029004916001019190604d565b909390049250505036603814608857366101f457346101f4575f5260205ff35b34106101f457600154600101600155600354806003026004013381556001015f35815560010160203590553360601b5f5260385f601437604c5fa0600101600355005b6003546002548082038060101160df575060105b5f5b8181146101835782810160030260040181604c02815460601b8152601401816001015481526020019060020154807fffffffffffffffffffffffffffffffff00000000000000000000000000000000168252906010019060401c908160381c81600701538160301c81600601538160281c81600501538160201c81600401538160181c81600301538160101c81600201538160081c81600101535360010160e1565b910180921461019557906002556101a0565b90505f6002555f6003555b5f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14156101cd57505f5b6001546002828201116101e25750505f6101e8565b01600290035b5f555f600155604c025ff35b5f5ffd'
    },
    signature: {
        v: 27,
        r: ethers.utils.hexZeroPad('0x539', 32),
        s: ethers.utils.hexZeroPad('0x5feeb084551e4e03a3581e269bc2ea2f8d0008', 32),
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

            // Note: The hardcoded nonce (0) might be incorrect if the sending account
            // has already made transactions. This script uses a pre-signed raw tx,
            // so the nonce is fixed and cannot be easily changed here without re-signing.
            // The main script should ideally fund this address first if needed.

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