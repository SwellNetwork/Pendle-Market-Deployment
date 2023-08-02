import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IStandardizedYield, SwETHSY } from '../typechain-types';
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
    const sy = await deploy<SwETHSY>(deployer, 'SwETHSY', [
        MarketConfiguration.name,
        MarketConfiguration.symbol,
        '0xf951E335afb289353dc249e82926178EaC7DEd78', // SWETH address
    ]);

    return await getContractAt<IStandardizedYield>('IStandardizedYield', sy.address);
}
