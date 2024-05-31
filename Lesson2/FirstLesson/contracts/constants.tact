import "@stdlib/deploy";

const GlobalConstants1 : Int = 2000;

contract Constants with Deployable {

    const contractConstants1 : Int = 2000; 
    init() {
        
    }

    get fun sum() : Int  {
        return self.contractConstants1 + GlobalConstants1;
    }
    
}
