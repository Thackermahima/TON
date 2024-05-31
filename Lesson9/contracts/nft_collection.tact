// import "@stdlib/deploy";
// import "@stdlib/ownable";
// import "./nft_item.tact";
// import "./messages.tact";


// contract NftCollection with Deployable, Ownable {
//     const minTonForStorage: Int = ton("0.03");
//     const gasConsumption: Int = ton("0.03");
//     owner: Address;
//     next_item_index: Int as uint32 = 0;
//     nftAddresses: map<Int, Address>;

//     init() {
//         self.owner = sender();
//     }


//     // receive("Mint"){
//     //     self.requireOwner();
//     //     self.mint(sender(), namee, descriptionn, imagee);
//     // } 

  
//     fun mint(receiver: Address, name: String, description: String, image: String) {

//         let nft_init: StateInit = self.getNftItemInit(self.next_item_index, name, description, image);
//         let msgValue: Int = context().value;
//         let nftAddress: Address =  contractAddress(nft_init);
//         let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
//         let storageFee: Int = self.minTonForStorage - min(tonBalanceBeforeMsg, self.minTonForStorage);
//         msgValue = msgValue - (storageFee + self.gasConsumption);

//         send(SendParameters{
//             to: contractAddress(nft_init),
//             value: msgValue,
//             mode: SendIgnoreErrors,
//             bounce: false,
//             body: Transfer{
//                 query_id: 0,
//                 new_owner: receiver
//             }.toCell(),
//             code: nft_init.code,
//             data: nft_init.data
//         });
//        self.nftAddresses.set(self.next_item_index, nftAddress);
//         self.next_item_index = self.next_item_index + 1;
//     }
  

   
 
//     get fun getNftItemInit(item_index: Int, name: String, description: String, image: String): StateInit {
//         return initOf NftItem(self.owner, myAddress(), item_index, name, description, image);
//     }

//     get fun get_nft_address_by_index(item_index: Int) : Address {
//       let address: Address = self.nftAddresses.get(item_index)!!;
//        return address; 
//     }  



  


//     // get fun get_collection_data(): CollectionData {
//     //     return CollectionData{
//     //         next_item_index: self.next_item_index,
//     //         collection_content: self.collection_content.asSlice().asCell(),
//     //         owner_address: self.owner
//     //     };
//     // }
// } 

import "@stdlib/deploy";
import "@stdlib/ownable";
import "./nft_item.tact";
import "./messages.tact";

const minTonsForStorage: Int = ton("0.02");
const gasConsumption: Int = ton("0.02");

contract NftCollection {
    next_item_index: Int as uint32 = 0;
    owner_address: Address;
    royalty_params: RoyaltyParams?;

    init(owner_address: Address, royalty_params: RoyaltyParams) {
        self.owner_address = owner_address;
        self.royalty_params = royalty_params;
    }

    receive("Mint") {
        let ctx: Context = context();
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);

        let name: String = ctx.param("name");
        let description: String = ctx.param("description");
        let imageUrl: String = ctx.param("imageUrl");

        self.mint(ctx.sender, msgValue, name, description, imageUrl);

        emit(LogEventMintRecord{ minter: sender(), item_id: self.next_item_index, generate_number: nativeRandom() }.toCell());
    }

    fun mint(sender: Address, msgValue: Int, name: String, description: String, imageUrl: String) {
        let nft_init: StateInit = self.getNftItemInit(self.next_item_index, name, description, imageUrl);
        send(SendParameters{
            to: contractAddress(nft_init),
            value: msgValue,
            bounce: false,
            mode: SendIgnoreErrors,
            body: Transfer {
                query_id: 0,
                new_owner: sender,
                response_destination: self.owner_address,
                custom_payload: encodeMetadata(name, description, imageUrl),
                forward_amount: 0,
                forward_payload: emptySlice()
            }.toCell(),
            code: nft_init.code,
            data: nft_init.data
        });
        self.next_item_index = self.next_item_index + 1;
    }

    fun encodeMetadata(name: String, description: String, imageUrl: String): Cell {
        let b: StringBuilder = beginCell();
        b.storeString(name).storeString(description).storeString(imageUrl);
        return b.endCell();
    }
}