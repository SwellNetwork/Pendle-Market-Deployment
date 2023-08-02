import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { AuraSwEthBbAWethSYV2, IStandardizedYield } from '../typechain-types';
import { deploy, getContractAt } from './helper';
import { MarketConfiguration } from './configuration';

/**
 * @dev This function aims to deploy your SY contract
 * @dev The below implementation show how to deploy a SwETH SY contract
 *
 * To deploy your own SY contract, you need to:
 * - Change the contract name / type name in "deploy<YOUR_CONTRACT_NAME>(deployer, 'YOUR_CONTRACT_NAME', [...])"
 * - Change the deployment params to match your constructor arguments
 */
export async function deploySY(deployer: SignerWithAddress): Promise<IStandardizedYield> {
    const sy = await deploy<AuraSwEthBbAWethSYV2>(deployer, 'AuraSwEthBbAWethSYV2', [
        MarketConfiguration.name,
        MarketConfiguration.symbol,
    ]);

    return await getContractAt<IStandardizedYield>('IStandardizedYield', sy.address);
}
