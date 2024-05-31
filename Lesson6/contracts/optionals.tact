import "@stdlib/deploy";

struct StructOpts{
    num:  Int?;
} 

message MsgOpts {
    num : Int?; 
    bool: Bool?;

}
contract Optionals with Deployable {  

    num: Int?;
    bool: Bool?;
    addr: Address?;

    init( a: Int?)  {
      self.num = a;
    }  

    receive(msg: MsgOpts) {
        if(msg.num != null) {
            self.num = msg.num!!;
        }
    }

    get fun optInt(): Int?{
        return self.num;
    }

    get fun optIntVal() : Int{ 
        if(self.num == null) {
            return -1;
        }
        return self.num!!;
    }

    get fun optNested(): Int?{
        if(self.strc != null && (self.stc!!).num != null) {
            return (self.strc!!).num!!;
        } 
        return null;
    }
}