import "@stdlib/deploy";

contract Integers with Deployable {

    i1: Int as int257 = 1000;
    i2: Int as uint256;
    i3: Int as coins;

   init() {
    self.i2 = 0x844;
    self.i3 = ton("1.23");
   }
 
  receive() {
    let i: Int as int8 = -12;
    let init1: Int as uint128 = 1111;
    let i2: Int as uint128 = 22000;


    i = int1 * 3 + (int2 - i); 
    i = int1 / 2;
  }
}