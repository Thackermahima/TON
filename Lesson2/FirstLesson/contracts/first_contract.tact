import "@stdlib/deploy";

message Add {
    amount: Int as uint32;
}

contract FirstContract with Deployable {
        
        counter: Int as uint32;
        id: Int as uint32;

     
    init(id: Int) {
            self.id = id;
            self.counter = 0;

        }   
    receive("increment") {
        self.counter = self.counter + 1;
    }

    receive(msg: Add){
        self.counter = self.counter + msg.amount;
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }
}