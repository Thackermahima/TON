import { toNano } from '@ton/core';
import { DepoloyableCounter } from '../wrappers/DepoloyableCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const depoloyableCounter = provider.open(await DepoloyableCounter.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await depoloyableCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(depoloyableCounter.address);

    console.log('ID', await depoloyableCounter.getId());
}
