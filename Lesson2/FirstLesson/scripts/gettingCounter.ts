import { toNano } from 'ton-core';
import { FirstContract } from '../wrappers/FirstContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const firstContract = provider.open(await FirstContract.fromInit(667880n));

    console.log(firstContract.address, "Contract address");
    const counter = await firstContract.getCounter()
    const id = await firstContract.getId()
    console.log(`Counter - ${counter}; Id - ${id}`)
}