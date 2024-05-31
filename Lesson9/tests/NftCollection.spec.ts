// import { Blockchain,SandboxContract, TreasuryContract } from '@ton/sandbox';
// import { toNano } from '@ton/core';
// import { NftCollection } from '../wrappers/NftCollection';
// import { NftItem } from '../wrappers/NftItem';
// import '@ton/test-utils';

// describe('NftCollection', () => {
//     let blockchain: Blockchain;
//     let nftCollection: SandboxContract<NftCollection>;
//     let deployer: SandboxContract<TreasuryContract>;
//     beforeEach(async () => {
//         blockchain = await Blockchain.create();

//         nftCollection = blockchain.openContract(await NftCollection.fromInit());
//         deployer = await blockchain.treasury('deployer');

//         const deployResult = await nftCollection.send(
//             deployer.getSender(),
//             {
//                 value: toNano('0.05'),
//             },
//             {
//                 $$type: 'Deploy',
//                 queryId: 0n,
//             }
//         );

//         expect(deployResult.transactions).toHaveTransaction({
//             from: deployer.address,
//             to: nftCollection.address,
//             deploy: true,
//             success: true,
//         });
//     });

//     it('should deploy', async () => {
//         // the check is done inside beforeEach
//         // blockchain and nftCollection are ready to use
//     });

//     // it("should mint nft", async()=>{
        
//     //     const res = await nftCollection.send(deployer.getSender(), {
//     //         value: toNano("0.3")
//     //     }, 'Mint') 
//     //     const ress = await nftCollection.send(deployer.getSender(), {
//     //         value: toNano("0.3")
//     //     }, 'Mint')

//     //     console.log(res);
//     //     console.log(ress);
        


//     //     console.log("deployer - ", deployer.getSender().address)
//     //     console.log("nftCollection - ", nftCollection.address)
//     //     const nftItemAddress = await nftCollection.getGetNftAddressByIndex(0n);
//     //     console.log("nftItemAddress - ", nftItemAddress);  
//     //     const nftItemAddress1 = await nftCollection.getGetNftAddressByIndex(1n);
//     //     console.log("nftItemAddress1 - ", nftItemAddress1);     
//     //     const nftItem: SandboxContract<NftItem> = blockchain.openContract(NftItem.fromAddress(nftItemAddress!))
//     //     const nftItem1: SandboxContract<NftItem> = blockchain.openContract(NftItem.fromAddress(nftItemAddress1!))

//     //     let nftItemData = await nftItem.getGetItemData();
//     //     let nftItemData1 = await nftItem1.getGetItemData();

//     //     console.log("NFT1 - ", nftItemData);
//     //     console.log("NFT2 - ", nftItemData1);


//     //     const nftCollectionData = await nftCollection.getGetCollectionData()

//     //     console.log(nftCollectionData, "nftCollectionData");

//     //     console.log(nftCollectionData.collection_content.beginParse().loadStringTail())

//     //     const user = await blockchain.treasury("user");
//     //     const getItemData = await nftItem.getGetItemData();
//     //     console.log("getItemData", getItemData.individual_content);
        
//     //     await nftItem.send(deployer.getSender(), {
//     //         value: toNano("0.2")
//     //     }, {
//     //         $$type: 'Transfer',
//     //         new_owner: user.address,
//     //         query_id: 0n
//     //     })

//     //     nftItemData = await nftItem.getGetItemData();

//     //     console.log("new owner - ", nftItemData.owner)
//     // }); 

//     it('should dynamically mint an NFT with specified attributes', async () => {
//         const name = "Dynamic NFT Name";
//         const description = "A detailed description of the NFT";
//         const image = "https://gateway.pinata.cloud/ipfs/QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/0.jpg";

//         // Simulating calling the Mint function via receive
       
//         const res = await nftCollection.send(deployer.getSender(),name, description, image, {
//             value: toNano("0.3")
//         }, 'mint') 

//         console.log("Mint Result:", res);
        
    
//         // You may need additional contract or function to fetch NFT data if available
//     });

// });

import { toNano, beginCell } from "@ton/core";
import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
    printTransactionFees,
    prettyLogTransactions,
} from "@ton/sandbox";
import "@ton/test-utils";
import { printSeparator } from "../utils/print";
import { NftCollection } from '../wrappers/NftCollection';
import { NftItem } from '../wrappers/NftItem';

describe("contract", () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let collection: SandboxContract<NftCollection>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");

        let royaltiesParam = {
            $$type: "RoyaltyParams",
            numerator: 350n,  // 35%
            denominator: 1000n,
            destination: deployer.address,
        };

        // Initialize the contract without predefined content
        collection = blockchain.openContract(
            await NftCollection.fromInit(deployer.address, royaltiesParam)
        );
    });

    it("should allow minting with dynamic data", async () => {
        let name = "Art Piece";
        let description = "A beautiful artwork";
        let imageUrl = "https://example.com/image.jpg";

        // Simulate minting by sending metadata
        const mintResult = await collection.send(deployer.getSender(), { value: toNano(1) }, "Mint", { name, description, imageUrl });
        printTransactionFees(mintResult.transactions);
        prettyLogTransactions(mintResult.transactions);

        // Verify the minting process
        let loadEvent = loadLogEventMintRecord(mintResult.externals[0].body.asSlice());
        console.log("Minted NFT ID: " + loadEvent.item_id);
        console.log("Name: " + name);
        console.log("Description: " + description);
        console.log("Image URL: " + imageUrl);
    });
});
