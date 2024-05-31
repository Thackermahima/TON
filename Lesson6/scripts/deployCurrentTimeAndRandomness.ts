import { toNano } from '@ton/core';
import { CurrentTimeAndRandomness } from '../wrappers/CurrentTimeAndRandomness';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const currentTimeAndRandomness = provider.open(await CurrentTimeAndRandomness.fromInit());

    await currentTimeAndRandomness.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(currentTimeAndRandomness.address);

    // run methods on `currentTimeAndRandomness`
}
