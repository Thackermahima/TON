import "@stdlib/deploy";

message Withdraw {
    amount : Int as coins;
}

contract SendTon with Deployable {
    const MinTonForStorage: Int = ton("0.01");
    owner : Address;
    

    init() {
       self.owner = sender();
    }

 fun onlyOwner() {
      require(sender() == self.owner, "Only owner can withdraw the amount");
 }
    receive() {
    //     send(SendParameters {
    //         to: sender(),
    //         value: 0;
    //         mode: SendIgnoreErrors,
    //         bouce: true,
    //         body: "Hello World".asComment()
    //     })

    //     self.reply("Hello World" .asComment());

    //    //Context() ;- It's able to get the context data. 

    //     context().bounced //true/false
    //     context().sender //sender() 
    //     context().value
    //     context().raw  // Slice of data
    } 

    receive("withdraw all") { 
      self.onlyOwner();
      send(SendParameters {
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingBalance + SendIgnoreErrors
        });
    } 

    receive("withdraw safe") {
      self.onlyOwner();
      send(SendParameters {
         to: sender(),
         bounce: true,
         value: myBalance() - context().value - self.MinTonForStorage,
         mode: SendIgnoreErrors + SendRemainingValue
      });
    } 

    receive(msg: Withdraw) {
        self.onlyOwner();
        let amount: Int = min(msg.amount, myBalance() -  context().value - self.MinTonForStorage);
        require(amount > 0, "insufficient balance");
        send(SendParameters{
            to: sender(),
            bounce:true,
            value: amount,
            mode: SendIgnoreErrors + SendRemainingValue
        });
    }


 
    get fun balance(): Int {
       return myBalance();
    } 

}
