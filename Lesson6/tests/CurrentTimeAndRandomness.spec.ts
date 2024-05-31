import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CurrentTimeAndRandomness } from '../wrappers/CurrentTimeAndRandomness';
import '@ton/test-utils';

describe('CurrentTimeAndRandomness', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let currentTimeAndRandomness: SandboxContract<CurrentTimeAndRandomness>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        currentTimeAndRandomness = blockchain.openContract(await CurrentTimeAndRandomness.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await currentTimeAndRandomness.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: currentTimeAndRandomness.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and currentTimeAndRandomness are ready to use
    });

    it("Should wait 10 sec", async() => {
        const deployer = await blockchain.treasury('deploy');
        await currentTimeAndRandomness.send(deployer.getSender(),
        {
            value: toNano("0.2")
        }, 'wait 10s')
        await sleep(10500)

        await currentTimeAndRandomness.send(deployer.getSender(),
        {
            value: toNano("0.2")
        }, 'wait 10s')
    }, 20000);

    it("should show random", async()=>{
        const randomInt = await currentTimeAndRandomness.getRand()
        console.log("randomInt - ", randomInt)
        const random = await currentTimeAndRandomness.getRandBetween(-10n, 30n);
        console.log("random - ", random)

        const unixTime = await currentTimeAndRandomness.getUnixTime()

        console.log("unixTime - ", unixTime)
    })

    const sleep = (ms: number)=> new Promise(resolve => setTimeout(resolve, ms));
});