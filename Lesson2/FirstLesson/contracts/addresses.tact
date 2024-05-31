import "@stdlib/deploy";

contract Addresses with Deployable {

    a1: Address = address("EQD3WvwxcwziTNcvdhfGLrw6XPv3BfuNe67DTxwpbMErlwcL");
    a2: Address = address("UQD3WvwxcwziTNcvdhfGLrw6XPv3BfuNe67DTxwpbMErl1rO");
    a3: Address;

    a4: Address;
    a5: Address;
    a6: Address;

    init() {
      self.a3 = newAddress(0, "0xf75afc31730ce24cd72f7617c62ebc3a5cfbf705fb8d7baec34f1c296cc12b97");
      self.a4 = myAddress(); //get the contract address. 
      self.a5 = sender(); //get the address of the transaction sender 
      self a6 = newAddress(0, 0);

    }
    receive () {
      self.a1 = self.a2;
      self.a2 = self.a3;
    }
}
