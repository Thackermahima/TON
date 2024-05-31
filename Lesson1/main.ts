import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, WalletContractV4, fromNano, internal } from "ton";
import { mnemonicToWalletKey } from "ton-crypto";
async function main() {
    const mnemonic = "media loyal spend jeans recycle position obey end vital supreme decorate tornado sustain creek alpha jeans correct dose genuine auction suspect sick slush elite";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({publicKey: key.publicKey, workchain: 0})

    const endpoint = await getHttpEndpoint({network:"testnet"})
    const client = new TonClient({endpoint})
 
    console.log(wallet.address);
    console.log(await client.isContractDeployed(wallet.address));
    
    

    if(!await client.isContractDeployed(wallet.address)) {
        return console.log("Wallet is not deployed");
    } 
    console.log("Wallet is deployed.");
    
    const balance = await client.getBalance(wallet.address);
    console.log("balance", fromNano(balance));
    
     // send 0.05 TON to EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e
     const walletContract = client.open(wallet);
     const seqno = await walletContract.getSeqno();
     await walletContract.sendTransfer({
         secretKey: key.secretKey,
         seqno: seqno,
         messages: [
             internal({
                 to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
                 value: "0.05", // 0.05 TON
                 body: "Hello", // optional comment
                 bounce: false,
             })
         ]
     });
      // wait until confirmed
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for transaction to confirm...");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!");
 
}

main();
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}