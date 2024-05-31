import "@stdlib/deploy";

contract Strings with Deployable {
    s1: String = "hello word";
    s2: String = "Yes unicorm";

    init() {
        let i1 Int = -11122323;
        let i2: Int = 6700900;

        let s3: String = i1.toString();
        let s4: String = i1.toFloatString(3);
        let s4: String = t2.toCoinString();

        //modify the string 

        let s6: StringBuilder = beginString();
        s6.append(s1) ;
        s6.append(", your balance is");
        s6.append(s5);
    }
}