import { Address, toNano } from '@ton/core';
import { DepoloyableCounter } from '../wrappers/DepoloyableCounter';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('DepoloyableCounter address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const depoloyableCounter = provider.open(DepoloyableCounter.fromAddress(address));

    const counterBefore = await depoloyableCounter.getCounter();

    await depoloyableCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Add',
            queryId: 0n,
            amount: 1n,
        }
    );

    ui.write('Waiting for counter to increase...');

    let counterAfter = await depoloyableCounter.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await depoloyableCounter.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
