import { getContractAt } from './helper';
import marketAddresses from '../deployments/SY-swETH-BbAWeth_BalancerLP Aura.json';
import { AuraSwEthBbAWethSYV2 } from '../typechain-types';
import { PENDLE_MULTISIG } from './consts';

async function main() {
    const SY = await getContractAt<AuraSwEthBbAWethSYV2>('AuraSwEthBbAWethSYV2', marketAddresses.SY);

    console.log('Transferring ownership to: ', PENDLE_MULTISIG);

    const tx = await SY.transferOwnership(PENDLE_MULTISIG, false, false); // direct=false, renounce=false

    console.log('Waiting for transaction confirmation');

    await tx.wait();

    console.log('Ownership transferred');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
