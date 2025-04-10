const ethers = require('ethers');
const dotenv = require('dotenv');

dotenv.config();

const txData = {
    nonce: 0,
    to: null,
    gasLimit: '0x3d090',
    gasPrice: '0xe8d4a51000',
    value: '0x0',
    data: '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5f5561019e80602d5f395ff33373fffffffffffffffffffffffffffffffffffffffe1460d35760115f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1461019a57600182026001905f5b5f82111560685781019083028483029004916001019190604d565b9093900492505050366060146088573661019a573461019a575f5260205ff35b341061019a57600154600101600155600354806004026004013381556001015f358155600101602035815560010160403590553360601b5f5260605f60143760745fa0600101600355005b6003546002548082038060021160e7575060025b5f5b8181146101295782810160040260040181607402815460601b815260140181600101548152602001816002015481526020019060030154905260010160e9565b910180921461013b5790600255610146565b90505f6002555f6003555b5f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff141561017357505f5b6001546001828201116101885750505f61018e565b01600190035b5f555f6001556074025ff35b5f5ffd'
};

const signature = {
    v: 27,
    r: ethers.utils.hexZeroPad('0x539', 32),
    s: ethers.utils.hexZeroPad('0xc0730f92dc275b663d377a7cbb141b6600052', 32),
};

// Serialize the transaction with the signature
const rawTransactionHex = ethers.utils.serializeTransaction(txData, signature);
const provider = new ethers.providers.JsonRpcProvider(process.env.DEVNET_RPC_URL);


async function sendTransaction() {
    const parsed = ethers.utils.parseTransaction(rawTransactionHex);
    console.log("Recovered sender address:", parsed.from);
    const txResponse = await provider.sendTransaction(rawTransactionHex);
    console.log('Transaction Hash:', txResponse.hash);
}

sendTransaction();