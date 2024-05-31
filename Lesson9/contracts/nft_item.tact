
// import "@stdlib/deploy";
// import "@stdlib/ownable";
// import "./messages.tact";

// contract NftItem with Deployable, Ownable {
//     owner: Address;
//     collection_address: Address;
//     item_index: Int;
//     name: String;
//     description: String;
//     image_url: String;

//     init(
//         owner: Address,
//         collection_address: Address,
//         item_index: Int,
//         name: String,
//         description: String,
//         image_url: String
//     ) {
//         self.owner = owner;
//         self.collection_address = collection_address;
//         self.item_index = item_index;
//         self.name = name;
//         self.description = description;
//         self.image_url = image_url;
//     }

//     receive(msg: Transfer){
//         self.requireOwner();
//         self.owner = msg.new_owner;
//     }

//     get fun get_item_data(): ItemData {
//         return ItemData{
//             owner: self.owner,
//             collection_address: self.collection_address,
//             item_index: self.item_index,
//             name: self.name,
//             description: self.description,
//             image_url: self.image_url
//         };
//     }
// }

import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";

contract NftItem {
    collection_address: Address;
    item_index: Int; 
    is_initialized: Bool;
    owner: Address?;
    name: String;
    description: String;
    imageUrl: String;

    init(collection_address: Address, item_index: Int, name: String, description: String, imageUrl: String) {
        require(sender() == collection_address, "not from collection");
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.name = name;
        self.description = description;
        self.imageUrl = imageUrl;
        self.is_initialized = false;
    }

    fun decodeMetadata(payload: Cell) {
        let b: Slice = payload.asSlice();
        self.name = b.asString();
        self.description = b.asString();
        self.imageUrl = b.asString();
    }

    receive(msg: Transfer) {
        let ctx: Context = context();
        let msgValue: Int = self.msgValue(ctx.value);
        
        if (self.is_initialized == false) {
            require(ctx.sender == self.collection_address, "initialized tx need from collection");
            self.is_initialized = true;
            self.owner = msg.new_owner;
            // Extract metadata from the payload
            self.decodeMetadata(msg.custom_payload);
            send(SendParameters{
                to: msg.response_destination!!,
                value: msgValue,
                mode: SendPayGasSeparately,
                body: Excesses { query_id: msg.query_id }.toCell()
            });
        } else {
        require(ctx.sender == self.owner!!, "not owner");
        self.owner = msg.new_owner;  // change current owner to the new_owner
        if (msg.forward_amount > 0) {
                send(SendParameters{
                    to: msg.new_owner,
                    value: msg.forward_amount,
                    mode:  SendPayGasSeparately, 
                    bounce: true,
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: ctx.sender,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }); 
            }

            msgValue = msgValue - ctx.readForwardFee(); 
            if (msg.response_destination != null) { 
                send(SendParameters{ 
                    to: msg.response_destination!!,
                    value: msgValue - msg.forward_amount,
                    mode: SendPayGasSeparately,
                    bounce: true,
                    body: Excesses { query_id: msg.query_id }.toCell()
                });
            } 

        }
    }


    

       fun msgValue(value: Int): Int {
        let tonBalanceBeforeMsg: Int = myBalance() - value;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        return value - (storageFee + gasConsumption);
    }

}
